var tblLaboratorio;
var tblLaboratorioProveedor;

var txtidproveedor = $('#txtidproveedor');
var txtproveedor = $('#txtproveedor');
var txtruc = $('#txtruc');
var txtoperacion = $('#txtoperacion');
var tbllista;
var btnguardar = $('#btn-guardar');

$(document).ready(function () {
    tblLaboratorio = $('#tblLaboratorio').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]], 
        "language": LENGUAJEDATATABLE(),
         "order": [[1, 'asc']],
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }
           
        ]
    
    });
    tblLaboratorioProveedor = $('#tblLaboratorioProveedor').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        dom: 'Bfrtip',
        responsive: true,
        buttons: BOTONESDATATABLE('LISTA DE LABORATORIOS DEL PROVEEDOR ' + txtproveedor.text(), 'V', false),
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }, {
                "targets": [1],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [2],
                "visible": false,
                "searchable": false
            }
        ]

    });

    listarLaboratorios(txtidproveedor.val());
    listarLaboratoriosProveedor(txtidproveedor.val());
});

function limpiar() {
    $('#form-registro').trigger('reset');
    txtoperacion.val("nuevo");    
    cmbsucursal.val("0");
    txtcodigo.val("");
    
}
// seleccionar columnas del table
$('#tblLaboratorio tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tblLaboratorio.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

$('#tblLaboratorioProveedor tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tblLaboratorioProveedor.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});


function mensajeeliminar(data) {
    swal({
        title: '¿Desea eliminar?',
        text: "",
        type: 'warning',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'No',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Si',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            eliminar(data);
        }
        else
            swal.close();
    });
}
function listarLaboratorios(idproveedor) {
    
    var url = ORIGEN + "/Compras/CProveedorLaboratorio/listarLaboratorios";
    var obj = { idproveedor: idproveedor };
    $.post(url,obj).done(function (data) {       
        tblLaboratorio.clear().draw();
        if (data != null) {
            for (var i = 0; i < data.length; i++) {
                agregarFila(data[i], 'laboratorio');
            }
        }
        else {
            mensaje("I","NO HAY INFORMACIÓN");
        }
    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });

}

function listarLaboratoriosProveedor(idproveedor) {

    var url = ORIGEN + "/Compras/CProveedorLaboratorio/BuscarLaboratoriosxProveedor";
    var obj = { idproveedor: idproveedor };
    $.post(url, obj).done(function (data) {
        tblLaboratorioProveedor.clear().draw();
        if (data != null) {
            for (var i = 0; i < data.length; i++) {
                agregarFila(data[i], 'laboratorioproveedor');
            }
        }
        else {
            mensaje("I", "NO HAY INFORMACIÓN");
        }
    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });

}
function eliminar(id) {
    var url = ORIGEN + "/Compras/CProveedorLaboratorio/Eliminar/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                tbllista.row('.selected').remove().draw(false);
                swal("Registro eliminado!", {
                    icon: "success",
                    buttons: {
                        confirm: { className: 'btn btn-success' }
                    }
                });
            }
        }
        else {
            mensaje("W", data.mensaje);
        }

    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });

}

function agregarFila(data, tipo) {


    if (tipo == 'laboratorio')
    {
        if (data.idproveedorlab == 0) {
            tblLaboratorio.row.add([
                data.idproveedorlab,
                data.idlaboratorio,
                data.laboratorio,
                '<div class="demo-switch-title"></div>'+
                '<div class="switch">'+
                '<label>' +
                '<input type = "checkbox" class= "check-rol" onClick = "activarLaboratorio(this,event)"/>' +
                '<span class="lever switch-col-teal"></span>' +
                '</label >'+
                '</div>'
                   
                ]).draw(false);
            }
        if (data.idproveedorlab >= 1) {
            tblLaboratorio.row.add([
                data.idproveedorlab,
                data.idlaboratorio,
                data.laboratorio,             
                '<span class="badge badge-success">ASIGNADO</span>'
            ]).draw(false);
        }

    }
    if (tipo == 'laboratorioproveedor') {
       
        tblLaboratorioProveedor.row.add([
                data.idproveedorlab,
                data.idproveedor,
                data.proveedor,
                data.idlaboratorio,
                data.laboratorio,
                '<div class="demo-switch-title"></div>' +
                '<div class="switch">' +
                '<label>' +
                '<input type = "checkbox" class= "check-rol" onClick = "desactivarLaboratorio(this,event)" checked/>' +
                '<span class="lever switch-col-teal"></span>' +
                '</label >' +
                '</div>'

            ]).draw(false);
    }
   

}




//habilitar y deshabilitar almacenes
function activarLaboratorio(tabla, evento) {
    var columna = tblLaboratorio.row($(tabla).parents('tr')).data();
    console.log(evento);

    if (evento.target.checked) {
        var url = ORIGEN + "/Compras/CProveedorLaboratorio/RegistrarEditar/";
        var data = {
            idproveedorlab: columna[0],
            idproveedor: txtidproveedor.val(),
            idlaboratorio: columna[1],
            estado: 'HABILITADO'
        };
        console.log(data);
        $.post(url, data).done(function (data) {
            if (data.mensaje == "ok") {
                listarLaboratorios(txtidproveedor.val());  
                listarLaboratoriosProveedor(txtidproveedor.val());                  
                mensaje('S', 'Laboratorio asignado');
            }
            else {
                mensaje('W', data.mensaje);
            }
        }).fail(function (data) {
            console.log(data);
            mensaje("D", "Error en el servidor");
        });
    }
}

function desactivarLaboratorio(tabla, evento) {
    var columna = tblLaboratorioProveedor.row($(tabla).parents('tr')).data();
    console.log(columna);

    if (!evento.target.checked) {
        var url = ORIGEN + "/Compras/CProveedorLaboratorio/Eliminar";   
        var data = {
            id: columna[0]
      
        };
        console.log(data);
        $.post(url,data).done(function (data) {
            if (data.mensaje == "ok") {        
                listarLaboratorios(txtidproveedor.val());
                listarLaboratoriosProveedor(txtidproveedor.val());   
                swal("Registro eliminado!", {
                    icon: "success",
                    buttons: {
                        confirm: { className: 'btn btn-success' }
                    }
                });
            }
            else {
                mensaje('W', data.mensaje);
            }
        }).fail(function (data) {
            console.log(data);
            mensaje("D", "Error en el servidor");
        });
    }

}