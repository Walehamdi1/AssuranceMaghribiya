import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDevisHabitationComponent } from './create-devis-habitation.component';

describe('CreateDevisHabitationComponent', () => {
  let component: CreateDevisHabitationComponent;
  let fixture: ComponentFixture<CreateDevisHabitationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateDevisHabitationComponent]
    });
    fixture = TestBed.createComponent(CreateDevisHabitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
