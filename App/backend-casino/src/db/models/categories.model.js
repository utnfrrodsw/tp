const { Model, DataTypes, Sequelize } = require('sequelize');

const CATEGORIES_TABLE  = 'categories';

class Category extends Model{
    static config(sequelize) {
        return{
            sequelize,
            tablename: CATEGORIES_TABLE,
            modelname: 'categories',
            timestamps: false
        }
    }
    static associate(models) {
        this.hasMany(models.Game, { foreignKey: 'id_category'});
    }
    
}

const CategorySchema = {
    id_category:{ 
        allowNull:false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    description:{
        allowNull: false,
        type: DataTypes.STRING,
        field: "description"
    }

    }

module.exports= { Category, CategorySchema };