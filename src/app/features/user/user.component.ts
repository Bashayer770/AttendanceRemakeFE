import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HomeTotalMinutesSvgComponent } from '../../../assets/SVG/home-total-minutes-svg.component';
import { HomeUserIdSvgComponent } from '../../../assets/SVG/home-user-id-svg.component';
import { HomeRemainingMinutesSvgComponent } from '../../../assets/SVG/home-remaining-minutes-svg.component';
import { AttendanceService } from '../../services/attendanceService';
import { EmployeeService } from '../../services/employeeService';
import { TimingPlanService } from '../../services/timingPlanService';
import type { TimingPlan } from '../../models/timing-plan';
import type { Attendance } from '../../models/attendance';

interface RowData {
  transactionType: number; // 4 = دخول/خروج
  date: Date | string;
  fromTime: string;
  toTime: string;
  minutes: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    HomeTotalMinutesSvgComponent,
    HomeUserIdSvgComponent,
    HomeRemainingMinutesSvgComponent,
  ],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  userName = 'بشاير';
  empId = '12345';
  fingerCode = '98765';

  timingPlan: TimingPlan | null = null;
  remainingMinutes = 0;

  TransactionTypeLabels: Record<number, string> = {
    0: 'دخول',
    1: 'خروج',
    2: 'تأخير',
    3: 'استئذان',
    4: 'دخول/خروج',
  };

  data: RowData[] = [];

  constructor(
    private attendanceService: AttendanceService,
    private employeeService: EmployeeService,
    private timingPlanService: TimingPlanService
  ) {}

  ngOnInit(): void {
    const finger = Number(this.fingerCode);
    this.employeeService.getByFingerCode(finger).subscribe((emp) => {
      if (emp) {
        this.userName = emp.nameA;
        this.empId = String(emp.empNo);
        this.timingPlanService.getByCode(emp.timingCode).subscribe((tp) => {
          if (tp) this.timingPlan = tp;
        });
      }
    });

    this.attendanceService
      .getByFingerCode(Number(this.fingerCode))
      .subscribe((list: Attendance[]) => {
        this.data = this.combineInOutPerDay(list);

        if (this.timingPlan) {
          const to = this.getTimeAsDate(this.timingPlan.toTime);
          const diffMin = Math.round((to.getTime() - Date.now()) / 60000);
          this.remainingMinutes = diffMin;
        } else {
          this.remainingMinutes = 0;
        }
      });
  }

  private combineInOutPerDay(list: Attendance[]): RowData[] {
    const sorted = [...list].sort(
      (a, b) =>
        new Date(a.iodateTime).getTime() - new Date(b.iodateTime).getTime()
    );

    const byDate: Record<string, RowData> = {};

    for (const a of sorted) {
      const d = new Date(a.iodateTime);
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(d.getDate()).padStart(2, '0')}`;
      const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(
        d.getMinutes()
      ).padStart(2, '0')}`;

      if (!byDate[dateKey]) {
        byDate[dateKey] = {
          transactionType: 4,
          date: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
          fromTime: '—',
          toTime: '—',
          minutes: 0,
        };
      }

      if (a.trType === 0) {
        // دخول → من
        byDate[dateKey].fromTime = timeStr;
      } else if (a.trType === 1) {
        // خروج → إلى
        byDate[dateKey].toTime = timeStr;
      }

      // Compute minutes if both present
      const row = byDate[dateKey];
      if (row.fromTime !== '—' && row.toTime !== '—') {
        const from = this.getTimeAsDate(row.fromTime);
        const to = this.getTimeAsDate(row.toTime);
        row.minutes = Math.max(
          0,
          Math.round((to.getTime() - from.getTime()) / 60000)
        );
      }
    }

    return Object.values(byDate);
  }

  getTimeAsDate(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  convertTimeStringToDate(time: string): Date | null {
    if (time === '—') return null;
    return this.getTimeAsDate(time);
  }
}
