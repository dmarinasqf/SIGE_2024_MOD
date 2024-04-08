var tblpedidos;
window.onload = function () {
    this.tblpedidos = $('#tblpedidos').DataTable({
        "searching": true,
        lengthChange: false,
        lengthMenu: [15],
        "ordering": false,
        language: LENGUAJEDATATABLE(),
        info: false,

    });
    var tabla1 = document.getElementsByClassName('dataTables_filter')[0];
    tabla1.className = 'mostrar';
    fnListarPedidos();
}

function fnListarPedidos() {
    let controller = new MotorizadoController();
    controller.ListarPedidoPorUsuario('ASIGNADO', fnLLenarTablaPedidos);
}
function fnLLenarTablaPedidos(data) {
  
    for (var i = 0; i < data.length; i++) {
        tblpedidos.row.add([
            '<input class="checkasignar" type="checkbox" idregistro="' + data[i]['ID'] + '"/>',
            '<button class="btn btn-sm btn-info btnverdelivery" idregistro="' + data[i]['ID'] + '"><i class="fas fa-eye"></i></button>',
            '<span>N. PED.: ' + data[i]['IDPEDIDO'] + '</span></br>' +
            '<span>F.ASIG: ' + data[i]['FECHAASIGNACION'] + '</span></br>' +
            '<span>F.ENTR: ' + data[i]['FECHAENTREGA'] + '</span></br>' +
            '<span>RECOGER EN: ' + data[i]['RECOGEREN'] + '</span></br>' +
            '<span> ENTREGAR EN:' + data[i]['DIRECCIONENVIO'] + '</span></br>',
            data[i]['CANTIDAD']

        ]).draw(false);
    }
    tblpedidos.columns.adjust().draw();

}
$('#txtbuscaritemlista').keyup(function () {
    tblpedidos.search($(this).val()).draw();
});
$(document).on('click', '.checkasignar', function (response) {
    var id = this.getAttribute('idregistro');
    let controller = new MotorizadoController();

    if (this.checked)
        controller.CambiarEstadoEntregaDelivery('RECEPCIONADO', id, function () {
            mensaje('S', 'Pedido Recepcionado');
        });
    else
        controller.CambiarEstadoEntregaDelivery('ASIGNADO', id, function () {
            mensaje('I', 'Pedido quitado de ruta');
        });

});
$(document).on('click', '.btnverdelivery', function () {
    var id = this.getAttribute('idregistro');
    var btnaux = document.getElementById('btnGuardar');
    btnaux.className = 'mostrar';
    $('#modalEntregaPedido').modal('show');
    buscarEntrega(id);
});