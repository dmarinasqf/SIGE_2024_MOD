var formdatospago = document.formpagos;
var RPtxtfile = document.getElementById('RP_txtfile');
var RPimgPagos = document.getElementById("RP_txtimagen");
var MP_cmbbanco = document.getElementById("MP_cmbbanco");
var MP_cmbcuenta = document.getElementById("MP_cmbcuenta");

var formpagos = document.getElementById("formpagos");
var MPtbodypagos = document.getElementById("MP_tbodypagos");
var MPlbltotal = document.getElementById("MPlbltotal");
var cardformpago = document.getElementById("cardformpago");
RPtxtfile.addEventListener('change', function () {
    let reader = new FileReader();
    var file = document.querySelector('input[id=RP_txtfile]')['files'][0];
    reader.readAsDataURL(file);
    reader.onload = function () {
        RPimgPagos.src = reader.result;
    };
});

$('#modaldatospago').on('shown.bs.modal', function () {

    if (formdatospago.idbanco.options.length == 0) {
        let controller = new BancoController();
        controller.ListarBancosHabilitados('MP_cmbbanco', null);
    }
});
MP_cmbbanco.addEventListener('change', function () {
    let controller = new BancoController();
    controller.ListarCuentasHabilitados('MP_cmbcuenta', this.value);
});

$(document).on('click', '.MPbtnquitarpago', function () {
    var fila = this.parentNode.parentNode;
    fila.remove();
    MPfnsumartotal();
});

formpagos.addEventListener('submit', function (e) {
    e.preventDefault();
    var obj = new FPagos();
    obj.idcuenta = formdatospago.idcuenta.value;
    obj.idbanco = formdatospago.idbanco.value;
    obj.numoperacion = formdatospago.numoperacion.value;
    obj.monto = parseFloat(formdatospago.monto.value);
    obj.fecha = formdatospago.fecha.value;
    obj.cuenta = MP_cmbcuenta.options[MP_cmbcuenta.selectedIndex].text;
    obj.isinterbancario = formdatospago.isinterbancario.checked;
    obj.imagen = formdatospago.imagen.src;
    obj.idpago = '';
    MPfnagregaatabla(obj);
    MPfnlimpiarform();

});
function MPfnagregaatabla(data) {
    var fila = '<tr idpago="' + data.idpago + '" idcuenta="' + data.idcuenta + '">';
    fila += '<td> <img src="' + data.imagen + '" alt="imagen boucher" class="imgbaucher" width="60px" height="60px" /></td>';
    fila += '<td class="numoperacion">' + data.numoperacion + '</td>';
    fila += '<td class="fecha">' + moment(data.fecha).format('DD/MM/YYYY') + '</td>';
    fila += '<td class="cuenta" >' + data.cuenta + '</td>';
    fila += '<td class="isinterbancario">' + (data.isinterbancario ?? '') + '</td>';
    fila += '<td class="monto text-right">' + data.monto.toFixed(2) + '</td>';

    fila += '<td>' + ((data.idpago == '') ? '<button class="btn btn-sm btn-danger MPbtnquitarpago"><i class="fa fa-trash-alt"></i></button>' : '') + '</td>';
    fila += '</tr>';
    $("#MP_tbodypagos").append(fila);
    MPfnsumartotal();
}

function MPfnlimpiarform() {
    formpagos.reset();
    formdatospago.imagen.src = '';
}
function MPfnlimpiarmodalpagos() {
    MPfnlimpiarform();
    MPtbodypagos.innerHTML = '';
    MPlbltotal.innerText = '';
}
function MPfnsumartotal() {
    var filas = document.querySelectorAll('#MP_tbodypagos tr');
    var total = 0;
    filas.forEach(function (e) {
        total += parseFloat(e.getElementsByClassName('monto')[0].innerText);
    });
    MPlbltotal.innerText = total.toFixed(2);
}
function MPfngetdatosdatapagos() {
    var c = 0;
    var filas = document.querySelectorAll("#MP_tbodypagos tr");
    var pagos = [];
    if (filas.length == 0)
        return [];
    filas.forEach(function (e) {

        var pago = new FPagos();
        var img = document.getElementsByClassName('imgbaucher')[0].src;
        pago = new Object();
        pago.imagen = img;
        pago.idcuenta = e.getAttribute('idcuenta');
        pago.idpago = e.getAttribute('idpago');;
        pago.numoperacion = document.getElementsByClassName('numoperacion')[0].innerText;
        pago.monto = document.getElementsByClassName('monto')[0].innerText;
        pago.fecha = document.getElementsByClassName('fecha')[0].innerText;
        pago.isinterbancario = document.getElementsByClassName('isinterbancario')[0].innerText;
        pagos.push(pago);
    });
    return pagos;
}

function MPfnbuscardepositospedido(idpedido) {
    var controller = new PedidoController();
    controller.BuscarPagosPedido(idpedido, (data) => {
        console.log(data);
        console.log(data);
        var fila = '';
        var total = 0;
        for (var i = 0; i < data.length; i++) {
            var tipo = data[i].imagen.split('_');           
            var imagen = '';
            if (tipo[0] == 'sisqf')
                imagen = location.hostname + ':9011/imagenes/pedido/depositos/' + data[i].imagen;
            else
                imagen = location.hostname + ':9001/imagenes/finanzas/depositos/' + data[i].imagen;
            fila += '<tr>';
            fila += '<td> <img src="' + imagen+'" alt="imagen boucher" class="imgbaucher" width="60px" height="60px" /></td>';
            fila += '<td>'+data[i].numoperacion+'</td>';
            fila += '<td>' + moment(data[i].fecha).format('DD/MM/YYYY') + '</td>';
            fila += '<td>' + data[i].cuenta + '</td>';
            fila += '<td>' + data[i].isinterbancario + '</td>';
            fila += '<td>' + data[i].monto.toFixed(2) + '</td>';
            fila += '<td></td>';
            fila += '</tr>';
            total += data[i].monto;
        }
        MPtbodypagos.innerHTML = fila;
        MPlbltotal.innerText = total.toFixed(2);
    });
}