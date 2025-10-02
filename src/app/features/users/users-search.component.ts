import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import {
  EmployeeSearchService,
  Db2Employee,
  Db2EmployeeInfo,
  EmployeeDetailsDto,
} from '../../services/employee-search.service';
import { Observable, forkJoin, of, switchMap } from 'rxjs';

interface SearchForm {
  query: string;
  type: 'auto' | 'empNo' | 'fingerCode' | 'loginName' | 'name';
}

interface EmployeeVM {
  //API Fields
  empNo: number | null;
  name: string | null;
  role?: string | null;
  deptName?: string | null;
  sectorName?: string | null;
  // Backend fields
  fingerCode?: number | null;
  timingCode?: number | null;
  hasAllow?: boolean | null;
  status?: number | null;
  inLeave?: boolean | null;
  hasPass?: boolean | null;
  locCode?: number | null;
  // Derived labels
  timingPlanName?: string | null;
}

@Component({
  selector: 'app-users-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './users-search.component.html',
})
export class UsersSearchComponent {
  loading = false;
  error: string | null = null;
  vm: EmployeeVM | null = null;
  form!: FormGroup;
  showDetails = false;
  results: EmployeeDetailsDto[] = [];
  hasSearched = false;
  selectedEmpNo: number | null = null;

  constructor(private fb: FormBuilder, private svc: EmployeeSearchService) {
    this.form = this.fb.group({
      query: ['', [Validators.required]],
      type: ['auto', [Validators.required]],
    });
  }

  onSearch() {
    this.error = null;
    this.vm = null;
    this.showDetails = false;
    this.results = [];
    this.selectedEmpNo = null;
    this.hasSearched = true;

    const { query, type } = this.form.value as SearchForm;
    const q = query?.trim();
    if (!q) return;

    this.loading = true;

    // Branch on selected type
    if (type === 'empNo') {
      const asNum = Number(q);
      if (Number.isNaN(asNum)) {
        this.loading = false;
        this.error = 'أدخل رقماً صحيحاً';
        return;
      }
      this.svc.searchEmployees({ empNo: asNum }).subscribe({
        next: (list) => {
          const dto = list && list.length > 0 ? list[0] : undefined;
          if (!dto) {
            this.loading = false;
            this.error = 'لم يتم العثور على نتائج';
            return;
          }
          this.populateFromEmployeeDto(dto);
          if (!dto.fullName) this.enrichNamesFromDb2(dto.empNo);
        },
        error: () => {
          this.loading = false;
          this.error = 'فشل البحث';
        },
      });
      return;
    }

    if (type === 'fingerCode') {
      const asNum = Number(q);
      if (Number.isNaN(asNum)) {
        this.loading = false;
        this.error = 'أدخل رقماً صحيحاً';
        return;
      }
      this.svc.searchByFinger(asNum).subscribe({
        next: (list) => {
          const dto = list && list.length > 0 ? list[0] : undefined;
          if (!dto) {
            this.loading = false;
            this.error = 'لم يتم العثور على نتائج';
            return;
          }
          this.populateFromEmployeeDto(dto);
          if (!dto.fullName) this.enrichNamesFromDb2(dto.empNo);
          if (dto.fingerCode) {
            this.svc.getEmployeeByFingerCode(dto.fingerCode).subscribe({
              next: (fdto) => {
                if (!fdto) return;
                this.populateFromEmployeeDto(fdto);
              },
            });
          }
        },
        error: () => {
          this.loading = false;
          this.error = 'فشل البحث';
        },
      });
      return;
    }

    if (type === 'loginName') {
      this.svc.GetEmployeeDataStr(q).subscribe({
        next: (raw) => {
          if (raw && raw.EmpNo) {
            this.resolveNamesFromLookups(raw);
            this.fetchBackendDetails(raw.EmpNo);
          } else {
            this.loading = false;
            this.error = 'لم يتم العثور على نتائج';
          }
        },
        error: () => {
          this.loading = false;
          this.error = 'فشل البحث';
        },
      });
      return;
    }

    if (type === 'name') {
      this.searchByName(q);
      return;
    }

    // Default auto behavior
    const asNum = Number(q);
    const isNumber = !Number.isNaN(asNum);

    if (isNumber) {
      // Sequential: try fingerCode first; only if empty, try EmpNo. Suppress 404s as empty results.
      this.svc
        .searchByFinger(asNum)
        .pipe(
          (src) => src.pipe((obs) => obs),
          switchMap((byFinger: any) => {
            if (byFinger && byFinger.length > 0) {
              return of({ byFinger, byEmpNo: [] });
            }
            return this.svc
              .searchEmployees({ empNo: asNum })
              .pipe(switchMap((byEmpNo) => of({ byFinger: [], byEmpNo })));
          })
        )
        .subscribe({
          next: ({ byFinger, byEmpNo }) => {
            const dto = (byFinger && byFinger[0]) || (byEmpNo && byEmpNo[0]);
            if (!dto) {
              this.queryByLoginOrDb2(q);
              return;
            }
            this.populateFromEmployeeDto(dto);
            if (!dto.fullName) {
              this.enrichNamesFromDb2(dto.empNo);
            }
            const cameFromFinger =
              byFinger && byFinger.length > 0 && dto === byFinger[0];
            if (cameFromFinger && dto.fingerCode) {
              this.svc.getEmployeeByFingerCode(dto.fingerCode).subscribe({
                next: (fdto) => {
                  if (!fdto) return;
                  this.populateFromEmployeeDto(fdto);
                },
              });
            }
          },
          error: () => {
            this.queryByLoginOrDb2(q);
          },
        });
      return;
    }

    // Non-numeric auto path: LoginName first, fallback to name
    this.svc.GetEmployeeDataStr(q).subscribe({
      next: (raw) => {
        if (raw && raw.EmpNo) {
          this.resolveNamesFromLookups(raw);
          this.fetchBackendDetails(raw.EmpNo);
        } else {
          this.searchByName(q);
        }
      },
      error: () => this.searchByName(q),
    });
  }

