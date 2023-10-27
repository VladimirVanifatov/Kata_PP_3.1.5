package ru.kata.spring.boot_security.demo.util;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.servises.RoleService;
import ru.kata.spring.boot_security.demo.servises.RoleServiceImpl;

import java.util.List;

@Component
public class RoleConverter implements Converter<String, Role> {

    private final RoleService roleService;

    @Autowired
    public RoleConverter(RoleService roleService) {
        this.roleService = roleService;
    }

    @Override
    public Role convert(String id) {
        int parseId = Integer.parseInt(id);
        List<Role> listRoles = roleService.index();
        return listRoles.get(parseId-1);
    }
}
