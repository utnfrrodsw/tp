const { Model, DataTypes, Sequelize } = require('sequelize');

const CITIES_TABLE  = 'cities';

class City extends Model{
    static config(sequelize) {
        return{
            sequelize,
            tablename: CITIES_TABLE,
            modelname: 'cities',
            timestamps: false
        }
    }
    static associate(models) {
        this.belongsTo(models.Province, { foreignKey: 'id_province, id_country', primaryKey: true });
        this.hasMany(models.User, { foreignKey: 'id_city, id_province, id_country', primaryKey: false  });
    }
}

const CitySchema = {
    id_city:{ 
        allowNull:false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    id_province: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Provinces',
            key: 'id_province'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true,
        field: "id_province"
    },
    id_country: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Provinces',
            key: 'id_country'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        primaryKey: true,
        field: "id_country"
    },
    name:{
        allowNull: false,
        type: DataTypes.STRING,
        field: "name"
    },
    postal_code: {
        allowNull: false,
        type: DataTypes.STRING,
        field: "postal_code"
    }

    }

module.exports= { City, CitySchema };