package com.example.visitor.service;

import com.example.visitor.dto.VisitCreateRequest;
import com.example.visitor.dto.VisitResponse;
import com.example.visitor.entity.*;
import com.example.visitor.exception.BadRequestException;
import com.example.visitor.exception.InvalidStateTransitionException;
import com.example.visitor.repository.ResidentRepository;
import com.example.visitor.repository.VisitRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for VisitService testing critical business rules and state transitions.
 *
 * Concepts explained:
 * - Mockito: Mocks dependencies (Repositories, other services) so we test VisitService in isolation.
 * - @ExtendWith(MockitoExtension.class): Initializes @Mock and @InjectMocks annotations.
 */
@ExtendWith(MockitoExtension.class)
class VisitServiceTest {

    @Mock
    private VisitRepository visitRepository;

    @Mock
    private ResidentRepository residentRepository;

    @Mock
    private VisitorService visitorService;

    @InjectMocks
    private VisitService visitService;

    private Resident activeResident;
    private Resident inactiveResident;
    private Visitor visitor;

    @BeforeEach
    void setUp() {
        activeResident = new Resident("Rahul Kumar", "9876543210", "rahul@test.com", "A-101", "Tower A", ResidentStatus.ACTIVE);
        activeResident.setId(1L);

        inactiveResident = new Resident("Kavita Rao", "9876543215", "kavita@test.com", "D-501", "Tower D", ResidentStatus.INACTIVE);
        inactiveResident.setId(2L);

        visitor = new Visitor("Suresh Kumar", "9123456780", "Amazon", "TN01AB1234");
        visitor.setId(10L);
    }

    @Test
    void testCreateVisit_Success() {
        VisitCreateRequest request = new VisitCreateRequest();
        request.setResidentId(1L);
        request.setVisitorName("Suresh Kumar");
        request.setPhone("9123456780");
        request.setCompany("Amazon");
        request.setPurpose("Package delivery");
        request.setVisitorType(VisitorType.DELIVERY);

        when(residentRepository.findById(1L)).thenReturn(Optional.of(activeResident));
        when(visitorService.getOrCreateVisitor(any(), any(), any(), any())).thenReturn(visitor);
        when(visitRepository.findByPassCode(any())).thenReturn(Optional.empty());

        Visit savedVisit = new Visit();
        savedVisit.setId(100L);
        savedVisit.setPassCode("VIS-20260928-1111");
        savedVisit.setResident(activeResident);
        savedVisit.setVisitor(visitor);
        savedVisit.setPurpose("Package delivery");
        savedVisit.setVisitorType(VisitorType.DELIVERY);
        savedVisit.setStatus(VisitStatus.CHECKED_IN);
        savedVisit.setCheckInTime(LocalDateTime.now());

        when(visitRepository.save(any(Visit.class))).thenReturn(savedVisit);

        VisitResponse response = visitService.createVisit(request);

        assertNotNull(response);
        assertEquals("VIS-20260928-1111", response.getPassCode());
        assertEquals(VisitStatus.CHECKED_IN, response.getStatus());
        assertEquals("Rahul Kumar", response.getResidentName());
        verify(visitRepository, times(1)).save(any(Visit.class));
    }

    @Test
    void testCreateVisit_ThrowsException_WhenResidentIsInactive() {
        VisitCreateRequest request = new VisitCreateRequest();
        request.setResidentId(2L);
        request.setVisitorName("John Doe");
        request.setPhone("9876543210");
        request.setPurpose("Meeting");

        when(residentRepository.findById(2L)).thenReturn(Optional.of(inactiveResident));

        assertThrows(BadRequestException.class, () -> visitService.createVisit(request));
        verify(visitRepository, never()).save(any());
    }

    @Test
    void testCheckOutVisit_ThrowsException_WhenAlreadyCheckedOut() {
        Visit visit = new Visit();
        visit.setId(101L);
        visit.setStatus(VisitStatus.CHECKED_OUT);
        visit.setCheckInTime(LocalDateTime.now().minusHours(2));
        visit.setCheckOutTime(LocalDateTime.now().minusHours(1));

        when(visitRepository.findById(101L)).thenReturn(Optional.of(visit));

        assertThrows(InvalidStateTransitionException.class, () -> visitService.checkOutVisit(101L));
        verify(visitRepository, never()).save(any());
    }
}
