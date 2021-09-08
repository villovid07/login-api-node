var Models=require("../models/index");
var FuncionesAdicionales = require("../helpers/funcionesAdicionales");
var sequelize = Models.sequelize;
var Constantes = require("../constantes/constantesApp");


const registroUsuario = ( datos , contrasenia)=>{
    return new Promise (async (resolve,reject)=>{

        let trans = await sequelize.transaction({autocommit:false});
        try {
            let usuario = await Models.Usuario.create ( datos,{ transaction: trans });

            let datosContra  = {
                password_value: contrasenia, 
                estado:Constantes.ESTADO_ACTIVO, 
                fecha_creacion: new Date(),
                id_usuario: usuario.id_usuario
            }

            let contraRes = await Models.Contrasenia.create ( datosContra, {transaction: trans});

            await trans.commit(); 
            resolve( {"mensaje": `usuario registrado con id usuario ${usuario.id_usuario}, y contra ${contraRes.id_password} =${contrasenia}`});

        } catch (error) {
            if(trans){
                await trans.rollback();
            }
            reject ( {"message": "Error al crear el registro en base de datos", "error_original": error.message})
        }
    })

}


module.exports={
    registroUsuario
}