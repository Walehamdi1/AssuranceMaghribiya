import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertConsultationsComponent } from './expert-consultations.component';

describe('ExpertConsultationsComponent', () => {
  let component: ExpertConsultationsComponent;
  let fixture: ComponentFixture<ExpertConsultationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpertConsultationsComponent]
    });
    fixture = TestBed.createComponent(ExpertConsultationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
