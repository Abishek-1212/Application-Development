package com.ctms.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "protocol_visits")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProtocolVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Study study;

    @Column(nullable = false)
    private String visitName;

    @Column(nullable = false)
    private String visitCode;

    private Integer scheduledDay;
    private Integer windowMinus;
    private Integer windowPlus;
    private String visitType;

    @Column(nullable = false)
    @Builder.Default
    private boolean isMandatory = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
