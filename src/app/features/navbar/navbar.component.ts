import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input() content: any;

  public menuIsOpen = false;
  public isMobile = false;

  constructor() {
    this.onResize();
  }

  @HostListener('window:resize', [])  onResize() {
    this.isMobile = window.innerWidth <= 999.98;
    this.menuIsOpen = false;
  }

  closeMenu() {
    setTimeout(() => {
      this.menuIsOpen = false;
    });
  }
}
