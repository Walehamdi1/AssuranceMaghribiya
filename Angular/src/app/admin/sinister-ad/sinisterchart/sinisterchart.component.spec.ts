import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinisterchartComponent } from './sinisterchart.component';

describe('SinisterchartComponent', () => {
  let component: SinisterchartComponent;
  let fixture: ComponentFixture<SinisterchartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SinisterchartComponent]
    });
    fixture = TestBed.createComponent(SinisterchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
