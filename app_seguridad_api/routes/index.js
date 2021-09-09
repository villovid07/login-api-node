var Express = require('express');
var router = Express.Router();
var AuthController = require("../controllers/authContoller");
var AdminController = require("../controllers/adminController")

router.post("/registro", AuthController.registro);

router.post("/login", AuthController.doLogin);

router.post("/validarBloqueo", AuthController.validarNivelBloqueo);

router.post("/dar-info-usuario", AuthController.darInfoUsuario);

router.get("/complejidades", AdminController.darComplejidades )

router.put("/complejidades/:id_complejidad", AdminController.actualizarComplejidad )

module.exports = router; 