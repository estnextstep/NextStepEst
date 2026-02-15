package ma.nextstepest.auth_service.dto.Response;


import lombok.Data;

import java.util.Date;


@Data

public class AuthResponse {
    public String token;
    public String role;
    private Date experation;
    private Integer id;
}