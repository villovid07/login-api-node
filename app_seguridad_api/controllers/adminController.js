const Respuesta = require("../../app_core/helpers/respuesta");
const FuncionesAdicionales = require("../../app_core/helpers/funcionesAdicionales");
const Constantes = require ("../../app_core/constantes/constantesApp");
const ComplejidadDao = require ("../../app_core/dao/complejidadDao");
const SeguridadDao = require ("../../app_core/dao/seguridadDao");
const UsuarioDao = require ("../../app_core/dao/usuarioDao");

const darComplejidades = async (req,res)=>{
    try {

        let complejidades = await ComplejidadDao.darListaComplejidades();
        Respuesta.sendJsonResponse(res,200, complejidades);
        
    } catch (error) {
        Respuesta.sendJsonResponse(res, 200 , {"mensaje":"Error al consultar el servicio", "error_original":error});
    }
}

const actualizarComplejidad = async (req, res)=>{
    try {
        let id = req.params.id_complejidad
        let datos = req.body;
        let actualizada = await ComplejidadDao.actualizarComplejidad(datos, id);
        Respuesta.sendJsonResponse(res, 200, {"mensaje":actualizada.mensaje});
    } catch (error) {
        Respuesta.sendJsonResponse(res, 200 , {"mensaje":"Error en el proceso de actualizacion", "error_original":error});
    }
}


const findAllUsuarios= async (req, res)=>{
    try {

        let token = req.body.token; 
        let decodificado = await SeguridadDao.verificarToken(token, process.env.JWT_SECRET);
        let usuarios = await UsuarioDao.findAllUsuarios(decodificado.user);
        let fmtUsuario = usuarios.map(item =>{
            return {
                'id_usuario':item.id_usuario,
                'nombre':`${item.nombre} ${item.apellido}`,
                'username':item.username,
                'genero': item.genero=='M'?'MASCULINO':'FEMENINO',
                'correo': item.correo,
                'id_perfil':item.id_perfil,
                'id_complejidad':item.id_complejidad,
                'perfil': item.Perfil.desc_perfil,
                'complejidad':item.Complejidad.nombre_complejidad
            }
        })

        Respuesta.sendJsonResponse(res, 200, fmtUsuario);
        
    } catch (error) {
        Respuesta.sendJsonResponse(res, 200 , {"mensaje":"Error en el proceso de actualizacion", "error_original":error});
    }
}


const updateConfigUsuario = async (req,res)=>{
    try {
        let id_usuario = req.params.id_usuario; 
        let datos = req.body; 
        let actualizado = await UsuarioDao.updateUsuario(datos, id_usuario);
        Respuesta.sendJsonResponse(res, 200, {"mensaje": "Registro de usuario actualizado", "mensaje_original": actualizado.mensaje});
    } catch (error) {
        Respuesta.sendJsonResponse(res, 200, {"mensaje":"Error en la actualizacion de la configuracion", "error_original":error});
    }
}

const findAllPerfil = async (req, res)=>{
    try {
        let perfiles = await SeguridadDao.findAllPerfil();
        Respuesta.sendJsonResponse(res,200, perfiles);
    } catch (error) {
        Respuesta.sendJsonResponse(res, 200, {"mensaje":"Error en la actualizacion de la configuracion", "error_original":error});
    }
}

module.exports= {
    darComplejidades,
    actualizarComplejidad,
    findAllUsuarios, 
    updateConfigUsuario, 
    findAllPerfil
}