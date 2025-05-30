import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { FirestoreService } from '../../../../core/firestore.service';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-hero-header',
  imports: [CommonModule, ButtonModule, TextareaModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './hero-header.component.html',
  styleUrl: './hero-header.component.scss'
})
export class HeroHeaderComponent implements OnInit {
  @Input() content: any;
  
  heroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
  ) {
    this.heroForm = this.fb.group({
      backgroundImg: [''],
      logoImg: [''],
      title: [''],
      subtitle: [''],
      button: ['']
    });
  }

  ngOnInit() {
    if (this.content?.heroSection) {
      this.heroForm.patchValue({
        backgroundImg: this.content.heroSection.backgroundImg,
        logoImg: this.content.heroSection.logoImg,
        title: this.content.heroSection.title,
        subtitle: this.content.heroSection.subtitle,
        button: this.content.heroSection.button
      });
    }
  }

  onFileChange(event: Event, field: 'backgroundImg' | 'logoImg') {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.heroForm.get(field)?.setValue(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  saveSection() {
    const { value } = this.heroForm;
    this.firestoreService.updateDocument('heroSection', value);
  }
  
}
