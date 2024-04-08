var cmbestado = document.getElementById('cmbestado');
var txtsucursal = document.getElementById('txtsucursal');
var txtfechainicio = document.getElementById('txtfechainicio');
var txtfechafin = document.getElementById('txtfechafin');
var txthorainicio = document.getElementById('txthorainicio');
var txthorafin = document.getElementById('txthorafin');
var cmbpaciente = document.getElementById('cmbpaciente');
var cmbcliente = document.getElementById('cmbcliente');
var checkusuario = document.getElementById('checkusuario');
var btnconsultar = document.getElementById('btnconsultar');


var tbodydetalle = document.getElementById('tbodydetalle');
var tblpedidos = document.getElementById('tblpedidos');
var btnimprimir = `<div class="input-group-append">
        <button type="button" class="btn btn-dark  btn-sm " data-toggle="dropdown" aria-expanded="false">
            <i class="fas fa-print"></i>
        </button>
        <div class="dropdown-menu" style="">
            <a class="dropdown-item btnimprimirformato1" href="#">Formato completo</a>
            <a class="dropdown-item btnimprimirformato2" href="#">Formato cliente</a>            
        </div>
    </div>`;
//var option = `<div class="btn-group dropright mb-1 btnsettings">
                  
//                        <button type="button" class="px-2 btn btn-green  btn-sm dropdown-toggle dropdown-toggle-split opacity-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
//                          <span class="sr-only"></span>
//                         <i class="fas fa-cog"></i>
//                        </button>
//                        <div class="dropdown-menu btnaccionespedido" style="position: absolute; transform: translate3d(145px, 0px, 0px); top: 0px; left: 0px; will-change: transform;" x-placement="right-start">
//                         @@items
//                        </div>
//                      </div>`;

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
    }

}
function fnbuscarpedidos(numpagina, tammano) {
    let controller = new PedidoController();
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
        cliente: cmbcliente.value,
        paciente: cmbpaciente.value,
        porusuario: checkusuario.checked,
        tipo: cmbtipo.value
    };
    // Verifica si fechainicio está vacío y establece la fecha actual en formato día/mes/año si es así
  

    BLOQUEARCONTENIDO('carddetalle', 'Buscando pedidos');
    controller.ListarPedidosVista(obj, fnagregarpedido, function () { DESBLOQUEARCONTENIDO('carddetalle'); });
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

