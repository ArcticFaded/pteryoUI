
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { JurassicTableComponent } from './jurassic-table.component';

describe('JurassicTableComponent', () => {
  let component: JurassicTableComponent;
  let fixture: ComponentFixture<JurassicTableComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JurassicTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JurassicTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
