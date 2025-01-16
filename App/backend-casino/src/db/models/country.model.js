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
    iso: {
        allowNull: false,
        type: DataTypes.CHAR,
        field: "iso"
    },
    name:{
        allowNull: false,
        type: DataTypes.STRING,
        field: "name"
    },
    nice_name:{
        allowNull: false,
        type: DataTypes.STRING,
        field: "nice_name"
    },
    iso3: {
        allowNull: true,
        type: DataTypes.CHAR,
        field: "iso3"
    },
    num_code: {
        allowNull: true,
        type: DataTypes.INTEGER,
        field: "num_code"
    },
    phone_code: {
        allowNull: true,
        type: DataTypes.INTEGER,
        field: "phone_code"
    }

    }

module.exports= { Country, CountrySchema };