package com.example.visitor.controller;

import com.example.visitor.dto.VisitCreateRequest;
import com.example.visitor.dto.VisitResponse;
import com.example.visitor.entity.VisitStatus;
import com.example.visitor.entity.VisitorType;
import com.example.visitor.service.VisitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * VisitController manages gate entry, exit, live occupancy, and historical audit logs.
 */
@RestController
@RequestMapping("/api/visits")
public class VisitController {

    private final VisitService visitService;

    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    /**
     * Registers and checks in a visitor/delivery.
     * Generates a digital pass code and marks status as CHECKED_IN.
     */
    @PostMapping
    public ResponseEntity<VisitResponse> createVisit(@Valid @RequestBody VisitCreateRequest request) {
        VisitResponse response = visitService.createVisit(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Retrieves all visitors currently inside the campus.
     */
    @GetMapping("/current")
    public ResponseEntity<List<VisitResponse>> getCurrentVisits() {
        return ResponseEntity.ok(visitService.getCurrentVisits());
    }

    /**
     * Searches and filters visitor history.
     */
    @GetMapping("/history")
    public ResponseEntity<List<VisitResponse>> getVisitHistory(
            @RequestParam(value = "type", required = false) VisitorType type,
            @RequestParam(value = "status", required = false) VisitStatus status,
            @RequestParam(value = "date", required = false) String date,
            @RequestParam(value = "query", required = false) String query) {
        return ResponseEntity.ok(visitService.filterVisits(type, status, date, query));
    }

    /**
     * Retrieves details of a specific visit by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<VisitResponse> getVisitById(@PathVariable Long id) {
        return ResponseEntity.ok(visitService.getVisitById(id));
    }

    /**
     * Retrieves visit details using the human-readable digital pass code.
     */
    @GetMapping("/pass/{passCode}")
    public ResponseEntity<VisitResponse> getVisitByPassCode(@PathVariable String passCode) {
        return ResponseEntity.ok(visitService.getVisitByPassCode(passCode));
    }

    /**
     * Checks out a visitor when leaving the premises.
     * Supports both PATCH and POST for convenience.
     */
    @RequestMapping(value = "/{id}/check-out", method = {RequestMethod.POST, RequestMethod.PATCH})
    public ResponseEntity<VisitResponse> checkOutVisit(@PathVariable Long id) {
        VisitResponse response = visitService.checkOutVisit(id);
        return ResponseEntity.ok(response);
    }
}
