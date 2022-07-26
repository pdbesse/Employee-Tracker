USE employees;

INSERT INTO departments (name)
VALUES ('Upper Management'),
       ('Accounting'),
       ('R&D'),
       ('Sales');


INSERT INTO roles (title, salary, department_id)
VALUES ('President', 5000000, 1),
       ('Accounting Manager', 400000, 2),
       ('Accountant', 200000, 2),
       ('Lead Scientist', 400000, 3),
       ('Scientist', 200000, 3),
       ('Sales Manager', 200000, 4),
       ('Sales', 150000, 4);



INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
       ('Renee', 'Rudolph', 2, NULL),
       ('Morton', 'Furbish', 3, 2),
       ('Fitzroy', 'Benton', 4, NULL),
       ('Jodi', 'Alton', 5, 4),
       ('Augustine', 'Adella', 6, NULL),
       ('Humphrey', 'Connor', 7, 6);