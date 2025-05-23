package tn.esprit.contractmanegement.Dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.esprit.contractmanegement.Entity.User;
import tn.esprit.contractmanegement.Enumeration.Role;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    private String token;
    private String messageResponse;
    private Role role;
    private String email;
    private User user;
}
