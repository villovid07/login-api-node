
const Respuesta = require("../../app_core/helpers/respuesta");
const FuncionesAdicionales = require("../../app_core/helpers/funcionesAdicionales");
const Encriptacion = require("../../app_core/helpers/encriptacion");
const Constantes = require ("../../app_core/constantes/constantesApp");
const SeguridadDao = require ("../../app_core/dao/seguridadDao");
const UsuarioDao = require("../../app_core/dao/usuarioDao");
const ComplejidadDao = require ("../../app_core/dao/complejidadDao");
const Passport = require("passport");
const { COMPLEJIDAD_DEFAULT } = require("../../app_core/constantes/constantesApp");


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
           Respuesta.sendJsonResponse(res, 500, {"mensaje": error.mensaje, "complejidad": error.id_complejidad, "bloqueado":error.bloqueado});     
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
            throw new Error(`La contraseña no cumple con las condiciones : ${contra.errores}`);
        }    
    } catch (error) {
        Respuesta.sendJsonResponse(res, 500, {"mensaje" : error.message});
    }
    
}


const validarContra = (contrasenia, nivel, id_usuario =null)=>{

   return new Promise (async (resolve, reject )=>{
    try {

        let valoresComplejidad = await ComplejidadDao.darComplejidadById(nivel);
        let validacion = await validarParametroComplejidad( valoresComplejidad, contrasenia, id_usuario);

        console.log(valoresComplejidad);
        resolve ({
            valor: Encriptacion.encriptar(contrasenia), 
            valida: validacion.valida, 
            errores: validacion.arreglo_errores.join(', ')
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


const validarParametroComplejidad = ( complejidad, contrasenia, id_usuario=null)=>{

    return new Promise(async (resolve, reject)=>{
        try {

             let arregloErrores = new Array();

             if(contrasenia.length < complejidad.longitud_minima){
                arregloErrores.push(`Debe tener minimo ${complejidad.longitud_minima} caracteres`);
             }     
             if(complejidad.ctrl_reutilizacion === Constantes.CARACTER_SI){
                //control de reutilizacion 
                if(id_usuario){
                    let resReutilizacion = await SeguridadDao.evaluarReutilizacion(contrasenia, id_usuario, complejidad.factor_reutilizacion);
                    if(!resReutilizacion.valido){
                        arregloErrores.push(resReutilizacion.mensaje);
                    }
                }
             }
             if(complejidad.ctrl_similitud === Constantes.CARACTER_SI){
                //control de similitudes 
                if(id_usuario){
                    let resimilitud = await SeguridadDao.evaluarSimilitud(contrasenia,id_usuario, complejidad.factor_similitud);
                    if(!resimilitud.valido){
                        arregloErrores.push(resimilitud.mensaje);
                    }
                }
             }
             if(complejidad.ctrl_caracteres === Constantes.CARACTER_SI){
                if(complejidad.requiere_mayus == Constantes.CARACTER_SI){
                    let regmayus = new RegExp("^(?=.*[A-Z]).+$");
                    if(!regmayus.test(contrasenia)){
                        arregloErrores.push("Debe tener al menos una letra mayuscula");
                    }
                }

                if(complejidad.requiere_minusculas == Constantes.CARACTER_SI){
                    let regminus = new RegExp("^(?=.*[a-z]).+$");
                    if(!regminus.test(contrasenia)){
                        arregloErrores.push("Debe tener al menos una letra minuscula");
                    }
                }
                
                if(complejidad.requiere_numeros == Constantes.CARACTER_SI){
                    let regnumeros = new RegExp("^(?=.*\\d).+$");
                    if(!regnumeros.test(contrasenia)){
                        arregloErrores.push("Debe tener al menos un numero");
                    }
                }

                if(complejidad.requiere_especiales == Constantes.CARACTER_SI){
                    let regespecial = new RegExp("^(?=.*[-+_!@#$%^&*., ?]).+$");
                    if(!regespecial.test(contrasenia)){
                        arregloErrores.push("Debe tener al menos un caracter especial");
                    }
                }
             }
             
             resolve({
                 "arreglo_errores": arregloErrores,
                 "valida":arregloErrores.length <= 0
             })
        } catch (error) {
            reject(error);
        }

    });

}


const actualizarContrasena = async (req, res)=>{
    try {
        let token = req.body.token;
        let contra = req.body.contrasena;
        let decodificado = await SeguridadDao.verificarToken(token, process.env.JWT_SECRET);
         if(decodificado){
            let contraValida =  await validarContra(contra, decodificado.id_complejidad, decodificado.user);
            if(contraValida.valida){
                 
                let actuacontrasena = await UsuarioDao.actualizarContrasena(contraValida.valor, decodificado.user);
                Respuesta.sendJsonResponse(res,200,{"mensaje": "Registro realizado de manera exitosa"});
                
            } else  {
                throw new Error(`La contraseña no cumple con las condiciones : ${contraValida.errores}`);
            }    


        } else {
            throw new Error("El token enviado no es valido");
        }
    } catch (error) {
        Respuesta.sendJsonResponse(res, 500, { "mensaje": error.message, "error_original": error});   
    }
}


module.exports={
    registro, 
    doLogin, 
    validarNivelBloqueo,
    darInfoUsuario,
    actualizarContrasena
}