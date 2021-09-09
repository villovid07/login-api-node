'use strict'

var Jwt= require('jsonwebtoken');
var FuncionesAdicionales = require('../helpers/funcionesAdicionales');

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
        }, 
        fecha_bloqueo: {
            allowNull:true,
            type: DataTypes.DATE
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
        instanceMethods: {
			
            generateJwt () {
              
              var idusuario=this.id_usuario;
              var nombre= `${this.nombre} ${this.apellido}`;
              var clave=process.env.JWT_SECRET
              var fechaExpiracion= new Date();
              fechaExpiracion.setDate(fechaExpiracion.getDate()+7)
              return Jwt.sign({
                user:idusuario,
                nombre:nombre,
                fecha_ultimo_login: this.fecha_ultimo_login?FuncionesAdicionales.formatearFecha(this.fecha_ultimo_login, 'S'):FuncionesAdicionales.formatearFecha(new Date(), 'S'),
                exp:parseInt(fechaExpiracion.getTime()/1000),
              }, clave, { algorithm: 'HS256', })
            },
        }
    })
}
