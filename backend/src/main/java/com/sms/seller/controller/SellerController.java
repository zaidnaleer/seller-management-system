// src/main/java/com/sms/seller/controller/SellerController.java
package com.sms.seller.controller;

import com.sms.seller.dto.SellerRequestDTO;
import com.sms.seller.dto.SellerResponseDTO;
import com.sms.seller.service.SellerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/sellers")
public class SellerController {

    @Autowired
    private SellerService sellerService;

    // POST /sellers  — your existing Create, now behind a normal controller
    @PostMapping
    public ResponseEntity<?> createSeller(@Valid @RequestBody SellerRequestDTO dto) {
        try {
            SellerResponseDTO created = sellerService.createSeller(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        }
    }

    // GET /sellers?page=0&size=20
    @GetMapping
    public ResponseEntity<?> getAllSellers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<SellerResponseDTO> sellers = sellerService.getAllSellers(page, size);
        return ResponseEntity.ok(Map.of("data", sellers, "page", page, "size", size));
    }

    // GET /sellers/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getSellerById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(sellerService.getSellerById(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /sellers/{id}
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSeller(@PathVariable String id, @Valid @RequestBody SellerRequestDTO dto) {
        try {
            return ResponseEntity.ok(sellerService.updateSeller(id, dto));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE /sellers/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSeller(@PathVariable String id) {
        try {
            sellerService.deleteSeller(id);
            return ResponseEntity.noContent().build(); // 204
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }
}