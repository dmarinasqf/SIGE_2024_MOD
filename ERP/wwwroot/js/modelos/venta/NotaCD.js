class NotaCD {
    constructor() {
        this.idnota = 0;
        this.idtipodocumento = 0;
        this.iddocumento = 0;
        this.idsucursal = 0;
        this.idempresa = 0;
        this.idventa = 0;
        this.motivodevolucion = '';
        this.estado = 'HABILITADO';
       
    }
}
class DetalleNotaCD {
    constructor() {
        this.iddetalle = 0;
        this.idnota = 0;
        this.idstock = 0;
        this.idprecioproducto = 0;
        this.precio = 0;
        this.precioigv = 0;
        this.cantidad = 0;
        this.cantidad = 0;
        this.isblister = false;
        this.isfraccion = false;        
        this.estado = 'HABILITADO';          
        this.tipo = '';          
    }
}