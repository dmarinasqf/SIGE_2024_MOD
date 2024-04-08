var MBS_tblstocklote;
var MBS_txtcodigo = document.getElementById("MBS_txtcodigo");
var MBS_txtnombre = document.getElementById("MBS_txtnombre");
var MBS_txtlote = document.getElementById("MBS_txtlote");

var btnbuscarStock = document.getElementById("btnbuscarStock");

var arrayStockLoteProducto = [];
var MBS_idalmacensucursal = "";
$(document).ready(function () {
    MBS_tblstocklote = $('#MBS_tblstocklote').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        info: false,
        paging: true,
        pageLength: [15]
    });
});

btnbuscarStock.addEventListener("click", function () {
    BuscarStockLoteProductoPorAlmacenSucursal(MBS_idalmacensucursal);
});

function BuscarStockLoteProductoPorAlmacenSucursal(idalmacensucursal) {
    MBS_idalmacensucursal = idalmacensucursal;
    let controller = new AAlmacenTransferenciaController();
    var obj = {
        idalmacensucursal: idalmacensucursal,
        codigo: MBS_txtcodigo.value,
        nombre: MBS_txtnombre.value,
        lote: MBS_txtlote.value
    };
    controller.BuscarStockLoteProductoPorAlmacenSucursal(obj, function (data) {
        var data = JSON.parse(data.objeto);
        MBS_tblstocklote.clear().draw(false);
        for (var i = 0; i < data.length; i++) {
            MBS_tblstocklote.row.add([
                data[i].idstock,
                data[i].codigoproducto,
                data[i].nombre,
                moment(data[i].fechavencimiento).format("DD-MM-YYYY"),
                data[i].lote,
                data[i].regsanitario,
                data[i].medida,
                data[i].candisponible,
                '<button class="btnpasarstock btn btn-sm btn-success" suc_intuictive=' + data[i].suc_intuictive + ' prod_intuictive=' + data[i].cod_intuictive+'  id=' + data[i].idstock + '><i class="fas fa-check "></i></button>',
            ]).draw(false).node();
        }
        arrayStockLoteProducto = data;
        MBS_tblstocklote.columns.adjust().draw(false);
    });
}

$('#MBS_tblstocklote tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        MBS_tblstocklote.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

//version v2 para agregar unidad de medida
function BuscarStockLoteProductoPorAlmacenSucursalv2(idalmacensucursal) {
    MBS_idalmacensucursal = idalmacensucursal;
    let controller = new AAlmacenTransferenciaController();
    var obj = {
        idalmacensucursal: idalmacensucursal,
        codigo: MBS_txtcodigo.value,
        nombre: MBS_txtnombre.value,
        lote: MBS_txtlote.value
    };
    controller.BuscarStockLoteProductoPorAlmacenSucursal(obj, function (data) {
        var data = JSON.parse(data.objeto);
        MBS_tblstocklote.clear().draw(false);
        for (var i = 0; i < data.length; i++) {
            MBS_tblstocklote.row.add([
                data[i].idstock,
                data[i].codigoproducto,
                data[i].nombre,
                moment(data[i].fechavencimiento).format("DD-MM-YYYY"),
                data[i].lote,
                data[i].regsanitario,
                data[i].medida,
                data[i].candisponible,
                '<button class="btnpasarstock btn btn-sm btn-success" id=' + data[i].idstock + '><i class="fas fa-check "></i></button>',
            ]).draw(false).node();
        }
        arrayStockLoteProducto = data;
        MBS_tblstocklote.columns.adjust().draw(false);
    });
}