  private searchByName(name: string) {
    this.svc.searchEmployees({ name }).subscribe({
      next: (list) => {
        this.loading = false;
        if (!list || list.length === 0) {
          this.error = 'لم يتم العثور على نتائج';
          return;
        }
        // Keep the full list; wait for user selection
        this.results = list;
        this.vm = null;
        this.showDetails = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'فشل البحث';
      },
    });
  }

  private queryByLoginOrDb2(q: string) {
    this.svc.GetEmployeeDataStr(q).subscribe({
      next: (raw) => {
        if (!raw) {
          this.loading = false;
          this.error = 'لم يتم العثور على نتائج';
          return;
        }
        this.resolveNamesFromLookups(raw);
        this.fetchBackendDetails(raw.EmpNo);
      },
      error: () => {
        this.loading = false;
        this.error = 'فشل البحث';
      },
    });
  }

  private resolveNamesFromLookups(raw: Db2Employee) {
    const deptCodeNum = Number(raw.DeptCode);
    const sectorCodeNum = Number(raw.SectorCode);

    forkJoin({
      jobs: this.svc.GetJobData(),
      departments: this.svc.GetDepartment(),
      sectors: this.svc.GetSectors(),
    }).subscribe({
      next: ({ jobs, departments, sectors }) => {
        const role =
          jobs.find((j) => Number(j.Value) === Number(raw.JobCode))?.Text ??
          null;
        const deptName =
          departments.find((d) => Number(d.Code) === deptCodeNum)?.Name ||
          departments.find((d) => Number(d.Code) === deptCodeNum)
            ?.EnglishName ||
          null;
        const sectorName =
          sectors.find((s) => Number(s.Value) === sectorCodeNum)?.Text ?? null;

        this.vm = {
          empNo: raw.EmpNo,
          name: raw.FullName,
          role,
          deptName,
          sectorName,
          ...(this.vm ?? {}),
        } as EmployeeVM;
      },
      error: () => {
        this.vm = {
          empNo: raw.EmpNo,
          name: raw.FullName,
          ...(this.vm ?? {}),
        } as EmployeeVM;
      },
    });
  }

  private populateFromEmployeeDto(d: EmployeeDetailsDto) {
    // Prefer an existing name (e.g., from DB2/LoginName), else use fullName, then NameA/NameE
    const displayName =
      (this.vm && this.vm.name ? this.vm.name : undefined) ??
      d.fullName ??
      d.nameA ??
      d.nameE;

    this.vm = {
      empNo: d.empNo,
      name: displayName,
      ...(this.vm ?? {}),
    } as EmployeeVM;
    // Enrich backend (fingerCode etc.) and timing plan name
    this.fetchBackendDetails(d.empNo);
  }

  private enrichNamesFromDb2(empNo: number) {
    this.svc.GetEmployeeData(empNo).subscribe({
      next: (raw) => {
        if (!raw) return;
        this.resolveNamesFromLookups(raw);
      },
    });
  }

  private fetchBackendDetails(empNo: number) {
    this.svc.getEmployeeByEmpNo(empNo).subscribe({
      next: (d: EmployeeDetailsDto) => {
        // Keep current name if present; otherwise prefer fullName from backend
        const currentName = this.vm?.name ?? null;
        const finalName =
          currentName ?? d.fullName ?? d.nameA ?? d.nameE ?? null;

        this.vm = {
          ...(this.vm ?? { empNo: d.empNo, name: null }),
          name: finalName,
          fingerCode: d.fingerCode ?? null,
          timingCode: d.timingCode ?? null,
          hasAllow: d.hasAllow ?? null,
          status: d.status ?? null,
          inLeave: d.inLeave ?? null,
          hasPass: d.hasPass ?? null,
          locCode: d.locCode ?? null,
        };
        // fetch timing plan name
        if (d.timingCode != null) {
          this.svc.getTimingPlanByCode(d.timingCode).subscribe({
            next: (tp) => {
              this.vm = {
                ...(this.vm as EmployeeVM),
                timingPlanName: tp?.descA ?? null,
              };
              this.loading = false;
            },
            error: () => {
              this.loading = false;
            },
          });
        } else {
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  openDetails() {
    if (this.vm) this.showDetails = true;
  }

  closeDetails() {
    this.showDetails = false;
  }

  selectResult(dto: EmployeeDetailsDto) {
    this.error = null;
    this.vm = null;
    this.showDetails = false;
    this.populateFromEmployeeDto(dto);
    if (!dto.fullName) this.enrichNamesFromDb2(dto.empNo);
    this.showDetails = true;
    this.selectedEmpNo = dto.empNo;
  }
}
