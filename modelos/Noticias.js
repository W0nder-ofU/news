class Noticias {
    constructor(id, data) {
        this.bandera = 0;
        this.id = id;
        this.titulo= data.titulo;
        this.historia = data.historia;
        this.foto= data.foto;
    }

    set id(id) {
        if (id != null) {
            id.length > 0 ? this._id = id : this.bandera = 1;
        }
    }

    set titulo(titulo) {
        titulo.length > 0 ? this._titulo = titulo : this.bandera = 1;
    }

    set historia(historia) {
        historia.length > 0 ? this._historia = historia : this.bandera = 1;
    }

    set foto(foto){
        foto.length>0?this._foto=foto:this.bandera=1;
    }
    get id() {
        return this._id;
    }

    get titulo() {
        return this._titulo;
    }

    get historia() {
        return this._historia;
    }

    get foto(){
        return this._foto;
    }
    get obtenerNoticia() {
        if (this._id == null) {
            return {
                titulo: this.titulo,
                historia: this.historia,
                foto: this.foto
            };
        } else {
            return {
                id: this.id,
                titulo: this.titulo,
                historia: this.historia,
                foto: this.foto
            };
        }
    }
}
module.exports = Noticias;