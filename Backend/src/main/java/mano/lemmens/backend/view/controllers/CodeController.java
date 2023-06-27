package mano.lemmens.backend.view.controllers;

import mano.lemmens.backend.flow.services.CodeService;
import mano.lemmens.backend.models.dtos.codeDTO.*;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/code")
public class CodeController {
    private final CodeService codeService;

    public CodeController(CodeService codeService){
        this.codeService = codeService;
    }

    @Contract(pure = true)
    @GetMapping("/get/Id")
    private @NotNull getCodeResponse getCodeWithCodeIdAndPwd(@RequestParam Long id, @RequestParam String pwd){
        try {
            return codeService.getCodeById(id, pwd);
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // TODO: might want a get with userName and codeName but
    @Contract(pure = true)
    @GetMapping("/get/UId")
    private @NotNull getCodeResponse getCodeWithUserIdAndCodeName(
            @RequestParam Long userId,
            @RequestParam String name,
            @RequestParam String pwd){
        try {
            return codeService.getCodeByUIdAndName(userId, name, pwd);
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @Contract(pure = true)
    @PostMapping("/post/new")
    private @NotNull postCodeResponse createNewCode(@RequestBody postCodeRequest req){
        try {
            return codeService.postCode(req);
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @Contract(pure = true)
    @PatchMapping("/patch")
    private @NotNull patchCodeResponse patchCode(@RequestBody patchCodeRequest req){
        try {
            return codeService.patchCode(req);
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @Contract(pure = true)
    @DeleteMapping("/remove")
    private void deleteCode(@RequestBody deleteCodeRequest req){
        try {
            codeService.deleteCode(req);
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }
}
