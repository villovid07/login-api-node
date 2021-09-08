'use strict'

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Usuario', {

        id_usuario:{
            allowNull: false,
            type:DataTypes.INTEGER,
            primaryKey:true,
        	autoIncrement:true
        } ,
        nombre :{
            allowNull: false,
            type:DataTypes.STRING,
        } ,
        apellido:{
            allowNull: false,
            type:DataTypes.STRING,
        } ,
        genero:{
            allowNull: false,
            type:DataTypes.CHAR(1),
        } ,
        correo:{
            allowNull: false,
            type:DataTypes.STRING
        } ,
        username: {
            allowNull: false,
            type:DataTypes.STRING
        } ,
        id_perfil: {
            allowNull:false,
            type:DataTypes.INTEGER
        } ,
        id_complejidad: {
            allowNull: false,
            type:DataTypes.INTEGER
        } ,
        fecha_creacion:{
            allowNull: false,
            type:DataTypes.DATE
        },
        fecha_ultimo_login:{
            allowNull:true,
            type:DataTypes.DATE
        }


    }, {

        tableName: 'usuario',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public',
        classMethods:
        {
            associate(models) {
                models.Usuario.belongsTo(models.Perfil,{foreignKey: 'id_perfil'});
                models.Usuario.belongsTo(models.Complejidad,{foreignKey: 'id_complejidad'});
                models.Usuario.hasMany(models.Contrasenia , { foreignKey: 'id_usuario' });
            },
        },
    })
}
