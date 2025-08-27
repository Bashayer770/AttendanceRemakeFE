import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HomeTotalMinutesSvgComponent } from '../../../assets/SVG/home-total-minutes-svg.component';
import { HomeUserIdSvgComponent } from '../../../assets/SVG/home-user-id-svg.component';
import { HomeRemainingMinutesSvgComponent } from '../../../assets/SVG/home-remaining-minutes-svg.component';

interface TimingPlan {
  descA: string;
  fromTime: string;
  toTime: string;
}

interface RowData {
  transactionType: number;
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
  templateUrl: './home.component.html',
})
export class HomeComponent {
  userName = 'بشاير';
  empId = '12345';
  fingerCode = '98765';

  timingPlan: TimingPlan | null = {
    descA: 'الدوام الصباحي',
    fromTime: '08:00',
    toTime: '02:00',
  };

  remainingMinutes = 614;

  TransactionTypeLabels: Record<number, string> = {
    0: 'دخول',
    1: 'تأخير',
    2: 'تأخير',
    3: 'استئذان',
  };

  data: RowData[] = [
    {
      transactionType: 1,
      date: new Date(),
      fromTime: '08:00',
      toTime: '14:00',
      minutes: 15,
    },
    {
      transactionType: 1,
      date: new Date(),
      fromTime: '08:30',
      toTime: '14:00',
      minutes: 45,
    },
    {
      transactionType: 1,
      date: new Date(),
      fromTime: '08:30',
      toTime: '14:00',
      minutes: 45,
    },
  ];

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
