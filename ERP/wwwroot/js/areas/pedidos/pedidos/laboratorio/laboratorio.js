var cmbestado = document.getElementById('cmbestado');
var txtsucursal = document.getElementById('txtsucursal');
var txtfechainicio = document.getElementById('txtfechainicio');
var txtfechafin = document.getElementById('txtfechafin');
var txthorainicio = document.getElementById('txthorainicio');
var txthorafin = document.getElementById('txthorafin');
var cmbpaciente = document.getElementById('cmbpaciente');
var cmbcliente = document.getElementById('cmbcliente');
var txtlaboratorio = document.getElementById('txtlaboratorio');
var btnconsultar = document.getElementById('btnconsultar');

var btnModalAsignados = document.getElementById('btnModalAsignados');
var btnModalRecepcionados = document.getElementById('btnModalRecepcionados');

var listaLaboratorio = [];

var tbodydetalle = document.getElementById('tbodydetalle');
var tblpedidos = document.getElementById('tblpedidos');

var _idpedidofila = '';
var btnimprimir = `<div class="input-group-append">
        <button type="button" class="btn btn-dark btn-sm " data-toggle="dropdown" aria-expanded="false">
            <i class="fas fa-print"></i>
        </button>
        <div class="dropdown-menu" style="">
            <a class="dropdown-item btnimprimirformato1" href="#">Formato completo</a>
            <a class="dropdown-item btnimprimirformato2" href="#">Formato cliente</a>            
        </div>
    </div>`;
var obspedido = `<div class="btn-group dropright mb-1 btnsettings">
                  
                        <button type="button" class="@@obsp  btn-sm dropdown-toggle dropdown-toggle-split opacity-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                          <span class="sr-only"></span>
                         <i class="fas fa-cog"></i>
                        </button>`
//px - 2 btn btn - green
var option = `<div class="dropdown-menu" style="position: absolute; transform: translate3d(145px, 0px, 0px); top: 0px; left: 0px; will-change: transform;" x-placement="right-start">
                         @@items
                        </div>
                      </div>`;



$(document).ready(function () {
    init();
    fnbuscarpedidos();
    //fnNumPedidosPendientes();
    $("#txtfiltrotabladetalle").val("");
});
function init() {
    let cliente = new ClienteController();
    var fn = cliente.BuscarClientesSelect2('documento');
    $('#cmbcliente').select2({
        allowClear: true,
        ajax: fn,
        width: '100%',
        placeholder: "Ingrese número de documento",
    });
    let paciente = new PacienteController();
    var fn = paciente.BuscarPacientesSelect2('documento');
    $('#cmbpaciente').select2({
        allowClear: true,
        ajax: fn,
        width: '100%',
        placeholder: "Ingrese número de documento",
    });
    if (txtsucursal.getAttribute('tipo') == 'select') {
        let sucursal = new SucursalController();
        sucursal.ListarTodasSucursales('txtsucursal', null, null, true);
        sucursal.ListarSucursalesByTipoLocal('txtlaboratorio', 'PRODUCCIÓN', true);
    }
    setTimeout(function () {
        let controller = new LaboratorioPedidoController();
        controller.BuscarPedidosDevueltos(null, function (data) {
            data = JSON.parse(data);
            var men = '';
            for (var i = 0; i < data.length; i++) {
                men += 'El pedido ' + data[i].codpedido + ' del ' + moment(data[i].fecha).format('DD/MM/YYY hh:mm') + ' ha sido DEVUELTO \n';
            }
            if (data.length > 0) {
                alertaSwall('I', 'EXISTEN PEDIDOS DEVUELTOS', men);
            }

        });
    }, 5000);

    let controller = new SucursalController();
    controller.ListarSucursalesByTipoLocalSinCombo("PRODUCCIÓN", function (data) {
        listaLaboratorio = data;
        var combo = document.getElementById("MDLAlaboratorioorigen");
        combo.innerHTML = '';
        var option = document.createElement('option');
        option.text = '[SELECCIONE]';
        option.value = '';
        combo.appendChild(option);
        for (var i = 0; i < listaLaboratorio.length; i++) {
            option = document.createElement('option');
            option.text = data[i].sucursal;
            option.value = data[i].idsucursal;
            combo.appendChild(option);
        }
    });

    var actualizarDetallesPedidosAsignados = function () {
        fnObtenerNumeroDetallePedidosAsignados(txtlaboratorio.value);
        fnObtenerNumeroDetallePedidosRecepcionados(txtlaboratorio.value);
    };

    //actualizarDetallesPedidosAsignados();
    //var intervalo = setInterval(actualizarDetallesPedidosAsignados, 3000);

    //var alertaPedidoSegunComplejidad = function () {
    //    fnAlertaDetalleSegunComplejidad();
    //};

    //alertaPedidoSegunComplejidad();
    //var intervalo = setInterval(alertaPedidoSegunComplejidad, 60000);
}

