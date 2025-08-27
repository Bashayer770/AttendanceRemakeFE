import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '../../../../models/locations';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-edit-location-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalComponent],
  templateUrl: './edit-location-modal.component.html',
  styleUrls: ['./edit-location-modal.component.css'],
})
export class EditLocationModalComponent implements OnChanges {
  @Input() isVisible: boolean = false;
  @Input() location: Location | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  myForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      descA: ['', Validators.required],
      descE: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['location'] && this.location) {
      this.myForm.patchValue({
        descA: this.location.descA,
        descE: this.location.descE,
      });
    }
  }

  onSubmit() {
    if (this.myForm.valid && this.location) {
      const updatedLocation = {
        ...this.location,
        ...this.myForm.value,
      };
      this.submit.emit(updatedLocation);
    }
  }

  onClose() {
    this.close.emit();
    this.myForm.reset();
  }
}
