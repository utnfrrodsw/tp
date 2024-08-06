const { Model, DataTypes, Sequelize } = require('sequelize');

const PROVINCES_STABLE  = 'provinces';

class Province extends Model{
    static config(sequelize) {
        return{
            sequelize,
            tablename: PROVINCES_STABLE,
            modelname: 'provinces',
            timestamps: false
        }
    }
    static associate(models) {
        this.belongsTo(models.Country, { foreignKey: 'id_country', primaryKey: true });
        this.hasMany(models.Cities, { foreignKey: 'id_province, id_country', primaryKey: true  });
    }
}

const ProvinceSchema = {
    id_province:{ 
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
        primaryKey: true,
        field: "id_country"
    },
    name:{
        allowNull: false,
        type: DataTypes.STRING,
        field: "name"
    }

    }

module.exports= { Province, ProvinceSchema };