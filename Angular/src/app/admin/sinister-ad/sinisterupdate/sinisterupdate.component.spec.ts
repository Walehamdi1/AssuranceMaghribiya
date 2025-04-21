import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinisterupdateComponent } from './sinisterupdate.component';

describe('SinisterupdateComponent', () => {
  let component: SinisterupdateComponent;
  let fixture: ComponentFixture<SinisterupdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SinisterupdateComponent]
    });
    fixture = TestBed.createComponent(SinisterupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
