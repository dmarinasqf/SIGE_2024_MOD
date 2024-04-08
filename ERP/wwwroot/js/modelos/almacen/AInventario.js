class AInventario {
    constructor() {
        this.idinventario = 0;
        this.suc_codigo = 0;
        this.idalmacensucursal = 0;
        this.usuarioinicia = 0;
        this.fechainicio = "";
        this.usuariofinaliza = 0;
        this.fechafin = "";
        this.estado = "";
    }
}

class AInventarioDetalle {
    constructor() {
        this.idinventariodetalle = 0;
        this.idinventario = 0;
        this.idstock = 0;
        this.cajas = 0;
        this.unidad = 0;
        this.estado = "";
    }
}

class AStockLoteProducto {
    constructor() {
        this.idstock = 0;
        this.idproducto = 0;
        this.idalmacensucursal = 0;
        this.lote = "";
        this.regsanitario = "";
        this.fechavencimiento = "";
        this.idtabla = 0;
    }
}