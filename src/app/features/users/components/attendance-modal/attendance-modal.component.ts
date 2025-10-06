import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AttendanceService,
  LateDay,
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

  month: string = '';
  months: Array<{ value: string; label: string }> = [];

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
    const pad = (n: number) => String(n).padStart(2, '0');
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
      value: `${year}-${pad(i + 1)}`,
      label: `${labels[i]} ${year}`,
    }));
    this.month = `${year}-${pad(now.getMonth() + 1)}`;
  }

  onClose() {
    this.close.emit();
  }

  private getMonthRange(ym: string): { start: string; end: string } | null {
    // ym format: YYYY-MM
    if (!/^\d{4}-\d{2}$/.test(ym)) return null;
    const [y, m] = ym.split('-').map(Number);
    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0); // last day of month
    const iso = (d: Date) => d.toISOString().slice(0, 10);
    return { start: iso(start), end: iso(end) };
  }

  fetchAttendance() {
    if (!this.loginName || !this.month) return;
    const range = this.getMonthRange(this.month);
    if (!range) return;

    this.loading = true;
    const user = this.loginName;

    this.attendance.getLateRecord(user, range.start, range.end).subscribe({
      next: (lateDays: LateDay[]) => {
        const byDay: Record<
          string,
          {
            day?: string;
            inTime?: string;
            outTime?: string;
            deduction?: number;
          }
        > = {};
        for (const d of lateDays || []) {
          const key = d.date;
          byDay[key] = byDay[key] || { day: key };
          // Parse signs into first IN (Tr0) and last OUT (Tr1) if available
          // Tr0 is out and Tr1 is in per instruction? Given text: tr1 is in, tr0 is out
          const inTimes = (d.signs || [])
            .filter((s) => s.endsWith('Tr1'))
            .map((s) => s.replace('Tr1', ''));
          const outTimes = (d.signs || [])
            .filter((s) => s.endsWith('Tr0'))
            .map((s) => s.replace('Tr0', ''));
          byDay[key].inTime = inTimes.length > 0 ? inTimes[0] : undefined;
          byDay[key].outTime =
            outTimes.length > 0 ? outTimes[outTimes.length - 1] : undefined;
        }

        this.attendance.getDeductions(user, range.start, range.end).subscribe({
          next: (ded: Deductions[]) => {
            for (const d of ded || []) {
              const key = d.day;
              byDay[key] = byDay[key] || { day: key };
              byDay[key].deduction = d.late ?? byDay[key].deduction;
            }
            // Expand to all days of month
            const [yy, mm] = this.month.split('-').map(Number);
            const daysInMonth = new Date(yy, mm, 0).getDate();
            const pad = (n: number) => String(n).padStart(2, '0');
            this.rows = Array.from({ length: daysInMonth }, (_, i) => {
              const dayStr = `${this.month}-${pad(i + 1)}`;
              return byDay[dayStr] || { day: dayStr };
            });
            this.loading = false;
          },
          error: () => {
            // Same expansion without deductions
            const [yy, mm] = this.month.split('-').map(Number);
            const daysInMonth = new Date(yy, mm, 0).getDate();
            const pad = (n: number) => String(n).padStart(2, '0');
            this.rows = Array.from({ length: daysInMonth }, (_, i) => {
              const dayStr = `${this.month}-${pad(i + 1)}`;
              return byDay[dayStr] || { day: dayStr };
            });
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
