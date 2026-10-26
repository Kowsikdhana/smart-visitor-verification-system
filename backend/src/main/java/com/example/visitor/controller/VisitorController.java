package com.example.visitor.controller;

import com.example.visitor.dto.VisitorResponse;
import com.example.visitor.service.VisitorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * VisitorController handles endpoints for querying visitor identity records.
 *
 * Fast Delivery Lookup:
 * GET /api/visitors/search?phone=9123456780
 * Enables the frontend to quickly fetch previously saved name/company/vehicle info.
 */
@RestController
@RequestMapping("/api/visitors")
public class VisitorController {

    private final VisitorService visitorService;

    public VisitorController(VisitorService visitorService) {
        this.visitorService = visitorService;
    }

    @GetMapping
    public ResponseEntity<List<VisitorResponse>> getAllVisitors() {
        return ResponseEntity.ok(visitorService.getAllVisitors());
    }

    @GetMapping("/search")
    public ResponseEntity<VisitorResponse> findByPhone(@RequestParam("phone") String phone) {
        return visitorService.findByPhone(phone)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
