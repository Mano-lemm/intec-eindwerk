package mano.lemmens.backend.view.controllers;

import mano.lemmens.backend.flow.exceptions.UserNameTakenException;
import mano.lemmens.backend.flow.services.UserService;
import mano.lemmens.backend.models.dtos.userDTO.*;
import org.jetbrains.annotations.Contract;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService service;

    public UserController(UserService service){
        this.service = service;
    }

    // aka read
    @Contract(pure = true)
    @GetMapping("/login")
    public PostUserLoginResponse loginRequest(@RequestParam String name, @RequestParam String pwd){
        PostUserLoginRequest req = new PostUserLoginRequest(name, pwd);
        try {
            return service.loginAttempt(req);
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @Contract(pure = true)
    @GetMapping("/getProjects")
    public GetUserProjects getProjectInfo(@RequestParam Long id){
        try {
	    return service.getUserProjects(id);
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    // aka create
    @Contract(pure = true)
    @PostMapping("/register")
    public PostUserRegisterResponse registerRequest(@RequestBody PostUserRegisterRequest req){
        try {
            return service.register(req);
        } catch (UserNameTakenException e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, String.format("Username %s already taken", req.name()));
        }
    }

    @Contract(pure = true)
    @PatchMapping("/update")
    public void updateRequest(@RequestBody PatchUserRequest req){
        try {
            service.update(req);
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @Contract(pure = true)
    @DeleteMapping("/delete")
    public void deleteRequest(@RequestBody DeleteUserRequest req){
        try {
            service.delete(req);
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }
}
