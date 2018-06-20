import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { Node } from './d3';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DropdownQuestion, QuestionBase, TextboxQuestion, InformationQuestion } from './form-support';


@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private questionSource = new Subject<any>();
  question$ = this.questionSource.asObservable();
  // private question: QuestionBase<any>;
  private KEYWORDS = ["SELECT", "INPUT", "BUTTON", "TEXTAREA"]
  private VALIDKEYWORDS = ["INPUT", "TEXTAREA"] //TEMP


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

    this.http.get('http://localhost:3333/find/question/' + node.id).subscribe(
      (data) => {
        console.log(data)
        var options = Object.keys(QuestionScripts.typeToString).map(val => {
          return {key: val, value: val}
        })
        var label = `What is the data type of: "${node.label}"?`
        quest.push(this.createDropdownQuestion(node.id, label, options, 1, data.Type))
        if(data.Answered){
          if(data.Value){
            quest.push(new InformationQuestion({
              key: node.id,
              value: `All questions have been answered for ${node.label}`
            }) );
            this.questionSource.next(quest);
            return
          }
          switch(QuestionScripts.typeToString[data.Type]){
            case 'string': {
              var questionString = QuestionScripts.createString(node.label)
              var i = 0
              for(var q in questionString){
                // console.log(question)
                quest.push(this.createTextboxQuestion(node.id + ' ' + q, questionString[q],"",true,i))
                i = i + 1;
              }
              this.questionSource.next(quest);
              break;
            }
            case 'integer': {
              var questionInteger = QuestionScripts.createInteger(node.label)
              var i = 0
              for(var q in questionInteger){
                // console.log(question)
                quest.push(this.createTextboxQuestion(node.id + ' ' + q, questionInteger[q],"",true,i))
                i = i + 1;
              }
              this.questionSource.next(quest);
              break;
            }
            case 'number': {
              var questionNumber = QuestionScripts.createNumber(node.label)
              var i = 0
              for(var q in questionNumber){
                // console.log(question)
                quest.push(this.createTextboxQuestion(node.id + ' ' + q, questionNumber[q],"",true,i))
                i = i + 1;
              }
              this.questionSource.next(quest);
              break;
            }
          }
        }

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
    console.log(node)
    this.http.get('http://localhost:3333/find/label/' + node.label).subscribe((data) => {
        console.log(data)
        if(data.Widget.offers.length > 0){
          console.log(data.Widget.offers[0])

          quest.push(this.createDropdownQuestion(node.id, label, options, 1, data.Widget.offers[0]))
          this.questionSource.next(quest);
        }
        else{
          //ask what type of question it is
          quest.push(this.createDropdownQuestion(node.id, label, options, 1))

          this.questionSource.next(quest);
        }
    }, (error) => {
      this.http.get('http://localhost:3333/find/widget/' + node.something.abstractWidgetKey).subscribe((data) => {
        if(data.Widget.offers.length > 0){
          console.log(data.Widget.offers[0])
          quest.push(this.createDropdownQuestion(node.id, label, options, 1, data.Widget.offers[0]))

          this.questionSource.next(quest);
        }
        else{
          //ask what type of question it is
          quest.push(this.createDropdownQuestion(node.id, label, options, 1))

          this.questionSource.next(quest);
        }
      }, (error) => {
        console.log(error)
        //ask what type of widget it is
        console.log(options)
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
      required: true,
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
      new TextboxQuestion({
        key: 'search2',
        label: 'Search by Partial String Match',
        value: '',
        required: false,
        order: 2
      }),

    ];

    return questions.sort((a, b) => a.order - b.order);
  }
}

export namespace QuestionScripts {
  const maxLenght = `What should the max length of`;
  const minLength = `What should the min length of`;
  const maxValue = `What should the max value of`;
  const minValue = `What should the min value of`; // {0} be?
  const precision = `How many significant figures does`; // {0} have?
  export const typeToString = {
    "timestamp": "integer",
    "day": "date",
    "date": "date",
    "money": "number",
    "real": "number",
    "url":"string",
    "year":"date",
    "zipcode":"string",
    "string":"string",
    "email":"string",
    "integer":"integer"
  }

  export function createString(variable: string): (String){
    var question = <String>{};
    question.maxLenght = maxLenght + ` "${variable}" be`;
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
    maxLenght: string;
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
}
