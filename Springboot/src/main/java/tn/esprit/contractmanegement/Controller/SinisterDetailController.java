package tn.esprit.contractmanegement.Controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.contractmanegement.Entity.SinisterDetail;
import tn.esprit.contractmanegement.Service.SinisterDetailService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sinister-details")
public class SinisterDetailController {

    @Autowired
    private SinisterDetailService sinisterDetailService;

    @GetMapping
    public List<SinisterDetail> getAll() {
        return sinisterDetailService.getAllSinisterDetails();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SinisterDetail> getById(@PathVariable Long id) {
        Optional<SinisterDetail> sinisterDetail = sinisterDetailService.getSinisterDetailById(id);
        return sinisterDetail.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/sinister/{sinisterId}")
    public List<SinisterDetail> getBySinisterId(@PathVariable Long sinisterId) {
        return sinisterDetailService.getDetailsBySinisterId(sinisterId);
    }

    @PostMapping("/create")
    public SinisterDetail create(@Valid @RequestBody SinisterDetail sinisterDetail) {
        return sinisterDetailService.createSinisterDetail(sinisterDetail);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SinisterDetail> update(@PathVariable Long id, @Valid @RequestBody SinisterDetail sinisterDetailDetails) {
        SinisterDetail updated = sinisterDetailService.updateSinisterDetail(id, sinisterDetailDetails);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        sinisterDetailService.deleteSinisterDetail(id);
        return ResponseEntity.noContent().build();
    }
}
