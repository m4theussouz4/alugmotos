import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarouselModule } from 'primeng/carousel';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-plans',
  imports: [CarouselModule, CommonModule, DialogModule, InputTextModule, ReactiveFormsModule, TextareaModule, SelectModule, DatePickerModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss'
})
export class PlansComponent implements OnInit {
  @Input() content: any;
  @Input() formData: any;

  public combinedPlans: any[] = [];
  public responsiveOptions: any[] | undefined;

  public dialogVisible: boolean = false;
  public selectedPlan: string = '';

  public form: FormGroup;
  public paymentMethodList: any[] = [];
  public purposeList: any[] = [];
  public motoList: any[] = [];
  public today: Date = new Date;
  public isSpecialPlan: boolean = false;

  constructor(
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      purpose: ['', Validators.required],
      pickupDate: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.combinedPlans = [
      ...this.content.plans.map((plan: any) => ({ ...plan, isSpecial: false })),
      { ...this.content.specialPlan, isSpecial: true }
    ];

    this.paymentMethodList = this.formData?.paymentMethodList || [];
    this.purposeList = this.formData?.purposeList || [];
    this.motoList = this.formData?.motosAvailable || [];

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

  openForm(plan: string, isSpecialPlan: boolean = false) {
    this.dialogVisible = true;
    this.selectedPlan = plan;
    this.isSpecialPlan = isSpecialPlan;

    if(isSpecialPlan) {
      this.form.addControl('moto', this.fb.control('', Validators.required));
    } else if (this.form.contains('moto')) {
      this.form.removeControl('moto');
    }

    this.form.reset();
    this.form.updateValueAndValidity();
  }

  cancelForm() {
    this.dialogVisible = false;
    this.selectedPlan = '';
    this.isSpecialPlan = false;
    this.form.reset();
  }

  submitForm() {
    const { value } = this.form;

    const formattedDate = value.pickupDate
      ? new Date(value.pickupDate).toLocaleDateString('pt-BR')
      : '';

    const message = `*Nova Reserva - ${this.selectedPlan}*

*Dados Pessoais:*
Nome: ${value.name}
WhatsApp: ${value.phone}
Email: ${value.email}
Endereço: ${value.address}
Cidade: ${value.city}

*Detalhes da Reserva:*
Data de Retirada: ${formattedDate}
Forma de Pagamento do Caução: ${value.paymentMethod.method}
Finalidade da Locação: ${value.purpose.purpose}
${value.moto ? `Moto: ${value.moto.text}` : ''}

*Plano Escolhido:* ${this.selectedPlan}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = this.formData?.phone;
    const whatsappUrl = `https://wa.me/55${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  }
}
