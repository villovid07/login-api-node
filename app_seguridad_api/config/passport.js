/**
 * @file archivo de configuracion del middleware de passport que permite la autenticacion a traves de base de datos
 * @name passport.js
 * @author David Villota <david.villlota@udenar.edu.co>
 * @license UDENAR
 * @copyright 2018 Udenar
 **/
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var Models = require("../../app_core/models/index");
var Encriptar = require("../../app_core/helpers/encriptacion.js");

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
    async function (usuario, password, done) {

        try{

            var usuario = await Models.Usuario.find({
                attributes:["id_usuario", "estado", "es_super","rol"],
                where:{
                    "clave":Encriptar.encriptar(password),
                    "estado":'A'
                },
                include:[{
                    attributes:["id_persona","num_identificacion"],
                    model: Models.Persona,
                    where:{
                       "num_identificacion": usuario
                    }
                }]
            });
            console.log(usuario);
            if(usuario){
                return done(null, usuario);
            } else {
                return done(null, false, {
                    "mensaje": "Los datos de autenticación no son validos"
                });
            }

        }
        catch(error){
            console.log(error);
            return done(error);
        }
    }
));