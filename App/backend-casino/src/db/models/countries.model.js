const { Model, DataTypes, Sequelize } = require('sequelize');

const COUNTRIES_TABLE  = 'countries';

class Country extends Model{
    static config(sequelize) {
        return{
            sequelize,
            tablename: COUNTRIES_TABLE,
            modelname: 'countries',
            timestamps: false
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
    iso_country: {
        allowNull: false,
        type: DataTypes.CHAR
    },
    name_country:{
        allowNull: false,
        type: DataTypes.STRING,
        field: "name_country"
    },
    niceName_country:{
        allowNull: false,
        type: DataTypes.STRING,
        field: "nice_name"
    },
    iso3_country: {
        allowNull: true,
        type: DataTypes.CHAR,
        field: "iso3"
    },
    num_code_country: {
        allowNull: true,
        type: DataTypes.INTEGER,
        field: "numcode"
    },
    phone_code_country: {
        allowNull: true,
        type: DataTypes.INTEGER,
        field: "phone_code"
    }

    }

module.exports= { Country, CountrySchema };