var {conexionUsuarios} = require("./conexion")
//var { conexionProductos, conexionUsuarios} = require("./conexion")
var Usuario=require("../modelos/Usuario");
const fs=require("fs");
const { generarPassword, validarPassword } = require("../middlewares/password");

async function mostrarUsuarios(){
    var users=[];
    try{
        var usuarios=await conexionUsuarios.get();
        usuarios.forEach((usuario)=>{
            
            var user=new Usuario(usuario.id, usuario.data());
            console.log(usuario.data());
            if(user.bandera==0){
                users.push(user.obtenerUsuario);       
            }
        });
    }
    catch(err){
        console.log("Error al obtener los usuarios de firebase"+err);
        users.push(null);
    }
    return users;
}

async function buscarporID(id){
    var user;
    try{
        var usuariobd=await conexionUsuarios.doc(id).get();
       // console.log(usuariobd.data());
        var usuarioObjeto=new Usuario(usuariobd.id, usuariobd.data());
        if(usuarioObjeto.bandera==0){
            user=usuarioObjeto;
        }
    }
    catch(err){
        console.log("Error al buscar al usuario"+err);
        user = null;
    }
    return user;
}

async function nuevoUsuario(datos){
    var {salt, hash}=generarPassword(datos.password);
    datos.password=hash;
    datos.salt=salt;
    datos.admin=false;
    var usuario=new Usuario(null, datos);
    var error=1;
    console.log(usuario.obtenerUsuario);
    if(usuario.bandera==0){
        try{
            await conexionUsuarios.doc().set(usuario.obtenerUsuario);
            console.log("Usuario registrado correctamente");
            error=0;
        }
        catch(err){
            console.log("Error al registrar al usuario"+err);
        }
    }
    return error;
}

async function modificarUsuario(datos){
    var user=await buscarporID(datos.id);
    var error=1;
    if(user!=undefined){
        if(datos.password==""){
            datos.password=user.password;
            datos.salt=user.salt;
        }
        else{
            var {salt, hash}=generarPassword(datos.password);
            datos.password=hash;
            datos.salt=salt;
        }
        var usuario=new Usuario(datos.id, datos);
        if(usuario.bandera==0){
            try{
                await conexionUsuarios.doc(usuario.id).set(usuario.obtenerUsuario);
                console.log("Usuario actualizado correctamente");
                error=0;
            }
            catch(err){
                console.log("Error al modificar el usuario"+err);
            }
        }
        else{
            console.log("Los datos no son correctos");
        }
    }
    return error;
}

async function borrarUsuario(id){
    var error=1; 
    var user=await buscarporID(id);
    if(user!=undefined){
        try{
            await conexionUsuarios.doc(id).delete();
            fs.unlinkSync("./web/"+user.foto)
            console.log("Usuario borrado");
            error=0;
        }
        catch(err){
            console.log("Error al borrar el usuario"+err);
        }
    }
    return error;
}


/*async function login(datos){
    var user=undefined;
    var usuarioObjeto;
    try{
        var user=await conexionUsuarios.where('usuario', '==',datos.usuario).get();
        if (user.docs.length==0){
            return undefined;
        }
        usuarios.docs.filter((doc)=>{
            var validar=validarPassword(datos.password,doc.data().password,doc.data().salt);
            if (validar){
                usuarioObjeto=new Usuario(doc.id,doc.data());
                if (usuarioObjeto.bandera==0){
                    user=usuarioObjeto.obtenerDatos;
                }
            }else
            return undefined;
        });
    }
    catch(err){
        console.log("Error al obtener usuario"+err);
    }
    return user;
}*/
async function validar (datos,users){
    var Cpass;
    var valUser;
    users.forEach((user)=>{
       if(datos.usuario == user.usuario){
         // console.log("Bienvenido "+user.nombre);
          Cpass = validarPassword(datos.password,user.password,user.salt);
          if(Cpass) {valUser = user;}else{
             valUser = undefined;}
       }
    });
    return valUser;
}


module.exports={
    mostrarUsuarios,
    buscarporID,
    nuevoUsuario,
    modificarUsuario,
    borrarUsuario,
    validar
}