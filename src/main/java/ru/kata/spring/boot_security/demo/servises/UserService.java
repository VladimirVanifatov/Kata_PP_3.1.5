package ru.kata.spring.boot_security.demo.servises;


import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> index();
    User show(int id);
    void save(User user);
    void update(int id, User updatedUser);
    void delete(int id);
    Optional<User> findByName(String name);
    User findById(int id);
    User findCurrentUser();



}
