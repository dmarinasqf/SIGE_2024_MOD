class AsistenciaController {
    AutorizarEmpleado(obj, fn) {
        var url = ORIGEN + '/Asistencia/Control/AutorizarEmp';
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                mensaje('S', 'Datos guardados');
                fn();
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    RegistrarEditar(obj, fn) {
        var url = ORIGEN + '/Asistencia/Control/RegistrarEditar';

        $.post(url, obj).done(function (data) {
            //if (data.mensaje === 'registrado') {
            //    fn();
            //}
            //else
            //    mensaje('W', data.mensaje);
            fn(data);
        }).fail(function (data) {
            limpiarModalTemperatura();
            mensaje("D", data.mensaje);
            desactivarBotones();
        });
    }
    LlenarCmbEmpleadosA(cmb,fn) {
        var url = "/Administrador/Empleado/ListarEmpleadosA";
        $.post(url).done(function (data) {
            if (data != null) {
                $('#'+cmb+' option').remove();
                $('#'+cmb).append('<option value="0">- SELECCIONE -</option>');
                $(data).each(function (i, e) {
                    $('#' + cmb).append('<option value="' + [e.idEmpleadoA] + '">' + [e.empleado] + '</option>');
                });
                //buscarUsuarioAutoriza(txtClave.val());
            }
        }).fail(function (data) {
            mensaje("D", data);
        });
    }
}