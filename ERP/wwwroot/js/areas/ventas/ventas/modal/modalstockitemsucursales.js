var lblMSSnombrescliente = document.getElementById('lblMSSnombrescliente');
var txtMCCidproducto = document.getElementById('txtMCCidproducto');
var tblMCC;

$(document).ready(function () {
 
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = false;
    datatable.ordering = true;
    datatable.buttons = [];
    var util = new UtilsSisqf();
    tblMCC = util.Datatable('tblMCC', false, datatable);
    var MCCfilter = tblMCC_filter.parentNode;
    MCCfilter.classList.remove('col-lg-6');
    MCCfilter.classList.remove('col-xl-6');
    MCCfilter.classList.add('col-xl-12');
    MCCfilter.classList.add('col-md-12');
});
$('#modalstocksucursales').on('shown.bs.modal', function () {
    fnMCCbuscarstocksucursales();
});
function fnMCCbuscarstocksucursales() {
    let controller = new StockController();
    controller.GetStockEnSucursalxProducto(txtMCCidproducto.value, function (data) {       
        tblMCC.clear().draw(false);
        for (var i = 0; i < data.length; i++) {
           var fila= tblMCC.row.add([
                data[i].sucursal,
                data[i].stock,
                data[i].fraccion
           ]).draw(false).node();
            fila.getElementsByTagName('td')[1].classList.add('text-right');
            fila.getElementsByTagName('td')[2].classList.add('text-right');


        }
    });
}