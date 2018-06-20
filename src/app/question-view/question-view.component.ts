import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { JsonDataService } from '../json-data.service'
import { SearchService } from '../search.service'
import { ModalService } from '../modal.service'
import { Node, Link } from '../d3';

@Component({
  selector: 'app-question-view',
  templateUrl: './question-view.component.html',
  styleUrls: ['./question-view.component.css']
})
export class QuestionViewComponent implements OnInit {

  nodes: Node[] = [];
  links: Link[] = [];
  questions : any[];
  queries: any[];
  answers: any[];
  index: number=0;
  size: number=0;
  isLoading: boolean=false;

  private alive: boolean = true;
  constructor(private jsonDataService: JsonDataService,  private searchService: SearchService,
    private modalService: ModalService, private ref: ChangeDetectorRef) {
    // console.log(this.jsonDataService.getNodes())
    // this.nodes = this.jsonDataService.getNodes();
    // this.links = this.jsonDataService.getLinks();
    console.log("constructing")
    this.isLoading = true;
    this.questions = searchService.getQuestions();
    jsonDataService.nodes$.subscribe(change => {
      this.nodes = change
      this.size = this.nodes.length
      this.populateQuestions();
    })
    jsonDataService.answer$.subscribe(change => {
      console.log(change)
      this.populateQuestions();
    })
    searchService.question$.subscribe(change => {
      console.log(change)
      this.queries = change;
      this.ref.markForCheck();
      this.isLoading=false;
    })
  }

  ngOnInit() {
    console.log("changing")
    this.getNodes();
  }
  getNodes() {
    this.jsonDataService.getNodes()
      .subscribe(d => {
        this.nodes = d
        this.size = this.nodes.length
      })
    this.populateQuestions();
  }
  increment(){
    this.index = (this.index + this.size + 1)%this.size;
    this.isLoading = true;
    this.searchService.createQuestionOnType(this.nodes[this.index])
  }
  decrement(){
    this.index = (this.index + this.size - 1)%this.size;
    this.isLoading = true;
    this.searchService.createQuestionOnType(this.nodes[this.index])
  }
  populateQuestions(){
    console.log(this.nodes)
    this.searchService.createQuestionOnType(this.nodes[this.index])
    // for(var node of this.nodes){
    //   this.searchService.createQuestionOnType(node)
    // }
  }

}
