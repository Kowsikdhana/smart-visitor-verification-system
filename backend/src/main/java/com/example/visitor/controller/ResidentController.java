package com.example.visitor.controller;

import com.example.visitor.dto.ResidentCreateRequest;
import com.example.visitor.dto.ResidentResponse;
import com.example.visitor.service.ResidentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ResidentController exposes endpoints for querying and managing residents.
 */
@RestController
@RequestMapping("/api/residents")
public class ResidentController {

    private final ResidentService residentService;

    public ResidentController(ResidentService residentService) {
        this.residentService = residentService;
    }

    @GetMapping
    public ResponseEntity<List<ResidentResponse>> getAllResidents() {
        return ResponseEntity.ok(residentService.getAllResidents());
    }

    @GetMapping("/search")
    public ResponseEntity<List<ResidentResponse>> searchResidents(@RequestParam(value = "query", required = false) String query) {
        return ResponseEntity.ok(residentService.searchResidents(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResidentResponse> getResidentById(@PathVariable Long id) {
        return ResponseEntity.ok(residentService.getResidentById(id));
    }

    @PostMapping
    public ResponseEntity<ResidentResponse> createResident(@Valid @RequestBody ResidentCreateRequest request) {
        ResidentResponse created = residentService.createResident(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
