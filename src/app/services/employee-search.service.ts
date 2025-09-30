import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { API } from './index';

@Injectable({
  providedIn: 'root',
})
export class EmployeeSearchService {
  private empUrl = 'http://10.114.1.70//db2sqlws/api/employee';
  private deptUrl = 'http://10.114.1.70//db2sqlws/api/Lookups/Departments';
  private jobsUrl = 'http://10.114.1.70//db2sqlws/api/Lookups/Jobs';
  private sectorsUrl = 'http://10.114.1.70//db2sqlws/api/Lookups/Sectors';

  constructor(private http: HttpClient) {}

  // External DB2 endpoints
  GetEmployeeData(param: number): Observable<Db2Employee> {
    return this.http.get<Db2Employee>(`${this.empUrl}/${param}`);
  }

  GetEmployeeDataStr(param: string): Observable<Db2Employee> {
    return this.http.get<Db2Employee>(`${this.empUrl}/${param}`);
  }

  GetJobData(): Observable<Job[]> {
    return this.http.get<Job[]>(`${this.jobsUrl}`);
  }

  GetDepartment(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.deptUrl}`);
  }

  GetSectors(): Observable<Sector[]> {
    return this.http.get<Sector[]>(`${this.sectorsUrl}`);
  }

  getCompleteEmployee(empNo: number): Observable<Db2EmployeeInfo | undefined> {
    return this.GetEmployeeData(empNo).pipe(
      catchError(() => of(undefined)),
      switchMap((empData) => {
        if (!empData) return of(undefined);

        return forkJoin({
          jobs: this.GetJobData(),
          departments: this.GetDepartment(),
          sectors: this.GetSectors(),
        }).pipe(
          map(({ jobs, departments, sectors }) => ({
            empNo: empData.EmpNo,
            empName: empData.FullName,
            empRole: jobs.find((j) => j.Value == empData.JobCode)?.Text,
            deptName: departments.find((d) => d.Code == empData.DeptCode)?.Name,
            sectorName: sectors.find(
              (s) => Number.parseInt(s.Value) == empData.SectorCode
            )?.Text,
          })),
          catchError(() => of(undefined))
        );
      })
    );
  }

  // Backend Employees endpoints
  searchEmployees(params: {
    empNo?: number;
    fingerCode?: number;
    civilId?: string;
    deptCode?: number;
    name?: string;
  }): Observable<EmployeeDetailsDto[]> {
    let httpParams = new HttpParams();
    if (params.empNo != null)
      httpParams = httpParams.set('empNo', params.empNo);
    if (params.fingerCode != null)
      httpParams = httpParams.set('fingerCode', params.fingerCode);
    if (params.civilId) httpParams = httpParams.set('civilId', params.civilId);
    if (params.deptCode != null)
      httpParams = httpParams.set('deptCode', params.deptCode);
    if (params.name) httpParams = httpParams.set('name', params.name);

    return this.http.get<EmployeeDetailsDto[]>(API.EMPLOYEES.SEARCH, {
      params: httpParams,
    });
  }

  getEmployeeByEmpNo(empNo: number): Observable<EmployeeDetailsDto> {
    return this.http.get<EmployeeDetailsDto>(API.EMPLOYEES.GET_BY_EMPNO(empNo));
  }

  // Backend TimingPlans endpoints
  getTimingPlanByCode(code: number): Observable<TimingPlanDto> {
    return this.http.get<TimingPlanDto>(API.TIMING_PLANS.GET_BY_CODE(code));
  }

  getTimingPlans(): Observable<TimingPlanDto[]> {
    return this.http.get<TimingPlanDto[]>(API.TIMING_PLANS.GET_ALL);
  }
}

interface Department {
  Activity: number;
  Sector: number;
  Name: string;
  EnglishName: string;
  Code: number;
}

interface Job {
  Text: string;
  Value: number;
}

interface Sector {
  Value2: null;
  Text: string;
  Value: string;
}

export interface Db2Employee {
  EmpNo: number;
  DeptCode: number;
  JobCode: number;
  SectorCode: number;
  FullName: string;
}

export interface Db2EmployeeInfo {
  empNo: number;
  empName: string | undefined;
  empRole: string | undefined;
  deptName: string | undefined;
  sectorName: string | undefined;
}

export interface EmployeeDetailsDto {
  empNo: number;
  fingerCode: number;
  deptCode: number;
  nameA: string;
  nameE: string;
  timingCode: number;
  jobType: number;
  sex: number;
  checkLate: number;
  hasAllow: boolean;
  status: number;
  inLeave: boolean;
  hasPass?: boolean;
  locCode?: number | null;
  regNo?: number | null;
  civilID?: string | null;
  db2DeptCode?: number | null;
  fullName?: string | null;
  shortName?: string | null;
  mobileNo?: number | null;
}

export interface TimingPlanDto {
  code: number;
  descA: string;
  descE: string;
}
