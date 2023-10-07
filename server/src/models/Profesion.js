module.exports = (sequelize, DataTypes) => {
    const Profesion = sequelize.define('Profesion', {
      idProfesion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      nombreProfesion: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    }, {
      tableName: 'profesion',
      timestamps: false,
    });
  
    return Profesion;
  };
  