function fnagregarpedido(response) {

    DESBLOQUEARCONTENIDO('carddetalle');
    var data = response.data;
    var fila = '';
    var lblestado = '';
    var lblestadodelivery = '';
    var opciones = '';
    for (var i = 0; i < data.length; i++) {
        var estado = data[i].estadopedido;
        var estadodelivery = data[i].estadodelivery;
        var tiporegistro = data[i].tiporegistro;
        
        var inputnumboleta = data[i].numboleta;

        opciones += ' <a class="dropdown-item btnverpedido" href="#"><i class="fas fa-eye ml-1- mr-1 text-info"></i>Ver pedido</a>';
        //IsAdmin && 24/02
        if (estado != 'PENDIENTE') {
            opciones += ' <a class="dropdown-item  btneditarpedido" href="#"><i class="fas fa-edit ml-1- mr-1 text-warning"></i>Editar Pedido</a>';
            opciones += ' <a class="dropdown-item  btneliminarpedido" href="#"><i class="fas fa-trash-alt ml-1- mr-1 text-danger"></i>Eliminar Pedido</a>';
            opciones += '<div class="dropdown-divider"></div>'
        }
        if (estado === 'PENDIENTE') {
            lblestado = '<span class="badge badge-info" style="font-size:9px"><i class="fas fa-flag"></i> ' + estado + '</span>';
            opciones += ' <a class="dropdown-item  btneditarpedido" href="#"><i class="fas fa-edit ml-1- mr-1 text-warning"></i>Editar Pedido</a>';
            opciones += ' <a class="dropdown-item  btneliminarpedido" href="#"><i class="fas fa-trash-alt ml-1- mr-1 text-danger"></i>Eliminar Pedido</a>';
            if ((data[i].saldo ?? 0) != 0)
                opciones += ' <a class="dropdown-item  btnadelantopedido" href="#"><i class="fas fa-money-bill-alt ml-1- mr-1 text-success"></i>Adelanto Pedido</a>';
            opciones += '<div class="dropdown-divider"></div>';
            if ((data[i].laboratorio ?? '') == '')
                inputnumboleta = '<label style="font-size:12px" class="border font-weight-bold text-center txtnumeroboleta" contenteditable ="true"> ' + data[i].numboleta + '</label> ';

        }
        else if (estado === 'EN PROCESO') {
            lblestado = '<span class="badge badge-warning" style="font-size:9px"><i class="fas fa-stopwatch"></i> ' + estado + '</span>';
            //opciones += ' <a class="dropdown-item  btnadelantopedido" href="#"><i class="fas fa-money-bill-alt ml-1- mr-1 text-success"></i>Adelanto Pedido</a>';
            //if ((data[i].saldo ?? 0) != 0)
                //opciones += ' <a class="dropdown-item  btnadelantopedido" href="#"><i class="fas fa-money-bill-alt ml-1- mr-1 text-success"></i>Adelanto Pedido</a>';
        }
        else if (estado === 'TERMINADO') {
            lblestado = '<span class="badge badge-info" style="font-size:9px"><i class="fas fa-flag"></i> ' + estado + '</span>';

            opciones += ' <a class="dropdown-item  btnentregarpedido" href="#"><i class="fas fa-check ml-1- mr-1 text-success"></i>Entregar Pedido</a>';
            opciones += ' <a class="dropdown-item  btndevolverpedido" href="#"><i class="fas fa-times ml-1- mr-1 text-danger"></i>Devolver Pedido</a>';
        }
        else if (estado === 'ENTREGADO') {
            lblestado = '<span class="badge badge-success" style="font-size:9px"><i class="fas fa-calendar-check"></i> ' + estado + '</span>';
        }
        else if (estado === 'DEVUELTO') {
            lblestado = '<span class="badge badge-danger" style="font-size:9px"><i class="fas fa-truck-loading"></i> ' + estado + '</span>';
        }
        else if (estado === 'ELIMINADO') {
            lblestado = '<span class="badge badge-danger" style="font-size:9px"><i class="fas fa-stopwatch"></i> ' + estado + '</span>';
        }
        else if (estado === 'DESCARGADO') {
            lblestado = '<span class="badge badge-danger" style="font-size:9px"><i class="fas fa-stopwatch"></i> ' + estado + '</span>';
        }
        else
            lblestado = '<span class="badge badge-dark" style="font-size:9px"><i class="fas fa-truck"></i> ' + estado + '</span>';

        // estado delivery
        
        if (estadodelivery === 'SIN DELIVERY' && tiporegistro != 'DELIVERY') {
            lblestadodelivery = '<span class="badge badge-secondary" style="font-size:9px"><i class="fas fa-exclamation-triangle"></i> ' + estadodelivery + '</span>'; 
        }
        else if (estadodelivery === 'SIN DELIVERY' && tiporegistro === 'DELIVERY') {

            lblestadodelivery = '<span class="badge badge-warning" style="font-size:9px"><i class="fas fa-user-times"></i>NO ASIGNADO</span>';

        }
        else if (estadodelivery === 'ASIGNADO') {

            lblestadodelivery = '<span class="badge badge-custom-orange" style="font-size:9px; background-color: #ffA500; color: #fff;"><i class="fas fa-user-circle"></i> ' + estadodelivery + '</span>';

        } else if (estadodelivery === 'EN RUTA') {

            lblestadodelivery = '<span class="badge badge-info" style="font-size:9px"><i class="fas fa-truck"></i> ' + estadodelivery + '</span>';

        } else if (estadodelivery === 'ENTREGADO') {
            lblestadodelivery = '<span class="badge badge-success" style="font-size:9px"><i class="fas fa-calendar-check"></i> ' + estadodelivery + '</span>';
        } else {
            lblestadodelivery = '<span class="badge badge-danger" style="font-size:9px"><i class="fas  fa-window-close"></i> ' + estadodelivery + '</span>';
        }
        var icono = '';
        if (data[i].tipoformulacion == 'VETERINARIA')
            icono = '<button class="btn btn-sm btn-melon"><i class="fas fa-paw"></i></button>';
        else if (data[i].tipoformulacion == 'CANNABIS')
            icono = '<button class="btn btn-sm btn-success"><i class="fas fa-cannabis"></i></button>';
        var isdelivery = '';
        if (data[i].tiporegistro == 'DELIVERY')
            isdelivery = '<button class="btn btn-sm btn-info btndelivery" data-toggle="tooltip" data-placement="top" title="El pedido es delivery"><i class="fas fa-truck"></i></button>';

        var tieneobservacion = '';
        if (data[i].observacion ?? '' != '') {
            tieneobservacion = 'table-info';
            obs = 'px-2 btn btn-red';
        }
        else {
            obs = 'px-2 btn btn-green'
        }
        fila += '<tr idpedido="' + data[i].idpedido + '" numdoc="'+data[i].nrodocumento+'" >';
        fila += '<td class="details-control" ></td>';
        fila += '<td class="' + tieneobservacion + '">' + obspedido.replace('@@obsp', obs) + option.replace('@@items', opciones) + '</td>';
        fila += '<td class="' + tieneobservacion + '">' + btnimprimir + '</td>';
        fila += '<td class="text-center  ' + tieneobservacion + '">' + data[i].idpedido + '</br>' + icono + isdelivery + '</td>';
        fila += '<td>' + data[i].sucursal + '</td>';
        fila += '<td>' + (data[i].laboratorio ?? '') + '</td>';
        fila += '<td>' + (moment(data[i].fecha).format('DD/MM/YYYY HH:mm')) + '</td>';

        fila += '<td>' + (data[i].cliente ?? '') + '</td>';
        fila += '<td>' + (data[i].docpaciente ?? '') + '</td>';
        fila += '<td>' + (data[i].paciente ?? '') + '</td>';
        fila += '<td>' + (data[i].cmp) + '</td>';
        fila += '<td>' + (data[i].medico) + '</td>';

        console.log("HOLA MUNDO LISTA");
        console.log((data[i].descuento ?? 0).toFixed(2) );
        //EARTCOD1009
        if ((data[i].adelanto ?? 0)> 0) {
            fila += '<td class="text-right">' + ((data[i].total ?? 0).toFixed(2) - (data[i].descuento ?? 0).toFixed(2)).toFixed(2) + '</td>';
            fila += '<td class="text-right">' + (data[i].adelanto ?? 0).toFixed(2) + '</td>';
            fila += '<td class="text-right saldo">' + ((data[i].saldo ?? 0).toFixed(2) - (data[i].descuento ?? 0).toFixed(2)).toFixed(2) + '</td>';
        } else {
            fila += '<td class="text-right">' + ((data[i].total ?? 0).toFixed(2) - (data[i].descuento ?? 0).toFixed(2)).toFixed(2) + '</td>';
            fila += '<td class="text-right">' + (data[i].adelanto ?? 0).toFixed(2) + '</td>';
            fila += '<td class="text-right saldo">' + (data[i].saldo ?? 0).toFixed(2) + '</td>';
        }
        //-EARTCOD1009

        //fila += '<td class="text-right">' + (data[i].total ?? 0).toFixed(2) + '</td>';
        //fila += '<td class="text-right">' + (data[i].adelanto ?? 0).toFixed(2) + '</td>';
        //fila += '<td class="text-right saldo">' + (data[i].saldo ?? 0).toFixed(2) + '</td>';

        fila += '<td>' + (data[i].nomusuario ?? '') + '</td>';
        fila += '<td class="estado">' + lblestado + '  - ' +  lblestadodelivery+ '</td>';
        fila += '<td>' + inputnumboleta + '</td>';
        fila += '<td>' + (data[i].ordenproduccion) + '</td>';
        fila += '<td>' + (data[i].usuarioentrega ?? '') + '</td>';
        fila += '<td>' + (data[i].fechadeliveryentrega ?? '') + '</td>';
        fila += '<td class="ultimafila"></td>';
        fila += '</tr>';
        fila += '<tr id="row' + data[i].idpedido + '" class="hijo"></tr>';
        opciones = '';
    }
    tbodydetalle.innerHTML = fila;
    CEfnagregardatosetiqueta(response.dataobject, response.numregistros);
    var pagine = new UtilsSisqf();
    pagine.PaggingTemplate(response.totalpaginas, response.paginaactual, 'linkpaginacion', 'paginacion');

}

