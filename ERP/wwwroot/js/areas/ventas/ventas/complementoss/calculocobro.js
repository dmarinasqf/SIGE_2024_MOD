//cobro
var cmbmoneda = document.getElementById('cmbmoneda');
var cmbtipopago = document.getElementById('cmbtipopago');
var txttotalcobrar = document.getElementById('txttotalcobrar');
var txtmontototalpagado = document.getElementById('txtmontototalpagado');
var txtsaldocobrar1 = document.getElementById('txtsaldocobrar1');
var txtadelanto = document.getElementById('txtadelanto');
var txtvueltocobrar1 = document.getElementById('txtvueltocobrar1');
var txtvueltocobrar2 = document.getElementById('txtvueltocobrar2');
var tbodymontopago = document.getElementById('tbodymontopago');
var totaltblpago = document.getElementById('totaltblpago');
var txtnumtarjeta = document.getElementById('txtnumtarjeta');
var cmbtipotarjeta = document.getElementById('cmbtipotarjeta');
var divtarjeta = document.getElementById('divtarjeta');
var btnnuevopago = document.getElementById('btnnuevopago');


//credito
var MCdivcredito = document.getElementById('MCdivcredito');
var MCtxtcreditoactual = document.getElementById('MCtxtcreditoactual');
var MClblmensajecredito = document.getElementById('MClblmensajecredito');

//transferencia
var divtransferencia = document.getElementById('divtransferencia');
var cmbtipotransferencia = document.getElementById('cmbtipotransferencia');


$(document).ready(function () {

});

