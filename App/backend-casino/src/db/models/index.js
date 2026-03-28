const { User, UserSchema } = require('./user.model');
const { Country, CountrySchema } = require('./country.model');
const { Category, CategorySchema } = require('./category.model');
const { Game, GameSchema } = require('./game.model');
const { UserGame, UserGameSchema } = require('./userGame.model');

function setupModels(sequelize){
    Country.init(CountrySchema, Country.config(sequelize));
    Category.init(CategorySchema, Category.config(sequelize));
    Game.init(GameSchema, Game.config(sequelize));
    User.init(UserSchema, User.config(sequelize));
    UserGame.init(UserGameSchema, UserGame.config(sequelize));
}

module.exports = setupModels