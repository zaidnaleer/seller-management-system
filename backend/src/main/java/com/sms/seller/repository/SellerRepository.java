// src/main/java/com/sms/seller/repository/SellerRepository.java
package com.sms.seller.repository;

import com.sms.seller.entity.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerRepository extends JpaRepository<Seller, String> {
    boolean existsByEmail(String email);
}