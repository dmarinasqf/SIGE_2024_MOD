class ASalidaManual {
    constructor() {
        this.idsalida = 0;
        this.fecha = '';
        this.idsucursal = 0;
        this.idempresa = 0;
        this.estado = 'HABILITADO';
        this.seriedoc = '';
        this.numdoc = '';
        this.motivo = '';
    }    
}
class ADetalleSalidaManual {
    constructor() {
        this.iddetalle = 0;
        this.idsalida = 0;
        this.cantidad = 0;
        this.isblister = false;
        this.isfraccion = false;
        this.idstock = 0;     
        this.estado = 'HABILITADO';   
    }   
}