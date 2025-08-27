import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EmpAllow } from '../models/emp-allow';

const MOCK_EMP_ALLOWS: EmpAllow[] = [
  {
    serial: 1,
    empNo: 1,
    startDate: '2024-09-01T08:00:00Z',
    realStartDate: '2024-09-01T08:10:00Z',
    endDate: '2024-09-01T16:00:00Z',
    allowTimeCode: 101,
    status: 1,
    dedHr: 0,
    empNoNavigation: undefined as any,
  },
];

@Injectable({ providedIn: 'root' })
export class EmpAllowService {
  getAll(): Observable<EmpAllow[]> {
    return of(MOCK_EMP_ALLOWS);
  }

  getByEmpNo(empNo: number): Observable<EmpAllow[]> {
    return of(MOCK_EMP_ALLOWS.filter((a) => a.empNo === empNo));
  }
}
