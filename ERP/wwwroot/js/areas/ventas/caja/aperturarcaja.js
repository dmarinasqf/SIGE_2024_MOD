var formregistro = document.getElementById('form-registro');
var txtmontoinicial = document.getElementById('txtmontoinicial');
var cmbcaja = document.getElementById('cmbcaja');

var tbodycajas = document.getElementById('tbodycajas');
var txtfechaconsulta = document.getElementById('txtfechaconsulta');


$(document).ready(function () {
    fnListarCajasSucursal();
});

formregistro.addEventListener('submit', function (e) {
    e.preventDefault();
    fnAperturarCaja();
});
txtfechaconsulta.addEventListener('change', function () {
    fnconsultarcajas();
});
txtfechaconsulta.addEventListener('keyup', function () {
    if (txtfechaconsulta.value.length==10)
        fnconsultarcajas();
});
$(document).on('click','.btndescargarpdf' ,function () {
    var idcajaaperturada = this.getAttribute('idapertura');
    fndescargarpdfcierre(idcajaaperturada);

});
function fndescargarpdfcierre(idcajaaperturada) {
    var url = ORIGEN + "/Ventas/Caja/GenerarPDFCierre";
    var obj = { url: "/Ventas/Caja/GenerarPDFCierre/" + idcajaaperturada };
    $.post(url, obj).done(function (data) {
        var link = document.createElement('a');
        link.href = "data:application/pdf;base64," + data;
        var fileName = "CierreCaja_" + idcajaaperturada + ".pdf";
        link.download = fileName;
        link.click();
    }).fail(function (data) {
        mensajeError(data);
    });

}
function fnconsultarcajas() {
    var obj = {
        fecha: txtfechaconsulta.value
    };
    let controller = new CajaVentasController();
    controller.ListarCajasPorfechaYUsuario(obj, function (data) {
        var fila = '';
        for (var i = 0; i < data.length; i++) {
            fila += '<tr>';
            fila += '<td><div class="btn-group btn-group-sm" > <button class="btn btn-danger btndescargarpdf" idapertura="' + data[i].idaperturacaja+'" ><i class="fas fa-file-pdf"></i></button></div ></td>';
            fila += '<td>'+data[i].sucursal+'</td>';
            fila += '<td>'+data[i].caja+'</td>';
            fila += '<td>' + data[i].fechaapertura+'</td>';
            fila += '</tr>';
        }
        tbodycajas.innerHTML = fila;
    });
}
function  fnListarCajasSucursal() {
    let controller = new CajaVentasController();
    controller.ListarCajaSucursal('', 'cmbcaja');
}

function fnAperturarCaja() {
    var obj = {
        idcajasucursal: cmbcaja.value,
        montoinicial: txtmontoinicial.value,
    };
    let controller = new CajaVentasController();
    controller.AperturarCaja(obj);
}