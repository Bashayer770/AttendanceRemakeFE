import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PifssLogoVComponent } from '../../../../shared/icons/pifss-logo-v/pifss-logo-v.component';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  imports: [CommonModule,PifssLogoVComponent],
  templateUrl: './brand-logo.component.html',
  styleUrls: ['./brand-logo.component.css'],
})
export class BrandLogoComponent {}
