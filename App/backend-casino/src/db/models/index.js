const { User, UserSchema } = require('./user.model');
const { Country, CountrySchema } = require('./countries.model');
const { State, StateSchema } = require('./state.model');

function setupModels(sequelize){
    User.init(UserSchema, User.config(sequelize));
    Country.init(CountrySchema, Country.config(sequelize));
    State.init(StateSchema, State.config(sequelize));
    

}

module.exports = setupModels