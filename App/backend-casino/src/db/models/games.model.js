const { Model, DataTypes, Sequelize } = require('sequelize');

const GAMES_TABLE  = 'games';

class Game extends Model{
    static config(sequelize) {
        return{
            sequelize,
            tablename: GAMES_TABLE,
            modelname: 'games',
            timestamp: false
        }
    }
}

const GameSchema = {
    id_game:{ 
        allowNull:false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name_game:{
        allowNull: false,
        type: DataTypes.STRING,
        field: "name_game"
    }

    }

module.exports= { Game, GameSchema };