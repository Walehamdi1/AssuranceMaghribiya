import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorComponent } from './histor.component';

describe('HistorComponent', () => {
  let component: HistorComponent;
  let fixture: ComponentFixture<HistorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorComponent]
    });
    fixture = TestBed.createComponent(HistorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
