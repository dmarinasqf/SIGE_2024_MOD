var tbllista;
var txtnumdocumento = document.getElementById('txtnumdocumento');
var txtidalmacensucursalorigen = document.getElementById('txtidalmacensucursalorigen');
var txtidalmacensucursaldestino = document.getElementById('txtidalmacensucursaldestino');
var txtestado = document.getElementById('txtestado');
var txtfechainicio = document.getElementById('txtfechainicio');
var txtfechafin = document.getElementById('txtfechafin');
var btnbusqueda = document.getElementById('btnbusqueda');

$(document).ready(function () {
    tbllista = $('#tbllista').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        info: false,
        paging: true,
        pageLength: [15]
    });
    //fnGetHistorial();
    //var tipo = txtidsucursal.getAttribute('tipo');
    //if (tipo == 'combo')
    cargarcomboalmacenes('txtidalmacensucursalorigen', IDSUCURSAL);
    cargarcomboalmacenes('txtidalmacensucursaldestino', IDSUCURSAL);
    txtfechainicio.value = moment().format("YYYY-MM-DD");
    txtfechafin.value = moment().add(30, 'd').format("YYYY-MM-DD");
    fnListarAlmacenTransferencia();
});
function fnListarAlmacenTransferencia() {
    let controller = new AAlmacenTransferenciaController();
    var obj = {
        numdocumento: txtnumdocumento.value,
        idalmacensucursalorigen: txtidalmacensucursalorigen.value,
        idalmacensucursaldestino: txtidalmacensucursaldestino.value,
        estado: txtestado.value,
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value
    };
    controller.ListarAlmacenTransferencia(obj, function (data) {
        tbllista.clear().draw(false);
        data = JSON.parse(data.objeto);
        for (var i = 0; i < data.length; i++) {
            var disenioboton = '<a class="btn btn-sm btn-outline-warning  font-10" data-toggle="tooltip" data-placement="top" title="Editar" href="' + ORIGEN + '/Almacen/AAlmacenTransferencia/RegistrarEditar?id=' + data[i].idalmacentransferencia + '"><i class="fas fa-edit"></i></a>';
            if (data[i].estado == "APROBADO") {
                disenioboton = '<a class="btn btn-sm btn-outline-info  font-10" data-toggle="tooltip" data-placement="top" title="Ver" href="' + ORIGEN + '/Almacen/AAlmacenTransferencia/RegistrarEditar?id=' + data[i].idalmacentransferencia + '"><i class="fas fa-eye"></i></a>';
            }
            let fila = tbllista.row.add([
                '',
                disenioboton,
                data[i].idalmacentransferencia,
                data[i].codigo,
                data[i].idalmacensucursalorigen,
                data[i].idalmacensucursalorigen,
                moment(data[i].fechatraslado).format("DD-MM-YYYY"),
                data[i].estado
            ]).draw(false).node();
            $(fila).find('td').eq(0).attr({ 'class': 'details-control' });
        }
    });
}
$('#tbllista tbody').on('click', 'tr td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = tbllista.row(tr);
    var columna = tbllista.row($(this).parents('tr')).data();
    if (row.child.isShown()) {
        tr.removeClass('details');
        row.child.hide();
    }
    else {
        var id = columna[2];
        tr.addClass('details');
        var obj = [];
        obj[obj.length] = { name: "id", value: id };
        let controller = new AAlmacenTransferenciaController();
        controller.BuscarAlmacenTransferenciaCompleto(obj, function (data) {
            var data = JSON.parse(data.objeto)[0];
            var detalle = JSON.parse(data.DETALLE);

            var tbody = `<tbody>`;
            for (var i = 0; i < detalle.length; i++) {
                tbody += `<tr>`;
                tbody += `<td>` + detalle[i]['idstockorigen'] + `</td>`;
                tbody += `<td>` + detalle[i]['codigoproducto'] + `</td>`;
                tbody += `<td>` + detalle[i]['producto'] + `</td>`;
                tbody += `<td>` + moment(detalle[i]['fechavencimiento']).format("DD-MM-YYYY") + `</td>`;
                tbody += `<td>` + detalle[i]['lote'] + `</td>`;
                tbody += `<td>` + detalle[i]['regsanitario'] + `</td>`;
                tbody += `<td>` + detalle[i]['cantidad'] + `</td>`;
                tbody += `<tr>`;

            }
            var cuerpoDetalle = `<table class="table table-sm">
                        <thead class="thead-light">
                               <tr>
                                    <th>ID</th>
                                    <th>CODIGO</th>
                                    <th>PRODUCTO</th>
                                    <th>FECHA VENCIMIENTO</th>                                
                                    <th>LOTE</th>                                
                                    <th>REG. SANITARIO</th>
                                    <th>CANT. TRANSFERIR</th>
                                </tr>
                        </thead>
                            `  + tbody + `
                    </table>`;
            row.child(cuerpoDetalle).show();
        });
    }
});

btnbusqueda.addEventListener('click', function () {
    fnListarAlmacenTransferencia();
});

function cargarcomboalmacenes(cmbid, idsucursal) {
    let controler = new AlmacenSucursalController();
    controler.ListarAlmacenxSucursal(cmbid, idsucursal, null);
}