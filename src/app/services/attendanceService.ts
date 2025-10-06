import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from './index';

export interface AttendanceLog {
  ioDate?: string;
  inTime?: string;
  outTime?: string;
  minutes?: number;
}

export interface AttendanceResponse {
  day?: string;
  minutes?: number;
}

export interface Deductions {
  day?: string;
  amount?: number;
}

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  constructor(private http: HttpClient) {}

  getLateRecord(
    user: string,
    startDate: string,
    endDate: string
  ): Observable<AttendanceLog[]> {
    return this.http.get<AttendanceLog[]>(
      API.ATTENDANCE.GET_LATE_RECORD(user, startDate, endDate)
    );
  }

  getLateExcuseRecord(
    user: string,
    startDate: string,
    endDate: string
  ): Observable<AttendanceResponse[]> {
    return this.http.get<AttendanceResponse[]>(
      API.ATTENDANCE.GET_LATE_EXCUSE_RECORD(user, startDate, endDate)
    );
  }

  getDeductions(
    user: string,
    startDate: string,
    endDate: string
  ): Observable<Deductions[]> {
    return this.http.get<Deductions[]>(
      API.ATTENDANCE.GET_DEDUCTIONS(user, startDate, endDate)
    );
  }
}
