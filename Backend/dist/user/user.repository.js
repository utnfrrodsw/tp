import { User } from "./user.entity.js";
const users = [
    new User('Tomas Yasparra', "tomas@gmail.com", "01/05/2001", "contrasenia123", 'a02b91bc-3769-4221-beb1-d7a3aeba7dad'),
];
export class UserRepository {
    findAll() {
        return users;
    }
    findOne(item) {
        return users.find((user) => user.id === item.id);
    }
    add(item) {
        users.push(item);
        return item;
    }
    update(item) {
        const userIdx = users.findIndex((user) => user.id === item.id);
        if (userIdx !== -1) {
            users[userIdx] = { ...users[userIdx], ...item };
        }
        return users[userIdx];
    }
    delete(item) {
        const userIdx = users.findIndex((user) => user.id === item.id);
        if (userIdx !== -1) {
            const deletedUsers = users[userIdx];
            users.splice(userIdx, 1);
            return deletedUsers;
        }
    }
}
//# sourceMappingURL=user.repository.js.map