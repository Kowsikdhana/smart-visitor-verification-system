package com.example.visitor.config;

import com.example.visitor.entity.*;
import com.example.visitor.repository.ResidentRepository;
import com.example.visitor.repository.UserRepository;
import com.example.visitor.repository.VisitRepository;
import com.example.visitor.repository.VisitorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * DataInitializer seeds realistic demonstration data into the MySQL database on startup
 * if tables are empty. This enables immediate testing and dashboard visualization.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ResidentRepository residentRepository;
    private final VisitorRepository visitorRepository;
    private final VisitRepository visitRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ResidentRepository residentRepository,
                           VisitorRepository visitorRepository,
                           VisitRepository visitRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.residentRepository = residentRepository;
        this.visitorRepository = visitorRepository;
        this.visitRepository = visitRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Seed Security Guard user
        if (userRepository.count() == 0) {
            User guard = new User(
                    "guard",
                    passwordEncoder.encode("guard123"),
                    "Chief Gate Security",
                    "ROLE_GUARD"
            );
            userRepository.save(guard);
            System.out.println(">>> Sample User Created: Username 'guard' / Password 'guard123'");
        }

        // 2. Seed Residents
        if (residentRepository.count() == 0) {
            Resident r1 = new Resident("Rahul Kumar", "9876543210", "rahul.kumar@example.com", "A-101", "Tower A", ResidentStatus.ACTIVE);
            Resident r2 = new Resident("Priya Sharma", "9876543211", "priya.sharma@example.com", "B-204", "Tower B", ResidentStatus.ACTIVE);
            Resident r3 = new Resident("Amit Patel", "9876543212", "amit.patel@example.com", "C-302", "Tower C", ResidentStatus.ACTIVE);
            Resident r4 = new Resident("Sneha Reddy", "9876543213", "sneha.reddy@example.com", "A-405", "Tower A", ResidentStatus.ACTIVE);
            Resident r5 = new Resident("Vikram Singh", "9876543214", "vikram.singh@example.com", "B-102", "Tower B", ResidentStatus.ACTIVE);
            Resident r6 = new Resident("Kavita Rao", "9876543215", "kavita.rao@example.com", "D-501", "Tower D", ResidentStatus.INACTIVE);

            residentRepository.save(r1);
            residentRepository.save(r2);
            residentRepository.save(r3);
            residentRepository.save(r4);
            residentRepository.save(r5);
            residentRepository.save(r6);
            System.out.println(">>> Sample Residents Seeded (6 residents across Tower A, B, C, D)");
        }

        // 3. Seed Frequent Delivery Personnel and Visitors
        if (visitorRepository.count() == 0) {
            Visitor v1 = new Visitor("Suresh Kumar", "9123456780", "Amazon", "TN-01-AB-1234");
            Visitor v2 = new Visitor("Ramesh Yadav", "9123456781", "Swiggy", "TN-01-CD-5678");
            Visitor v3 = new Visitor("Deepak Verma", "9123456782", "Urban Company", "TN-01-EF-9012");
            Visitor v4 = new Visitor("Meera Nair", "9123456783", "Personal Guest", "TN-01-GH-3456");

            visitorRepository.save(v1);
            visitorRepository.save(v2);
            visitorRepository.save(v3);
            visitorRepository.save(v4);
            System.out.println(">>> Sample Visitors Seeded (Amazon, Swiggy, Urban Company, Guest)");

            // 4. Seed initial active and completed visits
            if (visitRepository.count() == 0) {
                Resident rahul = residentRepository.findAll().get(0);
                Resident priya = residentRepository.findAll().get(1);

                // Visit 1: Amazon Delivery currently inside
                Visit visit1 = new Visit();
                visit1.setPassCode("VIS-2026-1001");
                visit1.setVisitor(v1);
                visit1.setResident(rahul);
                visit1.setVisitorType(VisitorType.DELIVERY);
                visit1.setPurpose("Package delivery for Flat A-101");
                visit1.setStatus(VisitStatus.CHECKED_IN);
                visit1.setCheckInTime(LocalDateTime.now().minusMinutes(25));
                visit1.setNotes("Carrying 2 parcel boxes");
                visitRepository.save(visit1);

                // Visit 2: Urban Company technician currently inside
                Visit visit2 = new Visit();
                visit2.setPassCode("VIS-2026-1002");
                visit2.setVisitor(v3);
                visit2.setResident(priya);
                visit2.setVisitorType(VisitorType.MAINTENANCE);
                visit2.setPurpose("AC Repair inspection");
                visit2.setStatus(VisitStatus.CHECKED_IN);
                visit2.setCheckInTime(LocalDateTime.now().minusMinutes(50));
                visit2.setNotes("Toolbox verified at gate");
                visitRepository.save(visit2);

                // Visit 3: Swiggy delivery completed earlier today
                Visit visit3 = new Visit();
                visit3.setPassCode("VIS-2026-1003");
                visit3.setVisitor(v2);
                visit3.setResident(rahul);
                visit3.setVisitorType(VisitorType.DELIVERY);
                visit3.setPurpose("Lunch order delivery");
                visit3.setStatus(VisitStatus.CHECKED_OUT);
                visit3.setCheckInTime(LocalDateTime.now().minusHours(3));
                visit3.setCheckOutTime(LocalDateTime.now().minusHours(2).minusMinutes(40));
                visit3.setNotes("Smooth exit");
                visitRepository.save(visit3);

                System.out.println(">>> Sample Visits Seeded (Active inside and Checked-out visits)");
            }
        }
    }
}
