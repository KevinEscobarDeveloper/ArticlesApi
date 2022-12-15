const express = require("express");
const ArticleController = require("../controllers/article")
const router = express.Router();
const multer = require("multer")



const almacenamiento = multer.diskStorage({
    destination: function (req,file,cb){
        cb(null,'./imagenes/articulos');
    },
    filename: function (req,file,cb) {
        cb(null, "articulo"+Date.now() +file.originalname);
    }
})

const subidas = multer({storage: almacenamiento});

//Rutas de pruebas
router.get("/ruta-de-prueba",ArticleController.test);
router.get("/curso",ArticleController.curso);
router.get("/articulos/:ultimos?", ArticleController.listarArticulos);
router.get("/articulo/:id", ArticleController.uno);
router.get("/imagen/:fichero", ArticleController.imagen);
router.get("/buscar/:busqueda", ArticleController.buscador);

//Ruta utíl
router.post("/create",ArticleController.create);
router.post("/subir-imagen/:id",[subidas.single("file0")],ArticleController.subir);



router.delete("/articulo/:id", ArticleController.borrar);


router.put("/articulo/:id", ArticleController.actualizar);




module.exports = router;

