package ma.nextstepest.auth_service.service;


import ma.nextstepest.auth_service.config.TokenUtil;
import ma.nextstepest.auth_service.dto.*;
import ma.nextstepest.auth_service.entity.User;
import ma.nextstepest.auth_service.exception.*;
import ma.nextstepest.auth_service.repository.UserRepository;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final OtpService service;

    public AuthService(UserRepository userRepository,
                       JwtService jwtService,
                       PasswordEncoder passwordEncoder,
                       OtpService service) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.service = service;
    }

    public MessageResponse register(@RequestBody User user) {
        if(userRepository.findByEmail((Object) user.getEmail()).isPresent()){
            throw new EmailExisteException("Email Already exist !");
        }
        if(user.getFirstname() == null || user.getFirstname().isEmpty()){
            throw new BadRequestException("First name can't be null");
        }
        if(user.getLastname()==null || user.getLastname().isEmpty()){
            throw new BadRequestException("lastName can't be null");
        }
        if(user.getEmail()==null|| user.getEmail().isEmpty()){
            throw new BadRequestException("email must be valid");
        }
        if(user.getPassword()==null || user.getPassword().length()<8){
            throw new BadRequestException("password must be more than 8 character");
        }
        String token_validation = TokenUtil.generateToken(36);
        user.setResetToken(token_validation);
        user.setActive(false);
        user.setCreatedAt(java.time.LocalDateTime.now());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setTokenId(UUID.randomUUID().toString());
        user.setUrlImage("/profile_pictures/default_profil.png");
        userRepository.save(user);
        MessageResponse message = new MessageResponse();
        message.setMessage("Registered");
        return message;
    }

    public AuthResponse login(@RequestBody User requestUser) {
        AuthResponse authresponse = new AuthResponse();
        User dbUser = userRepository.findByEmail(requestUser.getEmail());
        if(userRepository.findByEmail((Object) requestUser.getEmail()).isEmpty()){
            throw new UserNotFoundException("you don't have an account,please register");
        }
        if (!dbUser.isActive()){
            throw new AccountNotActiveException("please active your account before login");
        }
        if (passwordEncoder.matches(requestUser.getPassword(), dbUser.getPassword())) {
            String token = jwtService.generateToken(dbUser);
            authresponse.setToken(token);
            authresponse.setRole(dbUser.getRole());
            authresponse.setExperation(jwtService.getExpiration(token));
            return authresponse;
        }else {
            throw new DataInvalidException("Donneés invalid");
        }
    }

    public Object resetPassword(@RequestBody ResetRequest resetRequest){
        Optional<User> optionalUser = userRepository.findByEmail((Object) resetRequest.getEmail());
        if (optionalUser.isEmpty()) {
            throw new UserNotFoundException("you don't have an account, please register");
        }

        User dbUser = optionalUser.get();

        MessageResponse message = new MessageResponse();
        if(resetRequest.getOTP() != null){
            boolean valid = service.validateOTP(dbUser,resetRequest.getOTP());
            if (valid){
                service.invalidateOTP(dbUser);
                ResetResponse success = new ResetResponse();
                success.setReset_token(dbUser.getResetToken());
                success.setUser_id(dbUser.getId());
                return success;
            }else{
                message.setSuccess(false);
                message.setMessage("your otp is expired or wrong");
                return message;
            }
        } else {
            Integer otp = service.generateOTP(dbUser);
            message.setMessage("an otp have been send to you , " + otp);
            return message;
        }
    }

    public MessageResponse changePassword(@RequestBody ChangeRequest changeRequest){
        MessageResponse messageResponse = new MessageResponse();
        Optional<User> OptionalUser = userRepository.findById(changeRequest.getUser_id());
        if (OptionalUser.isEmpty()) {
            throw new UserNotFoundException("you don't have an account, please register");
        }else {
            User dbUser = OptionalUser.get();
            if (dbUser.getResetToken().equals(changeRequest.getReset_token())){
                if (changeRequest.getNew_password().equals(changeRequest.getConfirm_password())){
                    dbUser.setPassword(passwordEncoder.encode(changeRequest.getNew_password()));
                    dbUser.setResetToken(null);
                    userRepository.save(dbUser);
                    messageResponse.setMessage("Password have been changed");
                    return messageResponse;
                }else {
                    throw new PasswordNotMuchException("Password Not Mush To password confirmation");
                }
            }else {
                throw new TokenInvalidException("Token Invalid Exception");
            }
        }
    }

    public MessageResponse active(String token,Integer id){
        MessageResponse messageResponse = new MessageResponse();
        Optional<User> OptionalUser = userRepository.findById(id);
        if (OptionalUser.isEmpty()) {
            throw new UserNotFoundException("User Not Found");
        }
        User user = OptionalUser.get();
        if (Objects.equals(user.getId(), id) && user.getResetToken().equals(token)){
            user.setActive(true);
            user.setResetToken(null);
            userRepository.save(user);
            messageResponse.setMessage("your account have been activated");
            return messageResponse;
        }else {
            throw new ValidationException("an error during the activation");
        }
    }

    public MessageResponse logout(String token){
        MessageResponse message = new MessageResponse();
        String email= SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email);
        user.setTokenId(UUID.randomUUID().toString());
        userRepository.save(user);
        message.setMessage("logout with success");
        return message;
    }

    public UserInfoResponse Getuserinfo(String token){
        String email= SecurityContextHolder.getContext().getAuthentication().getName();
        User user=userRepository.findByEmail(email);
        UserInfoResponse resp=new UserInfoResponse();
        resp.setEmail(user.getEmail());
        resp.setFirstName(user.getFirstname());
        resp.setLastName(user.getLastname());
        resp.setRole(user.getRole());

        return resp;
    }
    public MessageResponse UpdateUserInfor(String firstname, String lastname,
                                           String role,
                                           MultipartFile image) throws IOException {
        String email=SecurityContextHolder.getContext().getAuthentication().getName();
        User user=userRepository.findByEmail(email);
        MessageResponse message=new MessageResponse();
        if(firstname!=null){
            user.setFirstname(firstname);
        }
        if(lastname!=null){
            user.setLastname(lastname);
        }
        user.setRole(role);
        if(image!=null&& !image.isEmpty()){
            String uploadDir="uploads/profile_pictures";
            Path dirPath=Paths.get(uploadDir);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            String filename=System.currentTimeMillis()+"_"+image.getOriginalFilename();
            Path filepath= Paths.get(uploadDir,filename);
            Files.write(filepath,image.getBytes());
            user.setUrlImage("/profile_pictures/" + filename);
        }
    userRepository.save(user);
    message.setMessage("profile updated with success ");
    return message;
    }
}