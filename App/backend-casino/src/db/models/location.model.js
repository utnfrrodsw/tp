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
}

const LocationSchema = {
    id_location:{ 
        allowNull:false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name_location:{
        allowNull: false,
        type: DataTypes.STRING,
        field: "name_location"
    }

    }

module.exports= { Location, LocationSchema };