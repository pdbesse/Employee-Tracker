USE employee_db;

INSERT INTO department (id, name)
VALUES (1, 'Management'),
       (2, 'Accounting'),
       (3, 'R&D'),
       (4, 'Sales');


INSERT INTO role (id, title, salary, department_id)
VALUES (1, 'President', 250000, 1),
       (2, 'Accountant', 150000, 2),
       (3, 'Scientist', 100000, 3),
       (4, 'Salesperson', 120000, 4);


INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, John, Doe, 1),
       (2, Renee, Rudolph, 2),
       (3, Morton, Furbish, 3),
       (4, Fitzroy, Benton, 4);