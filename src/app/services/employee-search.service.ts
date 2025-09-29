import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeSearchService {

  private empUrl = 'http://10.114.1.70//db2sqlws/api/employee';
  private deptUrl = 'http://10.114.1.70//db2sqlws/api/Lookups/Departments';
  private jobsUrl = 'http://10.114.1.70//db2sqlws/api/Lookups/Jobs';
  private sectorsUrl = 'http://10.114.1.70//db2sqlws/api/Lookups/Sectors';

  constructor(private http: HttpClient) { }

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

  getCompleteEmployee(empNo: number): Observable<Db2EmployeeInfo|undefined> {
    return this.GetEmployeeData(empNo).pipe(
      catchError(() => of(undefined)),
        switchMap(empData => {
          if (!empData)
            return of(undefined);
                    
          return forkJoin({
            jobs: this.GetJobData(),
            departments: this.GetDepartment(),
            sectors: this.GetSectors()
          }).pipe(
            map(({ jobs, departments, sectors }) => ({
              empNo: empData.EmpNo,
              empName: empData.FullName,
              empRole: jobs.find(j => j.Value == empData.JobCode)?.Text,
              deptName: departments.find(d => d.Code == empData.DeptCode)?.Name,
              sectorName: sectors.find(s => Number.parseInt(s.Value) == empData.SectorCode)?.Text
            })),
            catchError(() => of(undefined)) 
          );
        })
    );
  }
  
}

interface Department{
  Activity: number,
  Sector: number,
  Name: string,
  EnglishName: string,
  Code: number,
}

interface Job{
  Text:string,
  Value: number
}

interface Sector{
  Value2: null,
  Text: string,
  Value: string,
}

export interface Db2Employee{
  EmpNo: number,
  DeptCode: number,
  JobCode: number,
  SectorCode: number,
  FullName: string
}

export interface Db2EmployeeInfo {
  empNo: number ,
  empName: string | undefined,
  empRole: string | undefined,
  deptName: string | undefined,
  sectorName: string | undefined,
  }
