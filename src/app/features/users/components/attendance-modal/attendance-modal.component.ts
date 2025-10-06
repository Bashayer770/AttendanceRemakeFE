import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  @Output() close = new EventEmitter<void>();

  fromDate: string = '';
  toDate: string = '';

  onClose() {
    this.close.emit();
  }
}
