import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FirestoreService } from '../../../../core/firestore.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, TextareaModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  @Input() content: any;

  navbarForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
  ) {
    this.navbarForm = this.fb.group({
      logoImg: [''],
      buttonApp: [''],
      links: <FormArray>this.fb.array([]),
    });
  }

  ngOnInit() {
    if (this.content?.navbar) {
      this.navbarForm.patchValue({
        logoImg: this.content.navbar.logoImg,
        buttonApp: this.content.navbar.buttonApp,
      });

      // Preencher os links se existirem
      if (this.content.navbar.links) {
        const linksArray = this.navbarForm.get('links');
        if (linksArray) {
          (linksArray as any).clear();
          this.content.navbar.links.forEach((link: any) => {
            (linksArray as any).push(this.fb.group({
              href: [link.href],
              text: [link.text]
            }));
          });
        }
      }
    }
  }

  onFileChange(event: Event, field: 'logoImg') {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.navbarForm.get(field)?.setValue(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  saveSection() {
    const { value } = this.navbarForm;
    this.firestoreService.updateDocument('navbar', value);
  }

  get links(): FormArray {
    return this.navbarForm.get('links') as FormArray;
  }
}
