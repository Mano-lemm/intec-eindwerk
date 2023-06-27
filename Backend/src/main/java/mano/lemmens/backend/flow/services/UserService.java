package mano.lemmens.backend.flow.services;

import mano.lemmens.backend.flow.exceptions.UserNameTakenException;
import mano.lemmens.backend.flow.exceptions.UserNotFoundException;
import mano.lemmens.backend.flow.exceptions.UserPasswordAuthenticationException;
import mano.lemmens.backend.flow.mappers.UserMapper;
import mano.lemmens.backend.models.dtos.userDTO.*;
import mano.lemmens.backend.models.entities.User;
import mano.lemmens.backend.models.repositories.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       UserMapper userMapper){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    public PostUserLoginResponse loginAttempt(PostUserLoginRequest req) throws UserNotFoundException, UserPasswordAuthenticationException {
        User user = userRepository.findByName(req.userName()).orElseThrow(UserNotFoundException::new);
        if(!passwordEncoder.matches(req.pwd(), user.getPwdHash())){
            throw new UserPasswordAuthenticationException();
        }
        return userMapper.toLoginResponse(user);
    }

    public PostUserRegisterResponse register(PostUserRegisterRequest req) throws UserNameTakenException {
        User user = userMapper.toEntity(req);
        if(userRepository.existsByName(user.getName())){
            throw new UserNameTakenException();
        }
        user.setPwdHash(passwordEncoder.encode(req.pwd()));
        user = userRepository.save(user);
        return userMapper.toRegisterResponse(user);
    }

    public void update(PatchUserRequest req) throws UserNotFoundException, UserPasswordAuthenticationException {
        User user = userRepository.findById(req.id()).orElseThrow(UserNotFoundException::new);
        if(!passwordEncoder.matches(req.pwd(), user.getPwdHash())){
            throw new UserPasswordAuthenticationException();
        }
        if(req.name() != null) {
            user.setName(req.name());
        }
        if(req.pwd() != null){
            user.setPwdHash(passwordEncoder.encode(req.pwd()));
        }
    }

    public void delete(DeleteUserRequest req) throws UserNotFoundException, UserPasswordAuthenticationException {
        User user = userRepository.findById(req.id()).orElseThrow(UserNotFoundException::new);
        if(!passwordEncoder.matches(req.pwd(), user.getPwdHash())){
            throw new UserPasswordAuthenticationException();
        }
        userRepository.delete(user);
    }
}
