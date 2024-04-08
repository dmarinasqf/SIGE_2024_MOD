var MGS_tblguiasalida;
var MGS_arrayguias = [];
var MGS_btnbusqueda = $('#MGS_btnbusqueda');
$(document).ready(function () {
    MGS_tblguiasalida = $('#MGS_tblguiasalida').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        responsive: true,
        "language": LENGUAJEDATATABLE()
        
    });
    MGS_fnlistarsucursales();
});

$('#modallistarguiasalida').on('shown.bs.modal', function () {
    MGS_btnbusqueda.click();
})

function MGS_fnlistarsucursales() {
    let controller = new SucursalController();
    controller.ListarTodasSucursales('MGS_cmbsucursaldestino', '', null);
}

$('#MGS_form-busqueda').submit(function (e) {
    e.preventDefault();
    let controller = new GuiaSalidaController();
    obj = $('#MGS_form-busqueda').serializeArray();
    obj[obj.length] = { name: 'estado', value: 'TRANSITO' };    
    obj[1] = { name: 'idsucursaldestino', value: IDSUCURSAL };
    console.log(obj);
    controller.ListarGuiaSalidaPorCargar(obj, MGS_fncargarDatosGuiaSalida);
});

function MGS_fncargarDatosGuiaSalida(data) {
    //console.log(data);
    MGS_arrayguias = [];
    if (data.mensaje == "ok") {
        let datos = JSON.parse(data.objeto);
        MGS_fnagregarfila(datos);
        MGS_arrayguias=datos;

    } else 
        mensaje("W", data.mensaje, "BR");
}
function MGS_fnagregarfila(data) {
    MGS_tblguiasalida.clear().draw(false);
    for (let i = 0;i< data.length; i++) {
       var MGS_fila= MGS_tblguiasalida.row.add([
           '<div class="btn-group btn-group-sm "><button class="btn btn-sm btn-success btn-pasarguisalida"><i class="fas fa-check"></i></button></div>',
           '',
           data[i]["ID"],
            data[i]["CODIGO"],
           data[i]["SERIE"] + '-' + data[i]["NUMERODOC"],
            moment(data[i]["FECHA TRASLADO"]).format("DD/MM/YYYY"),
            data[i]["SUCURSAL ORIGEN"],
            data[i]["SUCURSAL DESTINO"],
            data[i]["ESTADO"]           
        ]).draw(false).node();
        $(MGS_fila).find('td').eq(1).attr({ 'class': 'details-control' });
    }
}

//TABLA CON DETALLE
$('#MGS_tblguiasalida tbody').on('click', 'tr td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = MGS_tblguiasalida.row(tr);
    var columna = MGS_tblguiasalida.row($(this).parents('tr')).data();
    if (row.child.isShown()) {
        tr.removeClass('details');
        row.child.hide();
    }
    else {
        var id = columna[2];
        tr.addClass('details');
        row.child(MGS_fnGetDetalleGuiaSalida(id)).show();
    }
});
function MGS_fnGetDetalleGuiaSalida(id) {

    var index = MGS_encontrarIndex(MGS_arrayguias, id);
    console.log(MGS_encontrarIndex(MGS_arrayguias, id));
    var detalle = (JSON.parse(MGS_arrayguias[index]['DETALLE']));    
    if (index === -1)
        return 'No hay datos';
    else {
        var tbody = '<tbody>';

        for (var i = 0; i < detalle.length; i++) {
            tbody += '<tr>';
            tbody += '<td>' + detalle[i]['IDDETALLE'] + '</td>';
            tbody += '<td>' + detalle[i]['CODIGO'] + '</td>';                
            tbody += '<td>' + detalle[i]['PRODUCTO'] + '</td>';
            tbody += '<td>' + detalle[i]['CANTIDAD'] + '</td>';
            tbody += '<td>' + detalle[i]['LABORATORIO'] + '</td>';
            tbody += '<td>' + detalle[i]['LOTE'] + '</td>';
            tbody += '<td>' + detalle[i]['FVENCE'] + '</td>';
            tbody += '<tr>';
            
        }
        return `<table class="table table-sm">
                    <thead class="thead-light">
                           <tr>
                                <th>ID</th>
                                <th>CODIGO</th>
                                <th>PRODUCTO</th>
                                <th>CANTIDAD</th>                                
                                <th>LABORATORIO</th>
                                <th>LOTE</th>
                                <th>F.VENCE</th>
                            </tr>
                    </thead>
                        `  + tbody + `
                </table>`;
    }
}

function MGS_encontrarIndex(array, id) {   
    for (var i = 0; i < array.length; i++) {
        if (array[i]['ID'] == id) {
            return i;
            break;
        }
    }
    return -1;
}

/*$(document).on('click', '.btn-pasarguisalida', function (e) {
    var columna = MGS_tblguiasalida.row($(this).parents('tr')).data();
    if (fnverificarsielitemestaendetalleguia(columna[4])) {
        mensaje('W', 'La Guia ya se agrego al detalle');
        return;
    }

    var inputbultos = '<input  class="text-center txtbultos font-14" type="number"  min="1" required/>'
    var inputfecha = '<input  class="text-center txtfecha font-14" type="date" required/>';
    var inputhora = '<input  class="text-center txthora font-14" type="time" required/>';
    var fila = tbldetalleguia.row.add([
        columna[5],
        columna[4],
        inputbultos,
        columna[7],
        inputfecha,
        inputhora,
        '<button class="btn-danger btneliminar" type="button"><i class="fas fa-trash-alt"></i></button>'
    ]).draw(false).node();
    fila.setAttribute('numguia', columna[4]);
    fila.setAttribute('fechaguia', columna[5]);
    fila.setAttribute('sucursal', columna[7]);
});

function fnverificarsielitemestaendetalleguia(nguia) {
    var filas = document.querySelectorAll('#tbldetalleguia tbody tr');
    //if(filas.length==1)
    if (tbldetalleguia.rows().data().length == 0)
        return false;
    var band = false;
    filas.forEach(function (e) {

        var aux = e.getAttribute('numguia');
        if (nguia == aux)
            band = true;
    });
    return band;
}
*/