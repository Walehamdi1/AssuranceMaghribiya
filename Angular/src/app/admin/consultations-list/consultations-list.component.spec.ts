import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsultationsListComponent } from './consultations-list.component';
import { CommonModule } from '@angular/common'; // Exemple de module que vous pourriez avoir besoin d'importer

describe('ConsultationsListComponent', () => {
  let component: ConsultationsListComponent;
  let fixture: ComponentFixture<ConsultationsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultationsListComponent],
      imports: [CommonModule] // Si vous utilisez des directives comme ngIf ou ngFor
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultationsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
