const GenericDao = require("./genericDao");

module.exports =class GeneralDao extends GenericDao{

    constructor(){
        super();
    }

    darListaTiposDocumento(){
        return this.models.TipoIdentificacion.findAll();
    }

    darLocalizacionesByPadre(codpadre){
        return this.models.Localizacion.findAll({
            attributes:["cod_localizacion","nombre_localizacion","sigla","cod_localizacion_padre","tipo_localizacion"],
            where:{
                cod_localizacion_padre: codpadre
            },
            raw:true
        })
    }

    darListaEspecialidades(){
        return this.models.Especialidad.findAll({
            raw:true
        })
    } 

    darListaEmpresaSalud (){
        return this.models.EmpresaSalud.findAll({
            raw:true
        })
    }


    updatePersona (id_persona, valores, trans){

        return new Promise((resolve,reject)=>{
            this.models.Persona.update(valores, {
                where:{
                    id_persona: id_persona
                }, 
                transaction: trans
            }).spread((registros)=>{
                resolve({"mensaje":`${id_persona} actualizada`});
            }).catch((error)=>{
                reject(error);
            });
        });
    }

}


  