package ma.nextstepest.auth_service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import ma.nextstepest.auth_service.service.JwtService;
import ma.nextstepest.auth_service.repository.UserRepository;
import ma.nextstepest.auth_service.entity.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;


@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getServletPath();


        if (path.equals("/auth/login") || path.equals("/auth/register") || path.equals("/auth/reset-password")
                || path.equals("/auth/change-password") || path.startsWith("/auth/activate")
                || path.startsWith("/profile_pictures")|| path.startsWith("/question/all")
                || path.startsWith("/questionInfo")
        ) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String token = header.substring(7).trim();

        if (!jwtService.validateToken(token)) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String email = jwtService.extractEmail(token);
        User user = userRepository.findByEmail(email);

        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        Claims claims = Jwts.parser()
                .verifyWith(jwtService.getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        String tokenId = claims.getId();

        if (!tokenId.equals(user.getTokenId())) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }



        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(user.getEmail(), null, List.of());

        SecurityContextHolder.getContext().setAuthentication(auth);

        filterChain.doFilter(request, response);
    }
}
