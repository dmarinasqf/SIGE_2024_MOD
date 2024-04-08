var tbllista;

var txtfechainicio = document.getElementById('txtfechainicio');
var txtfechafin = document.getElementById('txtfechafin');
var btnbusqueda = $('#btnbusqueda');
var btnbusqueda = $('#btnbusqueda');
var cmbestado = $('#cmbestado');
var txtfechaconsulta = $('#txtfechaconsulta');
var txtnumorden = document.getElementById('txtnumorden');
var _estados = ['ANULADO', 'APROBADO', 'PENDIENTE', 'TERMINADO', 'VENCIDO', 'PREINGRESO PARCIAL', 'COMPRA COMPLETADA'];
var mensajeemail = `  <h4>Se le envia una orden de compra</h4>
                                     <p>Esperamos su pronta respuesta</p>`;
$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = true;
    //CAMBIOS SEMANA4
    datatable.ordering = false;
    //datatable.ordering = true;
    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', false, datatable, 'DD/MM/YYYY hh:mm A');
    LLENAR_COMBO(_estados, 'cmbestado', 'TODOS');
    var fecha = new Date();
    fecha.setDate(fecha.getDate() - 31);
    var fechaHaceUnMes = new Date(fecha).toISOString().split('T')[0];
    txtfechainicio.value = fechaHaceUnMes;
    var fechaActual = new Date().toISOString().split('T')[0];
    txtfechafin.value = fechaActual;

    fnListarOrdenes();
});


function fnListarOrdenes() {

    BLOQUEARCONTENIDO('cardreport', 'Buscando ..');
    tbllista.clear().draw();
    $('#numRegistros').text('0');
    let controller = new OrdenCompraController();
    var fechaActual = new Date().toISOString().split('T')[0];
    var obj = {
        estado: fngetdatoscmbestado(),
        id: txtnumorden.value,
        top: 100,
        fechainicio: txtfechainicio.value ? txtfechainicio.value : fechaActual,
        fechafin: txtfechafin.value ? txtfechafin.value : fechaActual
    };
    btnbusqueda.prop('disabled', true);
    controller.ListarCompras(obj, fnLlenarTablaDatos);
}
function fngetdatoscmbestado() {
    var estado = cmbestado.val();
    if (cmbestado.val() === '') {
        var aux = '';
        for (var i = 0; i < _estados.length; i++) {
            aux += _estados[i] + " | ";
        }
        return aux;
    }
    return estado;
}
function fnLlenarTablaDatos(data) {
    btnbusqueda.prop('disabled', false);

    if (data === null || data.length === 0)
        return;

    var filas = [];

    for (var i = 0; i < data.length; i++) {
        var acciones = '';
        if (data[i]['ESTADO'] === 'PENDIENTE' || data[i]['ESTADO'] === 'TERMINADO' || data[i]['ESTADO'] === 'APROBADO') {
            acciones = '<div class="btn-group btn-group-sm">' +
                '<a class="btn btn-sm btn-outline-warning waves-effect btn-pasar font-10" data-toggle="tooltip" data-placement="top" title="Editar Proforma" href="' + ORIGEN + '/Compras/COrdenCompra/RegistrarEditar/' + data[i]['ID'] + '"><i class="fas fa-edit"></i></a>' +
                ' <button class="btn btn-sm btn-outline-info btnimprimir  font-10" data-toggle="tooltip" data-placement="top" title="Imprimir Proforma" target="_blank" href="' + ORIGEN + '/Compras/COrdenCompra/Imprimir/' + data[i]['ID'] + '"><i class="fas fa-print"></i></button>' +
                '<button class="btn btn-sm btn-outline-dark waves-effect btnemail font-10" data-toggle="tooltip" data-placement="top" title="Enviar Email" idorden="' + data[i]['ID'] + '"><i class="fas fa-envelope-square"></i></button>' +
                '</div>';
        } else {
            acciones = '<div class="btn-group btn-group-sm">' +
                '<a class="btn btn-sm btn-outline-warning waves-effect btn-pasar font-10" data-toggle="tooltip" data-placement="top" title="Editar Proforma" href="' + ORIGEN + '/Compras/COrdenCompra/RegistrarEditar/' + data[i]['ID'] + '"><i class="fas fa-edit"></i></a>' +
                ' <button class="btn btn-sm btn-outline-info btnimprimir font-10" data-toggle="tooltip" data-placement="top" title="Imprimir Proforma" target="_blank" href="' + ORIGEN + '/Compras/COrdenCompra/Imprimir/' + data[i]['ID'] + '"><i class="fas fa-print"></i></button>' +
                '</div>';
        }

        var fila = [
            acciones,
            data[i]['CODIGO'],
            data[i]['RUC'],
            data[i]['RAZONSOCIAL'],
            moment(data[i]['FECHA']).format('DD/MM/YYYY hh:mm A'),
            data[i]['FEVENCIMIENTO'],
            data[i]['ESTADO'],
            data[i]['TOTAL'],
            data[i]['SUCURSALDESTINO'],
            data[i]['USERNAME']
        ];

        filas.push(fila);
    }

    tbllista.clear().rows.add(filas).draw();
    tbllista.columns.adjust().draw();
}

function fnlistaremailsenvio(id) {
    let controller = new OrdenCompraController();

    controller.GetEmailEnvio(id, function (data) {
        var obj = new ModalCorreo();
        obj.fnagregarcorreos(data, mensajeemail);
    });
}
$(document).on('click', '.btnemail', function () {
    var id = $(this).attr('idorden');
    console.log(this.parentNode.parentNode.parentNode);
    txtasuntoemail.value = "Orden de compra N°" + this.parentNode.parentNode.parentNode.getElementsByTagName('td')[1].innerText;
    $('#modalcorreos').modal('show');
    _IDTABLACORREO = id;
    fnlistaremailsenvio(id);
});
$(document).on('click', '.btnimprimir', function () {
    var href = $(this).attr('href'); console.log(href);
    if (href != '')
        ABRIR_MODALIMPRECION(href, 'IMPRIMIR ORDEN DE COMPRA');
});
$('#tbllista tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbllista.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

txtnumorden.addEventListener('keyup', function () {
    if (txtnumorden.value.length % 2 === 0)
        fnListarOrdenes();
});
$('#form-busqueda').submit(function (e) {
    e.preventDefault();
    fnListarOrdenes();
});
btnenviaremail.addEventListener('click', function () {
    var emailclass = new ModalCorreo();
    var emails = emailclass.fngetemails();
    if (emails.length == 0)
        return;
    var obj = {
        id: _IDTABLACORREO, 
        asunto: txtasuntoemail.value,
        mensajehtml: $("#mensajeeditor").val(),
        destinatarios: "yexsoncuentas@gmail.com"
    }
    BLOQUEARCONTENIDO('modalcorreos', 'Enviando email...');
    let controller = new OrdenCompraController();
    controller.EnviarEmail(obj, function () {

    });
});
