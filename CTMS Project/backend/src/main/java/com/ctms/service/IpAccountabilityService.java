package com.ctms.service;

import com.ctms.audit.AuditService;
import com.ctms.dto.ClinicalDTOs.*;
import com.ctms.entity.*;
import com.ctms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IpAccountabilityService {

    private final IpAccountabilityRepository ipRepository;
    private final StudyRepository studyRepository;
    private final SiteRepository siteRepository;
    private final AuditService auditService;

    @Transactional
    public IpAccountability recordReceipt(IpReceiptRequest req, String username) {
        Study study = studyRepository.findById(req.getStudyId())
                .orElseThrow(() -> new IllegalArgumentException("Study not found"));
        Site site = siteRepository.findById(req.getSiteId())
                .orElseThrow(() -> new IllegalArgumentException("Site not found"));

        IpAccountability ip = IpAccountability.builder()
                .study(study)
                .site(site)
                .batchNumber(req.getBatchNumber())
                .kitNumber(req.getKitNumber())
                .quantityReceived(req.getQuantityReceived())
                .currentBalance(req.getQuantityReceived())
                .expiryDate(req.getExpiryDate())
                .build();

        ipRepository.save(ip);
        auditService.log(username, study, "IP_RECEIPT", "IpAccountability",
                ip.getKitNumber(), null, "Received: " + req.getQuantityReceived(), "system");
        return ip;
    }

    @Transactional
    public IpAccountability dispense(IpDispenseRequest req, String username) {
        IpAccountability ip = ipRepository.findById(req.getIpRecordId())
                .orElseThrow(() -> new IllegalArgumentException("IP record not found"));

        if (ip.getCurrentBalance() < req.getQuantity())
            throw new IllegalArgumentException("Insufficient balance — cannot dispense " + req.getQuantity()
                    + ", current balance: " + ip.getCurrentBalance());

        ip.setQuantityDispensed(ip.getQuantityDispensed() + req.getQuantity());
        ip.setCurrentBalance(ip.getQuantityReceived() - ip.getQuantityDispensed()
                - ip.getQuantityReturned() - ip.getQuantityDestroyed());

        ipRepository.save(ip);
        auditService.log(username, ip.getStudy(), "IP_DISPENSE", "IpAccountability",
                ip.getKitNumber(), null, "Dispensed: " + req.getQuantity(), "system");
        return ip;
    }

    public List<IpAccountability> getAccountability(Long studyId) {
        return ipRepository.findByStudyId(studyId);
    }
}
