import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hero-header',
  imports: [],
  templateUrl: './hero-header.component.html',
  styleUrl: './hero-header.component.scss'
})
export class HeroHeaderComponent {
  @Input() content: any;
}
