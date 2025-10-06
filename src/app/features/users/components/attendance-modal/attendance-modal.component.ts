import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AttendanceService,
  AttendanceLog,
  AttendanceResponse,
  Deductions,
} from '../../../../services/attendanceService';

@Component({
  selector: 'app-attendance-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance-modal.component.html',
})
export class AttendanceModalComponent {
  @Input() isVisible: boolean = false;
  @Input() empNo: number | null = null;
  @Input() empName: string | null = null;
  @Input() loginName: string | null = null;
  @Output() close = new EventEmitter<void>();

  fromDate: string = '';
  toDate: string = '';

  loading = false;
  rows: Array<{
    day?: string;
    inTime?: string;
    outTime?: string;
    minutes?: number;
    deduction?: number;
  }> = [];

  constructor(private attendance: AttendanceService) {}

  onClose() {
    this.close.emit();
  }

  fetchAttendance() {
    if (!this.loginName || !this.fromDate || !this.toDate) return;
    this.loading = true;

    const user = this.loginName; // backend expects loginName

    this.attendance.getLateRecord(user, this.fromDate, this.toDate).subscribe({
      next: (logs: AttendanceLog[]) => {
        // Initialize map by day
        const byDay: Record<
          string,
          {
            day?: string;
            inTime?: string;
            outTime?: string;
            minutes?: number;
            deduction?: number;
          }
        > = {};
        for (const l of logs || []) {
          const dayKey = l.ioDate || '';
          byDay[dayKey] = byDay[dayKey] || { day: dayKey };
          byDay[dayKey].inTime = l.inTime;
          byDay[dayKey].outTime = l.outTime;
          byDay[dayKey].minutes = l.minutes;
        }

        // Fetch deductions and merge
        this.attendance
          .getDeductions(user, this.fromDate, this.toDate)
          .subscribe({
            next: (ded: Deductions[]) => {
              for (const d of ded || []) {
                const key = d.day || '';
                byDay[key] = byDay[key] || { day: key };
                byDay[key].deduction = d.amount ?? byDay[key].deduction;
              }
              this.rows = Object.values(byDay);
              this.loading = false;
            },
            error: () => {
              this.rows = Object.values(byDay);
              this.loading = false;
            },
          });
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
