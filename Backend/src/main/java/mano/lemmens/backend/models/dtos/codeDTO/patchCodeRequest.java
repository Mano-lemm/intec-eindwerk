package mano.lemmens.backend.models.dtos.codeDTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

public record patchCodeRequest(Long codeId,
         String ownerPwd,
         @JsonIgnoreProperties(ignoreUnknown = true) String name,
         @JsonIgnoreProperties(ignoreUnknown = true) String code) {
}
