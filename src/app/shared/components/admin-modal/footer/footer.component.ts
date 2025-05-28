import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FirestoreService } from '../../../../core/firestore.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, TextareaModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {
  @Input() content: any;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
  ) {
    this.form = this.fb.group({
      logoImg: ['', Validators.required],
      description: ['', Validators.required],
      navegation: this.fb.group({
        title: ['', Validators.required],
        links: <FormArray>this.fb.array([]),
      }),
      contact: this.fb.group({
        title: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', Validators.required],
        openingHours: <FormArray>this.fb.array([]),
      }),
    });
  }

  ngOnInit() {
    if (this.content?.footer) {
      this.form.patchValue({
        logoImg: this.content.footer.logoImg,
        description: this.content.footer.description,
      });

      const navegation = this.form.get('navegation') as FormGroup;
      navegation.patchValue({
        title: this.content.footer.navegation.title,
      });

      const linksArray = navegation.get('links') as FormArray;
      this.content.footer.navegation.links.forEach((link: any) => {
        linksArray.push(this.fb.group({
          href: [link.href, Validators.required],
          text: [link.text, Validators.required]
        }));
      });

      const contact = this.form.get('contact') as FormGroup;
      contact.patchValue({
        title: this.content.footer.contact.title,
        phone: this.content.footer.contact.phone,
        email: this.content.footer.contact.email,
      });

      const openingHoursArray = contact.get('openingHours') as FormArray;
      this.content.footer.contact.openingHours.forEach((hour: any) => {
        openingHoursArray.push(this.fb.group({
          time: [hour.time, Validators.required]
        }));
      });
    }
  }

  onFileChange(event: Event, field: 'logoImg') {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.form.get(field)?.setValue(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  addNewOpeningHour() {
    const openingHoursArray = this.form.get('contact.openingHours') as FormArray;
    openingHoursArray.push(this.fb.group({
      time: ['', Validators.required]
    }));
  }

  deleteLastOpeningHour() {
    const openingHoursArray = this.form.get('contact.openingHours') as FormArray;
    if (openingHoursArray.length > 0) {
      openingHoursArray.removeAt(openingHoursArray.length - 1);
    }
  }

  saveSection() {
    const { value, valid } = this.form;

    if (!valid) {
      alert('Preencha todos os campos');
      return;
    }

    this.firestoreService.updateDocument('footer', value);
  }

  get links(): FormArray {
    return this.form.get('navegation.links') as FormArray;
  }

  get openingHours(): FormArray {
    return this.form.get('contact.openingHours') as FormArray;
  }
}
