import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeModel } from '../../../../models/node';

@Component({
  selector: 'app-delete-node-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-node-modal.component.html',
  styleUrls: ['./delete-node-modal.component.css'],
})
export class DeleteNodeModalComponent {
  @Input() node!: NodeModel;
  @Output() close = new EventEmitter<boolean>();

  onCancel() {
    this.close.emit(false);
  }

  onConfirm() {
    this.close.emit(true);
  }
}
