import { Paiement } from "./Paiement.model";
import { TypeAssurance } from "./TypeAssurance";

export interface Devis {
    id: number;
    nomClient: string;
    emailClient:string,
    typeAssurance: TypeAssurance;
    dateDebut: string;
    dateFin: string;
    statut: string;
    signe?: boolean; 
    trancheAge:number;
    nationalite:string; 
    destination:string;
    montantTotal:number;
    signature?: string;
    paiements: Paiement[];
  }
  