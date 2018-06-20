import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { JsonDataService } from '../json-data.service'
import { SearchService } from '../search.service'
import { ModalService } from '../modal.service'
import { Node, Link } from '../d3';


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
  questions : any[];
  queries: any[];
  index: number=0;

  private alive: boolean = true;
  constructor(private jsonDataService: JsonDataService,  private searchService: SearchService,
    private modalService: ModalService, private ref: ChangeDetectorRef) {
    // console.log(this.jsonDataService.getNodes())
    // this.nodes = this.jsonDataService.getNodes();
    // this.links = this.jsonDataService.getLinks();
    this.questions = searchService.getQuestions();
    jsonDataService.nodes$.subscribe(change => {
      this.nodes = change
    })
    jsonDataService.links$.subscribe(change => {
      this.links = change
    })
    jsonDataService.switchTypes$.subscribe(change => {
      this.queries = [];
      this.populateQuestions();
    })
    searchService.question$.subscribe(change => {
      this.queries = change;
      this.ref.markForCheck();

    })
  }
  populateQuestions(){
    console.log(this.nodes)
    this.searchService.createQuestionOnType(this.nodes[this.index], this.queries)
    // for(var node of this.nodes){
    //   this.searchService.createQuestionOnType(node)
    // }
  }
  ngOnInit() {
    // this.nodes = this.jsonDataService.nodes;
    // this.links = this.jsonDataService.links;
    this.getNodes();
    this.getLinks();

    console.log(this.nodes)
  }
  ngOnDestroy(){

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
