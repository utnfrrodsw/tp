const { Model, DataTypes, Sequelize } = require('sequelize');

const USERS_TABLE  = 'users';

class User extends Model{
    static config(sequelize) {
        return{
            sequelize,
            tablename: USERS_TABLE,
            modelname: 'user',
            timestamp: true
        }
    }
}

const UserSchema = {
    id:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER 
    },
    name:{
        allowNull: false,
        type: DataTypes.STRING,
        field:'name'
    },
}

module.exports= { User, UserSchema };