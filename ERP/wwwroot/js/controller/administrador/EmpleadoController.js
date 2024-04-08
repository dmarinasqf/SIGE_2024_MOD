class EmpleadoController {

    ListarEmpleado(fn) {
        var url = ORIGEN + "/Administrador/Empleado/ListarEmpleados";
        $.post(url).done(function (data) {
            var datos = JSON.parse(data);
            fn(datos);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    //int idempleado
    ListarPermisos(idempleado, fn) {
        var url = ORIGEN + '/Administrador/Empleado/ListarRolesEmpleado?idempleado=' + idempleado;
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });
    }
    ValidarCredenciales(obj, fn) {
        var url = ORIGEN + '/Administrador/Empleado/ValidarCredenciales';
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok')
                fn(data.objeto);
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });
    }
    ListarEmpleadosDatosBasicosCombo(obj, cmb, tipoid, fn) {
        var url = ORIGEN + '/Administrador/Empleado/ListarEmpleadosDatosBasicos';
        $.post(url, obj).done(function (data) {
            var combo = document.getElementById(cmb);
            combo.innerHTML = '';
            var option = document.createElement('option');
            //option.text = '';
            //option.value = '';
            //combo.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.text = data[i].nombres;
                if (tipoid == 'documento')
                    option.value = data[i].documento;
                else
                    option.value = data[i].idsucursal;

                combo.appendChild(option);
            }
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarEmpleados(obj, fn) {
        var url = ORIGEN + '/Administrador/Empleado/BuscarEmpleados';
        $.post(url, obj).done(function (data) {
            data = JSON.parse(data);
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });
    }
    //(int empleado, string permiso)
    AsignarRol(params) {
        var url = ORIGEN + '/Administrador/Empleado/AgregarRemoverPermiso';
        $.post(url, params).done(function (data) {
            if (data.mensaje === 'ok')
                mensaje('S', 'Datos Guardados');
            else
                mensaje('W', data.mensaje);

        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });
    }
    AsignarCanalVenta(params) {
        var url = ORIGEN + '/Administrador/Empleado/AsignarCanalVenta';
        $.post(url, params).done(function (data) {
            if (data.mensaje === 'ok')
                mensaje('S', 'Datos Guardados');
            else
                mensaje('W', data.mensaje);

        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });
    }
    AsignarSucursal(params) {
        var url = ORIGEN + '/Administrador/Empleado/AsignarSucursal';
        $.post(url, params).done(function (data) {
            if (data.mensaje === 'ok')
                mensaje('S', 'Datos Guardados');
            else
                mensaje('W', data.mensaje);

        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });
    }
    ListarEmpleadosxCargo(params, fn) {
        var url = ORIGEN + '/Administrador/Empleado/ListarEmpleadosxCargo';
        $.post(url, params).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });
    }
    ListarEmpleadosA(fn) {
        var url = ORIGEN + '/Administrador/Empleado/ListarEmpleadosA';
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", data);
        });
    }
    ListarEmpleadosNA(fn) {
        var url = ORIGEN + '/Administrador/Empleado/ListaEmpleadosNA';
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", data);
        });
    }
    EliminarEmpleadoA_Asis(obj,fn) {
        var url = ORIGEN + '/Administrador/Empleado/EliminarEmpleadoA';
        $.post(url, obj).done(function (data) {
            if (data.mensaje == "ok") {
                {
                    fn(data);
                }
            }
            else {
                mensaje("D", data);
            }
        }).fail(function (data) {
            console.log(data);
            mensaje("D", data);
        });
    }

    ListarMotorizados(cmb, fn) {
        var url = ORIGEN + '/Administrador/Empleado/ListarMotorizados';
        $.post(url).done(function (data) {
            if (cmb != null) {
                console.log(data);
                var combo = document.getElementById(cmb);
                combo.innerHTML = '';
                var option = document.createElement('option');
                option.text = '[SELECCIONE]';
                option.value = '';
                combo.appendChild(option);
                for (var i = 0; i < data.length; i++) {
                    option = document.createElement('option');
                    option.text = data[i].nombres;
                    option.value = data[i].idempleado;
                    combo.appendChild(option);
                }
            }
            if (fn != null) fn(data);
           
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}
