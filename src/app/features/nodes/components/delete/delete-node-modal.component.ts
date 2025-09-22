import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NodeService } from '../../../../services/nodes/nodeService';
import { NodeModel } from '../../../../models/node';
import { ModalComponent } from '../../../locations/components/modal/modal.component';

@Component({
  selector: 'app-delete-node-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './delete-node-modal.component.html',
  styleUrls: ['./delete-node-modal.component.css'],
})
export class DeleteNodeModalComponent {
  @Input() node!: NodeModel;
  @Output() close = new EventEmitter<boolean>();

  constructor(private nodeService: NodeService) {}

  onCancel() {
    this.close.emit(false);
  }

  onConfirm() {
    this.nodeService.delete(this.node.serialNo).subscribe({
      next: () => {
        this.close.emit(true);
      },
      error: (err) => {
        console.error('Failed to delete node', err);
        alert('فشل في حذف الجهاز');
      },
    });
  }
}
