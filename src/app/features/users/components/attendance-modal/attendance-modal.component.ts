import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-attendance-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance-modal.component.html',
})
export class AttendanceModalComponent {
  @Input() isVisible: boolean = false;
  @Input() empNo: number | null = null;
  @Input() empName: string | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
