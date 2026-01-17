package ma.nextstepest.auth_service.service;

import ma.nextstepest.auth_service.config.TokenUtil;
import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Random;

@Service
public class OtpService {
    private final UserRepository userRepository;


    public OtpService(UserRepository userRepository){
        this.userRepository = userRepository;


    }

    public Integer generateOTP(User user) {
        int otp = new Random().nextInt(900000) + 100000;
        user.setOtp(otp);
        user.setOtpExpiration(new Date(System.currentTimeMillis() + 5 * 60 * 1000));
        userRepository.save(user);
        return otp;
    }

    public boolean validateOTP(User user, Integer otp) {

        if (user.getOtp() == null || user.getOtpExpiration() == null) {
            return false;
        }

        if (user.getOtpExpiration().before(new Date())) {
            return false;
        }

        return user.getOtp().equals(otp);
    }

    public void invalidateOTP(User user) {
        user.setOtp(null);
        user.setOtpExpiration(null);
        String token = TokenUtil.generateToken(24);
        user.setResetToken(token);
        userRepository.save(user);
    }
}
