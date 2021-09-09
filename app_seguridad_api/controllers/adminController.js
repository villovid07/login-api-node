const Respuesta = require("../../app_core/helpers/respuesta");
const FuncionesAdicionales = require("../../app_core/helpers/funcionesAdicionales");
const Constantes = require ("../../app_core/constantes/constantesApp");
const ComplejidadDao = require ("../../app_core/dao/complejidadDao");

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

module.exports={
    darComplejidades,
    actualizarComplejidad
}