function formatarFecha(fecha) {
    if (fecha === "") {
        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        return `${day}/${month}/${year}`;
    } else {
        // Verifica si la fecha está en formato "año-mes-día"
        if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            var parts = fecha.split('-');
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return fecha;  // La fecha ya está en formato "día/mes/año"
    }
}
function fnbuscarpedidos(numpagina, tammano) {
    let controller = new LaboratorioPedidoController();
    var obj = {
        pagine: {
            tamanopagina: tammano ?? 20,
            numpagina: numpagina ?? 1
        },
        fechainicio: formatarFecha(txtfechainicio.value),
        fechafin: formatarFecha(txtfechafin.value),
        horainicio: txthorainicio.value,
        horafin: txthorafin.value,
        sucursal: txtsucursal.value,
        estadopedido: cmbestado.value,
        laboratorio: txtlaboratorio.value
        //cliente: cmbcliente.value,
        //paciente: cmbpaciente.value,
        //porusuario: checkusuario.checked
    };
    BLOQUEARCONTENIDO('carddetalle', 'Buscando pedidos');
    controller.ListarPedidosLaboratorio(obj, fnagregarpedido, function () { DESBLOQUEARCONTENIDO('carddetalle'); });
}
function fnagregarpedido(response) {

    DESBLOQUEARCONTENIDO('carddetalle');
    var data = response.data;
    var fila = '';
    var lblestado = '';
    var opciones = '';
    var obs = '';

    for (var i = 0; i < data.length; i++) {

        var btnlast = '';
        var estado = data[i].estadopedido;
        var inputnumboleta = '<label style="font-size:12px" class="border font-weight-bold text-center txtnumeroboleta" contenteditable ="true"> ' + data[i].numboleta + '</label> ';
        var inputordenproduccion = '<label style="font-size:12px" class="border font-weight-bold text-center txtordenproduccion" contenteditable ="true"> ' + data[i].ordenproduccion + '</label> ';
        //modificado 22/07
        //inputnumboleta = data[i].numboleta;
        //if (estado != 'PENDIENTE' && estado != 'EN PROCESO') {
        //    inputordenproduccion = data[i].ordenproduccion;
        //}
        //
        if (estado != 'PENDIENTE' && estado != 'EN PROCESO') {
            inputnumboleta = data[i].numboleta;
            inputordenproduccion = data[i].ordenproduccion;
        }
        opciones += ' <a class="dropdown-item btnverpedido" href="#"><i class="fas fa-eye ml-1- mr-1 text-info"></i>Ver pedido</a>';

        if (estado === 'PENDIENTE') {
            lblestado = '<span class="badge badge-info" style="font-size:9px"><i class="fas fa-flag"></i> ' + estado + '</span>';
            opciones += ' <a class="dropdown-item  btneditarpedido" href="#"><i class="fas fa-edit ml-1- mr-1 text-warning"></i>Editar Pedido</a>';
            opciones += '<div class="dropdown-divider"></div>'
            opciones += ' <a class="dropdown-item  btndificultad" href="#"><i class="fas fa-adjust ml-1- mr-1 text-dark"></i>Dificultad</a>';
            opciones += ' <a class="dropdown-item  btntransferir" href="#"><i class="fas fa-truck ml-1- mr-1 text-dark"></i>Transferir</a>';

        }
        else if (estado === 'EN PROCESO') {
            lblestado = '<span class="badge badge-warning" style="font-size:9px"><i class="fas fa-stopwatch"></i> ' + estado + '</span>';
            if ((data[i].numboleta ?? '').length > 0)
                btnlast += '<button class="btn btn-sm btn-dark btnfinalizarpedido" data-toggle="tooltip" title="Finalizar pedido"><i class="fas fa-check"></i></button>'
        }
        else if (estado === 'TERMINADO') {
            lblestado = '<span class="badge badge-dark" style="font-size:9px"><i class="fas fa-check"></i> ' + estado + '</span>';
        }
        else if (estado === 'ENTREGADO') {
            lblestado = '<span class="badge badge-success" style="font-size:9px"><i class="fas fa-calendar-check"></i> ' + estado + '</span>';
        }
        else if (estado === 'DEVUELTO') {
            lblestado = '<span class="badge badge-danger" style="font-size:9px"><i class="fas fa-truck-loading"></i> ' + estado + '</span>';
            opciones += '<a class="dropdown-item btndevolverlab"><i class="fas fa-arrow-down"></i> Descargar</button>';
        }
        else if (estado === 'ELIMINADO') {
            lblestado = '<span class="badge badge-danger" style="font-size:9px"><i class="fas fa-stopwatch"></i> ' + estado + '</span>';
        }
        else if (estado === 'DESCARGADO') {
            lblestado = '<span class="badge badge-danger" style="font-size:9px"><i class="fas fa-stopwatch"></i> ' + estado + '</span>';
        }
        else
            lblestado = '<span class="badge badge-dark" style="font-size:9px"><i class="fas fa-truck"></i> ' + estado + '</span>';


        opciones += ' <a class="dropdown-item  btnetiqueta" href="#"><i class="fas fa-ticket-alt ml-1- mr-1 text-dark"></i>Etiqueta</a>';

        var icono = '';
        if (data[i].tipoformulacion == 'VETERINARIA')
            icono = '<button class="btn btn-sm btn-melon"><i class="fas fa-paw"></i></button>';
        else if (data[i].tipoformulacion == 'CANNABIS')
            icono = '<button class="btn btn-sm btn-success"><i class="fas fa-cannabis"></i></button>';
        var isdelivery = '';
        if (data[i].tiporegistro == 'DELIVERY')
            isdelivery = '<button class="btn btn-sm btn-info" data-toggle="tooltip" data-placement="top" title="El pedido es delivery"><i class="fas fa-truck"></i></button>';
        var tieneobservacion = '';
        if (data[i].observacion ?? '' != '') {
            tieneobservacion = 'table-info';
            obs = 'px-2 btn btn-red';
        }
        else {
            obs = 'px-2 btn btn-green'
        }

        fila += '<tr idpedido="' + data[i].idpedido + '" nrodocumento="' + data[i].nrodocumento + '">';
        fila += '<td class="details-control" ></td>';
        fila += '<td class="' + tieneobservacion + '">' + obspedido.replace('@@obsp', obs) + option.replace('@@items', opciones) + '</td>';
        fila += '<td class="' + tieneobservacion + '">' + btnimprimir + '</td>';
        fila += '<td class="text-center  ' + tieneobservacion + '">' + data[i].idpedido + '</br>' + icono + isdelivery + '</td>';
        fila += '<td>' + data[i].sucursal + '</td>';
        fila += '<td>' + (moment(data[i].fecha).format('DD/MM/YYYY hh:mm')) + '</td>';
        //fila += '<td>' + (data[i].laboratorio ?? '') + '</td>';
        fila += '<td>' + (data[i].cliente ?? '') + '</td>';
        fila += '<td>' + (data[i].docpaciente ?? '') + '</td>';
        fila += '<td>' + (data[i].paciente ?? '') + '</td>';
        fila += '<td>' + (data[i].cmp) + '</td>';
        fila += '<td>' + (data[i].medico) + '</td>';

        fila += '<td class="text-right">' + (data[i].total ?? 0).toFixed(2) + '</td>';
        fila += '<td class="text-right">' + (data[i].adelanto ?? 0).toFixed(2) + '</td>';
        fila += '<td class="text-right">' + (data[i].saldo ?? 0).toFixed(2) + '</td>';
        fila += '<td>' + (data[i].nomusuario ?? '') + '</td>';
        fila += '<td>' + (data[i].fechadeliveryentrega ?? '') + '</td>';
        fila += '<td class="estado">' + lblestado + '</td>';
        fila += '<td class="numboleta">' + inputnumboleta + '</td>';
        fila += '<td class="ordenproduccion">' + inputordenproduccion + '</td>';
        fila += '<td class="ultimafila">' + btnlast + '</td>';
        fila += '</tr>';
        fila += '<tr id="row' + data[i].idpedido + '" class="hijo"></tr>';
        opciones = '';
    }
    tbodydetalle.innerHTML = fila;
    CEfnagregardatosetiqueta(response.dataobject, response.numregistros);
    var pagine = new UtilsSisqf();
    pagine.PaggingTemplate(response.totalpaginas, response.paginaactual, 'linkpaginacion', 'paginacion');

}
function fnagregardetalle(idpedido, nrodocumento, fila) {
    let controller = new PedidoController();
    controller.BuscarDetallePedido(idpedido, function (data) {
        var numfilas = tblpedidos.getElementsByTagName('thead')[0].getElementsByTagName('th');
        var cabecera = '<td class="text-center" colspan="' + numfilas.length + '"><table class="text-center table-hover" style="width:80%;font-size:13px;margin-left:30px"><tr> <th>Id </th><th>Tipo </th> <th style="width:50%">Detalle</th> <th>COD. Precio</th> <th>Unidades</th> <th>Precio </th> <th>Total </th>  </tr>'
        var cuerpo = "<tbody>";
        for (var i = 0; i < data.length; i++) {

            cuerpo += '<tr class="hijo">' +
                "<td>" + data[i].iddetalle + "</td>" +
                "<td>" + data[i].tipoitem + "</td>" +
                "<td>" + data[i].formula + "</td>" +
                "<td>" + (data[i].codprecioanterior ?? '') + "</td>" +
                '<td class="text-right">' + data[i].cantidad + '</td>' +
                '<td class="text-right">' + (data[i].precio ?? 0).toFixed(2) + "</td>" +
                '<td class="text-right">' + (data[i].subtotal ?? 0).toFixed(2) + "</td>";
            if (data[i].hasdetalleformula != 'x') {
                var idprecio = '';
                if (data[i].hasdetalleformula == 'actual')
                    idprecio = data[i].idprecio;
                if (data[i].hasdetalleformula == 'anterior')
                    idprecio = data[i].idcatalagocodigo;
                cuerpo += '<td><button class="btn btn-sm btn-info btnverdetalleproducto" onclick="MODALLISTACLIENTE_buscarArticulo(' + data[i]['idproducto'] + ',' + nrodocumento + ')" iddetalle="' + data[i].iddetalle + '" tipo="' + data[i].hasdetalleformula + '"><i class="fas fa-ticket-alt"></i></button></td>';

            }
            fila.innerHTML = cabecera + cuerpo + "</tbody></table></td>";
        }
    });


}
btnconsultar.addEventListener('click', function () {
    fnbuscarpedidos();
    MDDIFPListar(1);
    MDDIFPListar(2);
    MDDIFPListar(3);
    //fnNumPedidosPendientes();
});
$(document).on('click', '.linkpaginacion', function () {
    var numpagina = this.getAttribute('numpagina');
    fnbuscarpedidos(numpagina, 20);
    var pages = document.getElementsByClassName('linkpaginacion');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('activelink');
    }
    this.classList.add('activelink');
});
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
    var idpedido = fila.getAttribute('idpedido');
    var nrodocumento = fila.getAttribute('nrodocumento');
    var filahija = document.getElementById('row' + idpedido);
    if (fila.classList.contains('details')) {
        fila.classList.remove('details');
        filahija.innerHTML = '';
    }
    else {
        fila.classList.add('details');

        $('#row' + idpedido).show();
        fnagregardetalle(idpedido, nrodocumento, filahija);
    }
});
$(document).on('click', '.btnsettings', function () {


});
$(document).on('click', '.btnverpedido', function () {
    var fila = $(this).parents('tr')[0];
    var idpedido = fila.getAttribute('idpedido');
    MVPpedidotab.click();
    MVPbuscarpedido(idpedido);

});
$(document).on('click', '.btndelivery', function () {
    var fila = $(this).parents('tr')[0];
    var idpedido = fila.getAttribute('idpedido');
    MVPbuscarpedido(idpedido);
    MVPdeliverytab.click();
});
$(document).on('click', '.btndevolverlab', function () {
    var fila = $(this).parents('tr')[0];
    var idpedido = fila.getAttribute('idpedido');
    _idpedidofila = idpedido;
    MVUtxttipo.value = 'descargarlab';
    $('#modalvalidarusuario').modal('show');

});
$(document).on('click', '.btneditarpedido', function () {
    var fila = $(this).parents('tr')[0];
    var idpedido = fila.getAttribute('idpedido');
    MEDPlblnumpedido.innerText = idpedido;
    MEDPfneditarpedido(idpedido);

});
$(document).on('click', '.btndificultad', function () {
    var fila = $(this).parents('tr')[0];
    var idpedido = fila.getAttribute('idpedido');
    $('#modaldificultad').modal('show');
    MDDIPlblnumpedido.innerText = idpedido;
    MDDIPfnbuscardetalle(idpedido);
});

