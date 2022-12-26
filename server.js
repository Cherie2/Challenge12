const inquirer = require("inquirer");
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
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "QUIT"
        ],
      },
    ])
    .then((answers) => {
      switch (answers.action) {
        case  "View All Employees":
          viewEmployees();
          break;
        case  "View All Roles":
          viewRoles();
          break;
        case  "View All Departments":
          viewDepartments();
          break;
        case  "Add Employee":
          addEmployee();
          break;
        case  "Update Employee Role":
          updateEmployee();
          break;
        case  "Add Role":
          addRole();
          break;
        case  "Add Department":
          addDepartment();
          break;
        default:
          process.exit();
      }
    });
};

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

const addDepartment = () => {
    inquirer.prompt([
        {
          type: 'input',
          name: 'addDept',
          message: "What department do you want to add?",
          validate: deptAdd => {
            if (deptAdd) {
                return true;
            } else {
                console.log('Please enter a department');
                return false;
            }
          }
        }
      ])
        .then(dept => {
        database
          .departmentAddition(dept);
          viewDepartments();
          })
}

const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "What is the job title?"
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the role's salary?"
        }
    ]).then(answer => {
      const params = [answer.role, answer.salary];
    
      // grab dept from department table
      const role = `SELECT name, id FROM department`; 
    
      database.promise().query(role, (err, data) => {
        if (err) throw err; 
    
        const dept = data.map(({ name, id }) => ({ name: name, value: id }));
    
        inquirer.prompt([
        {
          type: 'list', 
          name: 'dept',
          message: "What department is this role in?",
          choices: dept
        }
        ])
          .then(deptChoice => {
            const dept = deptChoice.dept;
            params.push(dept);
    
            const sql = `INSERT INTO role (title, salary, department_id)
                        VALUES (?, ?, ?)`;
    
            database.query(sql, params, (err, result) => {
              if (err) throw err;
              console.log('Added' + answer.role + " to roles!"); 
    
              viewRoles();
            });
          });
        });
      });
    }

// const addEmployee = () => {
//     inquirer.prompt([
//         {
//             type: 'input',
//             name: 'name',
//             message: "What is employee's first name?"
//         },
//         {
//             type: 'input',
//             name: 'name',
//             message: "What is employee's last name?"
//         },
//         {
//             type: 'input',
//             name: 'role',
//             message: "What is the employee's job title?"
//         },
//         {
//             type: 'input',
//             name: 'manager',
//             message: "Who is the employee's manager?"
//         }
//     ]).then(answer => {
//       const params = [answer.fistName, answer.lastName]
  
//       // grab roles from roles table
//       const roleSql = `SELECT role.id, role.title FROM role`;
    
//       connection.promise().query(roleSql, (err, data) => {
//         if (err) throw err; 
        
//         const roles = data.map(({ id, title }) => ({ name: title, value: id }));
  
//         inquirer.prompt([
//               {
//                 type: 'list',
//                 name: 'role',
//                 message: "What is the employee's role?",
//                 choices: roles
//               }
//             ])
//               .then(roleChoice => {
//                 const role = roleChoice.role;
//                 params.push(role);
  
//                 const managerSql = `SELECT * FROM employee`;
  
//                 connection.promise().query(managerSql, (err, data) => {
//                   if (err) throw err;
  
//                   const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));
  
//                   // console.log(managers);
  
//                   inquirer.prompt([
//                     {
//                       type: 'list',
//                       name: 'manager',
//                       message: "Who is the employee's manager?",
//                       choices: managers
//                     }
//                   ])
//                     .then(managerChoice => {
//                       const manager = managerChoice.manager;
//                       params.push(manager);
  
//                       const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
//                       VALUES (?, ?, ?, ?)`;
  
//                       connection.query(sql, params, (err, result) => {
//                       if (err) throw err;
//                       console.log("Employee has been added!")
  
//                       showEmployees();
// }

// const updateEmployee = () => {
//     return inquirer.prompt([
//         {
//             type: 'input',
//             name: 'update',
//             message: "What would you like to update?",
//             choices:['First Name', 'Last Name', 'Role', "Employee's Manager", 'Finished Updating'],
//         }
//     ])
// }

initialAction();