function fnagregardetalle(idpedido,numdoc, fila) {
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
                "<td>" + (data[i].codigoproducto ?? '') + "</td>" +
                '<td class="text-right">' + data[i].cantidad + '</td>' +
                '<td class="text-right">' + (data[i].precio ?? 0).toFixed(2) + "</td>" +
                '<td class="text-right">' + (data[i].subtotal ?? 0).toFixed(2) + "</td>";
            if (data[i].hasdetalleformula!='x') {
                cuerpo += '<td><button class="btn btn-sm btn-info" onclick="MODALLISTACLIENTE_buscarArticulo(' + data[i]['idproducto']+','+numdoc + ')"><i class="fas fa-ticket-alt"></i></button></td>';
            }
            
            cuerpo += "</tr > ";

        }
        fila.innerHTML = cabecera + cuerpo + "</tbody></table></td>";
    });

}
btnconsultar.addEventListener('click', function () {
    fnbuscarpedidos();
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
    var numdoc = fila.getAttribute('numdoc');
    var filahija = document.getElementById('row' + idpedido);
    if (fila.classList.contains('details')) {
        fila.classList.remove('details');
        filahija.innerHTML = '';
    }
    else {
        fila.classList.add('details');

        $('#row' + idpedido).show();
        fnagregardetalle(idpedido,numdoc, filahija);
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
$(document).on('click', '.btneditarpedido', function () {
    var fila = $(this).parents('tr')[0];
    var idpedido = fila.getAttribute('idpedido');
    MEDPlblnumpedido.innerText = idpedido;
    MEDPfneditarpedido(idpedido);
    GetListarImagenesbit(idpedido);
});
$(document).on('click', '.btnadelantopedido', function () {
    var fila = $(this).parents('tr')[0];
    var idpedido = fila.getAttribute('idpedido');
});
$(document).on('click', '.btneliminarpedido', function () {
    var fila = $(this).parents('tr')[0];
    var idpedido = fila.getAttribute('idpedido');
    swal({
        title: '¿Desea eliminar pedido?',
        text: '',
        icon: 'info',
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

            let controller = new PedidoController();
            controller.EliminarPedido(idpedido, function () {
                alertaSwall('S', 'Pedido ' + idpedido + ', Eliminado.', '');
                var hijo = document.getElementById('row' + idpedido);
                fila.remove();
                hijo.remove();
            });
        }
        else
            swal.close();
    });

});
$(document).on('click', '.btnentregarpedido', function () {
    var fila = $(this).parents('tr')[0];
    var idpedido = fila.getAttribute('idpedido');
    MEPlblnumpedido.innerText = idpedido;
    $('#modalentregarpedido').modal('show');
    MEPfnbuscardatospedido(idpedido, 'Entregar');

});
$(document).on('click', '.btnadelantopedido', function () {
    var fila = $(this).parents('tr')[0];
    var idpedido = fila.getAttribute('idpedido');
    MEPlblnumpedido.innerText = idpedido;
    $('#modalentregarpedido').modal('show');
    MEPfnbuscardatospedido(idpedido, 'Adelanto');

});
$(document).on('click', '.btndevolverpedido', function () {
    var fila = $(this).parents('tr')[0];
    var idpedido = fila.getAttribute('idpedido');
    MDPlblnumpedido.innerText = idpedido;
    $('#modaldevolverpedido').modal('show');
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

$(document).on('click', '.btnfinalizarpedido', function () {
    var fila = this.parentNode.parentNode;
    let controller = new LaboratorioPedidoController();
    var obj = {
        idpedido: fila.getAttribute('idpedido'),
        idformulador: 0,
        tipo: 'usuarioactual'
    };
    controller.TerminarPedido(obj, function () {
        mensaje('S', 'Pedido terminado');

        fila.getElementsByClassName('ultimafila')[0].innerHTML = '';
        fila.getElementsByClassName('estado')[0].innerHTML = '<span class="badge badge-dark" style="font-size:9px"><i class="fas fa-check"></i> TERMINADO</span>';
        fila.getElementsByClassName('txtnumeroboleta')[0].setAttribute('contenteditable', false);
        fila.getElementsByClassName('btnaccionespedido')[0].innerHTML += ' <a class="dropdown-item  btnentregarpedido" href="#"><i class="fas fa-check ml-1- mr-1 text-success"></i>Entregar Pedido</a>';
    });

});

function GetListarImagenes(idpedido) {
    let controller = new PedidoController();
    controller.ListarArchivosPedido(idpedido, function (data) {
        for (var i = 0; i < data.length; i++) {
            data[i].tipoarchivo = 'FILE';
            data[i].type = 'FILE';
            data[i].size = 1024;
        }
        console.log(data);
        var fila = '';

        var arreglado = data.map(item => {
            return { idimagen: item.idimagen, idpedido: item.idpedido, tipo: item.tipo, name: item.imagen, pedido: item.pedido, tipoarchivo: item.tipoarchivo};
        });
        console.log(arreglado);

        _arrayArchivosPedido = arreglado;
        MSIlistarArchivos();

        //for (var i = 0; i < data.length; i++) {

        //    //_arrayArchivosPedido[_arrayArchivosPedido.length] = data.length;
        //    //_arrayArchivosPedido[i].tipo = data[i].tipo;
        //    //_arrayArchivosPedido[i].tipoarchivo = 'FILE';
        //    //_arrayArchivosPedido[i].name = data[i].imagen
        //    //_arrayArchivosPedido[i].ruta = "";

        //    fila += '<tr>';
        //    fila += '<td>' + (i + 1) + '</td>';
        //    fila += '<td>' + data[i].imagen + '</td>';
        //    fila += '<td>' + data[i].tipo + '</td>';
        //    fila += '<td>' + 'image' + '</td>';
        //    fila += '<td>' + '0.1 aprox' + '</td>';
        //    fila += '<td>' + (('FILE' === 'FILE') ? '<button class="btn btn-sm btn-danger MSIbtnquitaritem"><i class="fas fa-trash"></i></button>' :
        //        '<button class="btn btn-sm btn-danger MSIbtnquitaritem"><i class="fas fa-trash"></i></button>') + '</td>';
        //    fila += '</tr>';
        //}
        //MSItbodydetalle.innerHTML = fila;

    });
}

///CODIGO DE YEX IMAGENES BIT
function GetListarImagenesbit(idpedido) {
    let controller = new PedidoController();
    controller.ListarArchivosPedidobit(idpedido, function (data) {
        console.log("Datos originales:", data);
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }

        // Ahora que tenemos la certeza de que data es un array, procesamos sus elementos.
        let datosModificados = data.map(item => {
            return {
                imagen_codigo: item.imagen_codigo,
                idpedido: item.pedido_codigo,
                name: item.imagen,
                tipo: item.tipo,
                tipoarchivo: 'FILE',
                type: 'FILE',
                size: 1024
            };
        });

        console.log(datosModificados);

        _arrayArchivosPedido = datosModificados;
        _arrayArchivosIniciales = [...datosModificados]; //se uso para mandar los datos iniciales estaticos
        MSIlistarArchivos();

  
    });
}
//function MODALLISTACLIENTE_buscarArticulo(id) {
//    $('#MPC_h5').text('DATOS ADICIONALES DEL PEDIDO');

//    var obj = {
//        id: id
//    }

//    let controller = new PedidoController();
//    controller.BuscarArticulo(obj, function (data) {
//        if (data != null)
//            MPC_tbllista.row.add([
//                data.catalago_codigo,
//                data.codigoPrecio,
//                data.codigocliente,
//                data.articulo,
//                data.formulacion,
//                data.presentacion,
//                data.etiqueta,
//                data.precio.toFixed(2),
//                data.observacion,
//                ''
//            ]).draw(false);
//    }).fail(function (data) {
//        console.log(data);
//        mensaje("D", 'Error en el servidor.');
//    });

//}

//function MODALLISTACLIENTE_buscarArticulo(id) {
//    $('#MPC_h5').text('DATOS ADICIONALES DEL PEDIDO');
//    var url = '../Pedido/BuscarArticulo';
//    var obj = {
//        id: id
//    };
//    $('#MPC_modalprecioscliente').modal('show');
//    //MPC_tbllista.clear().draw(false);
//    $.post(url, obj).done(function (data) {
//        console.log(data);
//        if (data != null)
//            MPC_tbllista.row.add([
//                data.catalago_codigo,
//                data.codigoPrecio,
//                data.codigocliente,
//                data.articulo,
//                data.formulacion,
//                data.presentacion,
//                data.etiqueta,
//                data.precio.toFixed(2),
//                data.observacion,
//                ''
//            ]).draw(false);
//    }).fail(function (data) {
//        console.log(data);
//        mensaje("D", 'Error en el servidor.');
//    });
//}
