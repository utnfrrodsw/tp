module.exports = (sequelize, dataTypes) => {
    const alias = "FotoSolicitud";
    const cols = {
        idfoto: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        foto: {
            type: dataTypes.BLOB,
            allowNull: false,
        },
        nombre: {
            type: dataTypes.STRING(100),
            allowNull: false,
        },
        tipo: {
            type: dataTypes.STRING(45),
            allowNull: false,
        },
        idSolicitud: {
            type: dataTypes.INTEGER,
            allowNull: false,
        }
    };
    const config = {
        tableName: "foto_solicitud",
        timestamps: false,
    };

    const FotoSolicitud = sequelize.define(alias, cols, config);

    FotoSolicitud.associate = function (models) {
        FotoSolicitud.belongsTo(models.Solicitud, {
            as: 'solicitud',
            foreignKey: 'idSolicitud', // Clave foránea en FotoSolicitud
        });
    };

    return FotoSolicitud;
}