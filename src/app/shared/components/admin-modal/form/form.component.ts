import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FirestoreService } from '../../../../core/firestore.service';

@Component({
  selector: 'app-form',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit {
  @Input() content: any;

  form: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
  ) {
    this.form = this.fb.group({
      phone: ['', Validators.required],
      paymentMethodList: this.fb.array([]),
      purposeList: this.fb.array([]),
      motosAvailable: this.fb.array([]),
    });
  }

  ngOnInit() {
    if (this.content?.form) {
      this.form.patchValue({
        phone: this.content.form.phone,
      });

      const paymentMethods = this.form.get('paymentMethodList') as FormArray;
      this.content.form.paymentMethodList.forEach((methodObj: any) => {
        paymentMethods.push(this.fb.group({
          method: [methodObj.method, Validators.required]
        }));
      });

      const purposes = this.form.get('purposeList') as FormArray;
      this.content.form.purposeList.forEach((purpose: any) => {
        purposes.push(this.fb.group({
          purpose: [purpose.purpose, Validators.required]
        }));
      });

      const motosAvailable = this.form.get('motosAvailable') as FormArray;
      this.content.form.motosAvailable.forEach((moto: any) => {
        motosAvailable.push(this.fb.group({
          text: [moto.text, Validators.required]
        }));
      });
    }
  }

  addNewPaymentMethod() {
    const paymentMethodArray = this.form.get('paymentMethodList') as FormArray;
    paymentMethodArray.push(this.fb.group({
      method: ['', Validators.required]
    }));
  }

  addNewPurpose() {
    const purposeArray = this.form.get('purposeList') as FormArray;
    purposeArray.push(this.fb.group({
      purpose: ['', Validators.required]
    }));
  }

  addNewMoto() {
    const motosAvailableArray = this.form.get('motosAvailable') as FormArray;
    motosAvailableArray.push(this.fb.group({
      text: ['', Validators.required]
    }));
  }

  deleteLastPaymentMethod() {
    const paymentMethodArray = this.form.get('paymentMethodList') as FormArray;
    if (paymentMethodArray.length > 0) {
      this.paymentMethodList.removeAt(this.paymentMethodList.length - 1);
    }
  }

  deleteLastPurpose() {
    const purposeArray = this.form.get('purposeList') as FormArray;
    if (purposeArray.length > 0) {
      this.purposeList.removeAt(this.purposeList.length - 1);
    }
  }

  deleteLastMoto() {
    const motosAvailableArray = this.form.get('motosAvailable') as FormArray;
    if (motosAvailableArray.length > 0) {
      motosAvailableArray.removeAt(motosAvailableArray.length - 1);
    }
  }

  saveSection() {
    const { value, valid } = this.form;

    if (!valid) {
      alert('Preencha todos os campos');
      return;
    }

    this.firestoreService.updateDocument('form', value);
  }

  get paymentMethodList(): FormArray {
    return this.form.get('paymentMethodList') as FormArray;
  }

  get purposeList(): FormArray {
    return this.form.get('purposeList') as FormArray;
  }

  get motosAvailable(): FormArray {
    return this.form.get('motosAvailable') as FormArray;
  }
}
