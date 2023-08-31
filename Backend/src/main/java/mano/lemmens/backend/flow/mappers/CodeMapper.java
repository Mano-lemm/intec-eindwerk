package mano.lemmens.backend.flow.mappers;

import mano.lemmens.backend.flow.utils.securityUtils;
import mano.lemmens.backend.models.dtos.codeDTO.*;
import mano.lemmens.backend.models.dtos.userDTO.GetUserProjects;
import mano.lemmens.backend.models.entities.Code;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CodeMapper {
    private final securityUtils utils;

    public CodeMapper(securityUtils utils){
        this.utils = utils;
    }

    public getCodeResponse toGetResponse(Code code, String pwd) {
        getCodeResponse response = new getCodeResponse();
        response.setCode(code.getCodeHash());
        response.setName(utils.decrypt(code, pwd));
        return response;
    }

    public GetUserProjects toGetUserProjects(List<Code> codes){
        return new GetUserProjects(codes.stream().map(code -> new getCodeInfo(code.getId(), code.getName())).collect(Collectors.toList()));
    }

    public postCodeResponse toPostResponse(Code code){
        postCodeResponse response = new postCodeResponse();
        response.setId(code.getId());
        return response;
    }

    public patchCodeResponse toPatchResponse(Code code){
        patchCodeResponse response = new patchCodeResponse();
        response.setId(code.getId());
        return response;
    }

    public Code toEntity(postCodeRequest req) {
        securityUtils.encryptionResults results = utils.encrypt(req.code(), req.ownerPwd());
        return new Code()
                .name(req.name())
                .code(results.code())
		.salt(results.salt())
                .iv(results.Iv());
    }

    public Code toEntity(patchCodeRequest req) {
        securityUtils.encryptionResults results = utils.encrypt(req.code(), req.ownerPwd());
        return new Code()
                .name(req.name())
                .code(results.code())
                .iv(results.Iv());
    }
}
