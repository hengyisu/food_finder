package com.example.iac.controller;

import com.example.iac.entity.IacVmClusterMapping;
import com.example.iac.entity.IacVmClusterMappingId;
import com.example.iac.service.IacVmClusterMappingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/iac-vm-cluster-mappings")
public class IacVmClusterMappingController {

    private final IacVmClusterMappingService service;

    public IacVmClusterMappingController(IacVmClusterMappingService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<IacVmClusterMapping>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{fab}/{phase}")
    public ResponseEntity<IacVmClusterMapping> getById(
            @PathVariable String fab,
            @PathVariable String phase) {
        IacVmClusterMappingId id = new IacVmClusterMappingId(fab, phase);
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<IacVmClusterMapping> create(
            @RequestBody IacVmClusterMapping mapping) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(mapping));
    }

    @PutMapping("/{fab}/{phase}")
    public ResponseEntity<IacVmClusterMapping> update(
            @PathVariable String fab,
            @PathVariable String phase,
            @RequestBody IacVmClusterMapping mapping) {
        IacVmClusterMappingId id = new IacVmClusterMappingId(fab, phase);
        return ResponseEntity.ok(service.update(id, mapping));
    }

    @DeleteMapping("/{fab}/{phase}")
    public ResponseEntity<Void> delete(
            @PathVariable String fab,
            @PathVariable String phase) {
        IacVmClusterMappingId id = new IacVmClusterMappingId(fab, phase);
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}