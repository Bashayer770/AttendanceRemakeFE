import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NodeService } from '../../../../services/nodes/nodeService';
import { NodeModel } from '../../../../models/node';
import { ModalComponent } from '../../../locations/components/modal/modal.component';

@Component({
  selector: 'app-edit-node-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './edit-node-modal.component.html',
  styleUrls: ['./edit-node-modal.component.css'],
})
export class EditNodeModalComponent implements OnInit {
  @Input() node!: NodeModel;
  @Output() close = new EventEmitter<boolean>();

  nodeForm: FormGroup;

  constructor(private nodeService: NodeService, private fb: FormBuilder) {
    this.nodeForm = this.fb.group({
      serialNo: [{ value: '', disabled: true }],
      descA: ['', [Validators.required, Validators.minLength(1)]],
      descE: ['', [Validators.required, Validators.minLength(1)]],
      locCode: [0, [Validators.required, Validators.min(1)]],
      floor: [null],
    });
  }

  ngOnInit() {
    this.nodeForm.patchValue({
      serialNo: this.node.serialNo,
      descA: this.node.descA,
      descE: this.node.descE,
      locCode: this.node.locCode,
      floor: this.node.floor,
    });
  }

  onCancel() {
    this.close.emit(false);
  }

  onSave() {
    if (this.nodeForm.valid) {
      const payload: NodeModel = {
        serialNo: this.node.serialNo,
        descA: this.nodeForm.get('descA')?.value,
        descE: this.nodeForm.get('descE')?.value,
        locCode: this.nodeForm.get('locCode')?.value,
        floor: this.nodeForm.get('floor')?.value,
      };
      this.nodeService.update(this.node.serialNo, payload).subscribe({
        next: () => this.close.emit(true),
        error: (err) => {
          console.error('Failed to update node', err);
          alert('فشل في تحديث الجهاز');
        },
      });
    } else {
      Object.values(this.nodeForm.controls).forEach((c) => c.markAsTouched());
    }
  }
}
