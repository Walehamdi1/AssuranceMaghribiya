export interface SatisfactionSurvey {
    claimId: number;
    userId: number;
    csatScore: number;  // Par exemple, une échelle de 1 à 5 pour la satisfaction
    feedback: string;    // Retour optionnel
  }
  