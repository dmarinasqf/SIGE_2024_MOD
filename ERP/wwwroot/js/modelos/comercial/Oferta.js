class Oferta {
    constructor() {
        this.idoferta = 0;
        this.estado = 'HABILITADO';
        this.nombre = '';
        this.fechainicio = '';
        this.fechafin = '';
        this.tipo = '';
        this.reqcliente = false;
        this.grabarcosto0 = false;
    }
   
}
class DetalleOferta {
    constructor() {
        this.iddetalle = 0;
        this.idoferta = 0;
        this.idproducto = 0;
        this.isfraccion = false;
        this.cantidad = 0;
        this.monto = 0;
        this.estado = "HABILITADO";
    }   
}
class ObsequioOferta {
    constructor() {
        this.idobsequio = 0;
        this.idoferta = 0;
        this.idproducto = 0;
        this.cantidad = 0;
        this.descuento = 0;
        this.isfraccion = false;
        this.estado = "HABILITADO";

    }
   
}