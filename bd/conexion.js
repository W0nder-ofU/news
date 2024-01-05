var admin = require("firebase-admin");
var keys = require("../keys-8a2a5-firebase-adminsdk-2jbjs-c45ffa86d8.json");

admin.initializeApp({
    credential:admin.credential.cert(keys)
});

var db=admin.firestore();
db.settings({ignoreUndefinedProperties:true});
var conexionUsuarios=db.collection("Keys1");
var conexionProductos = db.collection("productos");
var conexionNoticias=db.collection("noticias");




module.exports = {
    conexionUsuarios,
    conexionProductos,
    conexionNoticias
};