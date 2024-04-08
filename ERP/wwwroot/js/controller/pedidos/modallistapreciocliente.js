var MPC_lblcliente = $('#MPC_lblcliente');
var MPC_tbllista;
$(document).ready(function (e) {
    //MPC_tbllista = $('#MPC_tbllista').DataTable({
    //    "searching": true,
    //    lengthChange: true,
    //    "ordering": false,
    //    "language": {
    //        "sSearch": "Buscar",
    //        "lengthMenu": "",
    //        "zeroRecords": "",
    //        "info": "",
    //        "infoEmpty": "No hay información",
    //        "infoFiltered": "",
    //        "search": "Buscar:",
    //        "paginate": {
    //            "first": "Primero",
    //            "last": "Ultimo",
    //            "next": "Siguiente",
    //            "previous": "Anterior"
    //        },
    //        "order": [[1, 'asc']]
    //    }
    //});
});
function MODALLISTACLIENTE_abrirmodal(idcliente) {
    $('#MPC_modalprecioscliente').modal('show');
    MODALLISTACLIENTE_listarprecioscliente(idcliente);
}
function MODALLISTACLIENTE_cerrarmodal() {
    $('#MPC_modalprecioscliente').modal('hide');
}

function MODALLISTACLIENTE_listarprecioscliente(idcliente) {
    var url = '/CatalagoPrecioCliente/BuscarCatalagoCliente';
    var obj = {
        idcliente: idcliente
    };

    MPC_tbllista.clear().draw(false);
    $.post(url, obj).done(function (data) {
        if (data != null)
            for (var i = 0; i < data.length; i++) {
                MPC_tbllista.row.add([
                    data[i].catalago_codigo,
                    data[i].codigoPrecio,
                    data[i].codigocliente,
                    data[i].articulo,
                    data[i].formulacion,
                    data[i].presentacion,
                    data[i].etiqueta,
                    data[i].precio.toFixed(2),
                    data[i].observacion,
                    '<button class="btn btn-xs btn-success btnadditemlistacliente"><i class="fas fa-check"></i></button>'
                ]).draw(false);
            }

        else
            mensaje('I', 'El cliente no tiene una lista de precio.');
    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor.');
    });
}

//function MODALLISTACLIENTE_buscarArticulo(id) {
//    $('#MPC_h5').text('DATOS ADICIONALES DEL PEDIDO');
//    var url = '/CatalagoPrecioCliente/BuscarArticulo';
//    var obj = {
//        id: id
//    };
//    $('#MPC_modalprecioscliente').modal('show');
//    MPC_tbllista.clear().draw(false);
//    $.post(url, obj).done(function (data) {
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

function MODALLISTACLIENTE_buscarArticulo(id,numdoc) {
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
    MPC_tbllista = $('#MPC_tbllista').DataTable({
        destroy: true,
        "searching": false,
        "paging": true,
        lengthChange: false,
        "lengthMenu": [[20, 25, 50, -1], [20, 25, 50, "All"]],
        "ordering": false,
        "info": false,
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