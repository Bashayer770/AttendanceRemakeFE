import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { API } from './index';
import { Attendance } from '../models/attendance';

export interface LateDay {
  date: string;
  signs: string[]; // e.g., ["08:11:13Tr1", "08:12:16Tr0"]
}

export interface AttendanceResponse {
  day?: string;
  minutes?: number;
}

export interface Deductions {
  day: string;
  late: number;
  endWorkExcuse: number;
  duringWorkExcuse: number;
  forgetIn: number;
  forgetOut: number;
}

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  constructor(private http: HttpClient) {}

  getLateRecord(
    user: string,
    startDate: string,
    endDate: string
  ): Observable<LateDay[]> {
    return this.http.get<LateDay[]>(
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

  // Backward compatibility for Home/User component
  getByFingerCode(fingerCode: number): Observable<Attendance[]> {
    return of([]);
  }
}
