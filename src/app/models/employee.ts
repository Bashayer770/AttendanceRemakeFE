import type { EmpAllow } from './emp-allow';
import type { TimingPlan } from './timing-plan';

export interface Employee {
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
  hasPass: boolean | null;
  locCode: number | null;
  regNo: number | null;
  empAllows: EmpAllow[];
  timingCodeNavigation: TimingPlan;
}
