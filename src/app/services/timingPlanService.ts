import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TimingPlan } from '../models/timing-plan';

const MOCK_TIMING_PLANS: TimingPlan[] = [
  {
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
];

@Injectable({ providedIn: 'root' })
export class TimingPlanService {
  getAll(): Observable<TimingPlan[]> {
    return of(MOCK_TIMING_PLANS);
  }

  getByCode(code: number): Observable<TimingPlan | undefined> {
    return of(MOCK_TIMING_PLANS.find((tp) => tp.code === code));
  }

  searchByArabicDesc(query: string): Observable<TimingPlan[]> {
    const q = query.toLowerCase();
    return of(
      MOCK_TIMING_PLANS.filter((tp) => tp.descA.toLowerCase().includes(q))
    );
  }
}