$(document).on('click', '#difBaja', function () {
    textDif.textContent = 'Baja';
    MDDIFPListar(3);
    $('#modalverdifpedido').modal('show');
});

$(document).on('click', '#difMedia', function () {
    textDif.textContent = 'Media';
    MDDIFPListar(1);
    $('#modalverdifpedido').modal('show');
});

$(document).on('click', '#difAlta', function () {
    textDif.textContent = 'Alta';
    MDDIFPListar(2);
    $('#modalverdifpedido').modal('show');
});

$(document).on('click', '.btntransferir', function () {
    var fila = $(this).parents('tr')[0];
    var idpedido = fila.getAttribute('idpedido');
    $('#modaltransferirpedido').modal('show');
    MTPlblnumpedido.innerText = idpedido;
});

$(document).on('click', '.btnetiqueta', function () {
    var fila = $(this).parents('tr')[0];
    var idpedido = fila.getAttribute('idpedido');

    editarEtiqueta(idpedido);
});

$(document).on('keyup', '.txtordenproduccion', function (e) {
    var fila = this.parentNode.parentNode;
    var idpedido = fila.getAttribute('idpedido');
    var orden = this.innerText;
    if (e.key == 'Enter') {
        if (orden.length >= 4) {
            var obj = {
                idpedido: idpedido,
                orden: orden
            }
            let controller = new LaboratorioPedidoController();
            controller.IngresarOrdenProduccion(obj, () => {
                mensaje('S', 'Se actualizo el pedido a PROCESO');
                fila.getElementsByClassName('estado')[0].innerHTML = '<span class="badge badge-warning" style="font-size:9px"><i class="fas fa-stopwatch"></i>EN PROCESO</span>';
            });
        }
    }
});
$(document).on('keyup', '.txtnumeroboleta', function (e) {
    var fila = this.parentNode.parentNode;
    var idpedido = fila.getAttribute('idpedido');
    var numdocumento = this.innerText;
    if (e.key == 'Enter') {
        if (numdocumento.length >= 1) {
            var obj = {
                idpedido: idpedido,
                numdocumento: numdocumento
            }
            let controller = new LaboratorioPedidoController();
            controller.IngresarNumDocumento(obj, () => {
                mensaje('S', 'Se actualizo el número de documento del pedido');
                fila.getElementsByClassName('ultimafila')[0].innerHTML = '<button class="btn btn-sm btn-dark btnfinalizarpedido" data-toggle="tooltip" title="Finalizar pedido"><i class="fas fa-check"></i></button>';
            });
        }
    }

});

