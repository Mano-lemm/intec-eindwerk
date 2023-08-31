package mano.lemmens.backend.models.dtos.userDTO;

import mano.lemmens.backend.models.dtos.codeDTO.getCodeInfo;

import java.util.List;

public record GetUserProjects(List<getCodeInfo> codeInfo) {
}
