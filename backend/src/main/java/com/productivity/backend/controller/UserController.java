package com.productivity.backend.controller;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.productivity.backend.entity.User;
import com.productivity.backend.repository.UserRepository;
import com.productivity.backend.service.UserService;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

     @Autowired
    private UserRepository userRepository;

    @PostMapping("/update-profile")
public ResponseEntity<?> updateProfile(
    @RequestPart(value = "file", required = false) MultipartFile file,
    @RequestPart("description") String description,
    @RequestPart("email") String email  // 👈 Add this
) {
    try {
        userService.updateUserProfile(email, description, file);
        return ResponseEntity.ok("Profile updated!");
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update failed");
    }
}
@GetMapping("/profile")
public ResponseEntity<?> getProfile(@RequestParam("email") String email) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    Map<String, Object> response = new HashMap<>();
    response.put("description", user.getDescription());
    response.put("profileImage", Base64.getEncoder().encodeToString(user.getProfileImage()));

    return ResponseEntity.ok(response);
}
@GetMapping("/username/{email}")
public String getUsername(@PathVariable("email") String email){
    return userService.getUsername(email);
}


}