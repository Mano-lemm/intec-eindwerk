package mano.lemmens.backend.models.dtos.userDTO;

public record PatchUserRequest(Long id, String name, String pwd) {
}
