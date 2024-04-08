var tbllista;
var arrayguias = [];
var dtpfecha = $('#dtpfecha');
let idfacturavalidar = 0;

$(document).ready(function () {
    tbllista = $('#tbllista').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[10, 15, 20, -1], [10, 15, 20, "All"]],
        responsive: true,
        buttons: BOTONESDATATABLE('LISTA ANALISIS ORGANOLEPTICO ', 'H', false),
        "language": LENGUAJEDATATABLE()
        //"columnDefs": [
        //    {
        //        "targets": [2],
        //        "visible": false,
        //        "searchable": false
        //    }]
    });
    buscarAnalisisOrganoleptico();
});

function buscarAnalisisOrganoleptico() {
    $('#btnbusqueda').click();
}

$('#form-busqueda').submit(function (e) {
    e.preventDefault();
    //let url = ORIGEN + "/Almacen/AGuiaSalida/ListarGuiasSalida";
    let obj = $('#form-busqueda').serializeArray();
    obj[obj.length] = { name: "fechainicio", value: FECHAINICIO };
    obj[obj.length] = { name: "fechafin", value: FECHAFIN };
    obj[obj.length] = { name: "idsucursalorigen", value: IDSUCURSAL };
    let controller = new AnalisisOrganolepticoController();
    controller.getHistorial(obj, listarHistorial);
});

function listarHistorial(data) {
    //console.log(data);
    arrayguias = [];
    tbllista.clear().draw(false);    
    try {
        if (data.mensaje === "ok") {
            //console.log(data)
            let datos = JSON.parse(data.objeto);
            //console.log(datos);
            arrayguias = datos;
            for (let i = 0; i < datos.length; i++) {
                let botones = `<div class="btn-group btn-group-sm" >            
                            <a class="btn btn-sm btn-outline-primary waves-effect btn-pasar font-10" data-toggle="tooltip" data-placement="top" title="Picking" href="`+ ORIGEN + `/PreIngreso/PIAnalisisOrganoleptico/Registrar/?id=` + datos[i]["ID"] + `"><i class="fa fa-eye"></i></a>`;
                if (datos[i]["USUARIOVALIDA"] == null) {
                    botones += `<button class="btn btn-sm btn-warning ml-1" onClick="fModalValidarUsuario(` + datos[i]["IDFACTURA"] +`)" data-toggle="tooltip" data-placement="top" title="Validar A.O.">
                        <i class="fas fa-check"></i></button>`;
                }
                botones += '</div>';
                let fila = tbllista.row.add([
                    //'',
                    botones,
                    datos[i]["ID"],
                    datos[i]["CODIGO"],
                    datos[i]["FACTURAS"],
                    datos[i]["RUC"],
                    datos[i]["RAZONSOCIAL"],
                    datos[i]["FECHA"],
                    datos[i]["USERNAME"],
                    
                ]).draw(false).node();
                $(fila).find('td').eq(0).attr({ 'class': 'text-center' });
            }
            $('[data-toggle="tooltip"]').tooltip();
        }
        else
            mensaje('W', data.mensaje);
    } catch (error) {
        $('#cdbtn_generar').prop('disabled', false);
    }
}

//AGREGAR DETALLE
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
        row.child(fnGetDetalleGuiaSalida(id)).show();
    }
});
function fnGetDetalleGuiaSalida(id) {
    var index = fnencontrarIndex(arrayguias, id);
    console.log(fnencontrarIndex(arrayguias, id));
    var detalle = (JSON.parse(arrayguias[index]['DETALLE']));
    if (index === -1)
        return 'No hay datos';
    else {
        var tbody = '<tbody>';

        for (var i = 0; i < detalle.length; i++) {
            tbody += '<tr>';
            tbody += '<td>' + detalle[i]['IDDETALLE'] + '</td>';
            tbody += '<td>' + detalle[i]['CODIGO'] + '</td>';
            tbody += '<td>' + detalle[i]['PRODUCTO'] + '</td>';
            tbody += '<td>' + detalle[i]['CANTIDAD ENVIAR'] + '</td>';
            tbody += '<td>' + detalle[i]['LABORATORIO'] + '</td>';
            tbody += '<td>' + detalle[i]['LOTE'] + '</td>';
            tbody += '<td>' + detalle[i]['FECHA VECIMIENTO'] + '</td>';
            tbody += '<tr>';

        }
        return `<table class="table table-sm">
                    <thead class="thead-light">
                           <tr>
                                <th>ID</th>
                                <th>CODIGO</th>
                                <th>PRODUCTO</th>
                                <th>CANTIDAD ENVIAR</th>                                
                                <th>LABORATORIO</th>
                                <th>LOTE</th>
                                <th>F.VENCE</th>
                            </tr>
                    </thead>
                        `  + tbody + `
                </table>`;
    }
}

function fnencontrarIndex(array, id) {
    for (var i = 0; i < array.length; i++) {
        if (array[i]['ID'] == id) {
            return i;
            break;
        }
    }
    return -1;
}

function fModalValidarUsuario(idfactura) {
    idfacturavalidar = idfactura;
    $('#modalvalidarusuario').modal('show');
}
$('#form-validarusuario').submit(function (e) {
    e.preventDefault();
    var url = ORIGEN + "/Compras/CAprobarFactura/VerificarCredenciales_AprobarFactura";
    var obj = $('#form-validarusuario').serializeArray();
    $.post(url, obj).done(function (data) {
        console.log(data);
        if (data.mensaje === "ok") {
            ValidarAnalisisOrganoleptico(idfacturavalidar);
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

function ValidarAnalisisOrganoleptico(idfactura) {
    let controller = new AprobarFacturaController();
    var obj = {
        idfactura: idfactura
    }
    controller.ValidarAnalisisOrganoleptico(obj, function (data) {
        if (data.mensaje == "ok") {

            let obj = $('#form-busqueda').serializeArray();
            obj[obj.length] = { name: "fechainicio", value: FECHAINICIO };
            obj[obj.length] = { name: "fechafin", value: FECHAFIN };
            obj[obj.length] = { name: "idsucursalorigen", value: IDSUCURSAL };
            let controller = new AnalisisOrganolepticoController();
            controller.getHistorial(obj, listarHistorial);

            alertaSwall('S', 'SE VALIDÓ EL ANÁLISIS ORGANOLÉPTICO', '');
            idfacturavalidar = 0;
        }
        else {
            alertaSwall('D', 'Error al validar el análisis organolpético.', '');
        }
    });
}
