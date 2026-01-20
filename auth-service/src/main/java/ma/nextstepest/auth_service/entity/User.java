package ma.nextstepest.auth_service.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Entity
@Table(name= "users" )
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String UrlImage;

    private String firstname;
    private String lastname;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String role;

    private boolean active;

    @Column(nullable = false, length = 36)
    private String tokenId;

    private Integer otp;

    private Date otpExpiration;

    private String resetToken;

    private LocalDateTime createdAt;
}
