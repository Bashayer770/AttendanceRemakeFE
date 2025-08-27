import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-delete-location-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './delete-location-modal.component.html',
  styleUrls: ['./delete-location-modal.component.css'],
})
export class DeleteLocationModalComponent {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }
}
