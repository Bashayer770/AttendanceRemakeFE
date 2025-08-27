import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  imports: [CommonModule,FormsModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
// @Input() show = false;
@Input() title = 'Modal'
@Input() isVisible: boolean = false
@Output() close = new EventEmitter<void>();


onClose(){
  this.close.emit()
}
}
