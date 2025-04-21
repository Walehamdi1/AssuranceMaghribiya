import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinisterdisplayComponent } from './sinisterdisplay.component';

describe('SinisterdisplayComponent', () => {
  let component: SinisterdisplayComponent;
  let fixture: ComponentFixture<SinisterdisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SinisterdisplayComponent]
    });
    fixture = TestBed.createComponent(SinisterdisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
