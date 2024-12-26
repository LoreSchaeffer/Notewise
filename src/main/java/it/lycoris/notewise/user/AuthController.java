package it.lycoris.notewise.user;

import it.lycoris.notewise.jwt.JwtProperties;
import it.lycoris.notewise.jwt.JwtService;
import it.lycoris.notewise.user.rest.AuthRequest;
import it.lycoris.notewise.user.rest.AuthResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Date;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    public AuthController(AuthenticationManager authManager, UserRepository userRepository, JwtService jwtService, JwtProperties jwtProperties) {
        this.authManager = authManager;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request, HttpServletResponse response) {
        if (request == null || request.username() == null || request.password() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        } catch (BadCredentialsException | DisabledException | LockedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Throwable e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        User user = userRepository.findByUsername(request.username()).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();

        user.setLastLogin(new Date());

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        user.setRefreshToken(refreshToken);

        try {
            userRepository.save(user);
        } catch (Throwable ignored) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(jwtProperties.refreshTokenExpiration());
        cookie.setAttribute("SameSite", "None");

        response.addCookie(cookie);

        return ResponseEntity.ok(new AuthResponse(accessToken));
    }

    @GetMapping("/refreshToken")
    public ResponseEntity<AuthResponse> refresh(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        String refreshToken = Arrays.stream(cookies)
                .filter(c -> c.getName().equals("refreshToken"))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);
        if (refreshToken == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        try {
            if (jwtService.isTokenExpired(refreshToken)) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            String username = jwtService.extractSubject(refreshToken);
            if (username == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            User user = userRepository.findByUsername(username).orElse(null);
            if (user == null || !refreshToken.equals(user.getRefreshToken())) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

            String accessToken = jwtService.generateAccessToken(user);
            return ResponseEntity.ok(new AuthResponse(accessToken));
        } catch (Throwable ignored) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return ResponseEntity.status(HttpStatus.NO_CONTENT).build();

        String refreshToken = Arrays.stream(cookies)
                .filter(c -> c.getName().equals("refreshToken"))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);
        if (refreshToken == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        try {
            String username = jwtService.extractSubject(refreshToken);
            if (username == null) return ResponseEntity.status(HttpStatus.NO_CONTENT).build();

            User user = userRepository.findByUsername(username).orElse(null);
            if (user == null || !refreshToken.equals(user.getRefreshToken())) return ResponseEntity.status(HttpStatus.NO_CONTENT).build();

            user.setRefreshToken(null);

            userRepository.save(user);
        } catch (Throwable ignored) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setAttribute("SameSite", "None");

        response.addCookie(cookie);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