function fnnuevopagos() {
    if (!divtarjeta.classList.contains('ocultar'))
        divtarjeta.classList.add('ocultar')
    if (!MCdivcredito.classList.contains('ocultar'))
        MCdivcredito.classList.add('ocultar')
    if (!divtransferencia.classList.contains('ocultar'))
        divtransferencia.classList.add('ocultar')
    totaltblpago.innerHTML = '0.00';
    tbodymontopago.innerHTML = '';
    cmbtipotarjeta.value = '';
    MCtxtcreditoactual.value = '';
    MClblmensajecredito.innerText = '';
}
cmbtipopago.addEventListener('change', function (e) {
    var texto = cmbtipopago.options[cmbtipopago.selectedIndex].text;
    if (texto == 'TARJETA') {
        if (cmbtipotarjeta.getElementsByTagName('option').length == 0) {
            let controller = new BancoController();
            controller.ListarTipoTarjeta('cmbtipotarjeta', null);
        }
        divtarjeta.classList.remove('ocultar');
        MCdivcredito.classList.add('ocultar');
        divtransferencia.classList.add('ocultar');
        return;
    } else if (texto == 'CREDITO') {
        MCdivcredito.classList.remove('ocultar');
        MCtxtcreditoactual.value = '';
        MClblmensajecredito.innerText = '';
        divtarjeta.classList.add('ocultar');
        divtransferencia.classList.add('ocultar');
        if (txtidcliente.value != '') {
            fnbuscarcreditocliente();
        } else
            mensaje('I', 'Seleccione cliente');

        return;
    } else if (Text == 'TRANSFERENCIA') {
        if (cmbtipotransferencia.getElementsByTagName('option').length == 0) {
            let controller = new BancoController();
            controller.ListarTipoTarjeta('cmbtipotransferencia', null);
        }
        MCdivcredito.classList.add('ocultar');
        divtarjeta.classList.add('ocultar');
        divtransferencia.classList.remove('ocultar');
        return;
    }
    else {
        divtarjeta.classList.add('ocultar');
        divtransferencia.classList.add('ocultar');
        MCdivcredito.classList.add('ocultar');
    }
    MClblmensajecredito.innerText = '';
    txtnumtarjeta.value = '';
    cmbtipotarjeta.value = '';
    MCtxtcreditoactual.value = '';
});
function fnLlenarCamposCobro() {
    var adelanto = parseFloat(txtadelanto.value === '' ? 0 : txtadelanto.value).toFixed(2);
    var total = (parseFloat(txttotalredondeado.value === '' ? 0 : txttotalredondeado.value)).toFixed(2);
    var totaltabla = parseFloat(totaltblpago.innerText);
    txttotalcobrar.value = total;
    total -= totaltabla;
    var cambio = parseFloat($('#cmbmoneda option:selected').attr('cambio'));
    if (isNaN(cambio) || cambio === null)
        cambio = 1;
    total = (total / cambio);
    //txttotalcobrar.value = total.toFixed(2);
    var montoingresado = parseFloat(txtmontototalpagado.value === '' ? 0 : txtmontototalpagado.value);
    var adelanto = parseFloat(txtadelanto.value===''?0:txtadelanto.value);
    var saldo = total - montoingresado - adelanto;
    if (saldo >= 0) {
        txtsaldocobrar1.value = saldo.toFixed(2);
        txtvueltocobrar1.value = '0.00';
    } else {
        txtsaldocobrar1.value = '0.00';
        txtvueltocobrar1.value = (-1 * (saldo)).toFixed(2);
    }
    //txttotalcobrar.value = total.toFixed(2);
    txtadelanto.value = adelanto.toFixed(2);
}
function fngetpagos() {
    var filas = document.querySelectorAll('#tbodymontopago tr');
    var array = [];
    if (filas.length != 0) {
        filas.forEach(function (e) {
            var obj = new VentaPagos();
            obj.estado = 'HABILITADO';
            obj.idmoneda = e.getAttribute('idmoneda');
            obj.idtipopago = e.getAttribute('idtipopago');
            obj.cambiomoneda = e.getAttribute('cambiomoneda');
            obj.numtarjeta = e.getAttribute('numtarjeta');
            obj.idtipotarjeta = e.getAttribute('idtipotarjeta');

            obj.montopagado = e.getElementsByClassName('importe')[0].innerText;
            obj.montodevuelto = e.getElementsByClassName('vuelto')[0].innerText;
            array.push(obj);
        });
    } else {
        //var obj = new VentaPagos();
        //obj.estado = 'HABILITADO';
        //obj.idmoneda = cmbmoneda.value;
        //if (cmbtipopago.options[cmbtipopago.selectedIndex].text == 'TARJETA') {
        //    obj.numtarjeta = txtnumtarjeta.value;
        //    obj.idtipotarjeta = cmbtipotarjeta.value;
        //}

        //obj.idtipopago = cmbtipopago.value;
        //obj.cambiomoneda = cmbmoneda.options[cmbmoneda.selectedIndex].getAttribute('cambio');
        //obj.montopagado = txttotalredondeado.value;
        //obj.montodevuelto = 0;

        //array.push(obj);
    }


    return array;
}
function fncalculartotalpagos() {
    var filas = document.querySelectorAll('#tbodymontopago tr');
    var total = 0,vuelto=0,vueltoss=0;
    filas.forEach(function (e) {
        total += parseFloat(e.getElementsByClassName('importe')[0].innerText);
     
    });
    var montofinal = parseFloat(total).toFixed(2);
    totaltblpago.innerText = parseFloat(montofinal).toFixed(2);
    fnLlenarCamposCobro();
}
function fnbuscarcreditocliente() {
    let controller = new LineaCreditoController();
    controller.BuscarLineaCredito(txtidcliente.value, function (data) {
        MCtxtcreditoactual.value = data.linea.montoactual.toFixed(2);
        if (data.linea.isbloqueado)
            MClblmensajecredito.innerText = 'Su crédito ha sido bloqueado';
        if (data.linea.montoactual == 0)
            MClblmensajecredito.innerText = 'No tiene crédito';

    });
}
function MCfnvalidarcreditocliente() {
    var total = parseFloat(totaltblpago.innerText);
    var credito = parseFloat(MCtxtcreditoactual.value);
    if (total <= credito && MClblmensajecredito.innerText == '') return "ok";
    else return "x";
}
$(document).on('click', '.btndeleteitempago', function () {
    this.parentNode.parentNode.remove();
    fncalculartotalpagos();

});
btnnuevopago.addEventListener('click', function () {
    var fila = '';
    if (txtmontototalpagado.value != '' && cmbmoneda.value != '' && cmbtipopago.value != '') {
        var total = parseFloat(txtsaldocobrar1.value);
        var s = parseFloat(txttotalcobrar.value);
        var t = parseFloat(txtadelanto.value) + total;
        var saldo = s - t;
        var vuelto = 0.00;
        var subtotal = 0;
        //if (saldo == 0)
        //    //subtotal = parseFloat(txttotalcobrar.value);
        //    subtotal = parseFloat(txtmontototalpagado.value)
        //else
        subtotal = parseFloat(txtmontototalpagado.value);
        vuelto = parseFloat(txtvueltocobrar1.value);
        var auxcmbiomoneda = auxcmbiomoneda = cmbmoneda.options[cmbmoneda.selectedIndex].getAttribute('cambio');
        var auxnomtipotarjeta = ''
        try {
            auxnomtipotarjeta = cmbtipotarjeta.options[cmbtipotarjeta.selectedIndex].text;
        } catch (e) {
            auxnomtipotarjeta = '';
        }
        if (cmbtipotarjeta.value == '')
            auxnomtipotarjeta = '';
        var nombretipopago = cmbtipopago.options[cmbtipopago.selectedIndex].text;
        if (nombretipopago == 'TARJETA') {
            nombretipopago = nombretipopago + '-' + auxnomtipotarjeta + '-' + txtnumtarjeta.value;
        } else
            cmbtipotarjeta.value = '';
        if (saldo > 0) {
            fila += '<tr numtarjeta="' + txtnumtarjeta.value + '" idmoneda="' + cmbmoneda.value + '" idtipopago="' + cmbtipopago.value + '" cambiomoneda="' + auxcmbiomoneda + '" idtipotarjeta="' + cmbtipotarjeta.value + '">';
            fila += '<td>' + cmbmoneda.options[cmbmoneda.selectedIndex].text + '</td>';
            fila += '<td>' + nombretipopago + '</td>';
            fila += '<td class="importe text-right font-16">' + (subtotal-vuelto).toFixed(2) + '</td>';
            fila += '<td class="vuelto text-right font-16">' + (vuelto).toFixed(2) + '</td>';
            fila += '<td><button type="button" class="btndeleteitempago"><i class="fas fa-trash-alt"></i></button></td>';
            fila += '</tr>';

            tbodymontopago.innerHTML = tbodymontopago.outerHTML + fila;
            fncalculartotalpagos();
        } else {
            mensaje('W', 'El monto ' + total + ' sobrepasa el total de la venta')
        }

    } else
        mensaje('W', 'Complete los campos de pago');
    txtmontototalpagado.value = '0.00';
    fnLlenarCamposCobro();
});
$('#modalcobrar').on('show.bs.modal', function (event) {
    var texto = cmbtipopago.options[cmbtipopago.selectedIndex].text;
    if (texto == 'TARJETA') {

    } else if (texto == 'CREDITO') {
        MCtxtcreditoactual.value = '';
        MClblmensajecredito.innerText = '';
        if (txtidcliente.value != '') {
            fnbuscarcreditocliente();
        } else
            mensaje('I', 'Seleccione cliente');

        return;
    }
});