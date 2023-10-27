package ru.kata.spring.boot_security.demo.servises;

import ru.kata.spring.boot_security.demo.models.Role;

import java.util.List;

public interface RoleService {

    public List<Role> index();
    public Role show(int id);
}
