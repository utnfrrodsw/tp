const { Model, DataTypes, Sequelize } = require('sequelize');

const USERSGAMES_TABLE  = 'usersgames';

class UserGame extends Model{
    static config(sequelize) {
        return{
            sequelize,
            tablename: USERSGAMES_TABLE,
            modelname: 'usersgames',
            updatedAt: false
        }
    }
}

const UserGameSchema = {
    id_game:{ 
        allowNull:false,
        type: DataTypes.INTEGER,
        references:{
            model: 'Games',
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
            model: 'Users',
            key: 'id_user'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true
    },
    bet: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    winning: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        primaryKey: true
    }

    }

module.exports= { UserGame, UserGameSchema };