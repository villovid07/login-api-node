var Express = require('express');
var router = Express.Router();
var EjemploController = require("../controllers/ejemploController");

var AuthController = require("../controllers/authContoller");


router.get("/saludar", EjemploController.saludar); //post //get 

router.post("/registro", AuthController.registro);



module.exports = router; 