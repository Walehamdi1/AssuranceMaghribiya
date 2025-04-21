import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from 'leaflet';
import { SinistersService } from 'src/app/services/sinisters.service';

@Component({
  selector: 'app-create-sin',
  templateUrl: './create-sin.component.html',
  styleUrls: ['./create-sin.component.css']
})
export class CreateSinComponent implements AfterViewInit, OnInit {
  estimatedTime: string = '';
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  selectedFile: File | null = null;
  minDate: Date;
  maxDate: Date;
  map: any;
  marker: any;
  selectedLocation: string = '';
  mapInitialized: boolean = false;
  userId: any;

  constructor(
    private _formBuilder: FormBuilder,
    private claimService: SinistersService
  ) {
    const currentDate = new Date();
    this.maxDate = currentDate;
    this.minDate = this.subtractMonths(currentDate, 3);

    this.firstFormGroup = this._formBuilder.group({
      typeAssurance: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      description: ['', Validators.required]
    });

    this.thirdFormGroup = this._formBuilder.group({
      incidentDate: ['', Validators.required]
    });

    this.fourthFormGroup = this._formBuilder.group({
      location: ['', Validators.required]
    });

    this.fifthFormGroup = this._formBuilder.group({
      document: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.decodeToken(token);
      this.userId = decodedToken?.id || null;
      console.log('Decoded userId:', this.userId);
    }
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  decodeToken(token: string): any {
    try {
      const tokenPayload = token.split('.')[1];
      return JSON.parse(atob(tokenPayload));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  initializeMap() {
    this.map = L.map('map').setView([33.6844, 73.0479], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (event: any) => {
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;
      this.selectedLocation = `${lat}, ${lng}`;
      this.fourthFormGroup.get('location')?.setValue(this.selectedLocation);

      if (this.marker) {
        this.marker.setLatLng(event.latlng);
      } else {
        this.marker = L.marker(event.latlng).addTo(this.map);
      }
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.fifthFormGroup.get('document')?.setValue(this.selectedFile.name);
      }
    }
  }

  onInsuranceTypeChange(event: any) {
    const selectedType = event.value;
    if (selectedType) {
      this.claimService.getEstimatedProcessingTime(selectedType).subscribe({
        next: (response) => {
          this.estimatedTime = response;
        },
        error: (error) => {
          console.error('Error fetching estimated processing time', error);
          this.estimatedTime = 'Error retrieving estimated time.';
        }
      });
    } else {
      this.estimatedTime = '';
    }
  }

  private allFormsValid(): boolean {
    return this.firstFormGroup.valid &&
      this.secondFormGroup.valid &&
      this.thirdFormGroup.valid &&
      this.fourthFormGroup.valid &&
      this.fifthFormGroup.valid &&
      !!this.selectedFile;
  }

  onSubmit() {
    if (!this.userId) {
      alert('User not authenticated.');
      return;
    }

    if (this.allFormsValid()) {
      const claimData = {
        userId: this.userId,
        typeAssurance: this.firstFormGroup.value.typeAssurance,
        description: this.secondFormGroup.value.description,
        incidentDate: this.thirdFormGroup.value.incidentDate,
        location: this.selectedLocation
      };

      this.claimService.createClaim(claimData, this.selectedFile!).subscribe({
        next: (response) => {
          console.log('Claim created successfully', response);
          alert('Claim submitted successfully!');
        },
        error: (error) => {
          console.error('Error creating claim', error);
          alert('Error submitting claim. Please try again.');
        }
      });
    } else {
      alert('Please fill out all fields and select a file.');
    }
  }

  private subtractMonths(date: Date, months: number): Date {
    const d = new Date(date);
    const originalDay = d.getDate();
    d.setMonth(d.getMonth() - months);

    if (d.getDate() !== originalDay) {
      d.setDate(0);
    }
    return d;
  }
}
