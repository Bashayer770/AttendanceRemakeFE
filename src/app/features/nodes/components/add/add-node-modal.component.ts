import { Component, EventEmitter, Output, OnInit } from '@angular/core';
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
  selector: 'app-add-node-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './add-node-modal.component.html',
  styleUrls: ['./add-node-modal.component.css'],
})
export class AddNodeModalComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();

  nodeForm: FormGroup;

  constructor(private nodeService: NodeService, private fb: FormBuilder) {
    this.nodeForm = this.fb.group({
      serialNo: ['', [Validators.required, Validators.minLength(1)]],
      descA: ['', [Validators.required, Validators.minLength(1)]],
      descE: ['', [Validators.required, Validators.minLength(1)]],
      locCode: [0, [Validators.required, Validators.min(1)]],
      floor: [null],
    });
  }

  ngOnInit() {
    // Form is already initialized in constructor
  }

  onCancel() {
    this.close.emit(false);
  }

  onSave() {
    if (this.nodeForm.valid) {
      const nodeData: NodeModel = this.nodeForm.value;
      this.nodeService.create(nodeData).subscribe({
        next: () => {
          this.close.emit(true);
        },
        error: (err) => {
          console.error('Failed to create node', err);
          alert('فشل في إضافة الجهاز');
        },
      });
    } else {
      this.markFormGroupTouched();
      alert('يرجى ملء جميع الحقول المطلوبة بشكل صحيح');
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.nodeForm.controls).forEach((key) => {
      const control = this.nodeForm.get(key);
      control?.markAsTouched();
    });
  }
}
