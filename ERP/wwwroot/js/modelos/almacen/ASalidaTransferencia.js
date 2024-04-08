
class ASalidaTransferencia {
    constructor() {
        this.idsalidatransferencia = 0;
        this.codigo = '';
        this.fechatraslado = '';
        this.idsucursal = 0;
        this.idalmacensucursalorigen = 0;
        this.idsucursaldestino = 0;
        this.idempresa = 0;
        this.idcaja = 0;
        this.idcorrelativo = 0;
        this.seriedoc = 0;
        this.numdoc = '';
        this.estado = 'HABILITADO';
        this.estadoguia = 'PENDIENTE';
        this.ano = 0;
        this.observacion = '';
        this.idempresatransporte = 0;
        this.idvehiculo = 0;
        this.idcodincentcost=''
    }    
}

class ASalidaTransferenciaDetalle {
    constructor() {

        this.idsalidatransferenciadetalle=0;
        this.idproducto=0;
        this.idstock=0;
        this.cantidad=0;
        this.estado = 'HABILITADO'; ;
        this.idsalidatransferencia=0;
        this.lote='';
        this.regsanitario='';
        this.fechavencimiento='';
        this.idalmacensucursal = 0;
    }   
}