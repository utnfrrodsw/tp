const { Model, DataTypes, Sequelize } = require('sequelize');

const USERSGAMES_TABLE  = 'usersgames';

class UserGame extends Model{
    static config(sequelize) {
        return{
            sequelize,
            tablename: USERSGAMES_TABLE,
            modelname: 'usersgames',
            timestamps: false
        }
    }
}

const UserGameSchema = {
    id_game:{ 
        allowNull:false,
        type: DataTypes.INTEGER,
        references:{
            model: 'games',
            key: 'id_game'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true,
    },
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id_user'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true
    },
    datePlayed:{
        allowNull: false,
        type: DataTypes.DATE,
        primaryKey: true,
        modelname: 'date_played'
    },
    bet: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    winning: {
        type: DataTypes.FLOAT,
        allowNull: true
    }

    }

module.exports= { UserGame, UserGameSchema };