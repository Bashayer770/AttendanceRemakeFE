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

  constructor(private fb: FormBuilder, private svc: EmployeeSearchService) {
    this.form = this.fb.group({
      query: ['', [Validators.required]],
    });
  }

  onSearch() {
    this.error = null;
    this.vm = null;
    this.showDetails = false;

    const q = (this.form.value as SearchForm).query?.trim();
    if (!q) return;

    this.loading = true;
    const asNum = Number(q);
    const isNumber = !Number.isNaN(asNum);

    if (isNumber) {
      // Try EmpNo first; if not found, try fingerCode
      this.svc
        .searchEmployees({ empNo: asNum })
        .pipe(
          switchMap((list) => {
            if (list && list.length > 0) return of(list[0]);
            return this.svc
              .searchEmployees({ fingerCode: asNum })
              .pipe(
                switchMap((list2) =>
                  of(list2 && list2.length > 0 ? list2[0] : undefined)
                )
              );
          })
        )
        .subscribe({
          next: (dto) => {
            if (!dto) {
              // fallback to external by EmpNo
              this.queryByLoginOrDb2(q);
              return;
            }
            this.populateFromEmployeeDto(dto);
            this.enrichNamesFromDb2(dto.empNo);
          },
          error: () => {
            this.queryByLoginOrDb2(q);
          },
        });
      return;
    }

    // Non-numeric: first try LoginName via DB2, then backend by name
    this.svc.GetEmployeeDataStr(q).subscribe({
      next: (raw) => {
        if (raw && raw.EmpNo) {
          // Build basic VM and enrich
          this.resolveNamesFromLookups(raw);
          this.fetchBackendDetails(raw.EmpNo);
        } else {
          // fallback to backend name search (DescA/DescE)
          this.searchByName(q);
        }
      },
      error: () => this.searchByName(q),
    });
  }

  private searchByName(name: string) {
    this.svc.searchEmployees({ name }).subscribe({
      next: (list) => {
        if (!list || list.length === 0) {
          this.loading = false;
          this.error = 'لم يتم العثور على نتائج';
          return;
        }
        const dto = list[0];
        this.populateFromEmployeeDto(dto);
        this.enrichNamesFromDb2(dto.empNo);
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
    // Set basic info from backend DTO (names A/E -> prefer Arabic)
    this.vm = {
      empNo: d.empNo,
      name: d.nameA || d.nameE,
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
        this.vm = {
          ...(this.vm ?? { empNo: d.empNo, name: null }),
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
}
