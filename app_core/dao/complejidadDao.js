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


module.exports = {
    darComplejidadById 
}

