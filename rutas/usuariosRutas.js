var ruta=require("express").Router();
const conexion = require("../bd/conexion");
var subirArchivos=require("../middlewares/middlewares").subirArchivos;
var eliminarArchivo=require("../middlewares/middlewares").eliminarArchivo;
var {autorizadoAdmin,autorizadoUsuario,admin}=require("../middlewares/password");
var {mostrarProducto}=require("../bd/productoBD")
var {mostrarUsuarios, nuevoUsuario, buscarporID, modificarUsuario, borrarUsuario, validar}=require("../bd/usuariosBD");
//const { autorizado } = require("../middlewares/password").autorizado;
const Usuario = require("../modelos/Usuario");

ruta.get("/usuarioadmin",autorizadoAdmin,async(req, res)=>{
    var usuarios = await mostrarUsuarios()
    //console.log(usuarios);
    res.render("usuarios/mostrar",{usuarios});
});
ruta.get("/usuario1",autorizadoUsuario,async(req, res)=>{
  var usuarios = await mostrarUsuarios()
  //console.log(usuarios);
  res.render("usuarios/mostrar1",{usuarios});
});

ruta.get("/nuevousuario",(req, res)=>{
    res.render("usuarios/nuevo");
});

ruta.post("/nuevousuario",subirArchivos(),async(req, res)=>{
    //console.log(req.file.originalname);
    //console.log(req.body);
    req.body.foto=req.file.filename;
    var error=await nuevoUsuario(req.body);
    //res.end();
    res.redirect("/");
});

ruta.get("/editarUsuario/:id",async(req, res)=>{
    console.log(req.params.id);
    buscarporID();
    var user=  await buscarporID(req.params.id);
    res.render("usuarios/modificar",{user});
    res.end();
});

ruta.post("/editarUsuario", subirArchivos(),async(req, res)=>{
   /* console.log(req.body);
    req.body.foto=req.file.originalname;
    var error=await modificarUsuario(req.body);
    res.redirect("/");*/
    if(req.file!=null){
      req.body.foto = req.file.filename;
    }
    else{
      req.body.foto = req.body.fotoAnterior;
    }
    var error=await modificarUsuario(req.body);
    res.redirect("/usuarioadmin");

});
ruta.get("/editarUsuario1/:id",async(req, res)=>{
  console.log(req.params.id);
  buscarporID();
  var user=  await buscarporID(req.params.id);
  res.render("usuarios/modificar1",{user});
  res.end();
});

ruta.post("/editarUsuario1", subirArchivos(),async(req, res)=>{
 /* console.log(req.body);
  req.body.foto=req.file.originalname;
  var error=await modificarUsuario(req.body);
  res.redirect("/");*/
  if(req.file!=null){
    req.body.foto = req.file.filename;
  }
  else{
    req.body.foto = req.body.fotoAnterior;
  }
  var error=await modificarUsuario(req.body);
  res.render("usuarios/mostrar1");

});

ruta.get("/borrarUsuario/:id", async (req, res) => {
await borrarUsuario(req.params.id);
res.redirect("usarioadmin")
});

ruta.get("/borrarUsuario1/:id", async (req, res) => {
  await borrarUsuario(req.params.id);
  res.redirect("usuarios/mostrar1")
  });


ruta.get("/borrarUsuario1/:id", async (req, res) => {
  try {
    var usuario = await buscarporID(req.params.id);
    if (!usuario) {
      res.status(400).send("Usuario no encontrado.");
    } else {
      var archivo = usuario.foto;
      await borrarUsuario(req.params.id);
      eliminarArchivo(archivo)(req, res, () => {
        res.redirect("/usuario1");
      });
    }
  } catch (err) {
    console.log("Error al borrar usuario" + err);
    res.status(200).send("Error al borrar usuario.");
  }
});

ruta.get("/login", (req, res) => {
  res.render("usuarios/login");
});

ruta.post("/login", async(req, res) => {
  var user=await mostrarUsuarios();
  var datos=req.body;
var ValidU=await validar(datos,user);
if (ValidU==undefined){
  res.redirect("/login");
}else{
      if (ValidU.admin){
          req.session.admin=req.body.usuario;
          res.render("producto/producto");
      }
      else{
          //console.log("usuario");
          req.session.usuario=req.body.usuario;
          res.redirect("/noticias2");
          res.end;
      }
  }
});

ruta.get("/logout",(req,res)=>{
  req.session=null;
  res.redirect("/login");
});


ruta.get("/registro", (req,res)=>{
  res.render("usuarios/registro");
});


module.exports=ruta;