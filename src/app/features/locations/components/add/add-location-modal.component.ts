import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-add-location-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './add-location-modal.component.html',
  styleUrls: ['./add-location-modal.component.css'],
})
export class AddLocationModalComponent {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  myForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      descA: ['', Validators.required],
      descE: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.submit.emit(this.myForm.value);
      this.myForm.reset();
    }
  }

  onClose() {
    this.close.emit();
    this.myForm.reset();
  }
}
