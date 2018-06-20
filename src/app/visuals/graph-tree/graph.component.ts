
// path : visuals/graph/graph.component.ts
import {
  Component,
  Input,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { D3Service, ForceDirectedGraph, Node } from '../../d3';
import { JsonDataService } from '../../json-data.service'

@Component({
  selector: 'graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg #svg [attr.width]="_options.width" [attr.height]="_options.height" class="picture">
      <g [zoomableOf]="svg">
        <g [linkVisual]="link" *ngFor="let link of links"></g>
        <g [nodeVisual]="node" *ngFor="let node of nodes" (click)="collapseNode(node)" [draggableNode]="node"
      [draggableInGraph]="graph"></g>
      </g>
    </svg>
  `,
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {
  @Input('nodes') nodes;
  @Input('links') links;

  graph: ForceDirectedGraph;

  constructor(private d3Service: D3Service, private ref: ChangeDetectorRef, private jsonDataService: JsonDataService) {}


  ngOnInit() {
    /** Receiving an initialized simulated graph from our custom d3 service */
    this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);

    this.graph.ticker.subscribe((d) => {
      this.ref.markForCheck();
    });
  }

  ngAfterViewInit() {
    this.graph.initSimulation(this.options);
  }

  collapseNode(node){
    this.jsonDataService.update(node)
  }

  private _options: { width, height } = { width: 1000, height: 800 };

  get options() {
    return this._options = {
      width: 1000,//window.innerWidth,
      height: 500,//window.innerHeight
    };
  }
}
