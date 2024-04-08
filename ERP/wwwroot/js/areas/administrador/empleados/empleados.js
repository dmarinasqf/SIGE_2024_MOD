

var tblEmpleados;

$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = true;
    datatable.ordering = true;
    var util = new UtilsSisqf();
    tblEmpleados = util.Datatable('tblempleados', true, datatable);
    $('#btndatatablenuevo').click(function () {
        limpiarmodal();
        $('#modalempleado').modal('show');
    });
    fnListarEmpleados();
});


function agregarFila(data) {
   
    tblEmpleados.row.add([   
        '<img src="/imagenes/empleados/' + data.foto + '" style="width:80px;height:50px" />',
        data.emp_codigo,
        data.documento,
        data.nombres + ' ' + data.apePaterno + ' ' + data.apeMaterno,
        data.sucursal,
        '',      
        data.grupo,
        data.userName,
        data.clave,
        data.estado,
        data.fechacreacion,
        `<div class="btn-group btn-group-sm" >
            <button class="btn btn-sm bg-warning waves-effect" onclick="buscarempleado(`+ data.emp_codigo +`)"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm bg-danger waves-effect text-white" onclick="mensajeeliminar(`+ data.emp_codigo +`)"><i class="fas fa-trash-alt"></i></button>                                           
             <button class="btn btn-info btnroles" ><i class="fas fa-shield-alt"></i></button>
        </div>`
    ]).draw(false);
}
function mensajeeliminar(data) {
    swal({
        title: '¿Desea deshabilitar empleado?',
        text: "Se eliminara los permisos y se desactivara la cuenta del empleado",
        type: 'warning',
        class:'text-center',
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
function eliminar(id) {
    var url = ORIGEN + "/Administrador/Empleado/Eliminar/" + id;       
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                tblEmpleados.row('.selected').remove().draw(false);
                swal("Empleado deshabilitado!", {
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


function fnListarEmpleados() {
    let obj = new EmpleadoController();
    obj.ListarEmpleado(fnLlenarTablaEmpleados);
}
function fnLlenarTablaEmpleados(data) {  
    tblEmpleados.clear().draw(false);
    for (var i = 0; i < data.length; i++) {
        var fila = tblEmpleados.row.add([
            '<img src="/imagenes/empleados/' + data[i]['FOTO'] + '" width="50px" height="50px"/>',
            data[i]['ID'],          
            data[i]['DOCUMENTO'],
            data[i]['NOMBRES'],
            data[i]['SUCURSAL'],
            data[i]['EMPRESA'],            
            data[i]['AREA'],
            data[i]['USUARIO'],
            data[i]['CLAVE'],
            data[i]['ESTADO'],
           data[i]['FECHACREACION'],
            `<div class="btn-group btn-group-sm" >
                <button class="btn btn-sm bg-warning waves-effect" onclick="buscarempleado(`+ data[i]['ID'] + `)"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm bg-danger waves-effect text-white" onclick="mensajeeliminar(`+ data[i]['ID'] + `)"><i class="fas fa-trash-alt"></i></button>                                           
               <button class="btn btn-info btnroles" ><i class="fas fa-shield-alt"></i></button>
             </div>`                     
       ]).draw(false).node();
        if (data[i]['ESTADO']=='DESHABILITADO')
            fila.classList.add('table-danger');
    }
    tblEmpleados.columns.adjust().draw();
}
$(document).on('click', '.btnroles', function () {
    var filas = tblEmpleados.row($(this).parents('tr')).data();
    $('#modalroles').modal('show');
    MP_lblempleado.innerHTML = filas[3];
    MP_lblidempleado.innerHTML = filas[1];
    fnMPListarRolUsuario(filas[1]);
});
$('#tblempleados tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tblEmpleados.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

$('#btndatatablenuevo').click(function () {
    limpiar();
});