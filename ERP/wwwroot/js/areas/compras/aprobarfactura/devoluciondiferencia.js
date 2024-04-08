var tblfactura = document.getElementById('tblfactura');
var tbodydetalle = document.getElementById('tbodydetalle');
var btnimprimirdevoluciondiferencia = document.getElementById('btnimprimirdevoluciondiferencia');
var btnbusqueda = document.getElementById('btnbusqueda');

let arrayFilaSeleccionada = [];
let dataPorPagina = 15;
let totalpaginas = 0;
let paginaactual = 1;
var dataFuera;

$(document).ready(function () {
    fnbuscarfactura();
});
function fnbuscarfactura() {
    var obj = $('#form-busqueda').serializeArray();
    obj[obj.length] = { name: 'top', value: 100 };

    BLOQUEARCONTENIDO('contenedorTabla', 'Buscando facturas');
    var controller = new AprobarFacturaController();
    controller.ListarFacturasParaNotaCredito(obj, fnagregarfacturas);
    
}
function fnagregarfacturas(response) {
    DESBLOQUEARCONTENIDO('contenedorTabla');
    var data = response;
    dataFuera = response;
    if (data.length % dataPorPagina > 0.00)
        totalpaginas = parseInt(data.length / dataPorPagina) + 1;
    else
        totalpaginas = parseInt(data.length / dataPorPagina);

     var iniciaEn = ((paginaactual - 1) * dataPorPagina);
    var terminaEn = 0;
    if (iniciaEn + dataPorPagina > data.length)
        terminaEn = data.length;
    else
        terminaEn = iniciaEn + dataPorPagina;

    var fila = '';
    for (var i = iniciaEn; i < terminaEn; i++) {

        var grupoBotones = '';
        var estadoNotaCredito = '';
        var btnValidacion = '<button class="btn btn-sm btn-warning ml-1" onClick="fModalValidarUsuario(' + data[i]["IDFACTURA"] + ')" data-toggle="tooltip" title="Validar Nota de Crédito"><i class="fas fa-check"></i></button>';
        var btnImprimir = '<button class="btn btn-sm btn-outline-info btnimprimirdevoluciondiferencia font-10" data-toggle="tooltip" data-placement="top" title="Imprimir NC Devolucion - Diferencia" target="_blank" href="' + ORIGEN + '/Compras/CAprobarFactura/ImprimirDevolucionDiferencia/' + data[i]["IDFACTURA"] + '"><i class="fas fa-print"></i></button>';
        if (data[i]["ESTADONC"] == null) {
            grupoBotones = btnValidacion + btnImprimir;
            estadoNotaCredito = '<select class="form-control cmbestadoNotaCredito" readonly><option value="PENDIENTE">PENDIENTE</option><option value="APROBADO"> APROBADO</option><option value="RECHAZADO"> RECHAZADO</option></select>';
        }
        else if (data[i]["ESTADONC"] == "PENDIENTE") {
            grupoBotones = btnImprimir;
            estadoNotaCredito = '<div class="bg-info text-white p-2 cmbestadoNotaCredito">PENDIENTE</div>';
        }
        else if (data[i]["ESTADONC"] == "APROBADO") {
            grupoBotones = btnImprimir;
            estadoNotaCredito = '<div class="bg-success text-white p-2 cmbestadoNotaCredito">APROBADO</div>';
        }
        else if (data[i]["ESTADONC"] == "RECHAZADO") {
            grupoBotones = btnImprimir;
            estadoNotaCredito = '<div class="bg-danger text-white p-2 cmbestadoNotaCredito">RECHAZADO</div>';
        }

        fila += '<tr idfactura="' + data[i]["IDFACTURA"] + '" numdoc="' + data[i]["NUMFACTURA"] + '" >';
        fila += '<td hidden><span class="index_detalle">' + i + '</span></td>'
        fila += '<td class="details-control" ></td>';
        fila += '<td><div clasS="btn-group">' + grupoBotones + '</div></td>';
        fila += '<td class="codigofactura">' + data[i]["IDFACTURA"] + '</td>';
        fila += '<td>' + data[i]["NUMFACTURA"] + '</td>';
        fila += '<td>' + (data[i]["NOMBRECOMPLETONC"] ?? '') + '</td>';
        fila += '<td>' + (moment(data[i]["FECHANC"]).format('DD/MM/YYYY hh:mm')) + '</td>';
        fila += '<td>' + (data[i]["DEVOLUCION"] ?? '') + '</td>';
        fila += '<td>' + (data[i]["DIFDESCUENTO"] ?? '') + '</td>';
        fila += '<td>' + estadoNotaCredito + '</td>';
        fila += '</tr>';
        fila += '<tr id="row' + data[i]["IDFACTURA"] + '" class="hijo"></tr>';
        opciones = '';
    }
    tbodydetalle.innerHTML = fila;

    var pagine = new UtilsSisqf();
    pagine.PaggingTemplate(totalpaginas, paginaactual, 'linkpaginacion', 'paginacion');
}

