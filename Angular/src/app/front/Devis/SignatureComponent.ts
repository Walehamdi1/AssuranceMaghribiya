/*import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef;
  signaturePad!: SignaturePad;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.signaturePad = new SignaturePad(canvas);
  }

  clearSignature(): void {
    this.signaturePad.clear();
  }

  saveSignature(): void {
    const dataURL = this.signaturePad.toDataURL(); // Image base64
    console.log('Signature enregistrée:', dataURL);
  }
}*/
