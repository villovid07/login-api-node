'use strict'

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Complejidad', {

        id_complejidad:{
            type:DataTypes.INTEGER,
            allowNull:false,
            primaryKey:true,
        	autoIncrement:true
        },
        nombre_complejidad:{
            type:DataTypes.STRING,
            allowNull:false
        },
        estado:{
            type:DataTypes.CHAR(1),
            allowNull:false
        },
        longitud_minima:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        ctrl_reutilizacion:{
            type:DataTypes.CHAR(1),
            allowNull:false
        },
        factor_reutilizacion:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        ctrl_similitud:{
            type:DataTypes.CHAR(1),
            allowNull:false
        },
        factor_similitud:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        ctrl_caracteres:{
            type:DataTypes.CHAR(1),
            allowNull:false
        },
        requiere_mayus:{
            type:DataTypes.CHAR(1),
            allowNull:false
        },
        requiere_minusculas:{
            type:DataTypes.CHAR(1),
            allowNull:false
        },
        requiere_numeros:{
            type:DataTypes.CHAR(1),
            allowNull:false
        },
        requiere_especiales:{
            type:DataTypes.CHAR(1),
            allowNull:false
        },
        control_vencimiento:{
            type:DataTypes.CHAR(1),
            allowNull:false
        },
        factor_vencimiento:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        ctrl_reintentos_fallidos:{
            type:DataTypes.CHAR(1),
            allowNull:false
        },
        factor_reintentos_fallidos:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
        factor_bloqueo:{
            type:DataTypes.INTEGER,
            allowNull:false
        },
       
    }, {

        tableName: 'complejidad',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public',
        classMethods:
        {
            associate(models) {
                models.Complejidad.hasMany(models.Usuario,{foreignKey: 'id_complejidad'});
            },
        },
    })
}
