class NotaCDController {
    Registrar(obj, fn) {
            var url = ORIGEN + "/Ventas/NotaCD/RegistrarEditar";
            $.post(url, obj).done(function(data) {
                if (data.mensaje === "ok") {
                    fn(data.objeto);
                    alertaSwall('S', 'Registro guardado', '');
                } else
                    alertaSwall('W', data.mensaje, '');
            }).fail(function(data) {
                mensajeError(data);
            });
        }
        //string fechainicio, string fechafin, string sucursal, string numdocnota,strng numdocventa,int top
    GetHistorialNotas(obj, fn) {
        var url = ORIGEN + "/Ventas/NotaCD/GetHistorialNotas";
        $.post(url, obj).done(function(data) {
            fn(JSON.parse(data));
        }).fail(function(data) {
            mensajeError(data);
        });
    }
    GetNotaCompleta(idnota, fn) {
        var url = ORIGEN + "/Ventas/NotaCD/GetNotaCompleta?idnota=" + idnota;
        $.post(url).done(function(data) {
            fn(JSON.parse(data));
        }).fail(function(data) {
            mensajeError(data);
        });
    }
    BuscarVentaNotaCD(obj, fn) {
        var url = ORIGEN + "/Ventas/NotaCD/BuscarVentaNotaCD";
        $.post(url, obj).done(function(data) {
            fn(JSON.parse(data));
        }).fail(function(data) {
            mensajeError(data);
        });
    }

    BuscarVentaNotaCD_V1(obj, fn) {
        var url = ORIGEN + "/Ventas/NotaCD/BuscarVentaNotaCD_v1";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    VerificarSiVentaTieneNota(idventa, fn) {
        var url = ORIGEN + "/Ventas/NotaCD/VerificarSiVentaTieneNota?idventa=" + idventa;
        $.post(url).done(function(data) {
            fn(data);
        }).fail(function(data) {
            mensajeError(data);
        });
    }
    GenerarTxtNota(idnota, fn) {
        var url = ORIGEN + "/Ventas/NotaCD/GenerarTxtNota?idnota=" + idnota;
        $.post(url).done(function (data) {
            if (data === 'ok')
                mensaje('S', 'Documento generado para SUNAT');
            else if (data === 'no')
                console.log('');
            else
                mensaje('W', data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ExportarNotas(obj, fn) {
        var url = ORIGEN + "/Ventas/NotaCD/GenerarExcelNotas";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') {
                location.href = ORIGEN + data.objeto;
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }

    // CODIGO PARA EL LISTADO DE LAS SUCURSALES 
    ListarTodasSucursales(idcmb, idsucursal, fn, isselect) {
        console.log(idcmb + "-" + idsucursal + "-" + fn + "-" + isselect)
        if (idsucursal == undefined)
            idsucursal = '';

        var txtnombreempresa = document.getElementById('txtnombreempresa').value;
        var txtnombresucursal = document.getElementById('txtnombresucursal').value;
        var url = ORIGEN + '/Administrador/Sucursal/ListarSucursales';
        $.post(url).done(function (data) {
            if (idcmb != '' && idcmb != null) {
                var empresas = fnObtenerEmpresa(data);

                var cmb = document.getElementById(idcmb);
                cmb.innerHTML = '';

                for (var i = 0; i < empresas.length; i++) {
                    var opgroup = document.createElement('optgroup');

                    if (empresas[i]) {
                        opgroup.label = empresas[i];
                        opgroup.className = 'text-primary';
                    } else {
                        opgroup.label = 'NO ASIGNADO';
                        opgroup.className = 'text-danger';
                    }

                    for (var j = 0; j < data.length; j++) {
                        if (empresas[i] === data[j].empresa) {
                            var option = document.createElement('option');
                            option.value = data[j].idsucursal;
                            option.text = data[j].sucursal;
                            option.setAttribute('data-idcaja', data[j].idcaja); // Usar un atributo de datos personalizado
                            option.setAttribute('data-idempresa', data[j].idempresa); // Usar un atributo de datos personalizado

                            option.className = 'text-dark';

                            // Verificar si la opción coincide con txtnombreempresa y txtnombresucursal
                            if (txtnombreempresa === data[j].empresa && txtnombresucursal === data[j].sucursal) {
                                option.selected = true;
                            }

                            opgroup.appendChild(option);
                        }
                    }
                    cmb.appendChild(opgroup);
                }

                if (isselect) {
                    $('#' + idcmb).select2({
                        placeholder: 'TODOS',
                        allowClear: true,
                        width: '100%',
                    });
                }

                if (fn != null)
                    fn(data);
            } else {
                if (fn != null)
                    fn(data);
            }
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
}