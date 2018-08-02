import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { JsonDataService } from '../json-data.service'
import { SearchService } from '../search.service'
import { ModalService } from '../modal.service'
import { Node, Link } from '../d3';
import { Observable, Subject, of, defer } from 'rxjs';
import { flatMap, withLatestFrom, take, map, single } from 'rxjs/operators'

import { IDatasource } from 'ngx-ui-scroll';

@Component({
  selector: 'jurassic-hero',
  templateUrl: './jurassic-hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./jurassic-hero.component.css'],
  providers: [ SearchService ]
})



export class JurassicHeroComponent implements OnInit, OnDestroy {

  nodes: Node[] = [];
  links: Link[] = [];
  selected: 0;
  questions : any[];
  queries: any[];

  public datasource: IDatasource = {
    get: (index, count, callback) => {
      if(index < this.jsonDataService.startIndex) {
        count -= Math.abs(index - this.jsonDataService.startIndex)
        index = this.jsonDataService.startIndex
      }
      callback(this.nodes.slice(index, index + count))
    }
    ,
    settings: {
      startIndex: this.jsonDataService.startIndex
    }
  }



  private alive: boolean = false;
  constructor(private jsonDataService: JsonDataService,  private searchService: SearchService,
    private modalService: ModalService, private ref: ChangeDetectorRef) {
    // console.log(this.jsonDataService.getNodes())
    // this.nodes = this.jsonDataService.getNodes();
    // this.links = this.jsonDataService.getLinks();
    this.questions = searchService.getQuestions();
    searchService.loading$.subscribe(change => {
      this.alive = change
    })

    jsonDataService.nodes$.subscribe(change => {
      this.nodes = change
      this.datasource.adapter.reload();
    })
    jsonDataService.links$.subscribe(change => {
      this.links = change
    })
    jsonDataService.switchTypes$.subscribe(change => {
      // console.log(change)
      var index = this.nodes.findIndex(i => i.id === change);
      // this.queries = [];
      this.populateQuestions(index);
    })
    searchService.question$.subscribe(change => {
      this.alive = false;
      this.queries = change;
      this.ref.markForCheck();

    })
  }
  populateQuestions(index){
    this.searchService.createQuestionOnType(this.nodes[index])
    // for(var node of this.nodes){
    //   this.searchService.createQuestionOnType(node)
    // }
  }
  ngOnInit() {
    // this.nodes = this.jsonDataService.nodes;
    // this.links = this.jsonDataService.links;
    this.getNodes();
    this.getLinks();
    // console.log(this.nodes)
  }
  ngOnDestroy(){

  }
  isSelected(id){
    // console.log()
    return this.selected === id
  }
  expand(item){
    this.selected = item.id;
    this.searchService.createQuestionOnType(item);

  }
  getLinks() {
    this.jsonDataService.getLinks()
        .subscribe(d => {
          this.links = d
        });
  }
  getNodes() {
    this.jsonDataService.getNodes()
      .subscribe(d => {
        this.nodes = d
      })
  }
  closeModal(id){
    this.modalService.close(id);
  }
  cards = [
    // { title: 'Card 1', cols: 2, rows: 1 },
    { title: 'Results', cols: 1, rows: 2 },
    { title: 'Search', cols: 1, rows: 2},
    { title: 'Question', cols: 2, rows: 2}
    // { title: 'Card 3', cols: 1, rows: 2 },
    // { title: 'Card 4', cols: 1, rows: 1 }
  ];

}
