'use strict'

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Perfil', {

        id_perfil:{
            allowNull: false,
            type:DataTypes.INTEGER,
            primaryKey:true,
        } ,
        desc_perfil:{
            allowNull: false,
            type:DataTypes.STRING,
        },
        pantalla_inicio:{
            allowNull: false,
            type:DataTypes.STRING,
        }
    }, {

        tableName: 'perfil',
        timestamps: false,
        underscored: true,
        freezeTableName: true,
        schema: 'public',
        classMethods:
        {
            associate(models) {
                models.Perfil.hasMany(models.Usuario ,{foreignKey: 'id_perfil'});
            },
        },
    })
}
