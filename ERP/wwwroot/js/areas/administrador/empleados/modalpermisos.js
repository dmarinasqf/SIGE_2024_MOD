var tblroles;
var rolesusuario = [];
var MP_lblempleado = document.getElementById('MP_lblempleado');
var MP_lblidempleado = document.getElementById('MP_lblidempleado');

$(document).ready(function () {
    console.log('inicio');
    tblroles = $('#tblroles').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }
        ]
    });
});


function fnMPListarRoles() {
    let rol = new ModulosGrupoController();
    rol.ListarPermisos(fnMPLlenarTablaRoles);
}
function fnMPLlenarTablaRoles(data) {
   
    tblroles.clear().draw(false);
    
    for (var i = 0; i < data.length; i++) {
        var check = '<input type="checkbox" class="MP_checkrol" idrol="' + data[i].id +'" />';
        if (fnEncontrarRolUsuario(data[i].id))
            check = '<input type="checkbox" class="MP_checkrol" checked idrol="' + data[i].id+'" />';
        tblroles.row.add([
            data[i].id,
            data[i].name,
            data[i].area,
            data[i].grupo,
            check
        ]).draw(false);
    }
}
function fnMPListarRolUsuario(id) {
    var rol = new EmpleadoController();
    rol.ListarPermisos(id, fnMPObtenerRolUsuario);
}
function fnMPObtenerRolUsuario(data) {
    rolesusuario = (data);
    fnMPListarRoles();
}
function fnEncontrarRolUsuario(rol) {
    for (var i = 0; i <rolesusuario.length; i++) {
        if (rol === rolesusuario[i])
            return true;
    }
    return false;
}

$(document).on('click', '.MP_checkrol', function (e) {
    var idrol = (this.getAttribute('idrol'));
    var idempleado = MP_lblidempleado.textContent;
    var obj = {
        empleado: idempleado,
        permiso:idrol
    };
    let empleado = new EmpleadoController();
    empleado.AsignarRol(obj);
});