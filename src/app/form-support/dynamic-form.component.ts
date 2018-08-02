import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange }  from '@angular/core';
import { FormGroup }                 from '@angular/forms';

import { QuestionBase }              from './question-base';
import { QuestionControlService }    from './question-control.service';
import { JsonDataService } from '../json-data.service'

@Component({
  selector: 'dynamic-form',
  template: `
  <div>
  <form mat-form-field [formGroup]="form">

    <div *ngFor="let question of questions" class="form-row">
      <app-question [question]="question" [form]="form"></app-question>
    </div>


  </form>

  <!-- <div *ngIf="payLoad" class="form-row">
    <strong>Saved the following values</strong><br>{{payLoad}}
  </div> -->
</div>
`,
  providers: [ QuestionControlService ],
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnInit, OnChanges {

  @Input('questions') questions: QuestionBase<any>[] = [];
  form: FormGroup;
  payLoad = '';


  constructor(private qcs: QuestionControlService, private jsonDataService: JsonDataService) {  }

  ngOnInit() {
    this.form = this.qcs.toFormGroup(this.questions);
    if(!this.form.controls.search){
      this.onChanges()
    }
  }
  ngOnChanges(): void {
    this.form = this.qcs.toFormGroup(this.questions);
    this.onChanges()

  }
  onChanges() {
    console.log(this.form.controls)

    this.form.valueChanges.subscribe(value => {
      // console.log(value, this.form.value)
      this.jsonDataService.form(this.form.value);

    })
  }
}
