const { Model, DataTypes, Sequelize } = require('sequelize');

const GAMES_TABLE  = 'games';

class Game extends Model{
    static config(sequelize) {
        return{
            sequelize,
            tablename: GAMES_TABLE,
            modelname: 'games',
            timestamps: false
        }
    }
    static associate(models) {
        this.belongsTo(models.Category, { foreignKey: 'id_category'});
        this.belongsToMany(models.User, {
            through: models.UserGame,
            foreignKey: 'id_game',
            otherKey: 'id_user',
            as: 'users'
        });
    }
}

const GameSchema = {
    id_game:{ 
        allowNull:false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name:{
        allowNull: false,
        type: DataTypes.STRING,
        field: "name"
    },
    id_category:{
        allowNull: false,
        type: DataTypes.INTEGER,
        field: "id_category",
        references: {
            model: 'Categories',
            key: 'id_category'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        field: "id_category"
    },
    description: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "description"
    }

    }

module.exports= { Game, GameSchema };