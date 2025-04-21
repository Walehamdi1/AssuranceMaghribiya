import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsListComponent } from './claims-list.component';

describe('ClaimsListComponent', () => {
  let component: ClaimsListComponent;
  let fixture: ComponentFixture<ClaimsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsListComponent]
    });
    fixture = TestBed.createComponent(ClaimsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
