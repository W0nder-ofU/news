//var { conexion,conexionUsuarios, conexionProductos } = require("./conexion");
var { conexionNoticias } = require("./conexion");
var Noticias = require("../modelos/Noticias");

async function mostrarNoticia() {
    var not = [];
    try {
        var noticias = await conexionNoticias.get();
        noticias.forEach((noticia) => {
            var noticia1 = new Noticias(noticia.id, noticia.data());
            if (noticia1.bandera == 0) {
                not.push(noticia1.obtenerNoticia);
            }
        });
    } catch (err) {
        console.log("Error al obtener la noticia del Firebase " + err);
        not.push(null);
    }
    return not;
}

async function buscarNoticiaPorID(id){
    var noti;
    try{
        var noticiabd=await conexionNoticias.doc(id).get();
       // console.log(usuariobd.data());
        var noticiaObjeto=new Noticias(noticiabd.id, noticiabd.data());
        if(noticiaObjeto.bandera==0){
            noti=noticiaObjeto;
        }
    }
    catch(err){
        console.log("Error al buscar la Noticia "+err);
        noti = null;
    }
    return noti;
}
async function nuevaNoticia(datos) {
    var noticia = new Noticias(null, datos);
    var error = 1;
    console.log(noticia.obtenerNoticia);
    if (noticia.bandera == 0) {
        try {
            await conexionNoticias.doc().set(noticia.obtenerNoticia);
            console.log("Noticia registrada correctamente");
            error = 0;
        } catch (err) {
            console.log("Error al registrar La noticia " + err);
        }
    }
    return error;
}

async function modificarNoticia(datos){
   // var producto=await buscarProductoPorID(datos.id);
   var noticia=new Noticias(datos.id, datos);
    var error =1;
    if(noticia!=undefined){
        var noticia=new Noticias(datos.id, datos);
        if(noticia.bandera==0){
            try{
                await conexionNoticias.doc(noticia.id).set(noticia.obtenerNoticia);
                console.log("Noticia actualizada correctamente");
                error=0;
            }
            catch(err){
                console.log("Error al modificar la noticia "+err);
            }
        }
        else{
            console.log("Los datos no son correctos");
        }
    }
    return error;
}

async function borrarNoticia(id) {
    var error = 1;
   // var producto=await buscarProductoPorID(datos.id);
   var noticia=await buscarNoticiaPorID(id);
    if(noticia!=undefined){
        try {
            await conexionNoticias.doc(id).delete();
            console.log("Noticia borrada");
            error = 0;
        } catch (err) {
            console.log("Error al borrar la noticia" + err);
        }
    }
    return error;
}


module.exports = {
    mostrarNoticia,
    buscarNoticiaPorID,
    nuevaNoticia,
    modificarNoticia,
    borrarNoticia
};
