package tn.esprit.contractmanegement.Enumeration;

import com.fasterxml.jackson.annotation.JsonValue;

public enum StatusConsultation {
    EN_COURS("En cours"),
    VALIDÉE("Validée"),
    REJETÉE("Refusée");


    private String label;

    StatusConsultation(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }
}