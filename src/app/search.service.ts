import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { Node } from './d3';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DropdownQuestion, QuestionBase, TextboxQuestion, InformationQuestion } from './form-support';
import APP_CONFIG from './app.config';

const APIroot = APP_CONFIG.APIroot
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private questionSource = new Subject<any>();
  private loadingSource = new Subject<any>();
  question$ = this.questionSource.asObservable();
  loading$ = this.loadingSource.asObservable();
  // private question: QuestionBase<any>;
  private KEYWORDS = ["SELECT", "INPUT", "BUTTON", "TEXTAREA"]
  private VALIDKEYWORDS = ["INPUT", "TEXTAREA"] //TEMP

  private isEmptyObject(o) {
    return Object.keys(o).every(function(x) {
        return o[x]===''||o[x]===null;  // or just "return o[x];" for falsy values
    });
  }
  private wordInString(string, keywords) {
      return keywords.map(keyword => {return string.indexOf(keyword)}).filter(res => res > -1);
  }
  private wordToKeyword(string, keywords){
    return keywords.map(keyword => {return string.indexOf(keyword)}).findIndex(element => element > -1)
  }
  constructor(private http: HttpClient) { }
  createQuestionOnType(node: Node){
    let quest:  QuestionBase<any>[] = [];
    // this.createAskType(node, quest);
    this.loadingSource.next(true);
    this.http.get(APIroot + '/find/question/' + node.id).subscribe(
      (data: QuestionScripts.AnswerFormat) => {
        console.log(data)
        var options = Object.keys(QuestionScripts.typeToString).map(val => {
          return {key: val, value: val}
        })
        var label = `What is the data type of: "${node.label}"?`

        quest.push(this.createDropdownQuestion(node.id, label, options, 1, data.Type))
        if(data.Answered){
          // console.log(QuestionScripts.typeToString[data.Type])
          // console.log(data.Value)

          var type = QuestionScripts.typeToString[data.Type].charAt(0).toUpperCase() + QuestionScripts.typeToString[data.Type].slice(1)
          switch(data.Type){
            case 'string': {
              var questionString = QuestionScripts.createString(node.label)
              var i = 0

              for(var q in questionString){
                var index = q.charAt(0).toUpperCase() + q.slice(1)
                var defaultAns = data.Value[type][index]

                quest.push(this.createTextboxQuestion(node.id + ' ' + q, questionString[q],defaultAns || "",false,i))
                i = i + 1;
              }

              this.questionSource.next(quest);
              break;
            }
            case 'integer': {
              var questionInteger = QuestionScripts.createInteger(node.label);
              var i = 0;
              for(var q in questionInteger){

                var index = q.charAt(0).toUpperCase() + q.slice(1)
                var defaultAns = data.Value[type][index]


                quest.push(this.createTextboxQuestion(node.id + ' ' + q, questionInteger[q],defaultAns || "",false,i))
                i = i + 1;
              }
              this.questionSource.next(quest);
              break;
            }
            case 'number': {
              var questionNumber = QuestionScripts.createNumber(node.label)
              var i = 0
              for(var q in questionNumber){
                var index = q.charAt(0).toUpperCase() + q.slice(1)
                var defaultAns = data.Value[type][index]

                quest.push(this.createTextboxQuestion(node.id + ' ' + q, questionNumber[q],defaultAns || "",false,i))
                i = i + 1;
              }
              this.questionSource.next(quest);
              break;
            }
            default: {
              quest.push(new InformationQuestion({value: `There are no questions of type ${data.Type} at this time`}))
              this.questionSource.next(quest);
              break;
            }
          } // AFTER SWITCH

        } // AFTER ANSWERED

      },
      (error) => {
        console.log(error)
        this.createAskType(node, quest);
      }
    )


  }
  createAskType(node: Node, quest: QuestionBase<any>[] = []){
    var options = Object.keys(QuestionScripts.typeToString).map(val => {
      return {key: val, value: val}
    })
    var label = `What is the data type of: "${node.label}"?`
    // console.log(node)
    this.http.get(APIroot + '/find/label/' + node.label).subscribe((data: QuestionScripts.TypeFormat) => {
        console.log(data)
        if(data.Widget.offers.length > 0){
          // console.log(data.Widget.offers[0])

          quest.push(this.createDropdownQuestion(node.id, label, options, 1, data.Widget.offers[0]))
          this.questionSource.next(quest);
        }
        else{
          //ask what type of question it is
          quest.push(this.createDropdownQuestion(node.id, label, options, 1))

          this.questionSource.next(quest);
        }
    }, (error) => {
      this.http.get(APIroot + '/find/widget/' + node.something.abstractWidgetKey).subscribe((data:  QuestionScripts.TypeFormat) => {
        if(data.Widget.offers.length > 0){
          // console.log(data.Widget.offers[0])
          quest.push(this.createDropdownQuestion(node.id, label, options, 1, data.Widget.offers[0]))

          this.questionSource.next(quest);
        }
        else{
          //ask what type of question it is
          quest.push(this.createDropdownQuestion(node.id, label, options, 1))

          this.questionSource.next(quest);
        }
      }, (error) => {
        // console.log(error)
        //ask what type of widget it is
        // console.log(options)
        quest.push(this.createDropdownQuestion(node.id, label, options, 1))
        this.questionSource.next(quest);
      })
    })
  }

  createTextboxQuestion(key: string, label: string, value: string, required: boolean, order: number){
    return new TextboxQuestion({
      key: key,
      label: label,
      value: value,
      required: required,
      order: order
    });
  }
  createDropdownQuestion(key: string, label: string, options: {key: any, value: any}[], order: number, value:string=""){
    return new DropdownQuestion({
      key: key,
      label: label,
      value: value,
      options: options,
      required: false,
      order: order
    });
  }


  // TODO: get from a remote source of question metadata
  // TODO: make asynchronous
  getQuestions() {

    let questions: QuestionBase<any>[] = [

      new TextboxQuestion({
        key: 'search',
        label: 'Search by Prefix',
        value: '',
        required: false,
        order: 1
      }),
      // new TextboxQuestion({
      //   key: 'search2',
      //   label: 'Search by Partial String Match',
      //   value: '',
      //   required: false,
      //   order: 2
      // }),

    ];

    return questions.sort((a, b) => a.order - b.order);
  }
}

