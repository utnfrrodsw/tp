import crypto from 'node:crypto';
export class Employee {
    constructor(name, email, phoneNum, address, salary, id = crypto.randomUUID()) {
        this.name = name;
        this.email = email;
        this.phoneNum = phoneNum;
        this.address = address;
        this.salary = salary;
        this.id = id;
    }
}
//# sourceMappingURL=employee.entity.js.map