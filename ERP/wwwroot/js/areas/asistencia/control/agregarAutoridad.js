var tbllista;

$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = true;
    datatable.ordering = true;

    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', true, datatable);
    $('#btndatatablenuevo').click(function () {
        $('#modalListaUsuarioA').modal('show');
    });

    listarEmpleadosA();
});



function listarEmpleadosA() {
    var controller = new EmpleadoController();
    controller.ListarEmpleadosA(fn_LlenarTablaEmpleadosA);
    delete controller;
}
function fn_LlenarTablaEmpleadosA(data) {
    tbllista.clear().draw();
    if (data != null) {
        for (var i = 0; i < data.length; i++) {
            agregarFila(data[i], 'empleadoA');
        }
    }
}

function agregarFila(data, tipo) {

    if (tipo == 'empleadoA') {
        tbllista.row.add([
            data.documentos,
            data.empleado,
            data.perfil,
            data.sucursal,
            '<button class="btn btn-xs btn-danger" onclick="eliminarEmpleadoA(' + data.idEmpleadoA + ')"><i class="fas fa-trash-alt fa-1x"></i></button>'

        ]).draw(false);
    }
}



function eliminarEmpleadoA(data) {
    console.log("");
    swal({
        title: '¿Desea eliminar?',
        text: "Se eliminará permisos y usuario correspondiente al empleado!!!",
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
            eliminar(data);
        }
        else
            swal.close();

    });
}

$('#tblUsuarioA tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        //console.log();
    }
    else {
        tblUsuarios.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

function eliminar(data) {
    var obj = { codigo: data };
    let controller = new EmpleadoController();
    controller.EliminarEmpleadoA_Asis(obj, fn_eliminarEmplA);
    delete controller;

}
function fn_eliminarEmplA(data) {
    listarEmpleadosA();
    mensaje("S", "Objetivo eliminado.");
    listarEmpleados();
}
//cargar los empleados a registrar

$(document).on('click', '.btn-empleadoA', function (e) {
    var columna = tblUsuariosAutorizantes.row($(this).parents('tr')).data();
    var idEmpleado;
    var nombre;
    var documento;
    idEmpleado = columna[0];
    documento = columna[1];
    nombre = columna[2];

    if (idEmpleado < 0) {
        console.log(idEmpleado);
        mensaje("W", "Seleccione otro usuario");
        return;
    }
    if (nombre == '') {
        console.log(nombre);
        mensaje("W", "Seleccione otro usuario");
        return;
    }
    var data = {};
    data['emp_codigo'] = idEmpleado;
    data['nombres'] = nombre;
    data['documento'] = documento;
    data['estado'] = 'HABILITADO';

    var obj = {
        obj: data
    }

    var controller = new AsistenciaController();
    controller.AutorizarEmpleado(obj, function (data) {
        listarEmpleadosA();
        cerrarModalUsuario();
    });
    delete controller;
    listarEmpleados();
});

//eventos
$('#btnNuevaAutoridad').click(function () {
    $('#modalListaUsuarioA').modal('show');
});
//cerrar modal

function cerrarModalUsuario() {
    $('#modalListaUsuarioA').modal('hide');
}