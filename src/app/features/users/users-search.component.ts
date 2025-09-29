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
import { Observable, forkJoin } from 'rxjs';

interface SearchForm {
  query: string;
}

interface EmployeeVM {
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

    const obs: Observable<Db2EmployeeInfo | Db2Employee | undefined> = isNumber
      ? this.svc.getCompleteEmployee(asNum)
      : (this.svc.GetEmployeeDataStr(q) as unknown as Observable<
          Db2Employee | undefined
        >);

    obs.subscribe({
      next: (res) => {
        if (!res) {
          this.vm = null;
          this.loading = false;
          this.error = 'لم يتم العثور على نتائج';
          return;
        }

        if ((res as Db2EmployeeInfo).empNo !== undefined) {
          const info = res as Db2EmployeeInfo;
          this.vm = {
            empNo: info.empNo,
            name: info.empName ?? null,
            role: info.empRole ?? null,
            deptName: info.deptName ?? null,
            sectorName: info.sectorName ?? null,
          };
          // enrich backend fields
          this.fetchBackendDetails(info.empNo);
          return;
        }

        const raw = res as Db2Employee;
        forkJoin({
          jobs: this.svc.GetJobData(),
          departments: this.svc.GetDepartment(),
          sectors: this.svc.GetSectors(),
        }).subscribe({
          next: ({ jobs, departments, sectors }) => {
            this.vm = {
              empNo: raw.EmpNo,
              name: raw.FullName,
              role: jobs.find((j) => j.Value === raw.JobCode)?.Text ?? null,
              deptName:
                departments.find((d) => d.Code === raw.DeptCode)?.Name ?? null,
              sectorName:
                sectors.find((s) => Number.parseInt(s.Value) === raw.SectorCode)
                  ?.Text ?? null,
            };
            // enrich backend fields
            this.fetchBackendDetails(raw.EmpNo);
          },
          error: () => {
            this.vm = {
              empNo: raw.EmpNo,
              name: raw.FullName,
              role: null,
              deptName: null,
              sectorName: null,
            };
            this.fetchBackendDetails(raw.EmpNo);
          },
        });
      },
      error: () => {
        this.error = 'فشل البحث';
        this.loading = false;
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
        this.loading = false;
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
