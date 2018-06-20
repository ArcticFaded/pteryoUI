
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { JurassicHeroComponent } from './jurassic-hero.component';

describe('JurassicHeroComponent', () => {
  let component: JurassicHeroComponent;
  let fixture: ComponentFixture<JurassicHeroComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JurassicHeroComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JurassicHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
