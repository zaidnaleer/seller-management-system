package com.sms.auth.service;

import com.sms.auth.dto.AuthResponseDTO;
import com.sms.auth.dto.LoginRequestDTO;
import com.sms.auth.dto.RegisterRequestDTO;
import com.sms.auth.entity.User;
import com.sms.auth.repository.UserRepository;
import com.sms.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    public AuthResponseDTO register(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalStateException("An account with this email already exists");
        }

        User user = new User();
        user.setEmail(dto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword())); // NEVER store raw password
        user.setRole("SELLER");

        User saved = userRepository.save(user);

        String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole());
        return new AuthResponseDTO(token, saved.getEmail(), saved.getRole());
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            // Deliberately identical error message to the "user not found" case above —
            // never reveal whether the email or the password was the wrong part,
            // since that tells an attacker whether an account exists.
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthResponseDTO(token, user.getEmail(), user.getRole());
    }
}