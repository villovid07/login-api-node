
const Respuesta = require("../../app_core/helpers/respuesta");
const FuncionesAdicionales = require("../../app_core/helpers/funcionesAdicionales");
const Encriptacion = require("../../app_core/helpers/encriptacion");


const saludar = (req, res )=>{
    Respuesta.sendJsonResponse(res,200,{"mensaje":" que mas pues como te ha ido! "});
};





module.exports ={
    saludar
}




