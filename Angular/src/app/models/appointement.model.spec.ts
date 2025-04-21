import { Appointement } from './appointement.model';

describe('Appointement', () => {
  it('should be an object with the correct structure', () => {
    const appointement: Appointement = {
      idAppointment: 1,
      description: 'Test description',
      dateSubmitted: new Date(),
      status: 'PENDING',
      archiver: true, // Ajout de la propriété manquante
      userId: 5 
    };
    

    // Vérifiez que l'objet respecte l'interface
    expect(appointement).toBeTruthy();
    expect(appointement.idAppointment).toBeDefined();
    expect(appointement.description).toBeDefined();
    expect(appointement.dateSubmitted).toBeDefined();
    expect(appointement.status).toBeDefined();
  });
});
