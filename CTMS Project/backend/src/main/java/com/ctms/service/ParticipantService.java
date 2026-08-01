package com.ctms.service;

import com.ctms.audit.AuditService;
import com.ctms.dto.ParticipantDTOs.*;
import com.ctms.entity.*;
import com.ctms.exception.DatabaseLockViolationException;
import com.ctms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ParticipantService {

    private final ParticipantRepository participantRepository;
    private final StudyRepository studyRepository;
    private final SiteRepository siteRepository;
    private final AuditService auditService;

    @Transactional
    public ParticipantResponse register(RegisterParticipantRequest req, String username) {
        Study study = studyRepository.findById(req.getStudyId())
                .orElseThrow(() -> new IllegalArgumentException("Study not found"));
        if (study.isDatabaseLocked())
            throw new DatabaseLockViolationException("Cannot enroll — database is locked");

        Site site = siteRepository.findById(req.getSiteId())
                .orElseThrow(() -> new IllegalArgumentException("Site not found"));

        String subjectId = generateSubjectId(study.getId(), site.getId());

        Participant p = Participant.builder()
                .study(study)
                .site(site)
                .subjectId(subjectId)
                .consentDate(req.getConsentDate())
                .consentVersion(req.getConsentVersion())
                .screeningDate(req.getScreeningDate())
                .status(Participant.ParticipantStatus.SCREENING)
                .build();

        participantRepository.save(p);

        // Update actual enrollment count
        study.setActualEnrollment(study.getActualEnrollment() + 1);
        studyRepository.save(study);

        auditService.log(username, study, "REGISTER_PARTICIPANT", "Participant", subjectId, null, "SCREENING", "system");
        return toResponse(p);
    }

    public ParticipantResponse getParticipant(Long id) {
        return toResponse(findById(id));
    }

    public List<ParticipantResponse> getByStudy(Long studyId) {
        return participantRepository.findByStudyId(studyId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public ParticipantResponse updateStatus(Long id, StatusUpdateRequest req, String username) {
        Participant p = findById(id);
        String old = p.getStatus().name();
        p.setStatus(req.getStatus());
        if (req.getStatus() == Participant.ParticipantStatus.WITHDRAWN) {
            p.setWithdrawalDate(LocalDate.now());
            p.setWithdrawalReason(req.getWithdrawalReason());
        }
        if (req.getStatus() == Participant.ParticipantStatus.ENROLLED) {
            p.setEnrollmentDate(LocalDate.now());
        }
        participantRepository.save(p);
        auditService.log(username, p.getStudy(), "UPDATE_PARTICIPANT_STATUS", "Participant",
                p.getSubjectId(), old, req.getStatus().name(), "system");
        return toResponse(p);
    }

    @Transactional
    public ParticipantResponse recordConsent(Long id, ConsentRequest req, String username) {
        Participant p = findById(id);
        p.setConsentVersion(req.getConsentVersion());
        p.setConsentDate(req.getConsentDate());
        participantRepository.save(p);
        auditService.log(username, p.getStudy(), "RECORD_CONSENT", "Participant",
                p.getSubjectId(), null, req.getConsentVersion(), "system");
        return toResponse(p);
    }

    public Participant findById(Long id) {
        return participantRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Participant not found: " + id));
    }

    private String generateSubjectId(Long studyId, Long siteId) {
        // Format: STUDY{studyId}-SITE{siteId}-{random6}
        String random = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return String.format("S%03d-T%03d-%s", studyId, siteId, random);
    }

    public ParticipantResponse toResponse(Participant p) {
        ParticipantResponse r = new ParticipantResponse();
        r.setId(p.getId());
        r.setSubjectId(p.getSubjectId());
        r.setStudyId(p.getStudy().getId());
        r.setStudyTitle(p.getStudy().getStudyTitle());
        r.setSiteId(p.getSite() != null ? p.getSite().getId() : null);
        r.setSiteName(p.getSite() != null ? p.getSite().getSiteName() : null);
        r.setEnrollmentDate(p.getEnrollmentDate());
        r.setStatus(p.getStatus());
        r.setConsentVersion(p.getConsentVersion());
        r.setConsentDate(p.getConsentDate());
        r.setScreeningDate(p.getScreeningDate());
        r.setWithdrawalDate(p.getWithdrawalDate());
        r.setWithdrawalReason(p.getWithdrawalReason());
        r.setCreatedAt(p.getCreatedAt());
        return r;
    }
}
