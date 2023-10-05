module.exports = (sequelize, dataTypes) => {
    const alias = 'Direccion';
    const cols = {
        idDireccion: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        calle: {
            type: dataTypes.STRING(45),
            allowNull: false,
        },
        numero: {
            type: dataTypes.STRING(10),
            allowNull: false,
        },
        piso: {
            type: dataTypes.STRING(10),
            allowNull: false,
        },
        dpto: {
            type: dataTypes.STRING(45),
            allowNull: false,
        },
        idUsuario: {
            type: dataTypes.INTEGER,
            allowNull: false,
        },
        codPostal: {
            type: dataTypes.INTEGER,
            allowNull: false,
        }
    };

    const config = {
        tableName: 'direccion',
        timestamps: false,
    };

    const Direccion = sequelize.define(alias, cols, config);

    Direccion.associate = function(models){
        Direccion.belongsTo(models.User, {
            as: "fk_direccion_cliente",
            foreignKey: "idUsuario"
        })
        Direccion.belongsTo(models.Localidad, {
            as: "fk_direccion_localidad",
            foreignKey: "codPostal"
        })
    }
};