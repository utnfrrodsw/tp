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
    static associate(models) {
        this.belongsTo(models.Country, { foreignKey: 'id_country', primaryKey: true });
        this.hasMany(models.Location, { foreignKey: 'id_state, id_country', primaryKey: true  });
    }
}

const StateSchema = {
    id_state:{ 
        allowNull:false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    id_country: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'countries',
            key: 'id_country'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true
    },
    name_state:{
        allowNull: false,
        type: DataTypes.STRING,
        field: "name_state"
    }

    }

module.exports= { State, StateSchema };