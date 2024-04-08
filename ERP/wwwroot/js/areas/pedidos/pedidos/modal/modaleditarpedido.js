var MEDPlblnumpedido = document.getElementById('MEDPlblnumpedido');
var MEDPcmbbuscarcliente = document.getElementById('MEDPcmbbuscarcliente');
var MEDPtxtidcliente = document.getElementById('MEDPtxtidcliente');
var MEDPlbldatoscliente = document.getElementById('MEDPlbldatoscliente');

var MEDPcmbbuscarpaciente = document.getElementById('MEDPcmbbuscarpaciente');
var MEDPtxtidpaciente = document.getElementById('MEDPtxtidpaciente');
var MEDPlbldatospaciente = document.getElementById('MEDPlbldatospaciente');

var MEDPcmbbuscarmedico = document.getElementById('MEDPcmbbuscarmedico');
var MEDPtxtidmedico = document.getElementById('MEDPtxtidmedico');
var MEDPlbldatosmedico = document.getElementById('MEDPlbldatosmedico');

var MEDPhdnIdDelivery = document.getElementById('MEDPhdnIdDelivery');//EARTCOD1005
var MEDPtxtdireccion = document.getElementById('MEDPtxtdireccion');//EARTCOD1005

var txtidorigenreceta = document.getElementById('txtidorigenreceta');

var MEDPbtnguardardedicion = document.getElementById('MEDPbtnguardardedicion');
var formeditarpedido = document.getElementById('formeditarpedido');

var MEDPtbodydetalle = document.getElementById('MEDPtbodydetalle');

var btnimagen = document.getElementById('btnimagen');

$(document).ready(function () {
    let cliente = new ClienteController();
    var fn = cliente.BuscarClientesSelect2();
    $('#MEDPcmbbuscarcliente').select2({
        allowClear: true,
        ajax: fn,
        width: '100%',
        placeholder: "Ingrese número de documento",
    });
    let paciente = new PacienteController();
    var fn = paciente.BuscarPacientesSelect2();
    $('#MEDPcmbbuscarpaciente').select2({
        allowClear: true,
        ajax: fn,
        width: '100%',
        placeholder: "Ingrese número de documento",
    });
    let medico = new MedicoController();
    var fn = medico.BuscarMedicoSelect2();
    $('#MEDPcmbbuscarmedico').select2({
        allowClear: true,
        ajax: fn,
        width: '100%',
        placeholder: "Ingrese número de documento",
    });
});
$('#MEDPcmbbuscarcliente').on('select2:select', function (e) {
    var id = MEDPcmbbuscarcliente.value;
    MEDPtxtidcliente.value = id;
    MEDPlbldatoscliente.innerText = $('#MEDPcmbbuscarcliente').text();
    $('#MEDPcmbbuscarcliente').text('');
});
$('#MEDPcmbbuscarpaciente').on('select2:select', function (e) {
    var id = MEDPcmbbuscarpaciente.value;
    MEDPtxtidpaciente.value = id;
    MEDPlbldatospaciente.innerText = $('#MEDPcmbbuscarpaciente').text();
    $('#MEDPcmbbuscarpaciente').text('');

});
$('#MEDPcmbbuscarmedico').on('select2:select', function (e) {
    var id = MEDPcmbbuscarmedico.value;
    MEDPtxtidmedico.value = id;
    MEDPlbldatosmedico.innerText = $('#MEDPcmbbuscarmedico').text();
    $('#MEDPcmbbuscarmedico').text('');

});

