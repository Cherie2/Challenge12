const db = require("../config/connection");

class Queries {
  constructor(db) {
    this.db = db;
  }

  getAllDepartments() {
    console.log("Showing all departments!\n");
    return this.db.promise().query("SELECT * FROM department;");
  }

  getAllEmployees() {
    console.log("Showing all employees!\n");
    const sql = `SELECT employee.id, 
                  employee.first_name, 
                  employee.last_name, 
                  role.title, 
                  department.name AS department,
                  role.salary,
                  CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employee
                  LEFT JOIN role ON employee.role_id = role.id
                  LEFT JOIN department ON role.department_id = department.id
                  LEFT JOIN employee manager ON employee.manager_id = manager.id`;

    return this.db.promise().query(sql);
  }

  getAllRoles() {
    console.log("Showing all roles!\n");
    const sql = `SELECT role.id, role.title, department.name AS department
                 FROM role
                 LEFT JOIN department ON role.department_id = department.id`;
    return this.db.promise().query(sql);
  }

  departmentAddition() {
    console.log("Added " + dept + " to departments!");
    const sql = `INSERT INTO department (name) VALUES (?)`;
    return this.db.promise().query(sql, dept);
  }
}

module.exports = new Queries(db);
