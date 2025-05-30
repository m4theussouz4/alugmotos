import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FirestoreService } from '../../../../core/firestore.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-plans',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, ToggleSwitchModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss'
})
export class PlansComponent implements OnInit {
  @Input() content: any;

  form: FormGroup;

   constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      plans: <FormArray>this.fb.array([]),
      specialPlan: this.fb.group({
        button: ['', Validators.required],
        buttonActive: [true],
        description: ['', Validators.required],
        planImg: ['', Validators.required],
        planName: ['', Validators.required],
        tag: ['', Validators.required],
        infos: this.fb.array([]),
      }),
    });
  }
 
  ngOnInit() {
    if (this.content?.plans) {
      this.form.patchValue({
        title: this.content.plans.title,
      });

      const plansArray = <FormArray>this.form.get('plans');
      this.content.plans.plans.forEach((plan: any) => {
        plansArray.push(this.fb.group({
          planImg: [plan.planImg, Validators.required],
          planName: [plan.planName, Validators.required],
          description: [plan.description, Validators.required],
          guarantee: [plan.guarantee, Validators.required],
          button: [plan.button, Validators.required],
          buttonActive: [plan.buttonActive],
          order: [plan.order, Validators.required],
          values: this.fb.array(plan.values.map((value: any) => this.fb.group({
            amount: [value.amount, Validators.required],
            time: [value.time, Validators.required]
          }))),
        }));
      });

      const specialPlan = this.form.get('specialPlan') as FormGroup;
      specialPlan.patchValue({
        button: this.content.plans.specialPlan.button,
        buttonActive: this.content.plans.specialPlan.buttonActive,
        description: this.content.plans.specialPlan.description,
        planImg: this.content.plans.specialPlan.planImg,
        planName: this.content.plans.specialPlan.planName,
        tag: this.content.plans.specialPlan.tag,
      });

      const infosArray = <FormArray>specialPlan.get('infos');
      this.content.plans.specialPlan.infos.forEach((info: any) => {
        infosArray.push(this.fb.group({
          title: [info.title, Validators.required],
          value: [info.value, Validators.required]
        }));
      });
    }
  }

  addNewPlan() {
    const plansArray = this.form.get('plans') as FormArray;
    plansArray.push(this.fb.group({
      planImg: ['', Validators.required],
      planName: ['', Validators.required],
      description: ['', Validators.required],
      guarantee: ['', Validators.required],
      button: ['', Validators.required],
      buttonActive: [true],
      order: [plansArray.length + 1, Validators.required], // Define a ordem automaticamente
      values: this.fb.array([this.fb.group({
        amount: ['', Validators.required],
        time: ['', Validators.required]
      })]),
    }));
  }

  deletePlan(index: number) {
    const plansArray = this.form.get('plans') as FormArray;
    plansArray.removeAt(index);
  }

  addNewPlanValue(index: number) {
    const valuesArray = this.valuesArray(index);
    valuesArray.push(this.fb.group({
      amount: ['', Validators.required],
      time: ['', Validators.required]
    }));
  }

  deleteLastPlanValue(index: number) {
    const valuesArray = this.valuesArray(index);
    if (valuesArray.length > 1) {
      valuesArray.removeAt(valuesArray.length - 1);
    }
  }

  addNewSpecialPlanInfo() {
    const infosArray = this.specialPlanInfos;
    infosArray.push(this.fb.group({
      title: ['', Validators.required],
      value: ['', Validators.required]
    }));
  }

  deleteLastSpecialPlanInfo() {
    const infosArray = this.specialPlanInfos;
    if (infosArray.length > 1) {
      infosArray.removeAt(infosArray.length - 1);
    }
  }

  saveSection() {
    const { value, valid } = this.form;

    // Verifica se tem 2 planos com ordens iguais e alerta o usuário
    const orders = value.plans.map((plan: any) => plan.order);
    const hasDuplicateOrders = orders.some((order: any, index: number) => orders.indexOf(order) !== index);
    if (hasDuplicateOrders) {
      alert('Existem planos com ordens iguais. Por favor, corrija isso antes de salvar.');
      return;
    }

    // Coloca o array de motocicletas em ordem
    value.plans.sort((a: any, b: any) => a.order - b.order);

    if (!valid) {
      alert('Preencha todos os campos');
      return;
    }

    this.firestoreService.setDocument('plans', value);
  }

  get plans(): FormArray {
    return this.form.get('plans') as FormArray;
  }

  get specialPlanInfos(): FormArray {
    return (this.form.get('specialPlan') as FormGroup).get('infos') as FormArray;
  }

  valuesArray(index: number): FormArray {
    return (this.form.get('plans') as FormArray).at(index).get('values') as FormArray;
  }
}
