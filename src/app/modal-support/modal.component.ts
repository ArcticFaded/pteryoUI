import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

import { ModalService } from '../modal.service';
import { SearchService } from '../search.service';
import { API } from '../json-data.service';


@Component({
    selector: 'modal',
    template: `<div>
      <h3>something</h3>
      <figure class="stack stack-vertspread">
        <div class="contents" *ngFor="let child of id.children" >
          <button (click)="printId()">{{child.id}}</button>
          <dynamic-form [questions]="questions"></dynamic-form>
        </div>
        <!-- <div class="contents" style="background: black"></div>
        <div class="contents" style="background: red"></div>
        <div class="contents" style="background: blue"></div> -->
      </figure>
    </div>`,
    styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit, OnDestroy {
    @Input() id: API.Points;
    private element: any;
    questions : any[];

    constructor(private modalService: ModalService, private el: ElementRef, private searchService: SearchService) {
        this.element = el.nativeElement;
        this.questions = searchService.getQuestions();

    }

    ngOnInit(): void {
        let modal = this;
        // add self (this modal instance) to the modal service so it's accessible from controllers
        this.modalService.add(this);
    }

    // remove self from modal service when directive is destroyed
    ngOnDestroy(): void {
        this.modalService.remove(this.id);
        this.element.remove();
    }

    printId(event) {
      // this.modalService.shuffle()
      console.log(event)
    }
    // open modal
    open(): void {
        this.element.style.display = 'block';
        document.body.classList.add('modal-open');
    }

    // close modal
    close(): void {
        this.element.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
}
