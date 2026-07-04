// src/main/java/com/sms/seller/dto/SellerRequestDTO.java
package com.sms.seller.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class SellerRequestDTO {

    @NotBlank(message = "businessName is required")
    private String businessName;

    @NotBlank @Email(message = "valid email is required")
    private String email;

    private String phoneNumber;
    private String gstNumber;

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getGstNumber() { return gstNumber; }
    public void setGstNumber(String gstNumber) { this.gstNumber = gstNumber; }
}