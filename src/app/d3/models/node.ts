import APP_CONFIG from '../../app.config';
import { Injectable, EventEmitter } from '@angular/core';
import { API, QUESTIONS} from '../../json-data.service'

@Injectable()
export class Node implements d3.SimulationNodeDatum {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

  id: string;
  label: string
  level: number;
  something: QUESTIONS.Data;
  linkCount: number = 0;
  collapse: Node[] = [];

  constructor(level:number = 0, something:QUESTIONS.Data = null, x:number = 0, y:number = 0) {
    this.id = something._id;
    this.label = something.labels;
    this.something = something;
    this.level = level;
    this.x = x;
    this.y = y;
  }

  addChild = (a:Node) => {
    this.collapse.push(a);
  }
  setLevel = (a:number) => {
    this.level = a;
  }
  setIndex = (a:number) => {
    this.index = a;
  }

  get Index() {
    return this.index;
  }

  get children() {
    return this.collapse;
  }

  normal = () => {
    return this.level;
  }

  get r() {
    return 10 * this.normal() + 10;
  }

  get fontSize() {
    return (20) + 'px';
  }

  get color() {
    return APP_CONFIG.SPECTRUM[this.level];
  }
}
