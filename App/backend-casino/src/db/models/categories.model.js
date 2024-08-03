const { Model, DataTypes, Sequelize } = require('sequelize');

const CATEGORIES_TABLE  = 'categories';

class Category extends Model{
    static config(sequelize) {
        return{
            sequelize,
            tablename: CATEGORIES_TABLE,
            modelname: 'categories',
            timestamp: false
        }
    }
}

const CategorySchema = {
    id_categories:{ 
        allowNull:false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name_category:{
        allowNull: false,
        type: DataTypes.STRING,
        field: "description_category"
    }

    }

module.exports= { Category, CategorySchema };