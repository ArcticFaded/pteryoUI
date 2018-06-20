import { Component, Input } from '@angular/core';
import { Node } from '../../../d3';

@Component({
  selector: '[nodeVisual]',
  template: `
    <svg:g [attr.transform]="'translate(' + node.x + ',' + node.y + ')'">
      <svg:rect
          class="node"
          [attr.fill]="node.color"
          width = 40
          height = 10
          x=-15
          y=-4
          rx="5px"
          ry="5px">
      </svg:rect>
      <svg:text
          class="node-name"
          [attr.font-size]="node.fontSize">
        {{node.id}}
      </svg:text>
    </svg:g>
  `,
  styleUrls: ['./node-visual.component.css']
})
export class NodeVisualComponent {
  @Input('nodeVisual') node: Node;
}
/*
<svg:g [attr.transform]="'translate(' + node.x + ',' + node.y + ')'">
<svg:circle
    class="node"
    [attr.fill]="node.color"
    cx="3px"
    cy="3px"
    [attr.r]="node.r">
</svg:circle>
*/
