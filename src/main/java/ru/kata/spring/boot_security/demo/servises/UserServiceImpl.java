package ru.kata.spring.boot_security.demo.servises;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;
import ru.kata.spring.boot_security.demo.security.UserDetailsImpl;

import java.util.List;
import java.util.Objects;
import java.util.Optional;


@Service
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<User> index() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User show(int id) {
        return userRepository.findById(id).orElse(null);

    }
    @Transactional
    public void save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void update(int id, User updatedUser) {
        if (Objects.equals(updatedUser.getPassword(), "")) {
            String password = userRepository.findById(id).orElse(null).getPassword();
            updatedUser.setPassword(password);

        } else {
            updatedUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }
        updatedUser.setId(id);
        userRepository.save(updatedUser);

    }

    @Transactional
    public User findCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userRepository.findById(userDetails.getUser().getId()).orElse(null);
    }



    @Transactional
    public void delete(int id) {
        userRepository.deleteById(id);
    }


    @Transactional
    public Optional<User> findByName(String name) {
        return userRepository.findByName(name);
    }

    @Transactional
    public User findById(int id) {
        return userRepository.findById(id).orElse(null);
    }



}
