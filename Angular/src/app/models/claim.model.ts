import { User } from './user.model';

export interface Claim {
  idClaim?: number;
  reclamationType: 'SERVICE' | 'QUALITY' | 'DELAY' | 'OTHER';
  reclamationDate: string;
  description: string;
  status?: 'ENREGISTREE' | 'EN_COURS' | 'TRAITEE';
  userId: number;  // ID de l'utilisateur auquel la réclamation est affectée
  user?: User;     // Objet utilisateur (optionnel)

}
