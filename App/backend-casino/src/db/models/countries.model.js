const { Model, DataTypes, Sequelize } = require('sequelize');

const COUNTRIES_TABLE  = 'countries';

class Country extends Model{
    static config(sequelize) {
        return{
            sequelize,
            tablename: COUNTRIES_TABLE,
            modelname: 'countries',
            timestamp: false
        }
    }
}

const CountrySchema = {
    id_country:{ 
        allowNull:false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name_country:{
        allowNull: false,
        type: DataTypes.STRING,
        field: "name_country"
    }

    }

module.exports= { Country, CountrySchema };