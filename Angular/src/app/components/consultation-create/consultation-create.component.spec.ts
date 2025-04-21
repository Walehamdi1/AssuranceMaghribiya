import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultationCreateComponent } from 'src/app/components/consultation-create/consultation-create.component';

describe('ConsultationCreateComponent', () => {
  let component: ConsultationCreateComponent;
  let fixture: ComponentFixture<ConsultationCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultationCreateComponent]
    });
    fixture = TestBed.createComponent(ConsultationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});