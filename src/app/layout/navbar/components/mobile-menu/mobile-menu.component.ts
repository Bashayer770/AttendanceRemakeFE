import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.css'],
})
export class MobileMenuComponent {
  @Input() isMenuOpen: boolean = false;
  @Output() toggleMenu = new EventEmitter<void>();
  @Output() closeMenu = new EventEmitter<void>();

  onToggleMenu() {
    this.toggleMenu.emit();
  }

  onCloseMenu() {
    this.closeMenu.emit();
  }
}
