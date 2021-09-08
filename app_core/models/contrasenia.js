'use strict'

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Contrasenia', {

        id_password:{
            allowNull: false,
            type:DataTypes.INTEGER,
            primaryKey:true,
        	autoIncrement:true
        } ,
        password_value:{
            allowNull: false,
            type:DataTypes.STRING,
        } ,
        estado:{
            allowNull: false,
            type:DataTypes.CHAR(1),
        } ,
        fecha_creacion:{
            allowNull: false,
            type:DataTypes.DATE,
        } ,
        id_usuario:{
            allowNull: false,
            type:DataTypes.INTEGER,
        },

    }, {

        tableName: 'contrasenia',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public',
        classMethods:
        {
            associate(models) {
                models.Contrasenia.belongsTo(models.Usuario , { foreignKey: 'id_usuario' });
            },
        },
    })
}
