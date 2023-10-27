create table users (
                       id int primary key auto_increment,
                       name varchar(50),
                       age int,
                       password varchar(200)

);

create table roles (
                       id int primary key  auto_increment,
                       name varchar(50)
);

create table user_role (
                           user_id int,
                           role_id int,
                           FOREIGN KEY (user_id) REFERENCES users(id),
                           FOREIGN KEY (role_id) REFERENCES roles(id)

);


insert into roles(name) values ('ROLE_ADMIN');
insert into roles(name) values ('ROLE_USER');

DELETE FROM user_role;

delete from users where id >77;

delete from users where id = 71;


CREATE TRIGGER before_delete_users
    BEFORE DELETE
    ON users FOR EACH ROW
BEGIN
    delete from user_role where user_id = OLD.id;
end;
