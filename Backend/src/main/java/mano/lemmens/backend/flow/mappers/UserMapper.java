package mano.lemmens.backend.flow.mappers;

import mano.lemmens.backend.models.dtos.userDTO.PostUserLoginResponse;
import mano.lemmens.backend.models.dtos.userDTO.PostUserRegisterRequest;
import mano.lemmens.backend.models.dtos.userDTO.PostUserRegisterResponse;
import mano.lemmens.backend.models.entities.User;
import org.springframework.stereotype.Service;

@Service
public class UserMapper {
    public PostUserLoginResponse toLoginResponse(User user) {
        PostUserLoginResponse response = new PostUserLoginResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        return response;
    }

    public PostUserRegisterResponse toRegisterResponse(User user){
        return new PostUserRegisterResponse(user.getId());
    }

    public User toEntity(PostUserRegisterRequest req) {
        User user = new User();
        user.setName(req.name());
        user.setPwdHash(req.pwd());
        return user;
    }
}
