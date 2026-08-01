package com.ctms.service;

import com.ctms.audit.AuditService;
import com.ctms.dto.ClinicalDTOs.*;
import com.ctms.entity.*;
import com.ctms.exception.DatabaseLockViolationException;
import com.ctms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EcrfService {

    private final EcrfDataRepository ecrfDataRepository;
    private final ParticipantRepository participantRepository;
    private final ProtocolVisitRepository visitRepository;
    private final UserRepository userRepository;
    private final StudyRepository studyRepository;
    private final ProtocolDeviationRepository deviationRepository;
    private final AuditService auditService;

    // Protocol range rules: fieldId -> {min, max}
    private static final Map<String, double[]> RANGE_RULES = Map.of(
            "HEART_RATE", new double[]{40, 180},
            "SYSTOLIC_BP", new double[]{70, 200},
            "DIASTOLIC_BP", new double[]{40, 130},
            "TEMPERATURE", new double[]{35.0, 42.0},
            "BMI", new double[]{10.0, 60.0}
    );

    @Transactional
    public EcrfResponse saveEntry(EcrfSaveRequest req, String username) {
        Participant participant = participantRepository.findById(req.getParticipantId())
                .orElseThrow(() -> new IllegalArgumentException("Participant not found"));

        if (participant.getStudy().isDatabaseLocked())
            throw new DatabaseLockViolationException("Database is locked — eCRF entry not allowed");

        ProtocolVisit visit = visitRepository.findById(req.getVisitId())
                .orElseThrow(() -> new IllegalArgumentException("Visit not found"));

        Users user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        EcrfData data = EcrfData.builder()
                .participant(participant)
                .visit(visit)
                .formId(req.getFormId())
                .fieldId(req.getFieldId())
                .fieldValue(req.getFieldValue())
                .enteredBy(user)
                .electronicSignature(req.getElectronicSignature())
                .queryStatus(EcrfData.QueryStatus.NONE)
                .build();

        ecrfDataRepository.save(data);

        // Protocol deviation detection
        checkForDeviation(data, participant, username);

        auditService.log(username, participant.getStudy(), "ECRF_SAVE", "EcrfData",
                String.valueOf(data.getId()), null, req.getFieldValue(), "system");

        return toResponse(data);
    }

    @Transactional
    public EcrfResponse modifyEntry(Long id, EcrfModifyRequest req, String username) {
        EcrfData data = ecrfDataRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("eCRF record not found"));

        if (data.getParticipant().getStudy().isDatabaseLocked())
            throw new DatabaseLockViolationException("Database is locked — modifications not allowed");

        Users modifier = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String oldValue = data.getFieldValue();
        data.setFieldValue(req.getFieldValue());
        data.setModifiedBy(modifier);
        data.setModifiedAt(LocalDateTime.now());
        data.setModificationReason(req.getModificationReason());

        ecrfDataRepository.save(data);
        auditService.log(username, data.getParticipant().getStudy(), "ECRF_MODIFY", "EcrfData",
                String.valueOf(id), oldValue, req.getFieldValue(), "system");

        return toResponse(data);
    }

    public List<EcrfResponse> getForVisit(Long participantId, Long visitId) {
        return ecrfDataRepository.findByParticipantIdAndVisitId(participantId, visitId)
                .stream().map(this::toResponse).toList();
    }

    private void checkForDeviation(EcrfData data, Participant participant, String username) {
        String fieldId = data.getFieldId().toUpperCase();
        if (!RANGE_RULES.containsKey(fieldId)) return;

        try {
            double value = Double.parseDouble(data.getFieldValue());
            double[] range = RANGE_RULES.get(fieldId);
            if (value < range[0] || value > range[1]) {
                ProtocolDeviation deviation = ProtocolDeviation.builder()
                        .participant(participant)
                        .study(participant.getStudy())
                        .deviationType("OUT_OF_RANGE_VALUE")
                        .description(String.format("Field %s value %s is outside protocol range [%.1f, %.1f]",
                                fieldId, data.getFieldValue(), range[0], range[1]))
                        .discoveryDate(LocalDate.now())
                        .reportedBy(data.getEnteredBy())
                        .autoDetected(true)
                        .triggerFieldId(fieldId)
                        .triggerFieldValue(data.getFieldValue())
                        .status(ProtocolDeviation.DeviationStatus.OPEN)
                        .build();
                deviationRepository.save(deviation);
                auditService.log(username, participant.getStudy(), "AUTO_DEVIATION_DETECTED",
                        "ProtocolDeviation", String.valueOf(deviation.getId()), null, deviation.getDescription(), "system");
            }
        } catch (NumberFormatException ignored) {
            // Non-numeric field — skip range check
        }
    }

    public EcrfResponse toResponse(EcrfData d) {
        EcrfResponse r = new EcrfResponse();
        r.setId(d.getId());
        r.setParticipantId(d.getParticipant().getId());
        r.setVisitId(d.getVisit().getId());
        r.setFormId(d.getFormId());
        r.setFieldId(d.getFieldId());
        r.setFieldValue(d.getFieldValue());
        r.setEnteredBy(d.getEnteredBy().getUsername());
        r.setEnteredAt(d.getEnteredAt());
        r.setModifiedBy(d.getModifiedBy() != null ? d.getModifiedBy().getUsername() : null);
        r.setModifiedAt(d.getModifiedAt());
        r.setModificationReason(d.getModificationReason());
        r.setQueryStatus(d.getQueryStatus());
        return r;
    }
}
