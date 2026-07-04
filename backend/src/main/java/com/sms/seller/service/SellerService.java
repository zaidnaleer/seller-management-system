// src/main/java/com/sms/seller/service/SellerService.java
package com.sms.seller.service;

import com.sms.seller.dto.SellerRequestDTO;
import com.sms.seller.dto.SellerResponseDTO;
import com.sms.seller.entity.Seller;
import com.sms.seller.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class SellerService {

    @Autowired
    private SellerRepository sellerRepository;

    // ---------- CREATE (your existing logic, moved here unchanged) ----------
    public SellerResponseDTO createSeller(SellerRequestDTO dto) {
        if (sellerRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalStateException("A seller with this email already exists");
        }

        Seller seller = new Seller();
        seller.setBusinessName(dto.getBusinessName());
        seller.setEmail(dto.getEmail());
        seller.setPhoneNumber(dto.getPhoneNumber());
        seller.setGstNumber(dto.getGstNumber());

        Seller saved = sellerRepository.save(seller);
        return SellerResponseDTO.fromEntity(saved);
    }

    // ---------- READ ----------
    public SellerResponseDTO getSellerById(String id) {
        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Seller not found: " + id));
        return SellerResponseDTO.fromEntity(seller);
    }

    public List<SellerResponseDTO> getAllSellers(int page, int size) {
        return sellerRepository.findAll(PageRequest.of(page, size))
                .stream()
                .map(SellerResponseDTO::fromEntity)
                .toList();
    }

    // ---------- UPDATE ----------
    public SellerResponseDTO updateSeller(String id, SellerRequestDTO dto) {
        Seller seller = sellerRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Seller not found: " + id));

        // If the email is being changed, make sure it's not colliding with a DIFFERENT seller
        if (!seller.getEmail().equals(dto.getEmail()) && sellerRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalStateException("Another seller already uses this email");
        }

        seller.setBusinessName(dto.getBusinessName());
        seller.setEmail(dto.getEmail());
        seller.setPhoneNumber(dto.getPhoneNumber());
        seller.setGstNumber(dto.getGstNumber());

        Seller saved = sellerRepository.save(seller);
        return SellerResponseDTO.fromEntity(saved);
    }

    // ---------- DELETE ----------
    public void deleteSeller(String id) {
        if (!sellerRepository.existsById(id)) {
            throw new NoSuchElementException("Seller not found: " + id);
        }
        sellerRepository.deleteById(id);
    }
}