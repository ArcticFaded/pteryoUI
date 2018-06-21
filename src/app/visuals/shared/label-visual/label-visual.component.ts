import { Component, Input } from '@angular/core';
import { Node } from '../../../d3';

@Component({
  selector: '[labelVisual]',
  template: `
    <svg:g >
      <svg:rect
          [attr.x]="node.x"
          [attr.y]="node.y"
          class="node"
          [attr.fill]="node.color"
          width = 550
          height = 25
          rx="3"
          ry="3">
      </svg:rect>
      <svg:text
          [attr.x]="node.x + 10"
          [attr.y]="node.y + 20"
          class="node-name"
          [attr.font-size]="node.fontSize">
        {{node.label}}
      </svg:text>
    </svg:g>
  `,
  styleUrls: ['./label-visual.component.css']
})
export class LabelVisualComponent {
  @Input('labelVisual') node: Node;

  ngOnInit() {

    // console.log(this.node)
  }
}