$("#txtfiltrotabladetalle").on("keyup", function () {
    var value = $(this).val().toLowerCase();

    $("#tbodydetalle tr").filter(function () {

        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)

    });
});

$(document).on('click', '.btnfinalizarpedido', function () {
    var fila = $(this).parents('tr')[0];
    var idpedido = fila.getAttribute('idpedido');
    MTPlblnumpedido.innerText = idpedido;
    $('#modalterminarpedido').modal('show');
    MDDIPfnbuscardetalleformula(idpedido);
});

MVUbtnaceptar.addEventListener('click', function () {
    if (MVUtxttipo.value != 'descargarlab')
        return;
    MVUfnvalidarcredenciales(function (data) {
        var obj = {
            idquimico: data.idempleado,
            idpedido: _idpedidofila
        };
        let controller = new LaboratorioPedidoController();
        controller.DescargarPedidoDevuelto(obj, function (data) {
            mensaje('S', 'Pedido descargado');
            var fila = tbodydetalle.getElementsByClassName('selected')[0];
            fila.getElementsByClassName('estado')[0].innerHTML = '<span class="badge badge-danger" style="font-size:9px"><i class="fas fa-stopwatch"></i>DESCARGADO</span>';

        });
    });
});
$(document).on('click', '.btnimprimirformato1', function () {
    var fila = $(this).parents('tr')[0];
    var idpedido = fila.getAttribute('idpedido');
    var href = ORIGEN + '/Pedidos/Pedido/Imprimirformato1/' + idpedido;
    ABRIR_MODALIMPRECION(href, 'IMPRIMIR PEDIDO');

});
$(document).on('click', '.btnimprimirformato2', function () {
    var fila = $(this).parents('tr')[0];
    var idpedido = fila.getAttribute('idpedido');
    var href = ORIGEN + '/Pedidos/Pedido/Imprimirformato2/' + idpedido;
    ABRIR_MODALIMPRECION(href, 'IMPRIMIR PEDIDO');
});

