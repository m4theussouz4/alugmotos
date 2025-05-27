import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirestoreService } from '../../../../core/firestore.service';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-how-it-works',
  imports: [CommonModule, TextareaModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss'
})
export class HowItWorksComponent implements OnInit {
  @Input() content: any;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      bannerImg: ['', Validators.required],
      cards: <FormArray>this.fb.array([]),
    });
  }

  ngOnInit() {
    if (this.content?.howItWorks) {
      this.form.patchValue({
        title: this.content.howItWorks.title,
        bannerImg: this.content.howItWorks.bannerImg,
      });

      // Preencher os cards se existirem
      if (this.content.howItWorks.cards) {
        const cardsArray = this.form.get('cards');
        if (cardsArray) {
          (cardsArray as any).clear();
          this.content.howItWorks.cards.forEach((card: any) => {
            (cardsArray as any).push(this.fb.group({
              title: [card.title, Validators.required],
              content: [card.content, Validators.required]
            }));
          });
        }
      }
    }
  }

  onFileChange(event: Event, field: 'bannerImg') {
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

  saveSection() {
    const { value, valid } = this.form;

    if (!valid) {
      console.error('Form is invalid');
      return;
    }

    this.firestoreService.updateDocument('howItWorks', value);
  }

  get cards(): FormArray {
    return this.form.get('cards') as FormArray;
  }
}
