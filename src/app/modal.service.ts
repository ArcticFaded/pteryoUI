import { Injectable } from '@angular/core';
// import { Node, Link } from './d3';
import { Observable, Subject, of } from 'rxjs';
import { API } from './json-data.service'


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: any[] = [];

  add(modal: any) {
      // add modal to array of active modals
      this.modals.push(modal);
  }

  remove(id: API.Points) {
      // remove modal from array of active modals
      this.modals = this.modals.filter(x => x.id !== id);
  }

  open(id: API.Points) {
      // open modal specified by id
      console.log(this.modals)
      let modal: any = this.modals.filter(x => x.id === id)[0];
      modal.open();
  }

  close(id: API.Points) {
      // close modal specified by id
      let modal: any = this.modals.filter(x => x.id === id)[0];
      modal.close();
  }
}
