const inquirer = require("inquirer");
const connection = require("./config/connection");
const { employeeAdd, getAllEmployees } = require("./db/queries");
const database = require("./db/queries");
require("console.table");

function initialAction() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View Employee By Manager",
          "View Employee By Department",
          "Add Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "Delete Employee",
          "View All Roles",
          "Add Role",
          "Delete Role",
          "View All Departments",
          "View Budget of Department",
          "Add Department",
          "Delete Department",
          "QUIT",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case "View All Employees":
          viewEmployees();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "View Employee By Manager":
          viewEmployeeByManager();
          break;
        case "View Employee By Department":
          viewEmployeeByDept();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "Update Employee Manager":
          updateEmployeeManager();
          break;
        case "Delete Employee":
          deleteEmployee();
          break;
        case "Add Role":
          addRole();
          break;
        case "Delete Role":
          deleteRole();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Delete Department":
          deleteDept();
          break;
        case "View Budget of Department":
          viewBudgetByDept();
          break;
        default:
          process.exit();
      }
    });
}

const viewDepartments = () => {
  database
    .getAllDepartments()
    .then(([data]) => {
      console.table(data);
    })
    .then(() => initialAction());
};

const viewRoles = () => {
  database
    .getAllRoles()
    .then(([data]) => {
      console.table(data);
    })
    .then(() => initialAction());
};

const viewEmployees = () => {
  database
    .getAllEmployees()
    .then(([data]) => {
      console.table(data);
    })
    .then(() => initialAction());
};

const viewEmployeeByDept = () => {
  database
    .viewByDept()
    .then(([data]) => {
      console.table(data);
    })
    .then(() => initialAction());
};

const viewEmployeeByManager = () => {
  database
    .viewByManager()
    .then(([data]) => {
      console.table(data);
    })
    .then(() => initialAction());
};

const viewBudgetByDept = () => {
  database
    .viewBudget()
    .then(([data]) => {
      console.table(data);
    })
    .then(() => initialAction());
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDept",
        message: "What department do you want to add?",
        validate: (deptAdd) => {
          if (deptAdd) {
            return true;
          } else {
            console.log("Please enter a department");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      console.log(`Added ${answer.addDept} as a department!`);
      const sql = `INSERT INTO department (name) VALUES (?)`;
      connection.query(sql, answer.addDept);
      viewDepartments();
    });
};

const addRole = () => {
  const departments = [];
  //Gets list of departments including name and id
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    //Makes choices object for prompt question
    res.forEach((dept) => {
      let deptObj = {
        name: dept.name,
        value: dept.id,
      };
      departments.push(deptObj);
    });
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the job title?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the role's salary?",
        },
        {
          type: "list",
          name: "dept",
          message: "What department is this role in?",
          choices: departments,
        },
      ])
      .then((response) => {
        const query = `INSERT INTO role (title, salary, department_id) VALUES (?)`;
        connection.query(
          query,
          [[response.title, response.salary, response.dept]],
          (err, res) => {
            if (err) throw err;
            console.log(`Successfully added ${response.title} as a role!`);
            viewRoles();
          }
        );
      });
  });
};

const addEmployee = () => {
  //Gets list of all employees
  connection.query("SELECT * FROM employee", (err, employee) => {
    if (err) throw err;

    //Possible that employee could have no manager
    const managerChoice = [
      {
        name: "NONE",
        value: 0,
      },
    ];

    employee.map(({ first_name, last_name, manager_id }) => {
      managerChoice.push({
        name: first_name + " " + last_name,
        value: manager_id,
      });
    });

    //Gets all the roles to make list(roleChoice) in prompt
    connection.query("SELECT * FROM role", (err, roles) => {
      if (err) throw err;
      const roleChoice = [];
      roles.map(({ title, id }) => {
        roleChoice.push({
          name: title,
          value: id,
        });
      });

      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "What is employee's first name?",
          },
          {
            type: "input",
            name: "lastName",
            message: "What is employee's last name?",
          },
          {
            type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: roleChoice,
          },
          {
            type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: managerChoice,
          },
        ])
        .then((response) => {
          const query = `INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id) VALUES (?)`;
          //Selection of NONE as manager will result in null value in manager column
          let manager_id = response.manager !==0? response.manager : null;
          connection.query(
            query,
            [
              [
                response.firstName,
                response.lastName,
                response.role,
                manager_id
              ],
            ],
            (err, res) => {
              if (err) throw err;
              console.log(
                `Successfully added ${response.firstName} ${response.lastName} as an employee!`
              );
              viewEmployees();
            }
          );
        });
    });
  });
};

