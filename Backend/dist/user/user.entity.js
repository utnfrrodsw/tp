import crypto from "node:crypto";
export class User {
    constructor(name, email, birthdate, pass, id = crypto.randomUUID()) {
        this.name = name;
        this.email = email;
        this.birthdate = birthdate;
        this.pass = pass;
        this.id = id;
    }
}
//# sourceMappingURL=user.entity.js.map