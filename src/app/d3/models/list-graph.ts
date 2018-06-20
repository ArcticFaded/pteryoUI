import { EventEmitter } from '@angular/core';
import { Node } from './node';
import { Link } from './link'
import * as d3 from 'd3';

export class ListGraph {

  public nodes: Node[] = [];
  public links: Link[] = [];

  constructor(nodes, links, options: {visible}) {
    this.nodes = nodes;
    this.links = links;

    // this.initPosition();
  }

  // var rowEnter = function(rowSelection) {
  //      rowSelection.append("rect")
  //          .attr("rx", 3)
  //          .attr("ry", 3)
  //          .attr("width", "250")
  //          .attr("height", "24")
  //          .attr("fill-opacity", 0.25)
  //          .attr("stroke", "#999999")
  //          .attr("stroke-width", "2px");
  //      rowSelection.append("text")
  //          .attr("transform", "translate(10,15)");
  //  };
  //  var rowUpdate = function(rowSelection) {
  //    rowSelection.select("rect")
  //        .attr("fill", function(d) {
  //            return colorScale(d.id);
  //        });
  //    rowSelection.select("text")
  //        .text(function (d) {
  //            return (d.index + 1) + ". " + d.label;
  //        });
  //    };
  //    var rowExit = function(rowSelection) {
  //    };
  //
  //     initPositions() {
  //       var virtualScroller = d3.VirtualScroller()
  //               .rowHeight(30)
  //               .enter(rowEnter)
  //               .update(rowUpdate)
  //               .exit(rowExit)
  //               .svg(scrollSVG)
  //               .totalRows(50)
  //               .viewport(d3.select(".viewport"));
  //       this.nodes.items.forEach((nextNode, i) => {
  //         this.nextNode.index = i;
  //       });
  //       virtualScroller.data(this.nodes.items, function(d) { return d.id; });
  //
  //     }



}
