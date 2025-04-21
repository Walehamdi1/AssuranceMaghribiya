// src/app/models/consulting.model.ts
export interface Consultation {
  id?: number | null;
  clientId: number | 1;
  insuranceType: string;
  objet: string;
  description: string;
  statut: 'VALIDÉE' | 'EN_COURS' | 'REJETÉE'; 
  dateConsultation: string;  
  clientEmail?: string;
  accepted?: boolean;
  rejected?: boolean;
  expertAction?: string;
  expertId?: number;  // Le champ pour l'expert si nécessaire
  rating?: number;  // Ajout du champ rating
  comment?: string;  // Ajout du champ comment
}



export interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  consultations: Consultation[];
}
