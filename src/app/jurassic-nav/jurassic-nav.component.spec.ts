
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { JurassicNavComponent } from './jurassic-nav.component';

describe('JurassicNavComponent', () => {
  let component: JurassicNavComponent;
  let fixture: ComponentFixture<JurassicNavComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JurassicNavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JurassicNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
