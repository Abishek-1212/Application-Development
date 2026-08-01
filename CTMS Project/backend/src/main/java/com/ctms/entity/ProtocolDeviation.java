package com.ctms.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "protocol_deviations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProtocolDeviation {

    public enum DeviationStatus {
        OPEN, UNDER_REVIEW, RESOLVED, CLOSED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "participant_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Participant participant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Study study;

    @Column(nullable = false)
    private String deviationType;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDate discoveryDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Users reportedBy;

    @Column(columnDefinition = "TEXT")
    private String piAssessment;

    @Column(columnDefinition = "TEXT")
    private String capaDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DeviationStatus status = DeviationStatus.OPEN;

    // Auto-detected flag
    @Column(nullable = false)
    @Builder.Default
    private boolean autoDetected = false;

    // Which eCRF field triggered this deviation
    private String triggerFieldId;
    private String triggerFieldValue;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
