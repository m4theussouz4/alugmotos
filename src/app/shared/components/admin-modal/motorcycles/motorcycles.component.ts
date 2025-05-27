import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FirestoreService } from '../../../../core/firestore.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-motorcycles',
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './motorcycles.component.html',
  styleUrl: './motorcycles.component.scss'
})
export class MotorcyclesComponent implements OnInit {
  @Input() content: any;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      motorcycles: <FormArray>this.fb.array([]),
    });
  }

  ngOnInit() {
    if (this.content?.motorcycles) {
      this.form.patchValue({
        title: this.content.motorcycles.title,
      });

      // Preencher os cards se existirem
      if (this.content.motorcycles.motorcycles) {
        const motorcyclesArray = this.form.get('motorcycles');
        if (motorcyclesArray) {
          (motorcyclesArray as any).clear();
          this.content.motorcycles.motorcycles.forEach((card: any) => {
            (motorcyclesArray as any).push(this.fb.group({
              motoImg: [card.motoImg, Validators.required],
              name: [card.name, Validators.required],
              // array de specifications
              specifications: this.fb.array(card.specifications.map((spec: any) => this.fb.group({
                title: [spec.title, Validators.required],
                text: [spec.text, Validators.required]
              })))
            }));
          });
        }
      }
    }
  }

  onFileChange(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const motorcyclesArray = this.form.get('motorcycles') as FormArray;
        const targetMotorcycle = motorcyclesArray.at(index);
        targetMotorcycle.get('motoImg')?.setValue(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  addNewMoto() {
    const motorcyclesArray = this.form.get('motorcycles') as FormArray;
    motorcyclesArray.push(this.fb.group({
      motoImg: ['', Validators.required],
      name: ['', Validators.required],
      specifications: this.fb.array([]) // Inicia com um array vazio
    }));

    // Adiciona 8 objetos de especificações vazios
    const specificationsArray = this.specifications(motorcyclesArray.length - 1);
    for (let i = 0; i < 8; i++) {
      specificationsArray.push(this.fb.group({
        title: ['', Validators.required],
        text: ['', Validators.required]
      }));
    }
  }

  deleteMoto(index: number) {
    const motorcyclesArray = this.form.get('motorcycles') as FormArray;
    motorcyclesArray.removeAt(index);
  }

  saveSection() {
    const { value, valid } = this.form;

    if (!valid) {
      alert('Preencha todos os campos');
      return;
    }

    this.firestoreService.setDocument('motorcycles', value);
  }

  specifications(index: number): FormArray {
    return this.motorcycles.at(index).get('specifications') as FormArray;
  }

  get motorcycles(): FormArray {
    return this.form.get('motorcycles') as FormArray;
  }
}
