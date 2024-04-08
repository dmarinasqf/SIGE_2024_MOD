
class AGuiaSalida {   
    constructor() {
        this.idguiasalida= 0;
        this.codigo = '';
        this.fechatraslado= '';
        this.idsucursal= 0;
        this.idalmacensucursalorigen= 0;
        this.idalmacensucursaldestino= 0;
        this.idsucursaldestino= 0;
        this.idcaja= 0;
        this.idcorrelativo= 0;
        this.idempresa= 0;
        this.seriedoc= '';
        this.numdoc= '';
        this.estado= '';
        this.estadoguia= '';
        this.ano= 0;
        this.observacion= '';
        this.idempresatransporte = 0;
        this.idvehiculo= 0;
        this.idempleadoaudita= 0;
        this.idempleadomantenimiento = '';
        this.idproveedor = 0;
        this.idcliente = 0;
        this.idtipoguia = 0;
        this.tieneguia = 0;
        this.empresa= '';
        this.sucursal= '';
        this.empleado= '';
        this.jsondetalle = '';
        //campos no mapeables
        this.encargado = '';
        this.sucursaldestino = '';
        this.proveedor = '';
    }
}

class ADetalleGuiaSalida {
    constructor() {
        this.iddetalleguiasalida = 0;
        this.idproducto= 0;
        this.idstock= 0;
        this.cantidadgenerada= 0;
        this.cantidadpicking= 0;
        this.estado= '';
        this.idguiasalida = 0;
        //campos no mapeables
        this.idsucusaldestino = 0;
        this.idproveedor = 0;
        this.producto = '';
        this.idalmacensucursalorigen = 0;
        this.lotecliente = 0;
        this.fechavencimientocliente = 0;
    }   
}