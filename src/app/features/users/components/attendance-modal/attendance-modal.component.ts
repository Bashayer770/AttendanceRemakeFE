import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AttendanceService,
  LateExcuseDay,
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

  selectedMonth: number = 1; // 1-12
  selectedYear: number = new Date().getFullYear();
  months: Array<{ value: number; label: string }> = [];
  years: number[] = [];

  loading = false;
  rows: Array<{
    day?: string;
    inTime?: string;
    outTime?: string;
    deduction?: number;
  }> = [];

  constructor(private attendance: AttendanceService) {
    const now = new Date();
    const year = now.getFullYear();
    const labels = [
      'يناير',
      'فبراير',
      'مارس',
      'إبريل',
      'مايو',
      'يونيو',
      'يوليو',
      'أغسطس',
      'سبتمبر',
      'أكتوبر',
      'نوفمبر',
      'ديسمبر',
    ];
    this.months = Array.from({ length: 12 }, (_, i) => ({
      value: i + 1,
      label: labels[i],
    }));
    this.selectedMonth = now.getMonth() + 1;
    this.years = [year - 2, year - 1, year, year + 1];
    this.selectedYear = year;
  }

  onClose() {
    this.close.emit();
  }

  private getMonthRange(
    y: number,
    m: number
  ): { start: string; end: string; base: string } | null {
    if (m < 1 || m > 12) return null;
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0);
    const iso = (d: Date) => d.toISOString().slice(0, 10);
    const pad = (n: number) => String(n).padStart(2, '0');
    return { start: iso(start), end: iso(end), base: `${y}-${pad(m)}` };
  }

  fetchAttendance() {
    if (!this.loginName) return;
    const range = this.getMonthRange(this.selectedYear, this.selectedMonth);
    if (!range) return;

    this.loading = true;
    const user = this.loginName;

    this.attendance
      .getLateExcuseRecord(user, range.start, range.end)
      .subscribe({
        next: (days: LateExcuseDay[]) => {
          const byDay: Record<
            string,
            {
              day?: string;
              inTime?: string;
              outTime?: string;
              deduction?: number;
            }
          > = {};
          for (const d of days || []) {
            const key = d.day;
            byDay[key] = byDay[key] || { day: key };
            byDay[key].inTime = d.in || undefined;
            byDay[key].outTime = d.out || undefined;
          }

          const isWeekend = (dayStr: string | undefined) => {
            if (!dayStr) return false;
            const dt = new Date(dayStr + 'T00:00:00');
            const wd = dt.getDay();
            return wd === 5 || wd === 6; // Fri/Sat
          };

          this.attendance
            .getDeductions(user, range.start, range.end)
            .subscribe({
              next: (ded: Deductions[]) => {
                for (const d of ded || []) {
                  const key = d.day;
                  byDay[key] = byDay[key] || { day: key };
                  byDay[key].deduction = d.late ?? byDay[key].deduction;
                }
                const daysInMonth = new Date(
                  this.selectedYear,
                  this.selectedMonth,
                  0
                ).getDate();
                const pad = (n: number) => String(n).padStart(2, '0');
                this.rows = Array.from({ length: daysInMonth }, (_, i) => {
                  const dayStr = `${range.base}-${pad(i + 1)}`;
                  return byDay[dayStr] || { day: dayStr };
                }).filter((r) => !isWeekend(r.day));
                this.loading = false;
              },
              error: () => {
                const daysInMonth = new Date(
                  this.selectedYear,
                  this.selectedMonth,
                  0
                ).getDate();
                const pad = (n: number) => String(n).padStart(2, '0');
                this.rows = Array.from({ length: daysInMonth }, (_, i) => {
                  const dayStr = `${range.base}-${pad(i + 1)}`;
                  return byDay[dayStr] || { day: dayStr };
                }).filter((r) => !isWeekend(r.day));
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
