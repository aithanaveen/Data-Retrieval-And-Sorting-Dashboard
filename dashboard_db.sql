CREATE DATABASE dashboard_db;

USE dashboard_db;

CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    department VARCHAR(100),
    join_date DATE
);

INSERT INTO students (name, department, join_date) VALUES
('Naveen', 'CSE', '2023-06-10'),
('Rahul', 'ECE', '2023-07-15'),
('Anjali', 'CSE', '2023-05-20'),
('Kiran', 'MECH', '2023-08-01'),
('Priya', 'ECE', '2023-04-25');
