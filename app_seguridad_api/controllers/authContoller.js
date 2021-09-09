
const Respuesta = require("../../app_core/helpers/respuesta");
const FuncionesAdicionales = require("../../app_core/helpers/funcionesAdicionales");
const Encriptacion = require("../../app_core/helpers/encriptacion");
const Constantes = require ("../../app_core/constantes/constantesApp");
const SeguridadDao = require ("../../app_core/dao/seguridadDao");
const ComplejidadDao = require ("../../app_core/dao/complejidadDao");
const Passport = require("passport");


const doLogin = (req, res, next) => {
    Passport.authenticate('local', async (err, usuario, info) => {

        var resusuario = null; 
        var error = {};

        if (err) {
            console.log(err);
            error.mensaje = "Error general en el proceso de autenticación";
        } else if (usuario) {
            resusuario = usuario;
        } else {
            if (info.mensaje) {
                error = info;
            } else {
                error = "Error en el proceso de autenticación";
            }
        }

        if( resusuario ){
            var token = resusuario.generateJwt();
            var perfil = resusuario.Perfil.desc_perfil;
            var pantalla_inicio = resusuario.Perfil.pantalla_inicio; 
            await SeguridadDao.actualizarFechaLogin(resusuario.id_usuario)
            Respuesta.sendJsonResponse(res, 200, {"token": token, "perfil": perfil, "pantalla_inicio":pantalla_inicio});

        } else {
           console.log(error); 
           Respuesta.sendJsonResponse(res, 500, {"mensaje": error.mensaje, "complejidad": error.id_complejidad});     
        }

    })(req, res, next);

}



const registro = async (req, res )=>{

    try {
        let usuario={
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            genero:req.body.genero,
            correo:req.body.correo,
            username: req.body.username,
            id_perfil: Constantes.PERFIL_INVITADO,
            id_complejidad: Constantes.COMPLEJIDAD_DEFAULT,
            fecha_creacion: new Date()
        }
    
        let contra = await validarContra ( req.body.contrasenia, Constantes.COMPLEJIDAD_DEFAULT);
    
        if(contra.valida){

            //console 
            let usuarioRes = await SeguridadDao.registroUsuario(usuario, contra.valor);
            console.log(usuarioRes);

            Respuesta.sendJsonResponse(res,200,{"mensaje": "Registro realizado de manera exitosa"});
            
        } else  {
            throw new Error("Contraseña no cumple con las condiciones minimas");
        }    
    } catch (error) {
        Respuesta.sendJsonResponse(res, 500, {"mensaje" : error.message});
    }
    
}


const validarContra = (contrasenia, nivel)=>{

   return new Promise (async (resolve, reject )=>{
    try {

        let valoresComplejidad = await ComplejidadDao.darComplejidadById(nivel); 
        console.log(valoresComplejidad);
        resolve ({
            valor: Encriptacion.encriptar(contrasenia), 
            valida: true
        })
        
    } catch (error) {
        reject({"mensaje": "Error al consultar los datos de validación", "error_original": error.message})
    }

   });
}

const validarNivelBloqueo = async (req, res) =>{
    try {
        let username = req.body.username;
        let id_complejidad  = req.body.id_complejidad;
        let intentos = req.body.intentos;

        let valoresComplejidad = await ComplejidadDao.darComplejidadById(id_complejidad);
        if(valoresComplejidad.ctrl_reintentos_fallidos ==Constantes.CARACTER_SI){

            if(parseInt(intentos) >= parseInt(valoresComplejidad.factor_reintentos_fallidos)){
                let bloqueado = await SeguridadDao.bloquearUsuario(username,valoresComplejidad.factor_bloqueo);
                Respuesta.sendJsonResponse( res, 200, {"mensaje": bloqueado.mensaje, "bloqueado":true});

            } else {
                Respuesta.sendJsonResponse(res, 200, {"mensaje":`Tiene aun ${valoresComplejidad.factor_reintentos_fallidos - intentos } intentos, de lo contrario su cuenta sera bloqueada`, "bloqueado":false});    
            }

        }else {
            Respuesta.sendJsonResponse(res, 200, {"mensaje":"No existe control de reintentos", "bloqueado":false});
        }    
    } catch (error) {
        Respuesta.sendJsonResponse(res, 500, {"mensaje": "Existe un problema en el servicio", "error_original": error})
    }
    
}


const darInfoUsuario = async (req, res)=>{
    try {
        let token = req.body.token;
        let datos = await SeguridadDao.darInfoToken(token);
        Respuesta.sendJsonResponse(res, 200, datos);
    } catch (error) {
        Respuesta.sendJsonResponse(res, 500, {"mensaje": "El usuario no se encuentra autenticado", "error_original": error});   
    }
}


module.exports={
    registro, 
    doLogin, 
    validarNivelBloqueo,
    darInfoUsuario
}