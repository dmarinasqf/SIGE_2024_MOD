
var tblReportes;
var datos;

$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = true;
    datatable.ordering = true;

    var util = new UtilsSisqf();
    tblReportes = util.Datatable('tblReportes', false, datatable);

    getReporteGeneral();
});



function getReporteGeneral() {

    var url = ORIGEN + '/Ventas/Caja/GetReporteListarCajasCerradas';

    var data = {
        fechaApertura: FECHAINICIO,
        fechaCierre: FECHAFIN,
        top: 1000
    };
    try {
        tblReporte.clear().draw();

    } catch (e) {
        console.log("x.x");
    }

    //limpiarTablas();
    BLOQUEARCONTENIDO('cardreport', 'Consultando reporte ...');
    $.post(url, data).done(function (data) {
        
        if (data.length == 0) {
            DESBLOQUEARCONTENIDO('cardreport');
            mensaje('I', 'No hay datos en la consulta');
            return;
        }

        tblReportes.rows().clear().draw(false);
        $.each(data, function (i, e) {
            var f1 = new Date(e.fechaapertura);
            var f2 = new Date(e.fechacierre);
            tblReportes.row.add([
                e.idaperturacaja,
                e.sucursal,
                e.caja,
                e.usuarioapertura,
                moment(f1).format('DD/MM/YYY HH:MM:SS'),
                e.usuariocierra,
                moment(f2).format('DD/MM/YYY HH:MM:SS'),
                e.numventas,
                e.montosistema,
                e.montousuario,
                (parseFloat(e.montousuario) - parseFloat(e.montosistema)),
                e.moneda,
                e.saldoNeto,
                e.observaciones,
                e.usuariocierra
            ]).draw(false);

        });
        DESBLOQUEARCONTENIDO('cardreport');

    }).fail(function (data) {
        DESBLOQUEARCONTENIDO('cardreport');
        mensajeError(data);
    });

}

$("#btnExportar").click(function () {

    descargarReporte();

});
function descargarReporte() {
    var url = ORIGEN + '/Ventas/Caja/GetReporteListarCajasCerradas';
    if (FECHAINICIO.length == 0) {
        FECHAINICIO = moment().format('DD/MM/YYYY');
        FECHAFIN = moment().format('DD/MM/YYYY');
    }
    var data = {
        fechaApertura: FECHAINICIO,
        fechaCierre: FECHAFIN,
        top: 1000000
    };
    BLOQUEARCONTENIDO('cardacciones', 'Descargando reporte ...');
    $.post(url, data).done(function (data) {

        DESBLOQUEARCONTENIDO('cardacciones');
        var url = location.origin.toString();
        if (data.mensaje == 'ok')
            location.href = ORIGEN + "/" + data.objeto;
        else
            mensaje('W', data.mensaje);
    }).fail(function (data) {
        DESBLOQUEARCONTENIDO('cardacciones');
        mensajeError(data);
    });
}

