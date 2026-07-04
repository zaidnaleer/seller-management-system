// src/main/java/com/sms/seller/dto/SellerResponseDTO.java
package com.sms.seller.dto;

import com.sms.seller.entity.Seller;
import java.time.Instant;

public class SellerResponseDTO {
    private String id;
    private String businessName;
    private String email;
    private String phoneNumber;
    private String gstNumber;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;

    public static SellerResponseDTO fromEntity(Seller s) {
        SellerResponseDTO dto = new SellerResponseDTO();
        dto.id = s.getId();
        dto.businessName = s.getBusinessName();
        dto.email = s.getEmail();
        dto.phoneNumber = s.getPhoneNumber();
        dto.gstNumber = s.getGstNumber();
        dto.status = s.getStatus();
        dto.createdAt = s.getCreatedAt();
        dto.updatedAt = s.getUpdatedAt();
        return dto;
    }

    public String getId() { return id; }
    public String getBusinessName() { return businessName; }
    public String getEmail() { return email; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getGstNumber() { return gstNumber; }
    public String getStatus() { return status; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}