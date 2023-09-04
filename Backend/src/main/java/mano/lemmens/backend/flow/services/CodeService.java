package mano.lemmens.backend.flow.services;

import mano.lemmens.backend.flow.exceptions.CodeDoesNotExistException;
import mano.lemmens.backend.flow.exceptions.UserNotFoundException;
import mano.lemmens.backend.flow.exceptions.UserPasswordAuthenticationException;
import mano.lemmens.backend.flow.mappers.CodeMapper;
import mano.lemmens.backend.models.dtos.codeDTO.*;
import mano.lemmens.backend.models.entities.Code;
import mano.lemmens.backend.models.entities.User;
import mano.lemmens.backend.models.repositories.CodeRepository;
import mano.lemmens.backend.models.repositories.UserRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CodeService {
    private final CodeRepository codeRepository;
    private final UserRepository userRepository;
    private final CodeMapper codeMapper;
    private final BCryptPasswordEncoder encoder;
    private final String pepper;

    public CodeService(CodeRepository codeRepository,
                       UserRepository userRepository,
                       CodeMapper codeMapper,
                       BCryptPasswordEncoder bCryptPasswordEncoder,
                       @Value("${PWD_PEPPER_VERY_SECRET}") String pepper){
        this.codeRepository = codeRepository;
        this.userRepository = userRepository;
        this.pepper = pepper;
        this.codeMapper = codeMapper;
        this.encoder = bCryptPasswordEncoder;
    }

    public @NotNull getCodeResponse getCodeById(Long id, String pwd) throws UserPasswordAuthenticationException, CodeDoesNotExistException {
        Code code = codeRepository.findById(id).orElseThrow(CodeDoesNotExistException::new);
        if(!encoder.matches(pwd, code.getOwner().getPwdHash())){
            throw new UserPasswordAuthenticationException();
        }
        return codeMapper.toGetResponse(code, pwd);
    }

    public getCodeResponse getCodeByUIdAndName(Long userId, String name, String pwd) throws UserNotFoundException, CodeDoesNotExistException, UserPasswordAuthenticationException {
        User owner = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        if(!encoder.matches(pwd, owner.getPwdHash())){
            throw new UserPasswordAuthenticationException();
        }
        Code code = codeRepository.findByOwnerAndName(owner, name).orElseThrow(CodeDoesNotExistException::new);
        return codeMapper.toGetResponse(code, pwd);
    }

    public postCodeResponse postCode(postCodeRequest req) throws UserNotFoundException, UserPasswordAuthenticationException {
        User user = userRepository.findById(req.ownerId()).orElseThrow(UserNotFoundException::new);
        if(!encoder.matches(req.ownerPwd(), user.getPwdHash())){
            throw new UserPasswordAuthenticationException();
        }
        Code code = codeRepository.save(codeMapper.toEntity(req).owner(user));
        return codeMapper.toPostResponse(code);
    }

    public patchCodeResponse patchCode(patchCodeRequest req) throws UserPasswordAuthenticationException, CodeDoesNotExistException {
        Code code = codeRepository.findById(req.codeId()).orElseThrow(CodeDoesNotExistException::new);
        if(!encoder.matches(req.ownerPwd(), code.getOwner().getPwdHash())){
            throw new UserPasswordAuthenticationException();
        }
        Code updated = codeMapper.toEntity(req);
        code.setCodeHash(updated.getCodeHash());
        code.setCodeSalt(updated.getCodeSalt());
        code.setName(updated.getName());
        code.setCodeIv(updated.getCodeIv());
	      code = codeRepository.save(code);
        return codeMapper.toPatchResponse(code);
    }

    public void deleteCode(deleteCodeRequest req) throws CodeDoesNotExistException, UserPasswordAuthenticationException {
        Code code = codeRepository.findById(req.id()).orElseThrow(CodeDoesNotExistException::new);
        if(!encoder.matches(req.pwd(), code.getOwner().getPwdHash())){
            throw new UserPasswordAuthenticationException();
        }
        codeRepository.delete(code);
    }
}
