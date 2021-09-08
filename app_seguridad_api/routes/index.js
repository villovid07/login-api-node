var Express = require('express');
var router = Express.Router();
var AuthController = require("../controllers/authContoller");

router.post("/registro", AuthController.registro);

router.post("/login", AuthController.doLogin);

router.post("/validarBloqueo", AuthController.validarNivelBloqueo);



module.exports = router; 