const { User, UserSchema } = require('./user.model');
const { Country, CountrySchema } = require('./countries.model');
const { State, StateSchema } = require('./state.model');
const { Location, LocationSchema } = require('./location.model');
const { Category, CategorySchema } = require('./categories.model');
const { Game, GameSchema } = require('./games.model');
const { UserGame, UserGameSchema } = require('./userGame.model');

function setupModels(sequelize){
    Country.init(CountrySchema, Country.config(sequelize));
    State.init(StateSchema, State.config(sequelize));
    Location.init(LocationSchema, Location.config(sequelize));
    Category.init(CategorySchema, Category.config(sequelize));
    Game.init(GameSchema, Game.config(sequelize));
    User.init(UserSchema, User.config(sequelize));
    UserGame.init(UserGameSchema, UserGame.config(sequelize));
}

module.exports = setupModels