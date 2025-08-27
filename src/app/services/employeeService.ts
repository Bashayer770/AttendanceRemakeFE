import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Employee } from '../models/employee';

const MOCK_EMPLOYEES: Employee[] = [
  {
    empNo: 1,
    fingerCode: 98765,
    deptCode: 100,
    nameA: 'أحمد علي',
    nameE: 'Ahmed Ali',
    timingCode: 1,
    jobType: 0,
    sex: 1,
    checkLate: 1,
    hasAllow: false,
    status: 1,
    inLeave: false,
    hasPass: null,
    locCode: null,
    regNo: null,
    empAllows: [],
    timingCodeNavigation: {
      code: 1,
      descA: 'الدوام الصباحي',
      descE: 'Morning Shift',
      fromTime: '08:00',
      toTime: '16:00',
      rmdFromTime: '08:00',
      rmdToTime: '16:00',
      isRamadan: false,
      canGoBefore: false,
      activity: true,
      employees: [],
    },
  },
];

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  getAll(): Observable<Employee[]> {
    return of(MOCK_EMPLOYEES);
  }

  getByEmpNo(empNo: number): Observable<Employee | undefined> {
    return of(MOCK_EMPLOYEES.find((e) => e.empNo === empNo));
  }

  getByFingerCode(fingerCode: number): Observable<Employee | undefined> {
    return of(MOCK_EMPLOYEES.find((e) => e.fingerCode === fingerCode));
  }
}