export namespace QuestionScripts {
  const maxLength = `What should the max length of`;
  const minLength = `What should the min length of`;
  const maxValue = `What should the max value of`;
  const minValue = `What should the min value of`; // {0} be?
  const precision = `How many significant figures does`; // {0} have?
  export const typeToString = {
    "timestamp": "integer",
    "day": "string",
    "date": "string",
    "money": "number",
    "real": "number",
    "url":"string",
    "year":"date",
    "zipcode":"string",
    "email":"string",
    "string":"string",
    "integer":"integer",
    "number":"number"
  }

  export function createString(variable: string): (String){
    var question = <String>{};
    question.maxLength = maxLength + ` "${variable}" be`;
    question.minLength = minLength + ` "${variable}" be`;

    return question;
  }
  export function createInteger(variable: string): (Integer){
    var question = <Integer>{};
    question.maxValue = maxValue + ` "${variable}" be?`;
    question.minValue = minValue + ` "${variable}" be?`;

    return question;
  }
  export function createNumber(variable: string): (Numeric){
    var question = <Numeric>{};
    question.precision = precision + ` "${variable}" have?`;
    question.maxValue = maxValue + ` "${variable}" be?`;
    question.minValue = minValue + ` "${variable}" be?`;

    return question;
  }
  export interface String {
    maxLength: string;
    minLength: string;
  }
  export interface Numeric{
    precision: string;
    maxValue: string;
    minValue: string;
  }
  // export interface Money{ DEFAULT MONEY TO NUMERIC FOR NOW
  //   precision: number;
  //   maxValue: number;
  //   minValue: number;
  // }
  export interface Integer{
    maxValue: string;
    minValue: string;
  }

  export interface TypeFormat {
    Id: string;
    Widget: any;
  }
  export interface AnswerFormat {
    id: string;
    Answered: boolean;
    Type: string;
    Value: any;
  }
}
