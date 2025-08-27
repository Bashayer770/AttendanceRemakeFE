export interface Attendance {
  attCode: number;
  fingerCode: number;
  iodateTime: string;
  nodeSerialNo: string;
  status: number;
  photo: string | null;
  trType: number;
  curTimPlan: number;
}
