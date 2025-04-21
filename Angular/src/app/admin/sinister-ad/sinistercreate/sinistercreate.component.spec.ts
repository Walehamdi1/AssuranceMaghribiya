import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinistercreateComponent } from './sinistercreate.component';

describe('SinistercreateComponent', () => {
  let component: SinistercreateComponent;
  let fixture: ComponentFixture<SinistercreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SinistercreateComponent]
    });
    fixture = TestBed.createComponent(SinistercreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
