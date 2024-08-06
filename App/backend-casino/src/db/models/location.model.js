const { Model, DataTypes, Sequelize } = require('sequelize');

const LOCATIONS_TABLE  = 'locations';

class Location extends Model{
    static config(sequelize) {
        return{
            sequelize,
            tablename: LOCATIONS_TABLE,
            modelname: 'locations',
            timestamps: false
        }
    }
    static associate(models) {
        this.belongsTo(models.State, { foreignKey: 'id_state, id_country', primaryKey: true });
        this.hasMany(models.User, { foreignKey: 'id_location, id_state, id_country', primaryKey: false  });
    }
}

const LocationSchema = {
    id_location:{ 
        allowNull:false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    id_state: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'states',
            key: 'id_state'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true
    },
    id_country: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'states',
            key: 'id_country'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true
    },
    name_location:{
        allowNull: false,
        type: DataTypes.STRING,
        field: "name_location"
    }

    }

module.exports= { Location, LocationSchema };