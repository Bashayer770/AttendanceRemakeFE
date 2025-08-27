import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Attendance } from '../models/attendance';

const MOCK_ATTENDANCE: Attendance[] = [
  {
    attCode: 1,
    fingerCode: 98765,
    iodateTime: '2024-09-01T08:01:00Z',
    nodeSerialNo: 'NODE-123',
    status: 1,
    photo: null,
    trType: 0,
    curTimPlan: 1,
  },
  {
    attCode: 2,
    fingerCode: 98765,
    iodateTime: '2024-09-01T16:00:00Z',
    nodeSerialNo: 'NODE-123',
    status: 1,
    photo: null,
    trType: 1,
    curTimPlan: 1,
  },
];

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  getAll(): Observable<Attendance[]> {
    return of(MOCK_ATTENDANCE);
  }

  getByFingerCode(fingerCode: number): Observable<Attendance[]> {
    return of(MOCK_ATTENDANCE.filter((a) => a.fingerCode === fingerCode));
  }
}
