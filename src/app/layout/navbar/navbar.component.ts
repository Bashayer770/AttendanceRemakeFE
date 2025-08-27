import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandLogoComponent } from './components/brand-logo/brand-logo.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { MobileMenuComponent } from './components/mobile-menu/mobile-menu.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    BrandLogoComponent,
    NavMenuComponent,
    UserMenuComponent,
    MobileMenuComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
