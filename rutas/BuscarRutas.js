var ruta=require("express").Router();
const conexion = require("../bd/conexion");
var { mostrarProducto, nuevoProducto, buscarProductoPorID, modificarProducto, borrarProducto } = require("../bd/productoBD");
const Producto = require("../modelos/Producto");
var subirArchivos=require("../middlewares/middlewares").subirArchivos;
var {autorizado,admin}=require("../middlewares/password");
var {mostrarProducto}=require("../bd/productoBD")
var {mostrarUsuarios, nuevoUsuario, buscarporID, modificarUsuario, borrarUsuario, validar}=require("../bd/usuariosBD");
const Usuario = require("../modelos/Usuario");
var subirArchivos=require("../middlewares/middlewaresNoticia").subirArchivos;
var { mostrarNoticia, nuevaNoticia, buscarNoticiaPorID, modificarNoticia, borrarNoticia} = require("../bd/noticiasBD");
const Noticias = require("../modelos/Noticias");

ruta.get("/usuarioBus",autorizado,async(req, res)=>{
    var usuarios = await mostrarUsuarios()
    //console.log(usuarios);
    res.render("dropdowns/dropmenu",{usuarios});
});  
    ruta.get("/productoBus",async(req, res)=>{
        var productos = await mostrarProducto()
        console.log(productos);
        res.render("dropdowns/dropmenu",{productos});
    });
ruta.get("/noticiasBus",async(req, res)=>{
    var noticias = await mostrarNoticia()
    console.log(noticias);
    res.render("dropdowns/dropmenu",{noticias});
});