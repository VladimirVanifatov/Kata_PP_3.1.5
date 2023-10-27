package ru.kata.spring.boot_security.demo.util;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.servises.UserService;
import ru.kata.spring.boot_security.demo.servises.UserServiceImpl;

import javax.persistence.Column;

@Component
public class UserValidator implements Validator {

    private UserService userService;

    private PasswordEncoder passwordEncoder;

    public UserValidator(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return User.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        User user = (User) target;
        if (userService.findByName(user.getName()).isPresent()) {
            // поле, код ошибки, сообщение ошибки
            errors.rejectValue("name", "", "This name is already in use");

        }


    }
}
