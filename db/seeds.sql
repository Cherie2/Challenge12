INSERT INTO department(name)
values("Education"),
      ("Information Technology"),
      ("Marketing"),
      ("Finance"),
      ("Human Resources");

INSERT INTO role(title, salary, department_id)
VALUES("Instructor", 90000, 1),
      ("Instructor Assistant", 40000, 1),
      ("Administrator", 140000, 1),
      ("Software Engineer", 85000, 2),
      ("Senior Software Engineer", 130000, 2),
      ("Project Manager", 120000, 2),
      ("Human Resource Representative", 70000, 5),
      ("Human Resources Manager", 150000, 5),
      ("Financial Advisor", 100000, 4),
      ("Chief of Financial Operations", 1000000, 4),
      ("Sales Specialist", 75000, 3),
      ("Sales Manager", 110000, 3);


INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES("TOM", "CLANCY", 3 NULL),
      ("JILL", "OPPENHEIMER", 2, 1),
      ("MIKE", "PILL", 1, 1),
      ("SHANE", "GARCIA", 4, 6),
      ("TERRELL", "JOHNSON", 8, NULL),
      ("CLAIRE", "STAR", 6, NULL),
      ("TODD", "STEWART", 9, 8 ),
      ("JANICE", "THOMAS", 12, NULL),
      ("BICHRAM", "KALID", 10, NULL),
      ("SUSAN","STYLE", 5, 6),
      ("JACOB", "WALLACE", 11, 8),
      ("SANDRA", "ALLEN", 7, 5);