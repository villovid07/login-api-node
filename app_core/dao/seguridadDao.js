const Models=require("../models/index");
const FuncionesAdicionales = require("../helpers/funcionesAdicionales");
const sequelize = Models.sequelize;
const Constantes = require("../constantes/constantesApp");
const moment = require('moment');  
const Jsonwebtoken = require("jsonwebtoken");
const UsuarioDao = require("./usuarioDao");




const registroUsuario = ( datos , contrasenia)=>{
    return new Promise (async (resolve,reject)=>{

        let trans = null;
        try {

            trans = await sequelize.transaction({autocommit:false});
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


const bloquearUsuario  = (username, tiempo)=>{
    return new Promise(async (resolve ,reject)=>{

        let trans = null;
        try {

            trans = await sequelize.transaction({autocommit:false});

            let usuario = await Models.Usuario.find({
                where:{
                    "username": username
                },
                raw:true
            });

            let fechaactual = moment();
            fechaactual.add(tiempo, 'minute');

            let actualizado = await UsuarioDao.actualizarUsuario({"fecha_bloqueo":fechaactual.toDate()},usuario.id_usuario, trans);
            console.log(actualizado);

            await trans.commit();

            resolve ({"mensaje": `Usuario bloqueado por lo siguientes ${tiempo} minutos`});
            
        } catch (error) {
            if(trans){
                await trans.rollback();
            }
            reject ({"mensaje": "Error en el registro del bloqueo", "error_original": error});   
        }
    });
}

const actualizarFechaLogin = (id_usuario)=>{
    return new Promise(async (resolve, reject)=>{
        let trans = null
        try {
            trans = await sequelize.transaction({autocommit:false});
            let actualizacion = await UsuarioDao.actualizarUsuario ({fecha_ultimo_login: new Date()}, id_usuario, trans);
            console.log(actualizacion);
            await trans.commit();
            resolve ({"mensaje":"Actualizada fecha de ultimo login"})
        } catch (error) {
            if(trans){
                await trans.rollback();
            }
            reject(error);
        }
    })
}




const darInfoToken = async (token)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            var datos = await verificarToken(token, process.env.JWT_SECRET);
            resolve({
                "nombre": datos.nombre,
                "fecha_ultimo_login": datos.fecha_ultimo_login 
            })
        } catch (error) {
            reject(error);
        }
    })
}


const verificarToken = (token, clave) => {
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

const findAllPerfil =()=> {
    return Models.Perfil.findAll({
        raw:true
    });
}

module.exports={
    registroUsuario,
    bloquearUsuario, 
    actualizarFechaLogin,
    darInfoToken,
    verificarToken, 
    findAllPerfil
}