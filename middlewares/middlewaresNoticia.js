var multer=require("multer");
var fs = require("fs");
function subirArchivos(){
    var storage=multer.diskStorage({
        destination:'./web/imagesNoticia',
        filename:(req,file,cb)=>{
            console.log(file.originalname);
            var archivo=file.originalname;
            cb(null,archivo);
        }
    });
    return multer({storage}).single('foto');
}

function eliminarArchivoNot(archivo) {
    return async (req, res, next) => {
      try {
        fs.unlinkSync(`./web/imagesNoticia/${archivo}`);
        next();
      } catch (err) {
        console.error("Error al eliminar el archivo de la Noticia: " + err);
        res.status(500).send("Error al eliminar el archivo de Noticia");
      }
    };
  }

module.exports={
    subirArchivos,
    eliminarArchivoNot
}