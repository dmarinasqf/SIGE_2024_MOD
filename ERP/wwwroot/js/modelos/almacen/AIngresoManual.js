class AIngresoManual {
    constructor() {
        this.idingreso = 0;
        this.fecha = '';
        this.idsucursal = 0;
        this.idempresa = 0;
        this.estado = 'HABILITADO';

        this.observacion = '';
    }    
}
class ADetalleIngresoManual {
    constructor() {
        this.iddetalle = 0;
        this.idingreso = 0;
        this.cantidad = 0;
        this.isblister = false;
        this.isfraccion = false;
        this.idproducto = 0;
        this.idstock = 0;
        this.estado = 'HABILITADO';
        this.lote = '';
        this.regsanitario = '';
        this.fechavencimiento = '';
        this.idalmacensucursal = 0;
    }   
}