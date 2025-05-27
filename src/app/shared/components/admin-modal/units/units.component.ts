import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FirestoreService } from '../../../../core/firestore.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-units',
  imports: [CommonModule, TextareaModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './units.component.html',
  styleUrl: './units.component.scss'
})
export class UnitsComponent implements OnInit {
  @Input() content: any;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      units: <FormArray>this.fb.array([]),
    });
  }

  ngOnInit() {
    if (this.content?.units) {
      this.form.patchValue({
        title: this.content.units.title,
      });

      // Preencher os units se existirem
      if (this.content.units.units) {
        const unitsArray = this.form.get('units');
        if (unitsArray) {
          (unitsArray as any).clear();
          this.content.units.units.forEach((unit: any) => {
            (unitsArray as any).push(this.fb.group({
              address: [unit.address, Validators.required],
              openingHours: this.fb.array(unit.openingHours.map((hour: any) => this.fb.group({
                time: [hour.time, Validators.required],
              }))),
              phone: [unit.phone, Validators.required],
              title: [unit.title, Validators.required],
            }));
          });
        }
      }
    }
  }

  addNewUnit() {
    this.units.push(this.fb.group({
      title: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', Validators.required],
      openingHours: this.fb.array([this.fb.group({ time: ['', Validators.required] })]),
    }));
  }

  deleteUnit(index: number) {
    const unitsArray = this.form.get('units') as FormArray;
    unitsArray.removeAt(index);
  }

  addNewOpeningHour(index: number) {
    const openingHoursArray = this.getOpeningHours(index);
    openingHoursArray.push(this.fb.group({
      time: ['', Validators.required],
    }));
  }

  deleteLastOpeningHour(index: number) {
    const openingHoursArray = this.getOpeningHours(index);
    if (openingHoursArray.length > 1) {
      openingHoursArray.removeAt(openingHoursArray.length - 1);
    }
  }

  saveSection() {
    const { value, valid } = this.form;

    if (!valid) {
      alert('Preencha todos os campos');
      return;
    }

    this.firestoreService.updateDocument('units', value);
  }

  getOpeningHours(index: number): FormArray {
    return (this.form.get('units') as FormArray).at(index).get('openingHours') as FormArray;
  }

  get units(): FormArray {
    return this.form.get('units') as FormArray;
  }
}
