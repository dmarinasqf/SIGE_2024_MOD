
var MCC_tblcliente;
var MCC_txtfiltro = document.getElementById('MCC_txtfiltro');
$(document).ready(function () {
    MCC_tblcliente = $('#MCC_tblcliente').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        info: false
    });
    MCC_fnBuscarClientes();
});
MCC_txtfiltro.addEventListener('keyup', function (e) {
    if (e.key === 'Enter')
        MCC_fnBuscarClientes();
});

$(document).on('click', '.MCC_btneditarcliente', function () {

    var idcliente = this.getAttribute('idcliente');
    $('#tabRegistroCliente').tab('show');
    MCC_fnbuscarcliente(idcliente);

});
function MCC_fnBuscarClientes() {
    var obj = {
        filtro: MCC_txtfiltro.value.trim().toUpperCase(),
        top: 20
    };
    let controller = new ClienteController();
    controller.BuscarClientes(obj, function (data) {
        MCC_tblcliente.clear().draw(false);
        for (var i = 0; i < data.length; i++) {
            MCC_tblcliente.row.add([
                '<div class="btn-group">' +
                '<button class="btn-success MCC_btnseleccionarcliente" idcliente="' + data[i].idcliente + '"><i class="fas fa-check"></i></button>' +
                '<button class="btn-warning MCC_btneditarcliente" idcliente="' + data[i].idcliente + '"><i class="fas fa-edit"></i></button>' +
                '</div>',
                data[i].documento,
                data[i].numdocumento,
                data[i].nombres + ' ' + data[i].apepaterno + ' ' + data[i].apematerno
            ]).draw(false);
        }
    });
}