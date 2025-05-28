import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { HeroHeaderComponent } from './hero-header/hero-header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { MotorcyclesComponent } from './motorcycles/motorcycles.component';
import { PlansComponent } from './plans/plans.component';
import { UnitsComponent } from './units/units.component';
import { OperatingRangeComponent } from './operating-range/operating-range.component';
import { FooterComponent } from './footer/footer.component';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-admin-modal',
  imports: [
    DialogModule,
    CommonModule,
    ButtonModule,
    HeroHeaderComponent,
    NavbarComponent,
    HowItWorksComponent,
    MotorcyclesComponent,
    PlansComponent,
    UnitsComponent,
    OperatingRangeComponent,
    FooterComponent,
    FormComponent,
  ],
  templateUrl: './admin-modal.component.html',
  styleUrl: './admin-modal.component.scss'
})
export class AdminModalComponent {
  @Input() content: any;
  
  @Output() onCloseModal: EventEmitter<void> = new EventEmitter<void>();
  
  sectionSelected: string | null = null;

  closeModal() {
    this.onCloseModal.emit();
    this.sectionSelected = null;
  }

  resetModal() {
    this.sectionSelected = null;
  }
}
