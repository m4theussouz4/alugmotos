import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FirestoreService } from '../../../../core/firestore.service';

@Component({
  selector: 'app-operating-range',
  imports: [CommonModule, TextareaModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './operating-range.component.html',
  styleUrl: './operating-range.component.scss'
})
export class OperatingRangeComponent implements OnInit {
  @Input() content: any;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      ranges: this.fb.array([]),
    });
  }

  ngOnInit() {
    if (this.content?.range) {
      this.form.patchValue({
        title: this.content.range.title,
        subtitle: this.content.range.subtitle,
      });

      const rangesArray = <FormArray>this.form.get('ranges');
      this.content.range.ranges.forEach((rg: any) => {
        rangesArray.push(this.fb.group({
          title: [rg.title, Validators.required],
          subtitle: [rg.subtitle, Validators.required],
          description: [rg.description, Validators.required],
          button: [rg.button, Validators.required],
          range: [rg.range, Validators.required]
        }));
      });
    }
  }

  saveSection() {
    const { value, valid } = this.form;

    if (!valid) {
      alert('Form is invalid');
      return;
    }

    this.firestoreService.updateDocument('range', value);
  }

  get ranges(): FormArray {
    return this.form.get('ranges') as FormArray;
  }
}
