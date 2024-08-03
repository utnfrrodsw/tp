const { User, UserSchema } = require('./user.model');
const { Country, CountrySchema } = require('./countries.model');

function setupModels(sequelize){
    User.init(UserSchema, User.config(sequelize));
    Country.init(CountrySchema, Country.config(sequelize));

}

module.exports = setupModels