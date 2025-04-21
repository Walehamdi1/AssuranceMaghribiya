// consultation-create.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConsultationService } from 'src/app/services/consulting.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { Consultation } from 'src/app/models/consulting.model';

export enum ConsultationStatus {
  EN_COURS = 'EN_COURS',
  VALIDEE = 'VALIDÉE',
  REJETEE = 'REJETÉE'
}

@Component({
  selector: 'app-consultation-create',
  templateUrl: './consultation-create.component.html',
  styleUrls: ['./consultation-create.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
    ToastModule,
    ProgressSpinnerModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    OverlayPanelModule
  ],
})
export class ConsultationCreateComponent implements OnInit {
  @ViewChild('op', { static: false }) op!: OverlayPanel;
  isListening: boolean = false;

  consultation: Consultation = {
    clientId: 1,
    dateConsultation: new Date().toISOString(),
    insuranceType: '',
    objet: '',
    description: '',
    statut: ConsultationStatus.EN_COURS
  };

  loading: boolean = false;
  minDate: Date = new Date();

  insuranceTypes = [
    { label: 'Voiture', value: 'voiture' },
    { label: 'Maison', value: 'maison' },
    { label: 'Santé', value: 'sante' },
    { label: 'Autre', value: 'autre' }
  ];

  constructor(
    private consultationService: ConsultationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    console.log("🔎 Client ID par défaut:", this.consultation.clientId);
  }

  saveConsultation() {
    const formattedDate = this.formatDateForBackend(new Date(this.consultation.dateConsultation));
    const consultationData: any = {
      objet: this.consultation.objet,
      description: this.consultation.description,
      dateConsultation: formattedDate,
      insuranceType: this.consultation.insuranceType,
      statut: this.consultation.statut,
      client: { id: this.consultation.clientId }
    };

    this.loading = true;
    this.consultationService.createConsultation(consultationData).subscribe(
      (res) => {
        this.snackBar.open('Consultation ajoutée avec succès!', 'Fermer', { duration: 3000 });
        this.consultationService.addConsultationToList(res);
        setTimeout(() => this.router.navigate(['/home']), 2000);
      },
      (err) => {
        this.snackBar.open(`Erreur : ${err.message || 'Une erreur est survenue'}`, 'Fermer', { duration: 3000 });
      }
    ).add(() => this.loading = false);
  }

  formatDateForBackend(date: Date): string {
    return date.toISOString().slice(0, 19);
  }

  toggleOverlayPanel(event: Event) {
    this.op.toggle(event);
  }

  requestOnlineConsultation(platform: string) {
    this.op.hide();
    this.loading = true;
    console.log(`💻 Consultation en ligne demandée via : ${platform}`);
    setTimeout(() => {
      this.loading = false;
      alert(`Demande envoyée via ${platform}`);
    }, 1500);
  }

  startVoiceRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("La reconnaissance vocale n'est pas supportée par votre navigateur.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    this.isListening = true;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('🎙️ Reconnu :', transcript);

      this.consultation.description = transcript;
      this.autoFillFromSpeech(transcript);

      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(`Vous avez dit : ${transcript}`);
      synth.speak(utterance);

      console.log('🧠 Consultation après traitement :', this.consultation);
    };

    recognition.onerror = (event: any) => {
      this.isListening = false;
      if (event.error !== 'no-speech') {
        console.error('⚠️ Erreur vocale :', event.error);
        alert('Erreur : ' + event.error);
      }
    };

    recognition.onend = () => {
      this.isListening = false;
      console.log('🎤 Fin de l\'écoute');
    };

    recognition.start();
  }

  autoFillFromSpeech(transcript: string) {
    const texte = transcript.toLowerCase();

    const typeMap = {
      voiture: ['voiture', 'auto', 'véhicule'],
      maison: ['maison', 'habitation', 'logement'],
      sante: ['santé', 'maladie', 'médecin', 'hospitalisation'],
      autre: ['autre', 'divers']
    };

    let typeTrouve = false;

    for (const [type, keywords] of Object.entries(typeMap)) {
      if (keywords.some(k => texte.includes(k))) {
        this.consultation.insuranceType = type;
        this.consultation.objet = `Assurance ${type}`;
        console.log('✅ Type détecté :', type);
        typeTrouve = true;
        break;
      }
    }

    if (!typeTrouve) {
      console.warn('❌ Aucun type détecté');
    }

    this.parseSpeech(texte);
  }

  parseSpeech(speech: string) {
    const jourMatch = speech.match(/(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)/i);
    const heureMatch = speech.match(/(\d{1,2})[:h](\d{0,2})?/);

    if (jourMatch && heureMatch) {
      const jourTexte = jourMatch[0].toLowerCase();
      const jours = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
      const today = new Date();
      const todayIndex = today.getDay();
      const jourIndex = jours.indexOf(jourTexte);
      let diff = jourIndex - todayIndex;
      if (diff < 0) diff += 7;

      const newDate = new Date();
      newDate.setDate(today.getDate() + diff);
      newDate.setHours(parseInt(heureMatch[1]), heureMatch[2] ? parseInt(heureMatch[2]) : 0);

      this.consultation.dateConsultation = newDate.toISOString();
      console.log('📅 Date vocale définie :', newDate.toLocaleString());
    } else {
      console.warn('⏳ Date ou heure non détectée');
    }
  }
}
