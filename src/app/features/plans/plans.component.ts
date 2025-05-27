import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-plans',
  imports: [CarouselModule, CommonModule, DialogModule, InputTextModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss'
})
export class PlansComponent implements OnInit {
  @Input() content: any;

  public combinedPlans: any[] = [];
  public responsiveOptions: any[] | undefined;

  public dialogVisible: boolean = false;

  ngOnInit() {
    this.combinedPlans = [
      ...this.content.plans.map((plan: any) => ({ ...plan, isSpecial: false })),
      { ...this.content.specialPlan, isSpecial: true }
    ];

    this.responsiveOptions = [
      {
        breakpoint: '1599.98px',
        numVisible: 3.5,
        numScroll: 3,
      },
      {
        breakpoint: '1399.98px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '1199.98px',
        numVisible: 2.5,
        numScroll: 2,
      },
      {
        breakpoint: '999.98px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '799.98px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  openForm(plan: string) {
    this.dialogVisible = true;
  }
}
