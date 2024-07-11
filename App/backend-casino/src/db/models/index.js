const { User, UserSchema } = require('./usuario.model');

function setupModels(sequelize){
    User.init(UserSchema, User.config(sequelize));
}

module.exports = setupModels