const updateEmployeeRole = () => {
  //empty arrays to create choice lists for prompt
  const employeeChoice = [];
  const roleChoice = [];
  //Gets list of all employees
  connection.query("SELECT * FROM employee", (err, employee) => {
    if (err) throw err;
    employee.map(({ first_name, last_name, id }) => {
      employeeChoice.push({
        name: first_name + " " + last_name,
        value: id,
      });
    });

    //Gets all the roles to make list(roleChoice) in prompt
    connection.query("SELECT * FROM role", (err, roles) => {
      if (err) throw err;
      roles.map(({ title, id }) => {
        roleChoice.push({
          name: title,
          value: id,
        });
      });
      inquirer
        .prompt([
          {
            type: "list",
            name: "id",
            choices: employeeChoice,
            message: "Which employee would you like to update?",
          },
          {
            type: "list",
            name: "role_id",
            choices: roleChoice,
            message: "What is the employee's new role?",
          },
        ])
        .then((response) => {
          const query = `UPDATE employee SET ? WHERE ?? = ?;`;
          connection.query(query, [
            { role_id: response.role_id },
            "id",
            response.id,
          ]);
          console.log("Successfully updated employee's role!");
          viewEmployees();
        });
    });
  });
};

const updateEmployeeManager = () => {
  //Gets list of all employees
  connection.query("SELECT * FROM employee", (err, employee) => {
    if (err) throw err;
    //Array to hold choice lists for employee prompt
    const employeeChoice = [];
    employee.map(({ first_name, last_name, id }) => {
      employeeChoice.push({
        name: first_name + " " + last_name,
        value: id,
      });
    });
    //Array to hold choice list for manager prompt
    //Possible that employee could have no manager
    const managerChoice = [
      {
        name: "NONE",
        value: 0,
      },
    ];
    employee.map(({ first_name, last_name, manager_id }) => {
      managerChoice.push({
        name: first_name + " " + last_name,
        value: manager_id,
      });
    });

    inquirer
      .prompt([
        {
          type: "list",
          name: "id",
          choices: employeeChoice,
          message: "Which employee would you like to update?",
        },
        {
          type: "list",
          name: "manager",
          choices: managerChoice,
          message: "Who is the employee's new manager?",
        },
      ])
      .then((manager) => {
        const query = `UPDATE employee SET ? WHERE id = ?;`;
        let manager_id = manager.manager;
        connection.query(query, [
          { manager_id: manager_id },
          manager.id,
        ]),
          console.log(`Successfully updated employee's manager!`);
        viewEmployees();
      });
    });
};

deleteEmployee = () => {
  //Gets all employees
  connection.query(`SELECT * FROM employee`, (err, employee) => {
    if (err) throw err;

    const employees = employee.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Which employee would you like to delete?",
          choices: employees,
        },
      ])
      .then((employeeChoice) => {
        const employee = employeeChoice.name;
        const sql = `DELETE FROM employee WHERE id = ?`;
        connection.query(sql, employee, (err, result) => {
          if (err) throw err;
          console.log(`Employee Successfully Deleted!`);
          viewEmployees();
        });
      });
  });
};

deleteRole = () => {
  //Gets all roles
  connection.query(`SELECT * FROM role`, (err, role) => {
    if (err) throw err;

    const roles = role.map(({ title, id }) => ({ name: title, value: id }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "role",
          message: "What role do you want to delete?",
          choices: roles,
        },
      ])
      .then((roleChoice) => {
        const role = roleChoice.role;
        const sql = `DELETE FROM role WHERE id = ?`;

        connection.query(sql, role, (err, result) => {
          if (err) throw err;
          console.log("Role Successfully Deleted!");
          viewRoles();
        });
      });
  });
};

deleteDept = () => {
  //Gets all departments
  connection.query(`SELECT * FROM department`, (err, dept) => {
    if (err) throw err;
    const depts = dept.map(({ name, id }) => ({ name: name, value: id }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "dept",
          message: "What department do you want to delete?",
          choices: depts,
        },
      ])
      .then((deptChoice) => {
        const dept = deptChoice.dept;
        const sql = `DELETE FROM department WHERE id = ?`;

        connection.query(sql, dept, (err, result) => {
          if (err) throw err;
          console.log("Department Successfully deleted!");
          viewDepartments();
        });
      });
  });
};

initialAction();