function fnagregardetalle(idfactura, fila) {
    let controller = new AprobarFacturaController();
    controller.BuscarDetallePorFacturaParaNotaCredito(idfactura, function (data) {
        var numfilas = tblfactura.getElementsByTagName('thead')[0].getElementsByTagName('th');
        var cabecera = '<td class="text-center" colspan="' + numfilas.length + '"><table class="text-center table-bordered" style="width:80%;font-size:13px;margin-left:30px"><tr> <th>Id </th><th>Tipo </th> <th style="width:50%">Detalle</th> <th>COD. Producto</th> <th>Cant. Ing.</th> <th>Cant. Dev. </th> <th>Importe Dev. </th> <th>Importe Dif. </th> </tr>'
        var cuerpo = "<tbody>";
        for (var i = 0; i < data.length; i++) {
            if (data[i].CANDEVUELTA > 0 || data[i].DIFERENCIA > 0) {
                cuerpo += '<tr class="hijo">' +
                    "<td>" + data[i].ID + "</td>" +
                    "<td>" + data[i].TIPOPRODUCTO + "</td>" +
                    "<td>" + data[i].PRODUCTO + "</td>" +
                    "<td>" + data[i].CODPRODUCTO + "</td>" +
                    "<td>" + data[i].CANINGRESADA + "</td>" +
                    "<td>" + data[i].CANDEVUELTA + "</td>" +
                    "<td>" + data[i].DEVOLUCION + "</td>" +
                    "<td>" + data[i].DIFERENCIA + "</td>";
                cuerpo += "</tr > ";
            }
        }
        fila.innerHTML = cabecera + cuerpo + "</tbody></table></td>";
    });
}

$('#tbodydetalle').on('click', 'tr', function () {
    var filas = document.querySelectorAll('#tbodydetalle tr');
    filas.forEach(function (e) {
        e.classList.remove('selected');
    });
    if (!this.classList.contains('hijo'))
        this.classList.add('selected');
});
$('#tbodydetalle').on('click', 'tr td.details-control', function () {
    var fila = this.parentNode;
    var idfactura = fila.getAttribute('idfactura');
    //var numdoc = fila.getAttribute('numdoc');
    var filahija = document.getElementById('row' + idfactura);
    if (fila.classList.contains('details')) {
        fila.classList.remove('details');
        filahija.innerHTML = '';
    }
    else {
        fila.classList.add('details');
        $('#row' + idfactura).show();
        fnagregardetalle(idfactura, filahija);
    }
});
$(document).on('click', '.linkpaginacion', function () {
    var numpagina = this.getAttribute('numpagina');
    paginaactual = parseInt(numpagina);
    fnagregarfacturas(dataFuera);
    var pages = document.getElementsByClassName('linkpaginacion');
    //for (var i = 0; i < pages.length; i++) {
    //    pages[i].classList.remove('activelink');
    //}
    this.classList.add('activelink');
});

$(document).on('click', '.btnimprimirdevoluciondiferencia', function () {
    var href = $(this).attr('href');
    if (href != '')
        ABRIR_MODALIMPRECION(href, 'IMPRIMIR NC DEVOLUCION - DIFERENCIA');
});

function fModalValidarUsuario(idfactura) {
    $('#modalvalidarusuario').modal('show');
}
$('#form-validarusuario').submit(function (e) {
    e.preventDefault();
    var url = ORIGEN + "/Compras/CAprobarFactura/VerificarCredenciales_AprobarFactura";
    var obj = $('#form-validarusuario').serializeArray();
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            validarNotaDeCredito(arrayFilaSeleccionada[0], arrayFilaSeleccionada[1]);
            $('#modalvalidarusuario').modal('hide');
        }
        else if (data.mensaje === "Credenciales incorrectas") {
            mensaje("I", "Usuario o contraseña son incorrectas");
        } else
            mensaje('I', data.mensaje);
    }).fail(function (data) {
        mensaje("D", "Error en el servidor");
    });
    $('#form-validarusuario').trigger('reset');
});

$(document).on('click', '.selected', function () {
    arrayFilaSeleccionada = [];
    let valorindex = parseInt((this).childNodes[0].innerText);
    let numDatosRecorridos = (dataPorPagina * (paginaactual - 1));
    let nuevoIndex = valorindex - numDatosRecorridos;
    let idfactura = parseInt(document.getElementsByClassName("codigofactura")[nuevoIndex].innerText);
    let valorCombo = document.getElementsByClassName("cmbestadoNotaCredito")[nuevoIndex].value;
    arrayFilaSeleccionada.push(idfactura);
    arrayFilaSeleccionada.push(valorCombo);
});

function validarNotaDeCredito(idfactura, estadoNC) {
    let controller = new AprobarFacturaController();
    var obj = {
        idfactura: idfactura,
        estadoNC: estadoNC
    }
    controller.ValidarNotaDeCredito(obj, function (data) {
        if (data.mensaje == "ok") {
            fnbuscarfactura();
            alertaSwall('S', 'NOTA DE CREDITO VALIDADA', '');
            arrayFilaSeleccionada = [];
        }
        else {
            alertaSwall('D', 'Error al anular la factura.', '');
        }
    });
}
btnbusqueda.addEventListener('click', function () {
    fnbuscarfactura();
});