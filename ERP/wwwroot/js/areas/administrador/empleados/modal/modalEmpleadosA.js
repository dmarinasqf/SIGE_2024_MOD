var tblUsuariosAutorizantes;

$(document).ready(function () {
   

    tblUsuariosAutorizantes = $('#tblUsuariosAutorizantes').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "language": {
            "sSearch": "Buscar",
            "lengthMenu": "Mostrar _MENU_ entradas",
            "zeroRecords": "No hay registros",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
            "infoEmpty": "No hay información",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "search": "Buscar:",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "order": [[1, 'asc']]
        },
        "columnDefs": [
            {
                width: "300px",
                targets: 1
            },
            {
                width: "100px",
                targets: 2
            }
        ]

    });

    listarEmpleados();
});

function listarEmpleados() {
    var controller = new EmpleadoController();
    controller.ListarEmpleadosNA(fn_LlenarTabla);
    delete controller;
}
function fn_LlenarTabla(data) {
    if (data != null) {
        for (var i = 0; i < data.length; i++) {
            agregarFilaA(data[i], 'empleadoNA');
        }
    }
}
function agregarFilaA(data, tipo) {
    if (tipo == 'empleadoNA') {
        tblUsuariosAutorizantes.row.add([
            data.emp_codigo,
            data.documento,
            data.empleado,
            data.perfil,
            data.sucursal,
            '<button class="btn  btn-success btn-xs btn-empleadoA"><i class="fas fa-check fa-1x"></i></button>'

        ]).draw(false);
    }
}

//cerrar modal
function cerrarModal_Empleados() {
    $('#modalListaUsuarioA').modal('hide');
}