var ruta=require("express").Router();
const conexion = require("../bd/conexion");
var subirArchivos=require("../middlewares/middlewaresNoticia").subirArchivos;
var eliminarArchivoNot=require("../middlewares/middlewaresNoticia").eliminarArchivoNot;
var { mostrarNoticia, nuevaNoticia, buscarNoticiaPorID, modificarNoticia, borrarNoticia} = require("../bd/noticiasBD");
const Noticias = require("../modelos/Noticias");
var {autorizadoAdmin,autorizadoUsuario,admin}=require("../middlewares/password");

ruta.get("/noticias",autorizadoAdmin,async(req, res)=>{
    var noticias = await mostrarNoticia()
    console.log(noticias);
    res.render("noticias/mostrarNoticia",{noticias});
});

ruta.get("/noticias1",async(req, res)=>{
  var noticias = await mostrarNoticia()
  console.log(noticias);
  res.render("noticias/mostrarNoticia1",{noticias});
});

ruta.get("/noticias2",autorizadoUsuario,async(req, res)=>{
  var noticias = await mostrarNoticia()
  console.log(noticias);
  res.render("noticias/mostrarNoticia2",{noticias});
});

ruta.get("/nuevaNoticia",autorizadoAdmin,(req, res)=>{
    res.render("noticias/noticias");
});
ruta.post("/nuevaNoticia",subirArchivos(), async (req, res) => {
    console.log(req.file.originalname);
    console.log(req.body);
    req.body.foto=req.file.originalname;
    var error = await nuevaNoticia(req.body);
    res.redirect("/noticias");
});

ruta.get("/nuevaNoticia1",autorizadoUsuario,(req, res)=>{
  res.render("noticias/noticias1");
});
ruta.post("/nuevaNoticia1",subirArchivos(), async (req, res) => {
  console.log(req.file.originalname);
  console.log(req.body);
  req.body.foto=req.file.originalname;
  var error = await nuevaNoticia(req.body);
  res.redirect("/noticias1");
});

ruta.get("/editarNoticia/:id", async (req, res) => {
    console.log(req.params.id);
    var noticia = await buscarNoticiaPorID(req.params.id);
    res.render("noticias/modificarNoticia", { noticia });
    res.end();
});

ruta.post("/editarNoticia",subirArchivos(), async (req, res) => {
    console.log(req.body);
    req.body.foto=req.file.originalname;
    var error = await modificarNoticia(req.body);
    res.redirect("/noticias");
});

ruta.get("/borrarNoticia/:id", async (req, res) => {
    try {
        var noticia = await buscarNoticiaPorID(req.params.id);
        if (!noticia) {
          res.status(200).send("Noticia no encontrada.");
        } else {
          var archivo = noticia.foto;
          await borrarNoticia(req.params.id);
          eliminarArchivoNot(archivo)(req, res, () => {
            res.redirect("/noticias");
          });
        }
      } catch (err) {
        console.log("Error al borrar la noticia " + err);
        res.status(400).send("Error al borrar noticia ");
      }
});

module.exports=ruta;