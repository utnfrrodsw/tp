import crypto from 'node:crypto';
export class Employee {
    constructor(name, email, phoneNum, address, salary, idEmp = crypto.randomUUID()) {
        this.name = name;
        this.email = email;
        this.phoneNum = phoneNum;
        this.address = address;
        this.salary = salary;
        this.idEmp = idEmp;
    }
}
//# sourceMappingURL=employee.entity.js.map