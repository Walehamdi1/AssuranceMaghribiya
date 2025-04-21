export interface Client {
    id: number; // Correspond à l'ID du client dans la base de données
    nom: string; // Le nom du client
    prenom: string; // Le prénom du client
    email: string; // L'email du client
    consultations: Consultation[]; // Liste des consultations associées à ce client
  }
  
  export interface Consultation {
    id: number; // ID de la consultation
    insuranceType: string; // Type d'assurance associé à la consultation
    description: string; // Description de la consultation
    dateConsultation: string; // Date de la consultation
    statut: string; // Statut de la consultation
    clientId: number; // L'ID du client lié à la consultation
  }
  