//$(document).on('click', '.btnverdetalleproducto', function () {
//    var fila = this.parentNode.parentNode;
//    let controller = new PedidoController();
//    var obj = {
//        tipo: this.getAttribute('tipo'),
//        iddetalle: this.getAttribute('iddetalle')
//    };
//    controller.DatosAdicionalesDetallePrecio(obj, function (data) {

//        $('#modaldatosadicionalesprecioproducto').modal('show');
//        MDAPlblnombre.innerText = data.nombre??'';
//        MDAPlblformulacion.innerText = data.formulacion ?? '';
//        MDAPlblpresentacion.innerText = data.presentacion??'';
//        MDAPlbletiqueta.innerText = data.etiqueta ?? '';
//        MDAPlblobservaciones.innerText = data.observacion??'';
//    });
//});

function MODALLISTACLIENTE_buscarArticulo(id, numdoc) {
    $('#MPC_h5').text('DATOS ADICIONALES DEL PEDIDO');
    var obj = {
        idcliente: numdoc,
        idproducto: id
    };
    let controller = new PedidoController();
    controller.Listarxproductocliente(obj, function (data) {
        limpiarTablasGeneradas('#contenedor', 'MPC_tbllista', false);
        crearCabeceras(data, '#MPC_tbllista', false);
        crearCuerpo(data, '#MPC_tbllista');
        iniciarTabla();
    });

    $('#MPC_modalprecioscliente').modal('show');
    //MPC_tbllista.clear().draw(false);
    //$.post(url, obj).done(function (data) {
    //    console.log(data);
    //    if (data != null)
    //        MPC_tbllista.row.add([
    //            data.catalago_codigo,
    //            data.codigoPrecio,
    //            data.codigocliente,
    //            data.articulo,
    //            data.formulacion,
    //            data.presentacion,
    //            data.etiqueta,
    //            data.precio.toFixed(2),
    //            data.observacion,
    //            ''
    //        ]).draw(false);
    //}).fail(function (data) {
    //    console.log(data);
    //    mensaje("D", 'Error en el servidor.');
    //});
}

