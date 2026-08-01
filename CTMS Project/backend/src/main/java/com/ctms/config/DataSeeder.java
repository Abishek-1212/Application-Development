package com.ctms.config;

import com.ctms.entity.*;
import com.ctms.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudyRepository studyRepository;
    private final SiteRepository siteRepository;
    private final ParticipantRepository participantRepository;
    private final ProtocolVisitRepository protocolVisitRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded — skipping");
            return;
        }

        log.info("Seeding demo data...");

        String pw = passwordEncoder.encode("Demo@1234");

        Users admin = save(user("admin", "admin@ctms.com", pw, Role.ADMIN, null, null));
        Users sponsor = save(user("sponsor", "sponsor@ctms.com", pw, Role.SPONSOR, "PharmaCorp", "GCP-SP-001"));
        Users pi = save(user("pi_user", "pi@ctms.com", pw, Role.PRINCIPAL_INVESTIGATOR, "City Hospital", "GCP-PI-002"));
        Users subInv = save(user("subinv", "subinv@ctms.com", pw, Role.SUB_INVESTIGATOR, "City Hospital", "GCP-SI-003"));
        Users coordinator = save(user("coordinator", "coord@ctms.com", pw, Role.SITE_COORDINATOR, "City Hospital", "GCP-SC-004"));
        Users dataManager = save(user("datamanager", "dm@ctms.com", pw, Role.DATA_MANAGER, "DataCRO", "GCP-DM-005"));
        Users regAffairs = save(user("regaffairs", "reg@ctms.com", pw, Role.REGULATORY_AFFAIRS, "PharmaCorp", "GCP-RA-006"));
        Users participant = save(user("participant1", "participant@ctms.com", pw, Role.PARTICIPANT, null, null));

        // Sample study
        Study study = studyRepository.save(Study.builder()
                .studyTitle("CTMS-DEMO-001: Phase 2 Efficacy Study of XYZ-100 in Type 2 Diabetes")
                .sponsor(sponsor)
                .phase(Study.Phase.PHASE_2)
                .therapeuticArea("Endocrinology")
                .studyStatus(Study.StudyStatus.ACTIVE)
                .protocolVersion("v1.2")
                .targetEnrollment(120)
                .actualEnrollment(3)
                .irbApprovalDate(LocalDate.of(2024, 1, 15))
                .regulatoryApprovalDate(LocalDate.of(2024, 2, 1))
                .firstParticipantIn(LocalDate.of(2024, 3, 1))
                .primaryEndpoint("HbA1c reduction from baseline at 24 weeks")
                .build());

        // Sample site
        Site site = siteRepository.save(Site.builder()
                .study(study)
                .siteName("City Hospital Research Center")
                .siteInvestigator(pi)
                .irbApprovalStatus("APPROVED")
                .address("123 Medical Drive, Research City, RC 10001")
                .contactInfo("research@cityhospital.com | +1-555-0100")
                .build());

        // Sample protocol visits
        protocolVisitRepository.save(ProtocolVisit.builder().study(study).visitName("Screening").visitCode("SCR-01").scheduledDay(-7).windowMinus(3).windowPlus(3).visitType("SCREENING").isMandatory(true).build());
        protocolVisitRepository.save(ProtocolVisit.builder().study(study).visitName("Baseline").visitCode("BL-01").scheduledDay(0).windowMinus(2).windowPlus(2).visitType("BASELINE").isMandatory(true).build());
        protocolVisitRepository.save(ProtocolVisit.builder().study(study).visitName("Week 4").visitCode("W4-01").scheduledDay(28).windowMinus(3).windowPlus(3).visitType("TREATMENT").isMandatory(true).build());
        protocolVisitRepository.save(ProtocolVisit.builder().study(study).visitName("Week 12").visitCode("W12-01").scheduledDay(84).windowMinus(3).windowPlus(3).visitType("TREATMENT").isMandatory(true).build());
        protocolVisitRepository.save(ProtocolVisit.builder().study(study).visitName("End of Study").visitCode("EOS-01").scheduledDay(168).windowMinus(7).windowPlus(7).visitType("CLOSEOUT").isMandatory(true).build());

        // Sample participants
        saveParticipant("S001-T001-AA1B2C", study, site, participant, LocalDate.of(2024, 3, 5));
        saveParticipant("S001-T001-DD3E4F", study, site, null, LocalDate.of(2024, 3, 12));
        saveParticipant("S001-T001-GG5H6I", study, site, null, LocalDate.of(2024, 3, 20));

        log.info("Seeding complete. Demo credentials: all users use password Demo@1234");
        log.info("Roles seeded: admin, sponsor, pi_user, subinv, coordinator, datamanager, regaffairs, participant1");
    }

    private Users user(String username, String email, String pw, Role role, String affiliation, String gcpCert) {
        return Users.builder()
                .username(username)
                .email(email)
                .passwordHash(pw)
                .role(role)
                .institutionalAffiliation(affiliation)
                .gcpCertNumber(gcpCert)
                .gcpExpiryDate(gcpCert != null ? LocalDate.of(2026, 12, 31) : null)
                .isActive(true)
                .passwordChangedAt(LocalDateTime.now())
                .build();
    }

    private Users save(Users u) {
        return userRepository.save(u);
    }

    private void saveParticipant(String subjectId, Study study, Site site, Users user, LocalDate consentDate) {
        participantRepository.save(Participant.builder()
                .study(study)
                .site(site)
                .subjectId(subjectId)
                .user(user)
                .consentDate(consentDate)
                .consentVersion("v1.0")
                .screeningDate(consentDate.minusDays(7))
                .enrollmentDate(consentDate.plusDays(1))
                .status(Participant.ParticipantStatus.ACTIVE)
                .build());
    }
}
