package ma.nextstepest.auth_service.config;

import java.security.SecureRandom;

public class TokenUtil {

    private static final String CHARACTERS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private static final SecureRandom random = new SecureRandom();

    public static String generateToken(int length) {
        StringBuilder token = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            token.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return token.toString();
    }
}
