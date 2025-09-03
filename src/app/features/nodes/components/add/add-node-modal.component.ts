import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-node-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-node-modal.component.html',
  styleUrls: ['./add-node-modal.component.css'],
})
export class AddNodeModalComponent {
  @Output() close = new EventEmitter<boolean>();

  onCancel() {
    this.close.emit(false);
  }

  onSave() {
    this.close.emit(true);
  }
}
