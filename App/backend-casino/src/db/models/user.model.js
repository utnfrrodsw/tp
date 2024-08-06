const { Model, DataTypes, Sequelize } = require('sequelize');

const USERS_TABLE  = 'users';

class User extends Model{
    static config(sequelize) {
        return{
            sequelize,
            tablename: USERS_TABLE,
            modelname: 'users',
            timestamps: true
        }
    }
    static associate(models) {
        this.belongsToMany(models.Game, {
            through: models.UserGame,
            foreignKey: 'id_user',
            otherKey: 'id_game',
            as: 'games'
        });
        this.belongsTo(models.Location, { foreignKey: 'id_location, id_state, id_country' });
    }
}

const UserSchema = {
    id_user:{
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER 
    },
    username: {
        allownull: false,
        type: DataTypes.STRING
    },
    first_name:{
        allowNull: false,
        type: DataTypes.STRING,
        field:'first_name'
    },
    last_name:{
        allowNull: false,
        type: DataTypes.STRING,
        field: 'last_name'
    },
    birthday:{
        allowNull: false,
        type: DataTypes.DATEONLY,
        field: 'birthday'
    },
    street:{
        allowNull: false,
        type: DataTypes.STRING,
        field: 'street'
    },
    phone:{
        allowNull: false,
        type: DataTypes.STRING,
        field: 'phone'  
    },
    email:{
        allowNull: false,
        type: DataTypes.STRING,
        field: 'email'
    },
    password:{
        allowNull: false,
        type: DataTypes.STRING,
        field: 'password'
    },
    role:{
        allowNull: false,
        type: DataTypes.STRING,
        field: 'role'
    },
    balance: {
        allowNull: true,
        type: DataTypes.DECIMAL,
        field: 'balance'
    },
    id_location: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'locations',
            key: 'id_location'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    id_state: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'locations',
            key: 'id_state'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    id_country: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'locations',
            key: 'id_state'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}

module.exports= { User, UserSchema };