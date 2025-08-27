import type { Employee } from './employee';

export interface TimingPlan {
  code: number;
  descA: string;
  descE: string;
  fromTime: string;
  toTime: string;
  rmdFromTime: string;
  rmdToTime: string;
  isRamadan: boolean;
  canGoBefore: boolean;
  activity: boolean | null;
  employees: Employee[];
}
