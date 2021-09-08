
const Respuesta = require("../../app_core/helpers/respuesta");
const FuncionesAdicionales = require("../../app_core/helpers/funcionesAdicionales");
const Encriptacion = require("../../app_core/helpers/encriptacion");
const Constantes = require ("../../app_core/constantes/constantesApp");
const SeguridadDao = require ("../../app_core/dao/seguridadDao");
const ComplejidadDao = require ("../../app_core/dao/complejidadDao");



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


module.exports={
    registro
}