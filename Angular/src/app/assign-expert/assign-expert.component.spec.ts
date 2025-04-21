import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignExpertComponent } from './assign-expert.component';

describe('AssignExpertComponent', () => {
  let component: AssignExpertComponent;
  let fixture: ComponentFixture<AssignExpertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignExpertComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignExpertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
