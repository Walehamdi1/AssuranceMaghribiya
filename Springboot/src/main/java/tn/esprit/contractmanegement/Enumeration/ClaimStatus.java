package tn.esprit.contractmanegement.Enumeration;


public enum ClaimStatus {
    ENREGISTREE("Réclamation bien enregistrée"),
    EN_COURS("Réclamation en cours de traitement"),
    TRAITEE("Réclamation traitée");

    private final String description;

    ClaimStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
