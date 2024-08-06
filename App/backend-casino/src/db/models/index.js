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

    Category.hasMany(Game, {foreignKey: 'id_categories'});
    Game.belongsTo(Category, { foreignKey: 'id_categories' });

    Country.hasMany(State, {foreignKey: 'id_country'});
    State.belongsTo(Country, {foreignKey: 'id_country'});

    State.hasMany(Location, {foreignKey: 'id_state'});
    Location.belongsTo(State, {foreignKey: 'id_state'});

    Location.hasMany(User, {foreignKey: 'id_location'});
    User.belongsTo(Location, {foreignKey: 'id_location'});

}

module.exports = setupModels