import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeModel } from '../../../../models/node';

@Component({
  selector: 'app-edit-node-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './edit-node-modal.component.html',
  styleUrls: ['./edit-node-modal.component.css'],
})
export class EditNodeModalComponent {
  @Input() node!: NodeModel;
  @Output() close = new EventEmitter<boolean>();

  onCancel() {
    this.close.emit(false);
  }

  onSave() {
    this.close.emit(true);
  }
}
