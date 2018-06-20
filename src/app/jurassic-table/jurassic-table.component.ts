import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { JurassicTableDataSource } from './jurassic-table-datasource';

@Component({
  selector: 'jurassic-table',
  templateUrl: './jurassic-table.component.html',
  styleUrls: ['./jurassic-table.component.css']
})
export class JurassicTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: JurassicTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];

  ngOnInit() {
    this.dataSource = new JurassicTableDataSource(this.paginator, this.sort);
  }
}
