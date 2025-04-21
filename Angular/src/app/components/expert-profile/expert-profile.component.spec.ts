import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertProfileComponent } from './expert-profile.component';

describe('ExpertProfileComponent', () => {
  let component: ExpertProfileComponent;
  let fixture: ComponentFixture<ExpertProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpertProfileComponent]
    });
    fixture = TestBed.createComponent(ExpertProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
