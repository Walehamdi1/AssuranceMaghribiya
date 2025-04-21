import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinisterDetailsComponent } from './sinister-details.component';

describe('SinisterDetailsComponent', () => {
  let component: SinisterDetailsComponent;
  let fixture: ComponentFixture<SinisterDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SinisterDetailsComponent]
    });
    fixture = TestBed.createComponent(SinisterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
