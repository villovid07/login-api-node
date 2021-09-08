/*var TipoIdentificacionDao = require("../../app_core/dao/tiposIdentificacionDao");
var Passport = require("passport");
var Respuesta = require("../../app_core/helpers/respuesta");
var Jsonwebtoken = require("jsonwebtoken");

var EmailController= require('../controllers/emailController');

var SeguridadDao = require("../../app_core/dao/seguridadDao");

var seguridadDao = new SeguridadDao();

var TokenRecordarDao = require("../../app_core/dao/tokenRecordarDao");

var Roles = require('../config/roles');


var doLogin = (req, res, next) => {
    Passport.authenticate('local', (err, usuario, info) => {
        if (err) {
            console.log(err);
            Respuesta.sendJsonResponse(res, 500, { "message": "Error en el proceso de autenticación" });
        } else if (usuario) {
            var token = usuario.generateJwt(usuario.Persona.num_identificacion);
            Respuesta.sendJsonResponse(res, 200, { "token": token, "rol": usuario.rol, "es_super": usuario.es_super });
        } else {
            if (info.mensaje) {
                Respuesta.sendJsonResponse(res, 500, { "mensaje": info.mensaje });
            } else {
                Respuesta.sendJsonResponse(res, 500, { "mensaje": "Error en el proceso de autenticación" });
            }
        }

    })(req, res, next);
};


var infoToken = (req) => {

    return new Promise(async (resolve, reject) => {

        try {
            if (req.headers.authorization && req.headers.authorization.search('Bearer ') === 0) {

                var token = req.headers.authorization.split(' ')[1];
                var clave = process.env.JWT_SECRET;
                decodificado = await verificarToken(token, clave);
                resolve(decodificado);

            } else {
                throw { "mensaje": "no se encuentra un token de sesion" };
            }
        } catch (error) {
            reject(error);
        }

    })
}


var verificarToken = (token, clave) => {
    return new Promise((resolve, reject) => {
        Jsonwebtoken.verify(token, clave, function (err, decoded) {
            if (err) {
                reject(err);
            }
            else {
                resolve(decoded);
            }
        });
    })
}


var darInfoUsuario = async (req, res) => {

    try {

        let token = await infoToken(req);
        console.log(token);
        let resultado = await seguridadDao.darInfoByDocumento(token.num_documento);
        Respuesta.sendJsonResponse(res, 200, resultado);

    } catch (error) {
        Respuesta.sendJsonResponse(res, 500, error);
    }
}


var authorization = async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.search('Bearer ') === 0) {

            let token = await infoToken(req);
            let ruta =[req.baseUrl,req.route.path].join("");
            let validar = buscarRolUrl(ruta, token.rol);
            if(validar){
                next();
            } else {
                throw "Autorizacion denegada para el rol"    
            }
        } else {
            throw "Token invalido o inexistente"
        }

    } catch (error) {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }

}


var buscarRolUrl = (ruta, rol)=>{
    let encontrado = Roles.WEB_ROUTES.find (item=> item.ruta== ruta && item.roles.indexOf(rol)>=0);

    if(encontrado){
        return true;
    } 
    return false;
}


/**
 * Funcion que permite traer la informacion de registro del proveedor, para reestablecer la contraseña
 * @param {*} req Objeto de petición
 * @param {*} res Objeto de respuesta
 
 var recordarPass = async (req, res) => {

    try {

        var numero_documento = req.body.numero_documento;
        var usuario = await seguridadDao.recordarPass(numero_documento);
        var correo = await EmailController.enviarCorreoRestablecer(usuario.correo, usuario.token);

        Respuesta.sendJsonResponse(res, 200, { "message": "correo enviado", "correo": usuario.correo });

    }
    catch (error) {
        Respuesta.sendJsonResponse(res, 500, error);
    }
}

const verificarTokenRestablecer = async (req,res)=>{
    try {

        let token =req.body.token;
        let resp =await  seguridadDao.verificarTokenRestablecer( token );
        delete resp["id_usuario"];
        delete resp["id_token_recordar"];
        console.log(resp);
        res.status(200);
        res.json(resp);
    } catch (error) {
        console.log(error);
        let reserr = { 'mensaje': 'Error al realizar el restablecimiento de la contraseña', 'estado': 'error_servidor' };
        if (error.mensaje) {
            reserr = { 'mensaje': error.mensaje, 'estado': error.estado };
        }
        res.status(500);
        res.json(reserr);
    }
}


const restablecerContra = async ( req,res)=>{
    try {
        let token = req.body.token;
        let passwd = req.body.passwd;

        let resp =await  seguridadDao.verificarTokenRestablecer( token );

        if( resp.id_usuario){
            let actualizacion = await seguridadDao.updatePasswd( resp.id_usuario, passwd );
            let actuatoken =await TokenRecordarDao.actualizarToken( resp.id_token_recordar);
            console.log( actualizacion, actuatoken);
            res.status(200);
            res.json(resp);
        } else {
            throw {"mensaje":"No se encuentra un registro del token buscado", "estado": "no_encontrado"};
        }
        
    } catch (error) {
        console.log(error);
        let reserr = { 'mensaje': 'Error al realizar el restablecimiento de la contraseña', 'estado': 'error_servidor' };
        if (error.mensaje) {
            reserr = { 'mensaje': error.mensaje, 'estado': error.estado };
        }
        res.status(500);
        res.json(reserr);
    }
}

const cambiarContra = async (req, res) =>{
    try{
        let token = await infoToken(req);
        let antigua = req.body.antigua;
        let nueva = req.body.nueva;

        console.log (token, antigua, nueva);
        let actualizar = await seguridadDao.cambiarContra(token.user, antigua, nueva);
        res.status(200);
        res.json(actualizar);
    } catch (error) {
        console.log(error);
        let reserr = { 'data': { 'mensaje': 'Error al realizar el restablecimiento de la contraseña', 'estado': 'error_servidor' }, 'code': 'error' };
        if (error.mensaje) {
            reserr = { 'data': { 'mensaje': error.mensaje, 'estado': error.estado }, 'code': 'error' };
        }
        res.status(500);
        res.json(reserr);
    }
}


module.exports = {
    doLogin,
    infoToken,
    darInfoUsuario,
    authorization,
    recordarPass,
    verificarTokenRestablecer,
    restablecerContra,
    cambiarContra
}

*/