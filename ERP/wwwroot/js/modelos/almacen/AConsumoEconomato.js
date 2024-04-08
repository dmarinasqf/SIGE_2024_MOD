class AConsumoEconomato {
    constructor() {
        this.idconsumoeconomato = 0;
        this.numdocumento = "";
        this.motivo = "";
        this.estado = "HABILITADO";
    }
}

class AConsumoEconomatoDetalle {
    constructor() {
        this.idconsumoeconomatodetalle = 0;
        this.idconsumoeconomato = 0;
        this.idproducto = 0;
        this.idstock = 0;
        this.cantidad = 0;
        this.estado = "HABILITADO";
    }
}