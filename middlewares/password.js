//const { log } = require("console");
var crypto = require("crypto");

function generarPassword(password){
    var salt=crypto.randomBytes(32).toString("hex");
    var hash=crypto.scryptSync(password,salt,100000,64,'sha512').toString("hex");
    return{
        salt,
        hash
    }
}

function validarPassword(password,hash,salt){
    var hashValidar=crypto.scryptSync(password,salt,100000,64,'sha512').toString("hex");
    return hashValidar===hash
}

function autorizadoAdmin(req,res,siguiente){
    if(req.session.admin){
        siguiente();
        console.log("admin autorizado");
    }else{
        res.redirect("/login");
        console.log("No admin")
    }
}
function autorizadoUsuario(req,res,siguiente){
    if(req.session.usuario){
        console.log("usuario autorizado");
        siguiente();
    }else{
        res.redirect("/login");
        console.log("No usuario")
    }
}

function admin(req,res,siguiente){
    console.log("administrador autorizado");
    if(req.session.admin){
        siguiente();
    }else{
        if(req.session.usuario){
            req.redirect("/");
        }else{
            res.redirect("/login");
        }
    } 
}

/*route.get('/usuarioadmin','/producto','/nuevoproducto','/nuevaNoticia','/noticias',function(req,res,next){
if (req.session.admin){
    next()
}else{
    res.status(401);
    console.log("No eres Admin")
}
});*/

module.exports={
    generarPassword,
    validarPassword,
    autorizadoAdmin,
    autorizadoUsuario,
    admin
}