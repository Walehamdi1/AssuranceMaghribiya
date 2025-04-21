import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSinComponent } from './create-sin.component';

describe('CreateSinComponent', () => {
  let component: CreateSinComponent;
  let fixture: ComponentFixture<CreateSinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateSinComponent]
    });
    fixture = TestBed.createComponent(CreateSinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
