
// path : visuals/graph-list/graph.component.ts
import {
  Component,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { D3Service, Node } from '../../d3';
import { JsonDataService } from '../../json-data.service'
import { ModalService } from '../../modal.service'
import { SearchService } from '../../search.service'

@Component({
  selector: 'graph-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div layout="row" layout-align="start start">
    <div class="box container" [style.height.px]=options.height [style.margin-right.px]=0>
      <div class="picture" [style.height.px]=options.height>
        <svg #svg [attr.width]="_options.width" [attr.height]="_options.height" class="scroll-svg">
          <g class = "chartGroup" [labelVisual]="node" (click)="expandNode(node)" *ngFor="let node of visNodes"></g>
        </svg>
      </div>
    </div>
  </div>
  `,
  styleUrls: ['./graph.component.css']
})
export class GraphListComponent {
  @Input('list') nodes: Node[];
  visNodes: Node[] = [];


  // scroller: ListGraph.virtualScroller
  private _options = {width: 500, height: 250}
  private options = {height: 250}
  // graph: ForceDirectedGraph;

  constructor (private jsonDataService: JsonDataService, private ref: ChangeDetectorRef,
    private d3Service: D3Service, private modalService: ModalService, private searchService: SearchService) {
    jsonDataService.search$.subscribe(change => {
      console.log(change)
      this.trimNode(change);
      this.ref.markForCheck();
    })
    jsonDataService.nodes$.subscribe(change => {
      this.nodes = change
      this.sortNodes()
      this.ngOnInit()
    })
  }



  trimNode(term){
    for(var node of this.nodes){
      var nodeIndex = this.visNodes.indexOf(node);
      var trying = node.label || node.id;
      console.log("trying:" + trying)
      if(trying.toLowerCase().startsWith(term.toLowerCase())){
        console.log("matched parent node:" + trying, term)
        if(nodeIndex === -1 && node.level > 1){
          this.visNodes.push(node)
        }
        continue;
      }
    }
    console.log(this.visNodes)
    this.orderNodes(this.visNodes)
    this._options.height = this.visNodes.length * 30
  }

  ngOnInit() {
    this.sortNodes()
    var i = 0;
    for(var entry in this.nodes){
      var sim = false;
      var simIndex = "";
      if(this.nodes[entry].label === null){
        continue
      }
      for(var similar in this.nodes){
        if(entry === similar){
          continue
        }
        if(this.nodes[similar].label === null){
          continue
        }
        if(this.jaacardSim(this.nodes[entry].something.norm, this.nodes[similar].something.norm) > 0.7){
          sim = true
          simIndex = this.nodes[similar].something.norm
        }
      }
      if(!sim){
        this.visNodes.push(this.nodes[entry]);
      }
    }

    this.orderNodes(this.visNodes)
    this._options.height = this.visNodes.length * 30;
    this.options.height = 12 * 30;
    this.ref.markForCheck();
  }

  jaacardSim(obj1, obj2){
    var arr1 = obj1.split("");
    var arr2 = obj2.split("");
    var intersection = arr1.filter(value => -1 !== arr2.indexOf(value))

    return  intersection.length / (arr1.length + arr2.length - intersection.length)
  }

  ngAfterViewInit() {
  }
  expandNode(node){
    // console.log(node)
    this.searchService.createQuestionOnType(node);
    // this.modalService.open(node.something);
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
  orderNodes(nodes){
    var i = 0;
    for(var node of nodes){
      node.index = i;
      node.y = i * 30;
      // entry.fontSize = 20;
      i = i + 1;
    }
  }



}
