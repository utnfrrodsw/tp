module.exports = (sequelize, DataTypes) => {
    const HistoricoResenia = sequelize.define('HistoricoResenia', {
      idPrestador: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fechaRes: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      resenia: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      tableName: 'historicoresenia',
      timestamps: false,
    });
  
    HistoricoResenia.associate = function (models) {
      // relación con la tabla Usuario
      HistoricoResenia.belongsTo(models.Usuario, {
        foreignKey: {
          name: 'idPrestador',
          allowNull: false,
        },
        targetKey: 'idUsuario',
        as: 'usuario',
      });
    };
  
    return HistoricoResenia;
  };
  