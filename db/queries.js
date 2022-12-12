const db  =  require('../config/connection');

class Queries {
    constructor(db){
        this.db = db
    }

    getAllDepartments(){
        return this.db.promise().query('SELECT * FROM department;')
    }

    getAllEmployees(){
        return this.db.promise().query('SELECT * FROM employee;')
    }

    getAllRoles(){
        return this.db.promise().query('SELECT * FROM role;')
    }

}

module.exports = new Queries(db)