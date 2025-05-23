package tn.esprit.contractmanegement.Controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.contractmanegement.Entity.User;
import tn.esprit.contractmanegement.Service.UserService;
import tn.esprit.contractmanegement.Dto.RegisterRequest;
import tn.esprit.contractmanegement.Dto.RegisterResponse;
import tn.esprit.contractmanegement.Enumeration.Role;
import tn.esprit.contractmanegement.Exception.UserException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/config")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    Map<String, String> response = new HashMap<>();
    @PutMapping("/disableAccount/{userId}")
    public ResponseEntity<Map<String, String>> disableAccount(@PathVariable Long userId) {
        try {
            Optional<User> user = userService.findById(userId);
            if (user.isPresent()) {
                User existingUser = user.get();
                existingUser.setEnabled(false);
                userService.updateUser(existingUser);
                response.put("message", "Account disabled successfully");
                return ResponseEntity.status(HttpStatus.OK).body(response);
            } else {
                response.put("message", "User Account not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/enableAccount/{userId}")
    public ResponseEntity<Map<String, String>> confirmUser(@PathVariable Long userId) {
        try {
            Optional<User> user = userService.findById(userId);
            if (user.isPresent()) {
                User existingUser = user.get();
                existingUser.setEnabled(true);
                userService.updateUser(existingUser);
                response.put("message", "Account enabled successfully");
                return ResponseEntity.status(HttpStatus.OK).body(response);
            } else {
                response.put("message", "User Account not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    @PostMapping("/registerAdmin")
    public ResponseEntity<RegisterResponse> registerAdmin(@RequestBody RegisterRequest registerRequest) {
        RegisterResponse registerResponse  = new RegisterResponse();
        try {
            userService.registerAccount(registerRequest, Role.ROLE_ADMIN);
            registerResponse.setEmailResponse(registerRequest.getEmail());
            registerResponse.setMessageResponse("Account Created");
            return ResponseEntity.status(HttpStatus.CREATED).body(registerResponse);
        }catch (UserException e) {
            registerResponse.setMessageResponse(e.getMessage());
            registerResponse.setEmailResponse(registerRequest.getEmail());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(registerResponse);
        } catch (Exception e) {
            registerResponse.setMessageResponse("An error occurred while registering user.");
            registerResponse.setEmailResponse(registerRequest.getEmail());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(registerResponse);
        }
    }
    @GetMapping("/getAllUsers")
    public ResponseEntity<?> getAllUsers(){
        try {
            List<User> users = userService.getAllUsers();

            return ResponseEntity.status(HttpStatus.CREATED).body(users);
        }catch (Exception e) {
            String errorMessage = "An error occurred while fetching users.";
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        }
    }

    @GetMapping("/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userService.updateUserById(id, updatedUser);
    }
    @GetMapping("/id/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with ID: " + id);
        }
    }

}