package ru.kata.spring.boot_security.demo.controllers;



import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import ru.kata.spring.boot_security.demo.servises.RoleService;
import ru.kata.spring.boot_security.demo.servises.UserService;


/**
 * @author Neil Alishev
 */
@Controller
public class UserController {


    private final RoleService roleService;
    private final UserService userService;


    public UserController(RoleService roleService, UserService userService) {
        this.roleService = roleService;
        this.userService = userService;
    }


    @GetMapping("/user")
    public String userPage(Model model) {
        model.addAttribute("users", userService.index());
        model.addAttribute("currentUser", userService.findCurrentUser());
        return "user";
    }



    @GetMapping("/admin")
    public String adminPage(Model model) {
        model.addAttribute("users", userService.index());
        model.addAttribute("listRoles", roleService.index());
        model.addAttribute("currentUser", userService.findCurrentUser());
        return "admin";
    }



    //    @GetMapping("/registration")
//    public String registrationPage(Model model) {
//        model.addAttribute("user", new User());
//        model.addAttribute("listRoles", roleService.index());
//
//        return "registration";
//    }
//
//    @PostMapping("/registration")
//    public String performRegistration(@ModelAttribute("user") @Valid User user, Model model,
//                                        BindingResult bindingResult) {
//        model.addAttribute("listRoles", roleService.index());
//        userValidator.validate(user, bindingResult);
//        if (bindingResult.hasErrors())
//            return "registration";
//        userService.save(user);
//        return "redirect:/login";
//    }

}


