import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-plans',
  imports: [CarouselModule, CommonModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss'
})
export class PlansComponent implements OnInit {
  @Input() content: any;

  public combinedPlans: any[] = [];
  public responsiveOptions: any[] | undefined;

  ngOnInit() {
    this.combinedPlans = [
      ...this.content.plans.map((plan: any) => ({ ...plan, isSpecial: false })),
      { ...this.content.specialPlan, isSpecial: true }
    ];

    this.responsiveOptions = [
      {
        breakpoint: '1249.98px',
        numVisible: 2.5,
        numScroll: 1,
      },
      {
        breakpoint: '1099.98px',
        numVisible: 2.2,
        numScroll: 1,
      },
      {
        breakpoint: '999.98px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '899.98px',
        numVisible: 1.8,
        numScroll: 2,
      },
      {
        breakpoint: '799.98px',
        numVisible: 1.5,
        numScroll: 0.75,
      },
      {
        breakpoint: '699.98px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }
}
