var tblcajascerradas;
var tblcajasabiertas;
var _CAJASCERRADAS = [];
var btnbuscarcajacerrada = document.getElementById('btnbuscarcajacerrada');
var txtfecha = document.getElementById('txtfecha');
var txtfechafin = document.getElementById('txtfechafin');
$(document).ready(function () {
    tblcajasabiertas = $('#tblcajasabiertas').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        info: false,
        "language": LENGUAJEDATATABLE(),        
        
        paging: true,
    });
    tblcajascerradas = $('#tblcajascerradas').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        info: false,
        "language": LENGUAJEDATATABLE(),
      
    
        paging: true,
    });
    fnListarCajasAbiertas();
    fnListarCajasCerradas();
});
function fnListarCajasAbiertas() {
    let controller = new CajaVentasController();
    controller.ListarCajaAbiertas(function (data) {
        for (var i = 0; i < data.length; i++) {
            var href = ORIGEN + "/Ventas/Caja/CerrarCaja?idaperturacaja=" + data[i].idaperturacaja;
            tblcajasabiertas.row.add([
                data[i].sucursal,
                data[i].caja,
                moment(data[i].fechaapertura).format('DD/MM/YYYY hh:mm'),
                data[i].empleadoapertura,
                '<div class="btn-group btn-group-sm"><a class="btn btn-success" href=" ' + href+'"><i class="fas fa-hand-holding-usd"></i></a></div>'
            ]).draw(false);
        }
        tblcajasabiertas.columns.adjust().draw(false);
    });
}
function fnListarCajasCerradas() {
    let controller = new CajaVentasController();
    
    var obj = {
        fecha: FECHAINICIO,
        fechafin: FECHAFIN
        
    };
    BLOQUEARCONTENIDO('cardacciones', 'Consultando reporte ...');
    controller.GetCajasCerradas(obj, function (data) {
        _CAJASCERRADAS = data;
        tblcajascerradas.clear().draw(false);
        for (var i = 0; i < data.length; i++) {          
            tblcajascerradas.row.add([
                data[i].sucursal,
                data[i].caja,
                moment(data[i].fechaapertura).format('DD/MM/YYYY hh:mm'),
                data[i].usuarioapertura,
                moment(data[i].fechacierre).format('DD/MM/YYYY hh:mm'),
                data[i].usuariocierra,
                '<div class="btn-group btn-group-sm"><button class="btn btn-danger btndescargarpdf" idapertura="' + data[i].idaperturacaja+'" ><i class="fas fa-file-pdf"></i></button></div>'
            ]).draw(false);
        }
        tblcajascerradas.columns.adjust().draw(false);
        DESBLOQUEARCONTENIDO('cardacciones');
    });
}

btnbuscarcajacerrada.addEventListener('click', function () {
    fnListarCajasCerradas();
});
$(document).on('click', '.btndescargarpdf', function () {
    var idcajaaperturada = this.getAttribute('idapertura');
        fndescargarpdfcierre(idcajaaperturada);

});
$("#btnExportar").click(function () {

    fnDescargarReporte();

});
function fnDescargarReporte() {

    var url = ORIGEN + "/Pedidos/Reporte/GetReporteListarCajasCerradas";
    var data = {
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        top: 1000000
    };
    BLOQUEARCONTENIDO('cardacciones', 'Consultando reporte ...');
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
function fndescargarpdfcierre(idcajaaperturada) {
    var url = ORIGEN + "/Ventas/Caja/GenerarPDFCierre";
    var obj = { url:  "/Ventas/Caja/GenerarPDFCierre/" + idcajaaperturada};
    $.post(url, obj).done(function (data) {
        var link = document.createElement('a');
        link.href = "data:application/pdf;base64," + data;
        var fileName = "CierreCaja_" + idcajaaperturada+".pdf";
        link.download = fileName;
        link.click();
    }).fail(function (data) {
        mensajeError(data);
    });

}