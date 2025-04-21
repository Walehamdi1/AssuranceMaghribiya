// src/app/models/appointement.model.ts
import { User } from './user.model';

export class Appointement {
  idAppointment: number;
  description: string;
  dateSubmitted: Date;
  status: string;
  archiver: boolean;
  userId: number; // ID de l'utilisateur auquel le rendez-vous est affecté
  user?: User;    // Propriété optionnelle pour l'objet utilisateur

  constructor(
    idAppointment: number = 0,
    description: string = '',
    dateSubmitted: Date = new Date(),
    status: string = 'PENDING',
    archiver: boolean = true,
    userId: number = 0 // Initialisation de l'userId
  ) {
    this.idAppointment = idAppointment;
    this.description = description;
    this.dateSubmitted = dateSubmitted;
    this.status = status;
    this.archiver = archiver;
    this.userId = userId;
  }
}