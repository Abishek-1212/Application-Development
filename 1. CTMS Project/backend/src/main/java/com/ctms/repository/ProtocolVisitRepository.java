package com.ctms.repository;

import com.ctms.entity.ProtocolVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProtocolVisitRepository extends JpaRepository<ProtocolVisit, Long> {
    List<ProtocolVisit> findByStudyId(Long studyId);
    List<ProtocolVisit> findByStudyIdAndIsMandatoryTrue(Long studyId);
}
