var tbllista;


var btnbusqueda = $('#btnbusqueda');
var txtfechaconsulta = $('#txtfechaconsulta');
var txtnumproforma = document.getElementById('txtnumproforma');
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

    fnListarCotizaciones();
});


function fnListarCotizaciones() {
    let controller = new CotizacionController();
    var obj = $('#form-busqueda').serializeArray();
    controller.ListarCotizaciones(obj, fnAgregarCamposTabla);
    btnbusqueda.prop('disabled', true);
}
function fnAgregarCamposTabla(data) {
    btnbusqueda.prop('disabled', false);
    if (data === null) {

        return;
    }
    if (data.length >= 0) {
        var acciones = '';
        tbllista.clear().draw();
        for (var i = 0; i < data.length; i++) {
            if (data[i]['ESTADO'] === 'TERMINADO' || data[i]['ESTADO'] === 'PENDIENTE') {
                acciones = ' <div class= "btn-group btn-group-sm" >' +
                    '  <a class="btn btn-sm btn-outline-warning waves-effect btn-pasar font-10" data-toggle="tooltip" data-placement="top" title="Editar Proforma" href="' + ORIGEN + '/Compras/CCotizacion/RegistrarEditar/' + data[i]['ID'] + '"><i class="fas fa-edit"></i></a>' +
                    '  <button class="btn btn-sm btn-outline-secondary waves-effect btnduplicar font-10" data-toggle="tooltip" data-placement="top" title="Duplicar Proforma" target="_blank" href="' + ORIGEN + '/Compras/CCotizacion/Duplicar/' + data[i]['ID'] + '"><i class="fas fa-copy"></i></button>' +
                    '  <button class="btn btn-sm btn-outline-info btnimprimir font-10" data-toggle="tooltip" data-placement="top" title="Imprimir Proforma"  href="' + ORIGEN + '/Compras/CCotizacion/Imprimir/' + data[i]['ID'] + '"><i class="fas fa-print"></i></button>' +
                    //'  <a class="btn btn-sm btn-outline-danger waves-effect  font-10" data-toggle="tooltip" data-placement="top" title="Generar Pdf" target="_blank" href="' + ORIGEN + '/Compras/CCotizacion/GenerarPDF/' + data[i]['ID'] + '"><i class="fas fa-file-pdf"></i></a>' +
                    ' <button class="btn btn-sm btn-outline-dark waves-effect btnemail font-10" data-toggle="tooltip" data-placement="top" title="Enviar Email" idproforma="' + data[i]['ID'] + '"><i class="fas fa-envelope-square"></i></button>'
                '  </div >';
            } else {
                acciones = ' <div class= "btn-group btn-group-sm" >' +
                    '  <a class="btn btn-sm btn-outline-warning waves-effect btn-pasar font-10" data-toggle="tooltip" data-placement="top" title="Editar Proforma" href="' + ORIGEN + '/Compras/CCotizacion/RegistrarEditar/' + data[i]['ID'] + '"><i class="fas fa-edit"></i></a>' +
                    '  <button class="btn btn-sm btn-outline-secondary waves-effect btnduplicar font-10" data-toggle="tooltip" data-placement="top" title="Duplicar Proforma" target="_blank" href="' + ORIGEN + '/Compras/CCotizacion/Duplicar/' + data[i]['ID'] + '"><i class="fas fa-copy"></i></button>' +
                    '  <button class="btn btn-sm btn-outline-info btnimprimir  font-10" data-toggle="tooltip" data-placement="top" title="Imprimir Proforma" href="' + ORIGEN + '/Compras/CCotizacion/Imprimir/' + data[i]['ID'] + '"><i class="fas fa-print"></i></button>' +
                    //'  <a class="btn btn-sm btn-outline-danger waves-effect  font-10" data-toggle="tooltip" data-placement="top" title="Generar Pdf" target="_blank" href="' + ORIGEN + '/Compras/CCotizacion/GenerarPDF/' + data[i]['ID'] + '"><i class="fas fa-file-pdf"></i></a>' +
                    '  </div >';
            }
            tbllista.row.add([
                acciones,
                data[i]['COD'],
                data[i]['RUCPROVEEDOR'],
                data[i]['RAZONSOCIAL'],
                moment(data[i]['FECHA']).format('DD/MM/YYYY hh:mm A'),
                data[i]['FEVENCIMIENTO'],
                data[i]['ESTADO'],
                data[i]['TOTAL'].toFixed(2),
                data[i]['USUARIO']
            ]).draw(false);
        }
        tbllista.columns.adjust().draw();
    }
    else {
        mensaje('I', 'No existen registros');
    }
}
function fnlistaremailsenvio(id) {
    let controller = new CotizacionController();

    controller.GetEmailEnvio(id, function (data) {
        var obj = new ModalCorreo();
        obj.fnagregarcorreos(data, mensajeemail);
    });
}
txtnumproforma.addEventListener('keyup', function () {
    let controller = new CotizacionController();
    var obj = $('#form-busqueda').serializeArray();
    controller.ListarCotizaciones(obj, fnAgregarCamposTabla);
});
$('#form-busqueda').submit(function (e) {
    e.preventDefault();
    fnListarCotizaciones();
});
$(document).on('click', '.btnimprimir', function () {
    var href = $(this).attr('href'); console.log(href);
    if (href != '')
        ABRIR_MODALIMPRECION(href, 'IMPRIMIR PROFORMA');
});
$(document).on('click', '.btnduplicar', function () {
    var href = this.getAttribute('href');
    swal({
        title: '¿DESEA DUPLICAR PROFORMA?',
        text: "",
        type: 'warning',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'Cancelar',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Aceptar',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            var a = document.createElement('a');
            a.href = href;
            a.target = "_blank";
            a.click();
        }
        else
            swal.close();
    });
});
$(document).on('click', '.btnemail', function () {
    var id = $(this).attr('idproforma');
    console.log(this.parentNode.parentNode.parentNode);
    txtasuntoemail.value = "Proforma  N°" + this.parentNode.parentNode.parentNode.getElementsByTagName('td')[1].innerText;
    $('#modalcorreos').modal('show');
    _IDTABLACORREO = id;
    fnlistaremailsenvio(id);
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
        destinatarios: emails
    }
    BLOQUEARCONTENIDO('modalcorreos', 'Enviando email...');
    let controller = new CotizacionController();
    controller.EnviarEmail(obj, function () {

    });
});
