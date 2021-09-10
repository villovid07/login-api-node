const Models=require("../models/index");
const FuncionesAdicionales = require("../helpers/funcionesAdicionales");
const sequelize = Models.sequelize;
const Constantes = require("../constantes/constantesApp");


const findAllUsuarios = (id_usuario)=>{
    return Models.Usuario.findAll({
        where:{
            id_usuario:{
                $ne: id_usuario
            }
        },
        include:[{
            attributes:['desc_perfil'],
            model: Models.Perfil
        },{
            attributes:['nombre_complejidad'],
            model: Models.Complejidad
        }]
    });
} 

const actualizarUsuario = (datos, id_usuario, trans)=>{
    return new Promise((resolve, reject)=>{
        Models.Usuario.update(datos, {
            where:{
                id_usuario: id_usuario
            },
            transaction: trans
        }).spread((contador, registros )=>{
            resolve( {"mensaje": `usuario ${id_usuario} actualizado exitosamente`});
        }).catch((error)=>{
            reject(error);
        });
    }); 
}

const updateUsuario = (datos, id_usuario)=>{
    return new Promise(async (resolve, reject) => {
        let trans = null; 
        
        try {
            trans = await sequelize.transaction({autocommit:false});
            let act = await actualizarUsuario(datos, id_usuario);
            await trans.commit();
            resolve(act);
        } catch (error) {
            if(trans){
                await trans.rollback();
            }
            reject(error);
        }
    });
}


module.exports= {
    actualizarUsuario,
    findAllUsuarios,
    updateUsuario
}

