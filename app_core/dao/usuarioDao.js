const Models = require("../models/index");
const FuncionesAdicionales = require("../helpers/funcionesAdicionales");
const sequelize = Models.sequelize;
const Constantes = require("../constantes/constantesApp");


const findAllUsuarios = (id_usuario) => {
    return Models.Usuario.findAll({
        where: {
            id_usuario: {
                $ne: id_usuario
            }
        },
        include: [{
            attributes: ['desc_perfil'],
            model: Models.Perfil
        }, {
            attributes: ['nombre_complejidad'],
            model: Models.Complejidad
        }]
    });
}

const actualizarUsuario = (datos, id_usuario, trans) => {
    return new Promise((resolve, reject) => {
        Models.Usuario.update(datos, {
            where: {
                id_usuario: id_usuario
            },
            transaction: trans
        }).spread((contador, registros) => {
            resolve({ "mensaje": `usuario ${id_usuario} actualizado exitosamente` });
        }).catch((error) => {
            reject(error);
        });
    });
}

const updateUsuario = (datos, id_usuario) => {
    return new Promise(async (resolve, reject) => {
        let trans = null;

        try {
            trans = await sequelize.transaction({ autocommit: false });
            let act = await actualizarUsuario(datos, id_usuario);
            await trans.commit();
            resolve(act);
        } catch (error) {
            if (trans) {
                await trans.rollback();
            }
            reject(error);
        }
    });
}


const actualizarContrasena = (contrasena, id_usuario) => {
    return new Promise(async (resolve, reject) => {

        let trans = null;
        try {
            trans = await sequelize.transaction({ autocommit: false });
            let actualizadas = await updateRegistroContraUsuario(id_usuario, trans);
            let creada = await Models.Contrasenia.create ({
                id_usuario: id_usuario,
                password_value: contrasena, 
                estado: Constantes.ESTADO_ACTIVO,
                fecha_creacion: new Date()
            }, {transaction:trans});

            await trans.commit();
            resolve({"mensaje": `Contraseña actualizada con exito para el usuario ${id_usuario}`});

        } catch (error) {
            console.log(error);
            reject(new Error("Error en actualización de contraseña"));
        }
    });
}

const updateRegistroContraUsuario = (id_usuario, trans) => {
    return new Promise((resolve, reject) => {
        Models.Contrasenia.update({
            estado: Constantes.ESTADO_INACTIVO
        }, {
            where: {
                id_usuario: id_usuario,
                estado: Constantes.ESTADO_ACTIVO
            },
            transaction: trans
        }).spread((contador, registros) => {
            resolve({"mensaje": `Registros de contraseñas actualizado de ${id_usuario}`});
        }).catch((error) => {
            reject(error);    
        })
    })
};

const lastContra = (id_usuario)=>{
    return Models.Contrasenia.find({
        attributes: ['id_usuario', 'password_value'],
        where:{
            id_usuario: id_usuario, 
            estado:'A'
        },
        raw:true
    });
}

const ultimosRegistros = (id_usuario, factor_reutilizacion)=>{

    return new Promise(async (resolve, reject)=>{
        try {
            let registros = await Models.Contrasenia.findAll({
                attributes: ['id_usuario', 'password_value', 'id_password'],
                where:{
                    id_usuario: id_usuario,
                },
                raw:true
            });

            registros.sort((a, b)=>{
                {return b.id_password-a.id_password}
            });

            if( registros.length > factor_reutilizacion){
                registros = registros.slice(0, factor_reutilizacion);    
            }

            resolve(registros);

        } catch (error) {
            reject( new Error("Error en la consulta de los registros de contraseña"));
        }
    });
}

module.exports = {
    actualizarUsuario,
    findAllUsuarios,
    updateUsuario,
    actualizarContrasena,
    lastContra,
    ultimosRegistros
}

