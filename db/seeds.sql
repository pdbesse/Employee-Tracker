USE employees_db;

INSERT INTO departments (name)
VALUES ('Management'),
       ('Accounting'),
       ('R&D'),
       ('Sales');


INSERT INTO roles (title, salary, department_id)
VALUES ('General Manager', 5000000, 1),
       ('Accounting Manager', 400000, 2),
       ('Accountant', 200000, 2),
       ('Lead Scientist', 400000, 3),
       ('Scientist', 200000, 3),
       ('Sales Manager', 200000, 4),
       ('Sales', 150000, 4);



INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('James', 'Baker', 1, NULL),
       ('Renee', 'Rudolph', 2, 1),
       ('Morton', 'Furbish', 3, 2),
       ('Fitzroy', 'Benton', 4, 1),
       ('Jodi', 'Alton', 5, 4),
       ('Augustine', 'Adella', 6, 1),
       ('Humphrey', 'Connor', 7, 6);