function iniciarTabla() {
    tblpedidos = $('#tblpedidos').DataTable({
        destroy: true,
        "searching": false,
        "paging": true,
        lengthChange: false,
        "lengthMenu": [[20, 25, 50, -1], [20, 25, 50, "All"]],
        "ordering": false,
        "info": false,
    });
}
//function fnNumPedidosPendientes() {
//    let controller = new PedidoController();
//    var obj = {
//        suc_codigo: txtsucursal.value
//    };
//    controller.BuscarNumeroPedidosPendientes(obj, function (data) {
//        var data = JSON.parse(data);
//        var numPedidos = data[0]["NUMPEDIDO"];
//        var sMensaje = "Pedidos pendientes: " + numPedidos + ".";
//        if (txtsucursal.value != "") {
//            sMensaje = "La sucursal cuenta con " + numPedidos + " pedidos pendientes.";
//        }

//        mensaje('W', sMensaje);
//    });
//}

btnModalAsignados.addEventListener("click", function () {
    MDDLAListar(txtlaboratorio.value);
    $('#modaldetallelaboratorioasignado').modal('show');
});

btnModalRecepcionados.addEventListener("click", function () {
    MDDLRListar(txtlaboratorio.value);
    $('#modaldetallelaboratoriorecepcionado').modal('show');
});

