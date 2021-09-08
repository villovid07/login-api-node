var Models=require("../models/index");
var FuncionesAdicionales = require("../helpers/funcionesAdicionales");
var Constantes = require("../constantes/constantesMedicina");

module.exports = class GenericDao {

     constructor(){
         this.models = Models
         this.funcionesAdicionales= FuncionesAdicionales;
         this.sequelize = Models.sequelize;
         this.constantes= Constantes;
     }

}