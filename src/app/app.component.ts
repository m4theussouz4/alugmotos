import { Component, OnInit } from '@angular/core';
import { FirestoreService } from './core/firestore.service';
import { HeroHeaderComponent } from './features/hero-header/hero-header.component';
import { HowItWorksComponent } from './features/how-it-works/how-it-works.component';
import { MotorcyclesComponent } from './features/motorcycles/motorcycles.component';
import { PlansComponent } from './features/plans/plans.component';
import { UnitsComponent } from './features/units/units.component';
import { OperatingRangeComponent } from './features/operating-range/operating-range.component';
import { FooterComponent } from './features/footer/footer.component';
import { NavbarComponent } from './features/navbar/navbar.component';
import { Carousel } from 'primeng/carousel';
import { CustomProgressBarComponent } from './shared/components/custom-progress-bar/custom-progress-bar.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    imports: [
        HeroHeaderComponent,
        HowItWorksComponent,
        MotorcyclesComponent,
        PlansComponent,
        UnitsComponent,
        OperatingRangeComponent,
        FooterComponent,
        NavbarComponent,
        CustomProgressBarComponent,
        CommonModule,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    public siteContent: any;
    public isLoading$: any;

    constructor(
        private firestoreService: FirestoreService,
    ) {
        Carousel.prototype.onTouchMove = () => { };
        this.isLoading$ = this.firestoreService.isLoading$;
    }

    ngOnInit(): void {
        this.firestoreService.getCollection().subscribe(data => {
          this.siteContent = data;
        });
    }
}
