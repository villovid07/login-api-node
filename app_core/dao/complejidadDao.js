var Models=require("../models/index");
var FuncionesAdicionales = require("../helpers/funcionesAdicionales");
var sequelize = Models.sequelize;
var Constantes = require("../constantes/constantesApp");

const darComplejidadById = (id_complejidad) =>{
    return Models.Complejidad.find ({
        where: {
            id_complejidad: id_complejidad
        }, 
        raw:true
    });
}


const darListaComplejidades = () =>{
    return Models.Complejidad.findAll({
        raw:true
    });
}

const actualizarComplejidad= (datos, id_complejidad)=>{
    return new Promise ((resolve, reject)=>{
        Models.Complejidad.update( datos , {
            where:{
                id_complejidad: id_complejidad
            }
        }).spread((contador , registros )=>{
            resolve({"mensaje": "Registro actualizado exitosamente"});
        }).catch((error)=>{
            reject(error);
        });
    });
}


module.exports = {
    darComplejidadById,
    darListaComplejidades,
    actualizarComplejidad
}

