const { User, UserSchema } = require('./user.model');
const { Country, CountrySchema } = require('./countries.model');
const { State, StateSchema } = require('./state.model');
const { Location, LocationSchema } = require('./location.model');
const { Category, CategorySchema } = require('./category.model');
const { Game, GameSchema } = require('./game.model');

function setupModels(sequelize){
    User.init(UserSchema, User.config(sequelize));
    Country.init(CountrySchema, Country.config(sequelize));
    State.init(StateSchema, State.config(sequelize));
    Location.init(LocationSchema, Location.config(sequelize));
    Category.init(CategorySchema, Category.config(sequelize));
    Game.init(GameSchema, Game.config(sequelize));

}

module.exports = setupModels