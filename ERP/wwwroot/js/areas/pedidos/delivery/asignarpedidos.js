
var lblpedidoasignar = $('#lblpedidoasignar');
var lblpedidoasignados = $('#lblpedidoasignados');
var lblpedidototal = $('#lblpedidototal');

var FECHAINICIO = '';
var FECHAFIN = '';
var pb_sucursal = $('#pb_sucursal');
var pb_cmbtipoentrega = $('#pb_cmbtipoentrega');
var pb_cmbhoraentrega = $('#pb_cmbhoraentrega');
var tbldelivery;
//otras variables
var totalseleccionados = 0;
var listaselecciones = [];
$(document).ready(function () {

    tbldelivery = $('#tbldelivery').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        responsive: true,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "language": {
            "sSearch": "Buscar",
            "lengthMenu": "Mostrar _MENU_ entradas",
            "zeroRecords": "No hay registros",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
            "infoEmpty": "No hay registros",
            "infoFiltered": "",
            "search": "Buscar:",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            },
        },
        "columnDefs": [
            //{
            //     "targets": [2],
            //     "visible": false,
            //     "searchable": false
            // }
        ]
    });
    fnlistarsucursales();

    listardelivery();
});
function fnlistarsucursales() {
    let controller = new SucursalController();
    controller.ListarSucursalEntrega('pb_sucursal');
}
$('#tbldelivery tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        //console.log();
    }
    else {
        tbldelivery.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
//EVENTOS
$('#btnLimpiar').click(function () {
    $('#txtfecharango').val('');
    FECHAINICIO = "";
    FECHAFIN = "";
    pb_sucursal.val('');
    pb_cmbtipoentrega.val('');

});

function listardelivery() {
    //if (PERFIL !== "ADMINISTRADOR" && pb_sucursal.val()=== "") {
    //    mensaje("W", "SELECCIONE UNA SUCURSAL");
    //    return;
    //}
    $('#btnConsultar').prop('disabled', true);
    tbldelivery.clear().draw();
    var url = ORIGEN + '/Pedidos/Delivery/ListarPedidosAsignacion';
    var obj = {
        sucursal: pb_sucursal.val(),
        fechainicio: FECHAINICIO,
        fechafin: FECHAFIN,
        tipoentrega: pb_cmbtipoentrega.val(),
        horaentrega: pb_cmbhoraentrega.val(),
        perfil: ''
    };

    $.post(url, obj).done(function (data) {

        DESBLOQUEARCONTENIDO('cardacciones');
        $('#btnConsultar').prop('disabled', false);
        DESBLOQUEARCONTENIDO('cardacciones');
        tbldelivery.clear();
        agregarFilas(data);
        //sumaretiquetas(datos);



    }).fail(function (data) {
        DESBLOQUEARCONTENIDO('cardacciones');
        $('#btnConsultar').prop('disabled', false);

    });

}

$('#btnConsultar').click(function (e) {
    listardelivery();
});

function agregarFilas(data) {

    var counterasignar = 0;
    var counterasignado = 0;
    var total = 0;
    for (var i = 0; i < data.length; i++) {

        var controles = `
            <input class=" btn-pasar checkbox" type="checkbox" style="width:25px;height:25px;" id=`+ data[i]["IDDELIVERY"] + `>         
      `;
        //'<button class="btn  btn-info btn-xs" onclick="modalEditar(' + data[i]["ESTADOREGISTRO"] + ')"><i class="fas fa-eye fa-1x"></i></button>'; 

        if (data[i]["ESTADOREGISTRO"] === 0) {
            counterasignar++;
        } else {
            counterasignado++;
            controles = '<span class="badge badge-success">ASIGNADO</span>' +
                '<button class="btn btn-xs btn-danger" onclick="eliminarAsignacion(' + data[i]["IDDELIVERY"] + ')"><i class="fas fa-trash-alt fa-1x"></i></button>';
        }

        var fila = tbldelivery.row.add([
            /*  data[i]["IDDELIVERY"],*/
            data[i]["IDPEDIDO"],
            data[i]["FECHAENTREGA"],
            data[i]["RECOGER EN"],
            data[i]["DIRECCIÓN ENTREGA"],
            data[i]["DISTRITO"],
            data[i]["CLIENTE"],
            data[i]["PACIENTE"],
            data[i]["CANTPRODUCTO"],
            data[i]["ESTADOENTREGA"],
            data[i]["HORAENTREGA"],

            data[i]["ASIGNADOA"],
            controles

        ]).draw(false).node();

    }

    tbldelivery.columns.adjust().draw();
    lblpedidoasignados.text(counterasignado);
    lblpedidoasignar.text(counterasignar);
    lblpedidototal.text(counterasignado + counterasignar);
}
//   <label class="form-check-label" for=`+ data[i]["IDDELIVERY"] + `></label>
function seleccionarTodo() {
    var checkbox = document.getElementById('checkTodo');
    var checked = checkbox.checked;
    if (checked)
        $('.checkbox').prop('checked', true);
    else
        $('.checkbox').prop('checked', false);
}

$('#btnAsiganar').click(function () {

    totalseleccionados = 0;
    $('.checkbox').each(function () {
        if ($(this).is(':checked')) {
            if ($(this).attr('id') !== "checkTodo") {
                totalseleccionados++;
                listaselecciones.push($(this).attr('id'));
            }
        }
    });

    if (totalseleccionados > 0) {
        $('#modalAsignarPedido').modal();
    } else {
        mensaje("I", "Selecione un pedido como mínimo");
    }
    //console.log(totalseleccionados);
});

function modalEditar(id) {
    $('#modalAsignarPedido').modal();
}

function eliminarAsignacion(data) {

    swal({
        title: '¿Desea eliminar?',
        text: "No se podra revertir",
        type: 'warning',
        buttons: {
            cancel: {
                visible: true,
                text: 'Cancelar',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Eliminar',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {

            eliminarEntregaPedido(data);
        } else {
            swal.close();
        }
    });
}
function eliminarEntregaPedido(data) {
    var obj = { id: data };
    let controller = new DeliveryController();
    btnguardar.prop('disabled', true);
    controller.EliminarEntregaDelivery(obj, () => {
        tbldelivery.row('.selected').remove().draw(false);
        mensaje("S", "Registro eliminado.");
    });


}


