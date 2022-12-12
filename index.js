const inquirer = require('inquirer');
require('console.table');
const query = require('./db/queries');
require('dotenv').config();

const initialAction = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View all Roles', 'Add role', 'View All Departments', 'Add Department', 'Quit']
        }
    ])
        .then((data) => {
            switch(data) {
                case (data.action === 'View All Employees'):
                    viewEmployees()
                    break;
                case (data.action === 'View All Roles'):
                    viewRoles()
                    break;
                case (data.action === 'View All Departments'):
                    viewDepartments()
                    break;
                case (data.action === 'Add Employee'):
                    addEmployee()
                    break;
                case (data.action === 'Update Employee Role'):
                    updateEmployee()
                    break;
                case (data.action === 'Add Role'):
                    addRole()
                    break;
                case (data.action === 'Add Department'):
                    addDepartment()
                    break;
                default:
                    initialAction()
              }
        })
};

const viewDepartments = () => {
    query.getAllDepartments().then(([data]) => {
        console.table(data)
    }).then(() => initialAction())
}

const viewRoles = () => {
    query.getAllRoles().then(([data]) => {
        console.table(data)
    }).then(() => initialAction())
}

const viewEmployees = () => {
    query.getAllEmployees().then(([data]) => {
        console.table(data)
    }).then(() => initialAction())
}

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name:'name',
            message:"What is the department's name",
        }
    ])
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
        },
        {
            type: 'input',
            name: 'department',
            message: "What department is this role under?"
        }
    ])
}

const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "What is employee's first name?"
        },
        {
            type: 'input',
            name: 'name',
            message: "What is employee's last name?"
        },
        {
            type: 'input',
            name: 'role',
            message: "What is the employee's job title?"
        },
        {
            type: 'input',
            name: 'manager',
            message: "Who is the employee's manager?"
        }
    ])
}

const updateEmployee = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'update',
            message: "What would you like to update?",
            choices:['First Name', 'Last Name', 'Job Title', "Employee's Manager", 'Finished Updating'],
        }
    ])
}

initialAction();