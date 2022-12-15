const validator = require("validator");
const Article = require("../models/Article");
const { validarArticulo } = require("../helpers/validar");
const fs = require("fs");
const path = require('path')

const test = (req, res) => {
  return res.status(200).json({
    mensaje: "Soy una acción de prueba en mi controlador de articulo",
  });
};

const curso = (req, res) => {
  console.log("Se ha ejecutado el endpoint probando");
  return res.status(200).json([
    {
      curso: "Master en React",
      autor: "Kevin Escobar Martínez",
      url: "Url de prueba",
    },
    {
      curso: "Master en React",
      autor: "Kevin Escobar Martínez",
      url: "Url de prueba",
    },
  ]);
};

const create = (req, res) => {
  //recoger los parametros por post a guardar
  const parametros = req.body;

  //validar datos
  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      mensaje: "Faltan los datos por enviar",
      status: "error",
    });
  }

  // Crear el objeto a guardar
  const article = new Article(parametros); //automatico

  //Asignar valores a objeto basado en modelo (manual, automatico)
  // article.titulo = parametros.titulo; manual

  //guardar el articulo en la base de datos
  article.save((error, articleSaved) => {
    if (error || !articleSaved) {
      return res.status(400).json({
        mensaje: "No se ha guardado el articulo",
        status: "error",
      });
    }

    return res.status(200).json({
      status: "success",
      article: articleSaved,
      mensaje: "Articulo guardado con exito",
    });
  });
};

const listarArticulos = (req, res) => {
  let consulta = Article.find({});

  if (req.params.ultimos) {
    consulta.limit(ultimos);
  }

  consulta.sort({ fecha: -1 }).exec((error, articulos) => {
    if (error || !articulos) {
      return res.status(404).json({
        mensaje: "No se han encontrado articulos",
        status: "error",
      });
    }

    return res.status(200).send({
      status: "success",
      parametro: req.params.ultimos,
      articulos,
    });
  });

 
};

const uno = (req, res) => {
  //recoger un id por la url
  let id = req.params.id;
  //buscar el articulo
  Article.findById(id, (error, article) => {
    //Si no existe devolver error
    if (error || !article) {
      return res.status(404).json({
        mensaje: "No se han encontrado el articulo",
        status: "error",
      });
    }

    //Devolver resultado
    return res.status(200).json({
      status: "success",
      article,
    });
  });
};

const borrar = (req, res) => {
  let id = req.params.id;

  Article.findOneAndDelete({ _id: id }, (error, articuloborrado) => {
    if (error || !articuloborrado) {
      return res.status(500).json({
        status: "error",
        mensaje: "error al borrar",
      });
    }

    return res.status(200).json({
      status: "success",
      articulo: articuloborrado,
    });
  }); //id de la base de datos igual al id que viene como parametro
};

const actualizar = (req, res) => {
  //Recoger id articulo a editar
  let id = req.params.id;
  //recoger datos del body
  let parametros = req.body;

  //validar datos
  try {
    validarArticulo(parametros);
  } catch (error) {
    return res.status(400).json({
      mensaje: "Faltan los datos por enviar",
      status: "error",
    });
  }

  //buscar y actualizar articulo
  Article.findOneAndUpdate(
    { _id: id },
    parametros,
    { new: true },
    (error, articuloactualizado) => {
      if (error || !articuloactualizado) {
        return res.status(500).json({
          status: "Error",
          mensaje: "Error al actualizar",
        });
      }

      return res.status(200).json({
        status: "success",
        articulos: articuloactualizado,
      });
    }
  );
};

const subir = (req, res) => {
  //configurar multer

  //recoger el fichero de imagen subido
  if (!req.file && !req.files) {
    return res.status(404).json({
      status: "error",
      mensaje: "Peticion invalida",
    });
  }

  //nombre del archivo
  let archivo = req.file.originalname;

  //extensión del archivo
  let archivo_split = archivo.split(".");
  let extension = archivo_split[1];
  //comprobar extensión correcta
  if (
    extension != "png" &&
    extension != "jpg" &&
    extension != "jpeg" &&
    extension != "gif"
  ) {
    //Borrar archivo y dar respuesta
    fs.unlink(req.file.path, (error) => {
      return res.status(400).json({
        status: "error",
        mensaje: "Archivo invalido",
      });
    });
  } else {
    //Recoger id articulo a editar
    let id = req.params.id;

    //buscar y actualizar articulo
    Article.findOneAndUpdate(
      { _id: id },
      {image: req.file.filename},
      { new: true },
      (error, articuloactualizado) => {
        if (error || !articuloactualizado) {
          return res.status(500).json({
            status: "Error",
            mensaje: "Error al actualizar",
          });
        }

        return res.status(200).json({
          status: "success",
          articulos: articuloactualizado,
          fichero: req.file
        });
      }
    );
  }

  //si todo va bien, actualizar el articulo

  //devolver una respuesta
};

const imagen = (req,res) =>{
    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenes/articulos/"+fichero;


    fs.stat(ruta_fisica, (error,existe) => {
        if(existe){
            return res.sendFile(path.resolve(ruta_fisica));
        }else{
            return res.status(404).json({
                status: "Error",
                mensaje: "la imagen no existe",
              });  
        }
    })
}

const buscador = (req,res) =>{
    //sacar el string de busqueda
    let busqueda =  req.params.busqueda;

    //find or 
    Article.find({"$or": [
        {"titulo": {"$regex": busqueda, "$options": "i"}},
        {"contenido": {"$regex": busqueda, "$options": "i"}},
    ]})
    .sort({date: -1})
    .exec((error,articulos) =>{
       if(error || !articulos || articulos.length<=0){
        return res.status(404).json({
            status: "error",
            mensaje: "No se han encontrado articulos"
       });
    }

       return res.status(200).json({
            status: "success",
            articulos: articulos,
       });

    });


}

module.exports = {
  test,
  curso,
  create,
  listarArticulos,
  uno,
  borrar,
  actualizar,
  subir,
  imagen,
  buscador,
};
