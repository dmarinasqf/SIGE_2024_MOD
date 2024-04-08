class ProveedorController {
    BuscarProveedor(id,fn) {
        var url = ORIGEN + "/Compras/CProveedor/Buscar/" + id;
        $.post(url).done(function (data) {
            if (data.mensaje === "ok") {
                {
                    fn(data.objeto);
                }
            }
            else {
                mensaje("W", data.mensaje);
            }

        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });

    }
    ListarLaboratorios(proveedor,laboratorio, fn) {
        var url = ORIGEN + "/Compras/CProveedor/listarLaboratorioProveedor";
        var data = { proveedor: proveedor, laboratorio: laboratorio };

        $.post(url, data).done(function (data) {
            fn(data);

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    RegistrarCuenta(obj, fn) {
        var url = ORIGEN + "/Compras/CProveedor/RegistrarCuenta";
        console.log(obj);
        $.post(url, obj).done(function (data) {
         
            if (data.mensaje === "ok") {
                mensaje('S', 'Registro guardado.');
                fn(data);
            }
            else 
                mensaje("W", data.mensaje);           
        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });

    }
    EliminarCuenta(id, fn) {
        var url = ORIGEN + "/Compras/CProveedor/EliminarCuenta/" + id;
        $.post(url).done(function (data) {
            if (data.mensaje === "ok") {
                mensaje('S', 'Cuenta eliminada');
                    fn();                
            }
            else 
                mensaje("W", data.mensaje);            

        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });

    }
    BuscarCuenta(id, fn) {
        var url = ORIGEN + "/Compras/CProveedor/BuscarCuenta/" + id;
        $.post(url).done(function (data) {
            if (data.mensaje === "ok")             
                    fn(data);                
            else 
                mensaje("W", data.mensaje);            

        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });

    }
    ListarCuentas(idproveedor, fn) {
        var url = ORIGEN + "/Compras/CProveedor/ListarCuentas?idproveedor=" + idproveedor;
        $.post(url).done(function (data) {
            fn(data);

        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });

    }
    RegistrarDatosArchivo(obj, fn) {
        var url = ORIGEN + "/Compras/CProveedor/RegistrarDatosArchivo";             
        $.ajax({
            url: url,
            type: "POST",
            data: obj,
            contentType: false,
            processData: false,
            async: false,
            success: function (data) {
                if (data.mensaje == 'ok')
                    fn();
                else
                    mensaje('W', data.mensaje);
            }, error: function (data) {
                mensajeeliminar(data);
            }
        });

    }   
    EliminarArchivo(id, fn) {
        var url = ORIGEN + "/Compras/CProveedor/EliminarArchivo/"+id;
     
        $.post(url).done(function (data) {
            if (data.mensaje === "ok") {
                mensaje('S', 'Registro Eliminado.');
                fn(data);
            }
            else
                mensaje("W", data.mensaje);
        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });

    }
    ListarArchivos(idproveedor, fn) {
        var url = ORIGEN + "/Compras/CProveedor/ListarArchivos?idproveedor=" + idproveedor;
      
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });

    }
    BuscarProveedoresSelect2() {
        return {
            url: ORIGEN + "/Compras/CProveedor/BuscarProveedores",
            dataType: 'json',
            data: function (params) {
                var query = {
                    filtro: params.term,
                }
                return (query);
            },
            processResults: function (data) {
                return {
                    results: $.map(data, function (obj) {
                        return {
                            id: obj.idproveedor,
                            text: obj.ruc+' '+obj.razonsocial
                        };
                    })
                };
            }
        }
    }
    //ListarProveedor(cmb, fn, isselect) {
    //    var url = ORIGEN + '/Compras/CProveedor/ListarProveedor';
    //    $.post(url).done(function (data) {

    //        if (cmb === null || cmb === '')
    //            if (fn != null) {
    //                fn(data);
    //                return;
    //            }

    //        var combo = document.getElementById(cmb);
    //        combo.innerHTML = '';
    //        var option = document.createElement('option');
    //        option.text = '[SELECCIONE]';
    //        option.value = '';
    //        combo.appendChild(option);
    //        for (var i = 0; i < data.length; i++) {
    //            option = document.createElement('option');
    //            option.text = data[i].razonsocial;//
    //            option.value = data[i].idproveedor;//
    //            combo.appendChild(option);
    //        }
    //        if (isselect) {
    //            $('#' + cmb).select2({
    //                placeholder: 'TODOS',
    //                allowClear: true
    //            });
    //        }

    //    }).fail(function (data) {
    //        mensajeError(data);
    //    });
    //}
    //ReporteDevolucionProveedor(obj, fn) {
    //    var url = ORIGEN + "/Compras/CReporte/ReporteDevolucion";
    //    $.post(url, obj).done(function (data) {
    //        if (data == '[]') {
    //            console.log('adentro');
    //            mensaje('W', 'No se encontraron registros');
    //        }
    //            fn(JSON.parse(data));
    //    }).fail(function (data) {
    //        fn(null);

    //        mensajeError(data);
    //    });
    //}
    //GenerarExcelDevolucionProveedor(obj, fn) {
    //    var url = ORIGEN + "/Compras/CReporte/GenerarExcelDevolucionProveedor";
    //    $.post(url, obj).done(function (data) {
    //        if (data.mensaje === 'ok') {
    //            location.href = ORIGEN + data.objeto;
    //        }
    //        else
    //            mensaje('W', data.mensaje);
    //    }).fail(function (data) {
    //        fn(null);
    //        mensajeError(data);
    //    });
    //}
}