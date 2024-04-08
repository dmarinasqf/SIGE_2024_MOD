var tbllista;
$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = true;
    datatable.ordering = true;
    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', false, datatable);  
    fnlistarsucursales();
});
function fnlistarsucursales() {
    let controller = new SucursalController();
    controller.ListarTodasSucursales(null, null, function (data) {
        var fila = '';
        for (var i = 0; i < data.length; i++) {
            tbllista.row.add([
                data[i].idsucursal,
                data[i].sucursal,
                '<button class="btn btn-sm btn-success btndescargar" idsucursal=' + data[i].idsucursal+' ><i class="fas fa-file-excel"></i></button>'
            ]).draw(false);
        }
    });

}
$(document).on('click', '.btndescargar', function () {
    var idsucursal = this.getAttribute('idsucursal');
    let controller = new IncentivoController();
    controller.ExportarIncentivos(idsucursal);
});