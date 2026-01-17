package ma.nextstepest.auth_service.service;

import ma.nextstepest.auth_service.entity.User;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Random;

@Service
public class OtpService {

    public Integer generateOTP(User user) {
        int otp = new Random().nextInt(900000) + 100000;
        user.setOtp(otp);
        user.setOtpExpiration(new Date(System.currentTimeMillis() + 5 * 60 * 1000));
        return otp;
    }

    public boolean validateOTP(User user, Integer otp) {
        return user.getOtp().equals(otp)
                && user.getOtpExpiration().after(new Date());
    }

    public void invalidateOTP(User user) {
        user.setOtp(null);
        user.setOtpExpiration(null);
    }
}
