import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup }        from '@angular/forms';

import { QuestionBase }     from './question-base';
import { JsonDataService } from '../json-data.service';

@Component({
  selector: 'app-question',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <mat-form-field class="container" [formGroup]="form">
<label [attr.for]="question.key">{{question.label}}</label>
<div style="color: red" *ngIf="!isValid">*{{question.id}} is required</div>
<div [ngSwitch]="question.controlType">

  <input matInput *ngSwitchCase="'textbox'" [formControlName]="question.key"
          [id]="question.key" [type]="question.type">

  <mat-select [id]="question.key" *ngSwitchCase="'dropdown'" [formControlName]="question.key">
    <mat-option *ngFor="let opt of question.options" [value]="opt.key">{{opt.value}}</mat-option>
  </mat-select>

  <mat-card *ngSwitchCase="'display'">
    <mat-card-content>
      <h2>{{question.value}}</h2>
    </mat-card-content>
    <mat-card-actions>
    <input matInput style="display:none;" [formControlName]="question.key">
      <div class="mat-button" (click)="something()">Re-Edit</div>
    </mat-card-actions>
  </mat-card>

</div>


</mat-form-field>
  `
})
export class DynamicFormQuestionComponent {
  @Input() question: QuestionBase<any>;
  @Input() form: FormGroup;

  constructor(private ref: ChangeDetectorRef, private jsonDataService: JsonDataService) {}

  ngOnInit(){
    console.log(this.question, this.form.controls, this.question.key)
    this.form.controls[this.question.key].valueChanges.subscribe((value) => {
      console.log(value, this.question.key, this.question)
      if(this.question.key === 'search'){
        this.jsonDataService.search(value);
      }
      if(this.question.controlType === 'dropdown'){
        this.jsonDataService.updateSubQuestions(value, this.question.key)
      }
      this.question.value = value;

    })
  }
  something(){
    console.log("not a submit")
  }
  get isValid() { return this.form.controls[this.question.key].valid; }
}
