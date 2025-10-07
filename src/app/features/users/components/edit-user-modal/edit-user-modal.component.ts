import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../../services/index';

interface TimingPlanDto {
  code: number;
  descA: string;
  descE?: string;
}

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-user-modal.component.html',
})
export class EditUserModalComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean = false;
  @Input() empNo: number | null = null;
  @Input() fingerCode: number | null = null;
  @Input() timingCode: number | null = null;
  @Input() hasAllow: boolean | null = null;
  @Input() status: number | null = null; // 0 or 1

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{
    empNo: number | null;
    fingerCode: number | null;
    timingCode: number | null;
    hasAllow: boolean | null;
    status: number | null;
  }>();

  form!: FormGroup;
  loadingPlans = false;
  timingPlans: TimingPlanDto[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      fingerCode: [this.fingerCode, [Validators.required]],
      timingCode: [this.timingCode, [Validators.required]],
      hasAllow: [this.hasAllow, [Validators.required]],
      status: [this.status, [Validators.required]],
    });
    this.loadTimingPlans();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.form) return;
    const patch: any = {};
    if (changes['fingerCode']) patch.fingerCode = this.fingerCode;
    if (changes['timingCode']) patch.timingCode = this.timingCode;
    if (changes['hasAllow']) patch.hasAllow = this.hasAllow;
    if (changes['status']) patch.status = this.status;
    if (Object.keys(patch).length > 0)
      this.form.patchValue(patch, { emitEvent: false });
  }

  private loadTimingPlans(): void {
    this.loadingPlans = true;
    this.http.get<TimingPlanDto[]>(API.TIMING_PLANS.GET_ALL).subscribe({
      next: (list) => {
        this.timingPlans = Array.isArray(list) ? list : [];
        this.loadingPlans = false;
      },
      error: () => {
        this.timingPlans = [];
        this.loadingPlans = false;
      },
    });
  }

  onSave(): void {
    if (this.form.invalid) return;
    const v = this.form.value;
    this.save.emit({
      empNo: this.empNo,
      fingerCode: v.fingerCode ?? null,
      timingCode: v.timingCode ?? null,
      hasAllow: v.hasAllow ?? null,
      status: v.status ?? null,
    });
  }

  onClose(): void {
    this.close.emit();
  }
}
