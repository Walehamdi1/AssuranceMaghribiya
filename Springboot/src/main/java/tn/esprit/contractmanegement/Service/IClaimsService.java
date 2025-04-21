package tn.esprit.contractmanegement.Service;

import tn.esprit.contractmanegement.Entity.Claims;

import java.util.List;
import java.util.Optional;

public interface IClaimsService {

    Claims createClaim(Claims claim);
    List<Claims> getAllClaims();
    Optional<Claims> getClaimById(Long id);
    Claims updateClaim(Long claimId, Claims updatedClaim);
    void deleteClaim(Long id);
}