function fnObtenerNumeroDetallePedidosAsignados(idlaboratorio) {
    var obj = {
        idlaboratorio: idlaboratorio
    };
    let controller = new LaboratorioPedidoController();
    controller.ObtenerNumeroDetallePedidosAsignados(obj, (data) => {
        if (data.length > 0)
            btnModalAsignados.innerText = "ASIGNADOS: " + data[0].cantidadProductosAsignados;
        else
            btnModalRecepcionados.innerText = "ASIGNADOS: 0";
    });
}
function fnObtenerNumeroDetallePedidosRecepcionados(idlaboratorio) {
    var obj = {
        idlaboratorio: idlaboratorio
    };
    let controller = new LaboratorioPedidoController();
    controller.ObtenerNumeroDetallePedidosRecepcionados(obj, (data) => {
        if (data.length > 0)
            btnModalRecepcionados.innerText = "RECEPCIONAR: " + data[0].cantidadProductosRecepcionados;
        else
            btnModalRecepcionados.innerText = "RECEPCIONAR: 0";
    });
}

function fnAlertaDetalleSegunComplejidad() {
    var obj = {
        suc_codigo: txtsucursal.value,
        idlaboratorio: txtlaboratorio.value,
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value
    };
    let controller = new LaboratorioPedidoController();
    controller.AlertaDetalleSegunComplejidad(obj, (data) => {
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                mensaje("W", data[i].Mensaje, null, 10000);
            }
        }
    });
}