formeditarpedido.addEventListener('submit', function (e) {
    console.log('HOLA MUNDO PEDIDO');

    e.preventDefault();
    var pr = txtidorigenreceta.value;
    var pr2 = txtidorigenreceta.val;
    if (MEDPfngetdetalle().length == 0)
        return;
    var obj = {
        idpaciente: MEDPtxtidpaciente.value,
        idcliente: MEDPtxtidcliente.value,
        idmedico: MEDPtxtidmedico.value,
        idpedido: MEDPlblnumpedido.innerText,
        iddelivery: MEDPhdnIdDelivery.value == null ? '0' : MEDPhdnIdDelivery.value,///EARTCOD1005
        direcciondeenvio: MEDPtxtdireccion.value == null ? '' : MEDPtxtdireccion.value,//EARTCOD1005
        idorigenreceta: txtidorigenreceta.value,
        idusuario: '',
        jsondetalle: MEDPfngetdetalle()
    }
    MEDPbtnguardardedicion.disabled = true;
    let controller = new PedidoController();
    controller.EditarPedido(obj, function (data) {
        mensaje('S', 'Datos guardados');
        MEDPbtnguardardedicion.disabled = false;
        MSIregistrarimagenes(MEDPlblnumpedido.innerText);
        $('#modaleditarpedido').modal('hide');
    }, () => { MEDPbtnguardardedicion.disabled = false;});
});
$(document).on('click', '.MEDPbtnquitar', function () {
    var fila = this.parentNode.parentNode;
    fila.remove();
});
function MEDPfngetdetalle() {
    var array = [];
    var filas = document.querySelectorAll('#MEDPtbodydetalle tr');
    filas.forEach(function (e) {
        var dato = '';
        var iddetalle = e.getAttribute('id');
        var formula = e.getElementsByClassName('MEDPformula')[0].innerText;
        var tipopedido = e.getElementsByClassName('MEDPtipopedido')[0];
        var tipoPedidoValue = tipopedido.getAttribute("tipopedido_codigo");
        //var tipoPedidoSelect = e.querySelector('.cmbtipopedido');
        //var tipoPedidoValue = tipoPedidoSelect.value;
        array.push(iddetalle + '|||' + formula + '|||DEVUELTO'+ ' |||' + tipoPedidoValue);
    });
    return array;
}
function MEDPfneditarpedido(idpedido) {
    $('#modaleditarpedido').modal('show');
    let controller = new PedidoController();

    controller.Listartipopedido((data) => {
        console.log(data);
        var arraytipopedido = JSON.parse(data);

        controller.BuscarPedidoCompleto(idpedido, (data) => {
            var cabecera = JSON.parse(data["pedido"][0].cabecera)[0];
            var detalle = JSON.parse(data["pedido"][0].detalle);

            MEDPtxtidpaciente.value = cabecera.idpaciente == 0 ? '' : cabecera.idpaciente;
            MEDPtxtidcliente.value = cabecera.idcliente == 0 ? '' : cabecera.idcliente;
            MEDPtxtidmedico.value = cabecera.idmedico == 0 ? '' : cabecera.idmedico;
            MEDPlbldatoscliente.innerText = cabecera.doccliente + ' - ' + cabecera.cliente;
            MEDPlbldatospaciente.innerText = cabecera.docpaciente + ' - ' + cabecera.paciente;
            MEDPlbldatosmedico.innerText = cabecera.cmp + ' - ' + cabecera.medico;
            txtidorigenreceta.innerText = cabecera.idorigenreceta == 0 ? '' : cabecera.idorigenreceta;
            txtorigenreceta.value = cabecera.origenreceta;

            //EARTCOD1005
            if (cabecera.tiporegistro != "DELIVERY") {
                $('#MEDPdivDelivery').hide();
                $('#MEDPtxtdireccion').prop('required', false);
            } else {
                $('#MEDPdivDelivery').show();
                MEDPhdnIdDelivery.value = data["delivery"][0].iddelivery;
                MEDPtxtdireccion.value = data["delivery"][0].direcciondeenvio;
                if (cabecera.estadopedido == "TERMINADO") {
                    MEDPtxtdireccion.disabled = true;
                } else {
                    MEDPtxtdireccion.disabled = false;
                }
            }
        //----------
            var fila = '';
            for (var i = 0; i < detalle.length; i++) {
                var codigo = detalle[i].codigoproducto;
                if (codigo == '')
                    codigo = detalle[i].codprecioanterior;

                var selectedOption = detalle[i].tipopedido; // Valor a seleccionar por defecto en el combo detalle[0].

                fila += '<tr id="' + detalle[i].iddetalle + '">';
                fila += '<td  >' + codigo + '</td>';
                fila += '<td contenteditable=true class="MEDPformula" >' + detalle[i].formula + '</td>';

                // Modificar la generación del combo para incluir la opción seleccionada por defecto
                var objTipoPedido = arraytipopedido.filter(x => x.descripcion == selectedOption);
                fila += '<td class="text-center align-middle MEDPtipopedido" tipopedido_codigo="' + objTipoPedido[0].tipopedido_codigo + '">' + selectedOption;
                //fila += '<select class="cmbtipopedido" required="" name="idtipopedido">';
                //for (var j = 0; j < arraytipopedido.length; j++) {
                //    var seleccionado = (arraytipopedido[j].descripcion === selectedOption);
                //    fila += '<option value="' + arraytipopedido[j].tipopedido_codigo + '" ' + (seleccionado ? 'selected' : '') + '>'
                //        + arraytipopedido[j].descripcion + '</option>';
                //}

                //fila += '</select>';
                fila += '</td>';

                fila += '<td class="text-right">' + (detalle[i].precio ?? 0).toFixed(2) + '</td>';
                fila += '<td class="text-right">' + (detalle[i].cantidad ?? 0).toFixed(2) + '</td>';
                fila += '<td class="text-right">' + (detalle[i].subtotal ?? 0).toFixed(2) + '</td>';
                fila += '<td class="text-right"><button class="btn btn-danger btn-sm MEDPbtnquitar"><i class="fas fa-trash-alt"></i></button></td>';
                fila += '</tr>';
            }

            MEDPtbodydetalle.innerHTML = fila;
        });
    });

}

btnimagen.addEventListener('click', function () {
    $('#modalsubirimagen').modal('show');
});

btnbuscarorigenreceta.addEventListener('click', function () {
    $('#modalorigenreceta').modal('show');
    MORfnbuscarorigenreceta();
});

$(document).on('click', '.MORbtnseleccionaritem', function () {
    var fila = this.parentNode.parentNode;
    txtidorigenreceta.value = fila.getAttribute('id');;
    txtorigenreceta.value = fila.getElementsByTagName('td')[0].innerText;
    $('#modalorigenreceta').modal('hide');
    //MMfnlistarmedicoByOrigenReceta(fila.getAttribute('id'));

});