
$(document).on('click', '.check-rol', function (e) {
    var valor = $(this).prop('checked');
    var idrol = $(this).attr('idrol');
    console.log(idrol);
    agregarRemoverPermiso(valor, idrol.toString());
});

function agregarRemoverPermiso(valor,rol) {
   
    var url = ORIGEN +"/Usuarios/Empleado/AgregarRemoverPermiso";
    var obj = {
        empleado: empleado,
        permiso: rol
    };    
    console.log(rol);
    $.post(url,obj).done(function (data) {
        console.log(data);
        if (data.mensaje === "ok") {
            if (valor)
                mensaje('S', 'Permiso añadido');
            else
                mensaje('S', 'Permiso removido');
        } else
            mensaje('W', data.mensaje);
    }).fail(function (data) {
        console.log(data);      
        mensaje("D", "Error en el servidor");
    });
}