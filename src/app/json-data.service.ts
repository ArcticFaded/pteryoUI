import { Injectable,
  ChangeDetectorRef,
  ChangeDetectionStrategy } from '@angular/core';
import { Node, Link } from './d3';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';


const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',

    })
};

@Injectable({
  providedIn: 'root'
})
export class JsonDataService {

  private nodesSource = new Subject<any>();
  private linksSource = new Subject<any>();
  private dataSource = new Subject<any>();
  private searchTerm = new Subject<any>();
  private answer = new Subject<any>();

  nodes$ = this.nodesSource.asObservable();
  links$ = this.linksSource.asObservable();
  datum$ = this.dataSource.asObservable();
  search$ = this.searchTerm.asObservable();
  answer$ = this.answer.asObservable();


  public nodes: Node[] = [];
  public links: Link[] = [];
  data: API.RootObject;
  questions: QUESTIONS.Widget[];
  term = "";

  constructor(private http: HttpClient ){
    // this.http.get('http://localhost:3000/semantic').subscribe((data: API.RootObject) => {
    //   this.createGraph(data[0]);
    //
    // })
    this.http.get('http://localhost:3333/all').subscribe((data: QUESTIONS.Widget[]) => {
      this.createQuestions(data);
    })
  }
  createQuestions(data: QUESTIONS.Widget[]){
    console.log(data)
    for(var nodes of data){
      // console.log(nodes)
      this.nodes.push(new Node(2, nodes.data))
    }
    this.sortNodes();
    this.nodesSource.next(this.nodes)
  }

  sortNodes(){
    this.nodes.sort(function(a,b){
      if(!a.label)
      {
        return 0;
      }
      if(!b.label){
        return 0;
      }
      return a.label.localeCompare(b.label); });
  }
  // createGraph(data: API.RootObject){
  //   var gloCount = 0;
  //   var i = 0;
  //   var nodeToLink = []
  //   console.log(data.nodes)
  //   for (var nodes in data.nodes){
  //       var entity = data.nodes[nodes]
  //       nodeToLink.push(new Node(2, entity));
  //       this.nodes.push(nodeToLink[i]);
  //       gloCount++;
  //       for (var child in entity.children){
  //         var j = gloCount;
  //         var subentity = entity.children[child]
  //         nodeToLink.push(new Node(1 , subentity));
  //         this.nodes.push(nodeToLink[j])
  //         this.nodes[i].linkCount++;
  //         this.links.push(new Link(nodeToLink[i], nodeToLink[j]))
  //         this.nodes[i].addChild(nodeToLink[j])
  //         gloCount++;
  //         for(var subchild in subentity.children){
  //           var subbedEntity = subentity.children[subchild]
  //           nodeToLink.push(new Node(0 , subbedEntity))
  //           this.nodes.push(nodeToLink[gloCount])
  //           this.nodes[j].linkCount++;
  //           this.nodes[j].addChild(nodeToLink[gloCount])
  //           this.links.push(new Link(nodeToLink[j], nodeToLink[gloCount]))
  //           gloCount++;
  //         }
  //       }
  //       i = gloCount;
  //   }
  //   this.nodesSource.next(this.nodes);
  //   this.linksSource.next(this.links);
  //   this.dataSource.next(data);
  // }
  form(val: {key:string, value:string}){
    console.log(Object.keys(val))
    if(Object.keys(val).length === 1){
      var id = Object.keys(val)[0];
      this.http.post('http://localhost:3333/create/answer', {
        id: id,
        type: val[id],
        answered: true
      }).subscribe((data) => {
        console.log(data)
        this.answer.next(val);
      }, (error) => {
        console.log(error)
      })
    }
    else{
      var id = Object.keys(val)[0].split(" ")[0]
      var values = Object.keys(val).map(value => {
        return {key: value.split(" ")[1], value: val[value]}
      })
      console.log(id, values)
      this.http.put('http://localhost:3333/update/answer', {
        id: id,
        value: values
      }, httpOptions).subscribe((data) => {
        console.log(data)
        this.answer.next(val);

      }, (error) => {
        console.log(error)
      })
    }
  }
  search(term){
    this.searchTerm.next(term);
  }
  getTerm(): Observable<string>{
    return of(this.term);
  }
  getNodes(): Observable<Node[]>{
    return of(this.nodes);
  }
  getLinks(): Observable<Link[]>{
    return of(this.links);
  }
  update(node){
    var copy = [];
    for(var link in this.links){
      if(node === this.links[link].source){
        continue;
      }
      copy.push(this.links[link])
    }
    this.linksSource.next(copy)
  }

}

export namespace QUESTIONS {
  export interface Answer {
    id: string;
    answered: boolean;
    type: string;
    widgetKey: string;
    stateHash: number;
    value: any;
  }
  export interface AnswerAPI{
    _id: string;
    answered: boolean;
    type: string;
    widgetKey: string;
    stateHash: number;
    value: any;
  }
  export interface Data{
    _id: string;
    abstractStateHash: number;
    abstractWidgetKey: string;
    cnnScreenshot: string;
    dynamic: boolean;
    graphId: string;
    identifier: string;
    labelWidgetKey: string;
    labels: string;
    norm: string;
    requiredField: boolean;
    type: string;
  }
  export interface Widget{
    _id: string;
    data: Data;
  }
}
export namespace API{


    export interface SuggestedFormat {
        type: string;
        debugData: string;
        merged: boolean;
        properties?: any;
        coverageConfidence: number;
        left: string;
        right: string;
        op: string;
        precision?: any;
        confidence: number;
    }

    export interface SuggestedConstraint {
        type: string;
        debugData: string;
        merged: boolean;
        properties?: any;
        coverageConfidence: number;
        left: any;
        right: any;
        op: string;
        precision?: any;
        confidence?: number;
    }

    export interface Traits {
        xPercent?: number;
        yPercent?: number;
        color?: string;
        'font-weight'?: string;
        tagName?: string;
        type?: string;
        'background-color' ?: string;
        'is-hidden' ?: boolean;
        'is-focused' ?: boolean;
        x?: number;
        width?: number;
        y?: number;
        fontSize?: number;
        'font-family'?: string;
        href?: string;
        text?: string;
        value?: string;
        class?: string;
        height?: number;
        values?: string[];
        'ng-model'?: string;
        name?: string;
        valuesText?: string[];
        'ng-min'?: string;
        integer?: string;
        id?: string;
        placeholder?: string;
        required?: string;
        'ui-sref'?: string;
        rows?: string;
        'ng-max'?: string;
    }

    export interface Points {
        systemId: string;
        type: string;
        suggestedTypes: any[];
        flags: any[];
        suggestedFormat?: any;
        suggestedConstraint?: any;
        lemmaLabel: string;
        confidenceInType: number;
        stateHash: number;
        description?: any;
        suggestedDefault?: any;
        fieldRequired?: any;
        traits?: Traits;
        children: Points[];
        label: string;
        operationId?: any;
        id: string;
    }

    export interface RootObject {
        id: string;
        nodes: Points[];
    }

}
