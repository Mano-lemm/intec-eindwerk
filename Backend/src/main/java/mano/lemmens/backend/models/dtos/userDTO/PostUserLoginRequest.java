package mano.lemmens.backend.models.dtos.userDTO;

import lombok.Value;

public record PostUserLoginRequest(String userName, String pwd) {
}
