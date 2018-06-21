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

  <mat-card *ngSwitchCase="'display'" style="width:fit-content">
    <mat-card-content>
      <h3>{{question.value}}</h3>
    </mat-card-content>
    <mat-card-actions>
    <input matInput style="display:none; z-index:0" [formControlName]="question.key">
      <!-- <div class="mat-button" (click)="something()">Re-Edit</div> -->
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
    if(Object.keys(this.form.controls).length === 1 && this.question.value != ""){
      this.jsonDataService.form({ [this.question.key] : this.question.value});
    }
    this.form.controls[this.question.key].valueChanges.subscribe((value) => {
      if(this.question.key === 'search'){
        this.jsonDataService.search(value);
      }
      if(this.question.controlType === 'dropdown'){
        console.log(this.question)
        // this.jsonDataService.updateSubQuestions(this.form.value, this.question.key)
        this.jsonDataService.form({ [this.question.key] : value});
      }
      this.question.value = value;

    })
  }
  something(){
    console.log("not a submit")
  }
  get isValid() {
    return this.form.controls[this.question.key].valid;
  }
}
