import type { Employee } from './employee';

export interface EmpAllow {
  serial: number;
  empNo: number;
  startDate: string; // ISO or date string representation
  realStartDate: string;
  endDate: string;
  allowTimeCode: number;
  status: number;
  dedHr: number;
  empNoNavigation: Employee;
}
