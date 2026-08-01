package com.ctms.repository;

import com.ctms.entity.ProtocolDeviation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProtocolDeviationRepository extends JpaRepository<ProtocolDeviation, Long> {
    List<ProtocolDeviation> findByStudyId(Long studyId);
    List<ProtocolDeviation> findByParticipantId(Long participantId);
    List<ProtocolDeviation> findByStudyIdAndStatus(Long studyId, ProtocolDeviation.DeviationStatus status);
}
