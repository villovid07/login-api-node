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

var FuncionesAdicionales = require("../../app_core/helpers/funcionesAdicionales");

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
    async function (usuario, password, done) {

        try{

            var autenticado = false;
            var mensajeerror="";
            var userres = await Models.Usuario.find({
                attributes:["id_usuario", "nombre", "apellido", "id_complejidad", "fecha_bloqueo", "fecha_ultimo_login"],
                where:{
                    "username": usuario,
                },
                include:[{
                    attributes:["desc_perfil","pantalla_inicio"],
                    model: Models.Perfil,
                }]
            });

            if(userres){
                
                if(FuncionesAdicionales.validarFechaBloqueo(userres.fecha_bloqueo)){
                    var contra = await Models.Contrasenia.find({
                        where:{
                            estado:'A',
                            password_value:Encriptar.encriptar(password)
                        },
                        raw:true
                    });
    
                    if(contra){
                        autenticado=true;
                    } else{
                        mensajeerror="Contraseña incorrecta";
                    }
                } else {
                    mensajeerror= "Usuario bloqueado hasta "+ FuncionesAdicionales.formatearFecha(userres.fecha_bloqueo, 'S');
                }
                
                
            } else {
                mensajeerror= "Usuario no encontrado";
            }

            if(autenticado){
                return done(null, userres);
            } else {
                return done(null, false, {
                    "id_complejidad": userres? userres.id_complejidad: null,
                    "mensaje": mensajeerror
                });
            }
        }
        catch(error){
            console.log(error);
            return done({"mensaje":error});
        }
    }
));