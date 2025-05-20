import { Component, Input } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-motorcycles',
  imports: [CarouselModule],
  templateUrl: './motorcycles.component.html',
  styleUrl: './motorcycles.component.scss'
})
export class MotorcyclesComponent {
  @Input() content: any;
}
