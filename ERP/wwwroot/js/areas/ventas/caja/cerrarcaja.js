
var txtidcaja = document.getElementById('txtidcaja');
var txtnombrecaja = document.getElementById('txtnombrecaja');
var txtfechaapertura = document.getElementById('txtfechaapertura');
var txtusuarioapertura = document.getElementById('txtusuarioapertura');
var txtobservaciones = document.getElementById('txtobservaciones');
var tblmontos;
var tblbodydetalle = document.getElementById('tblbodydetalle');
var btncerrarcaja = document.getElementById('btncerrarcaja');
var btnprecierre = document.getElementById('btnprecierre');
var btndescargarreporte = document.getElementById('btndescargarreporte');

$(document).ready(function () {
  
    if (_CAJAABIERTA != null) {
        console.log(    _CAJAABIERTA);
        txtidcaja.value = _CAJAABIERTA.idaperturacaja;
        txtnombrecaja.value = _CAJAABIERTA.caja;
        txtfechaapertura.value = _CAJAABIERTA.fechaapertura;
        txtusuarioapertura.value = _CAJAABIERTA.usuarioapertura;
        txtobservaciones.value = _CAJAABIERTA.observaciones;
        fnGetDatosCierreCaja();
    }

    $('#btncerrarcaja').attr('disabled', true);//EARTCOD1009
});

function fnGetDatosCierreCaja() {
    let controller = new CajaVentasController();
    controller.GetDatosCierre(txtidcaja.value, function (data) {

        data = JSON.parse(data[0].ventas);
        var fila = '';
        tblbodydetalle.innerHTML = '';

        for (var i = 0; i < data.length; i++) {
            var cantidad = 0;
            //if (data[i].tipopago == 'MONTO APERTURA')
                cantidad = data[i].total.toFixed(2);
            fila += '<tr idaperturacaja="' + data[i].idaperturacaja + '" totalsistema="' + data[i].total.toFixed(2)+'">';
            fila += '<td class="fecha">' + data[i].fecha + '</td>';
            fila += '<td class="caja">' + data[i].caja + '</td>';
            fila += '<td class="moneda" cambio="'+data[i].cambiomoneda+'">' + data[i].moneda + '</td>';
            fila += '<td class="tipopago">' + data[i].tipopago + '</td>';
            fila += '<td class="numventas text-right">' + data[i].numventas + '</td>';
            //fila += '<td class="totalsistema text-right">' + data[i].total.toFixed(2) + '</td>';
            fila += '<td class="text-right"><input class="totalusuario text-right" type="number" step="any" value="' + cantidad+'" readonly/></td>';
            fila += '</tr>';
        }
        tblbodydetalle.innerHTML = (fila);

        //EARTCOD1009
        if ($('#tblbodydetalle tr').length > 0 && $('#tblbodydetalle tr').length == data.length) {
            $('#btncerrarcaja').attr('disabled', false);
        }
        //-EARTCOD1009
    });
}

btncerrarcaja.addEventListener('click', function () {
    //console.log("HOLA MUNDO");
    //console.log(fngetdetalle());

    if (txtidcaja.value.length === 0) {
        mensaje('W', 'No se puede cerrar la caja');
    }
    btnprecierre.classList.add('ocultar');
    let controller = new CajaVentasController();
    var obj = {
        idapertura: txtidcaja.value,
        observaciones:txtobservaciones.value,
        cierre: fngetdetalle()
    };
    controller.CerrarCaja(obj,function (id) {
        btndescargarreporte.classList.remove('ocultar');
        fngenerarPDFCierre(id);
    });
});
btndescargarreporte.addEventListener('click', function () {
    fngenerarPDFCierre(txtidcaja.value);
});
btnprecierre.addEventListener('click', function (e) {
    let controller = new CajaVentasController();
    var obj = {
        observaciones: txtobservaciones.value,
        idapertura: txtidcaja.value
    };
    controller.GuardarPreCierre(obj, function (data) {
        if (data.mensaje == 'ok')
            mensaje('S', 'Datos guardados.');
        else
            mensaje('W', data.mensaje);
    });
});
function fngetdetalle() {
    var filas = document.querySelectorAll('#tblbodydetalle tr');
    var array = [];
    filas.forEach(function (e) {
        var obj = new CerrarCaja();
        obj.idaperturarcaja = e.getAttribute('idaperturacaja');
        obj.cambiomoneda = e.getElementsByClassName('moneda')[0].getAttribute('cambio');
        obj.moneda = e.getElementsByClassName('moneda')[0].innerText;
        obj.tipopago = e.getElementsByClassName('tipopago')[0].innerText;
        obj.fecha = e.getElementsByClassName('fecha')[0].innerText;
        obj.caja = e.getElementsByClassName('caja')[0].innerText;
        obj.numventas = e.getElementsByClassName('numventas')[0].innerText;
        obj.montosistema = e.getAttribute('totalsistema');
        obj.montousuario = e.getElementsByClassName('totalusuario')[0].value;
        array.push(obj);
    });
    return array;
}

function fngenerarPDFCierre(id) {
    var url = ORIGEN + "/Ventas/Caja/GenerarPDFCierre";
    var obj = {
        url: "/Ventas/Caja/GenerarPDFCierre/"+id};
    $.post(url, obj).done(function (data) {
        var link = document.createElement('a');
        link.href = "data:application/pdf;base64," + data;
        var fileName = "cierre_caja.pdf";
        link.download = fileName;
        link.click(); 
    }).fail(function (data) {
        mensajeError(data);
    });

}