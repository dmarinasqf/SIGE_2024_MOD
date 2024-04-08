
var MAL_txtidproducto = document.getElementById("MAL_txtidproducto");
var MAL_txtcodigobarra = document.getElementById("MAL_txtcodigobarra");
var MAL_txtcodigo = document.getElementById("MAL_txtcodigo");
var MAL_txtproducto = document.getElementById("MAL_txtproducto");
var MAL_txtlote = document.getElementById("MAL_txtlote");
var MAL_txtregsanitario = document.getElementById("MAL_txtregsanitario");
var MAL_txtfechavencimiento = document.getElementById("MAL_txtfechavencimiento");

var MAL_btnGuardarLote = document.getElementById("MAL_btnGuardarLote");

MAL_txtcodigo.addEventListener("click", function (e) {
    $('#modalproductos').modal('show');
});

$(document).on('click', '.btnpasarproducto', function (e) {
    var idproducto = this.getAttribute('idproducto');
    let controller = new ProductoController();
    controller.BuscarProducto(idproducto, function (data) {
        MAL_txtidproducto.value = idproducto;
        MAL_txtcodigobarra.value = data.codigobarra ?? "";
        MAL_txtcodigo.value = data.codigoproducto;
        MAL_txtproducto.value = data.nombre;
        $('#modalproductos').modal('hide');
    });
});

MAL_btnGuardarLote.addEventListener("click", function () {
    if (MAL_txtidproducto.value == "" || MAL_txtlote.value == "" || MAL_txtregsanitario.value == "" || MAL_txtfechavencimiento.value == "") {
        mensaje("W", "Llene todos los campos");
    } else {
        var lValidarExisteLote = arrayLoteGeneral.filter(x => x.codigoproducto == MAL_txtcodigo.value && x.lote == MAL_txtlote.value);
        if (lValidarExisteLote.length > 0) {
            mensaje("W", "El lote y producto ingresado ya existen en el almacen.");
        } else {
            BLOQUEARCONTENIDO("contenedorLote", "Cargando...");
            var oStockLoteProducto = new AStockLoteProducto();
            oStockLoteProducto.idalmacensucursal = txtidalmacensucursal.value;
            oStockLoteProducto.idproducto = MAL_txtidproducto.value;
            oStockLoteProducto.lote = MAL_txtlote.value;
            oStockLoteProducto.regsanitario = MAL_txtregsanitario.value;
            oStockLoteProducto.fechavencimiento = MAL_txtfechavencimiento.value;
            oStockLoteProducto.idtabla = txtidinventario.value;

            var controller = new InventarioController();
            controller.RegistrarLote(oStockLoteProducto, function (data) {
                if (data.mensaje == "ok") {
                    data = data.objeto;
                    tbllistalote.row.add([
                        data.idstock,
                        MAL_txtcodigobarra.value,
                        MAL_txtcodigo.value,
                        MAL_txtproducto.value,
                        data.lote,
                        data.regsanitario,
                        moment(data.fechavencimiento).format("DD-MM-YYYY"),
                        '<input type="number" class="text-center cantidadCajasStock" idstock=' + data.idstock + ' style="width:80px;" min="1" value="' + data.candisponible + '">',
                        '<input type="number" class="text-center cantidadUnidadStock" idstock=' + data.idstock + ' style="width:80px;" min="1" value="' + data.candisponible + '">',
                        '<button type="button" class="btn btn-warning btn-sm btnseleccionarAdicionar" idstock=' + data.idstock + '><i class="fa fa-barcode"></i></button>',
                        '<button type="button" class="btn btn-success btn-sm btnconfirmarstock" idstock=' + data.idstock + '><i class="fa fa-check"></i></button>',
                    ]).draw(false).node();
                    var obj = {
                        almacen: "", cantidadCajas: data.candisponible, cantidadUnidad: data.candisponible, codigobarra: MAL_txtcodigobarra.value, codigoproducto: MAL_txtcodigo.value, fechavencimiento: MAL_txtfechavencimiento.value, idalmacensucursal: txtidalmacensucursal.value, idproducto: MAL_txtidproducto.value,
                        idstock: data.idstock, lote: data.lote, nombre: MAL_txtproducto.value, regsanitario: data.regsanitario
                    }
                    arrayLoteGeneral.push(obj);
                    limpiarCampos();
                    mensaje("S", "Lote guardado correctamente");
                    $('#modalAgregarLote').modal('hide');
                } else {
                    mensaje("W", "Error al guardar el lote");
                }
                DESBLOQUEARCONTENIDO("contenedorLote");
            });
        }
    }
});

function limpiarCampos() {
    MAL_txtidproducto.value = "";
    MAL_txtcodigo.value = "";
    MAL_txtproducto.value = "";
    MAL_txtlote.value = "";
    MAL_txtregsanitario.value = "";
    MAL_txtfechavencimiento.value = "";
}