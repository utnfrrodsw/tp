const { Model, DataTypes, Sequelize } = require('sequelize');

const STATES_TABLE  = 'states';

class State extends Model{
    static config(sequelize) {
        return{
            sequelize,
            tablename: STATES_TABLE,
            modelname: 'states',
            timestamps: false
        }
    }
}

const StateSchema = {
    id_state:{ 
        allowNull:false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name_state:{
        allowNull: false,
        type: DataTypes.STRING,
        field: "name_state"
    }

    }

module.exports= { State, StateSchema };