module.exports = (sequelize, dataTypes) => {
    const alias = 'Token';
    const cols = {
        idToken: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        token: {
            type: dataTypes.STRING(1000),
            allowNull: false,
        },
    }
    const config = {
        tableName: 'token',
        timestamps: false,
    };
    const Token = sequelize.define(alias, cols, config);
    return Token;
}