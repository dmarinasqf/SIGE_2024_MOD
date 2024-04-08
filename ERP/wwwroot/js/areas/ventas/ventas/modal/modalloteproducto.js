
var MBP_tblstock;
var MBP_lblnombreproductotablastock = $('#MBP_lblnombreproductotablastock');
var MBP_stock_spinner = $('#MBP_stock_spinner');
$(document).ready(function (e) {

    MBP_tblstock = $('#MBP_tblstock').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        paging: false,
        info: false
    });
});

function MBP_buscarstock(producto, idalmacensucursal, sucursal) {
    $('#modallotes').modal('show');
    MBP_stock_spinner.removeClass('ocultar');
    MBP_tblstock.clear().draw(false);
    let controller = new StockController();
    var obj = {
        idproducto: producto,
        sucursal: sucursal,
        idalmacensucursal: idalmacensucursal
    };
    //console.log("HELLO");
    //console.log(obj);
    controller.GetStockProductosxLote(obj, function (data) {
        //TEMPORAL
        //console.log("PRODUCTO ENCONTRADO");
        //console.log(data);

        MBP_stock_spinner.addClass('ocultar');
        if (!data || data.length === 0) {
            controller.RegistrarProductosSinStock(obj);
            return;
        }

        for (var i = 0; i < data.length; i++) {
            var fila = MBP_tblstock.row.add([
                '<div class="btn-group btn-group-sm"><button idstock="' + data[i].idstock + '" idproducto="' + data[i].idproducto + '" class="btn btn-success MBP_seleccionarstock"> <i class="fas fa-check"></i></button></div>',
                '<span class="almacen font-10">' /*+ data[i].almacen + '</span><br>*/ + '<span class="font-10">' + data[i].areaalmacen + '</span>',
                '<span class="stock">' + data[i].canfraccion + '</span>',
                '<span class="stockfraccion">' + data[i].candisponible + '</span>',
                '<span class="lote">' + data[i].lote + '</span>',
                '<span class="fechav">' + (data[i].fechavencimiento) + '</span>',
                '<span class="promocion"></span>',

            ]).draw(false).node();
            $(fila).attr('idstock', data[i].idstock);
            $(fila).attr('idproducto', data[i].idproducto);
        }
    });
}
