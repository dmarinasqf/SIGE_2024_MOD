
var MSSPG_txtfechatraslado = document.getElementById("MSSPG_txtfechatraslado");
var MSSPG_txtpeso = document.getElementById("MSSPG_txtpeso");
var MSSPG_txtbulto = document.getElementById("MSSPG_txtbulto");

var MSS_tblserie;
$(document).ready(function (e) {
    MSS_tblserie = $('#MSS_tblserie').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        paging: false,
        info: false
    });
});

function MSS_buscarSeriesXSucursal(idsucursal) {
    MSS_tblserie.clear().draw(false);
    let controller = new GuiaSalidaController();
    var obj = {
        idsucursal: idsucursal,
    };
    controller.ObtenerSerieGuiaxSucursal(obj, function (data) {
        data = JSON.parse(data.objeto);
        for (var i = 0; i < data.length; i++) {
            MSS_tblserie.row.add([
                '<span>' + data[i].idcorrelativo + '</span>',
                '<span>' + data[i].descripcion + '</span>',
                '<span>' + data[i].serie + '</span>',
                '<span>' + data[i].correlativo + '</span>',
                '<button idcorrelativo="' + data[i].idcorrelativo + '" class="btn btn-success MSS_btnseleccionarserie"><i class="fas fa-check"></i></button></div>',
            ]).draw(false).node();
        }
        $('#modalserie').modal('show');
    });
}