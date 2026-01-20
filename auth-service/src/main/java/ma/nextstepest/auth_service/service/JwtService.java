package ma.nextstepest.auth_service.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import ma.nextstepest.auth_service.entity.User;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET = "SECRET_KEY_123_SECRET_KEY_123_SECRET_KEY_123";

    public SecretKey getKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // Generate JWT
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .setId(user.getTokenId())
                .claim("role", user.getRole())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(getKey())
                .compact();
    }

    // Validate JWT
    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Extract email
    public String extractEmail(String token) {
        Claims claims = Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token).getPayload();
        return claims.getSubject();
    }

    public Date getExpiration(String token) {
        Claims claims = Jwts.parser().verifyWith(getKey()).build().parseSignedClaims(token).getPayload();
        return claims.getExpiration();
    }

}
