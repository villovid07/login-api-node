var GenericDao = require("./genericDao");
var Encriptacion = require("../helpers/encriptacion");
var TokenRecordarDao = require("../dao/tokenRecordarDao");

module.exports = class SeguridadDao extends GenericDao {

    constructor() {
        super();
    }

    darInfoByDocumento(num_documento) {
        return new Promise(async (resolve, reject) => {
            try {
                let persona = await this.models.Persona.find({
                    attributes: ["num_identificacion", "primer_nombre", "segundo_nombre", "primer_apellido", "segundo_apellido"],
                    where: {
                        num_identificacion: num_documento
                    },
                    raw: true
                });

                let respersona = {
                    "num_identificacion": persona.num_identificacion,
                    "nombre_completo": this.funcionesAdicionales.darNombreCompleto(persona)
                }

                resolve(respersona);

            } catch (error) {
                reject(error);
            }
        })
    }


    updateUsuario(id, valores, transaccion) {
        return new Promise((resolve, reject) => {
            this.models.Usuario.update(valores, {
                where: {
                    id_usuario: id
                },
                transaction: transaccion
            }).spread((registros) => {
                resolve({ "mensaje": `${registros} actualizados- ${id} actualizado` });
            }).catch((error) => {
                reject(error);
            })
        })
    }


    findUsuarioByIdPersona(id_persona, estados) {
        return this.models.Usuario.find({
            raw: true,
            where: {
                id_persona,
                estado: estados
            }
        });
    }


    recordarPass(numero_documento) {

        return new Promise(async (resolve, reject) => {
            try {

                let usuario = await this.models.Usuario.find({
                    attributes: ["id_usuario"],
                    where: {
                        estado: 'A'
                    },
                    include: [{
                        attributes: ["correo", "id_persona"],
                        model: this.models.Persona,
                        where: {
                            num_identificacion: numero_documento
                        }
                    }]
                });

                if (usuario) {
                    let token = Encriptacion.generarTokenByEmail(usuario.Persona.correo);
                    let registroToken = {
                        token: token,
                        fecha_creacion: new Date(),
                        estado: 'A',
                        id_usuario: usuario.id_usuario
                    };

                    let restoken = await TokenRecordarDao.registrarToken(registroToken);
                    resolve({ "token": restoken.token, "correo": usuario.Persona.correo });

                } else {
                    throw { "mensaje": "No se encuentra un registro del usuario", "estado": "no_encontrado" };
                }
            } catch (error) {
                reject(error);
            }
        });

    }

    verificarTokenRestablecer(token) {

        return new Promise(async (resolve, reject) => {
            try {

                let rescons = await this.models.TokenRecordar.find({
                    attributes: ["id_token_recordar", "token", "id_usuario"],
                    where: {
                        token: token,
                        estado: 'A'
                    },
                    raw: true
                });
                if (rescons) {
                    resolve({ "mensaje": "token de recuperacion valido", 'id_usuario': rescons.id_usuario, 'id_token_recordar': rescons.id_token_recordar });
                } else {
                    throw { "mensaje": "No se encuentra un registro del token buscado", "estado": "no_encontrado" };
                }

            } catch (error) {
                reject(error);
            }
        })
    }


    /**
     * Actualizar clave de usuario 
     * @param {*} id_usuario - identificador del usuario 
     * @param {*} passwd - contraseña
     */
    updatePasswd = (id_usuario, passwd) => {

        return new Promise(async (resolve, reject) => {
            try {
                let usu = await this.models.Usuario.find({
                    where: {
                        id_usuario: id_usuario
                    }
                });

                if (usu) {
                    await usu.updateAttributes({
                        clave: Encriptacion.encriptar(passwd)
                    });
                    resolve({ "mensaje ": `${id_usuario}- actualizado - ${passwd}` });
                } else {
                    throw { "mensaje": "No se encuentra el registro del usuario", "estado": "no_encontrado" };
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    cambiarContra = (id_usuario, antigua, nueva) =>{
        return new Promise (async (resolve, reject)=>{
            try {
                let usu = await this.models.Usuario.find({
                    where: {
                        id_usuario: id_usuario,
                        clave: Encriptacion.encriptar(antigua)
                    }
                });

                if(usu){
                    await usu.updateAttributes({
                        clave: Encriptacion.encriptar(nueva)
                    });
                    resolve({ "mensaje ": `${id_usuario}- actualizado - ${nueva}` });
                } else {
                    throw { "mensaje": "No se encuentra el registro del usuario", "estado": "no_encontrado" };
                }
                
            } catch (error) {
                reject(error);
            }
        })

    }
}