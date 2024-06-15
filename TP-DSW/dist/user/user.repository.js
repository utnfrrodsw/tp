import { User } from './user.entity.js';
const users = [
    new User('4585666', 'Pepito', 'Juarez', 'pepito@gmail.com', '1234hacker', 48, -1),
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
            Object.assign(users[userIdx], item);
        }
        return users[userIdx];
    }
    delete(item) {
        const userIdx = users.findIndex((user) => user.id === item.id);
        if (userIdx !== -1) {
            const deletedUser = users[userIdx];
            users.splice(userIdx, 1);
            return deletedUser;
        }
    }
}
//# sourceMappingURL=user.repository.js.map