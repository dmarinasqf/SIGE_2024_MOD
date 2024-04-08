class SucursalController {
  
    ListarSucursalxEmpresaEnCombo(cmb, idempresa, fn, idsucursal, isselect) {
        var tiposucursal ='LOCAL|PRODUCCIÓN'
        let obj = {
            idempresa: idempresa,
            tiposucursal: tiposucursal
        };

        var url = ORIGEN + "/Administrador/Sucursal/ListarSucursalxEmpresa";

        $.post(url, obj).done(function (data) {
            
            if (cmb === null || cmb === '')
                if (fn != null) {
                    fn(data);
                    return;
                }

            var combo = document.getElementById(cmb);
            combo.innerHTML = '';
            var option = document.createElement('option');
            option.text = '[SELECCIONE]';
            option.value = '';
            combo.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.text = data[i].descripcion;
                option.value = data[i].idsucursal;
                if (idsucursal == data[i].idsucursal)
                    option.selected = true;
                combo.appendChild(option);
            }
            if (idempresa == 1001) {
                option = document.createElement('option');
                option.text = "MATRIZ";
                option.value = "100";
                if (idsucursal == "100")
                    option.selected = true;
                combo.appendChild(option);
            }
            if (idempresa == 1000) {
                option = document.createElement('option');
                option.text = "QF PUCALLPA";
                option.value = "126";
                if (idsucursal == "126")
                    option.selected = true;
                combo.appendChild(option);
            }
            if (isselect) {
                $('#' + cmb).select2({
                    placeholder: 'TODOS',
                    allowClear: true
                });
            }
          
        }).fail(function (data) {
            mensajeError(data);
        });
    }
 
    ListarSucursalesPrimarias(cmb, idempresa, idsucursal, fn ) {
        var url = ORIGEN + '/Administrador/Sucursal/ListarSucursalesPrimarias?idempresa=' + idempresa;
        $.post(url).done(function (data) {           
            var combo = document.getElementById(cmb);
            combo.innerHTML = '';
            var option = document.createElement('option');
            option.text = '[SELECCIONE]';
            option.value = '';
            combo.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.text = data[i].descripcion;
                option.value = data[i].idsucursal;
                if (idsucursal === data[i].idsucursal)
                    option.selected = true;
                combo.appendChild(option);
            }
            if (cmb === null || cmb === '')
                if (fn != null)
                    fn(data);

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarSucursalesByTipoLocal(cmb, tipo, isselect) {
        var url = ORIGEN + '/Administrador/Sucursal/ListarSucursalesByTipoLocal?tipo='+tipo;
        $.post(url).done(function (data) {
            var combo = document.getElementById(cmb);
            combo.innerHTML = '';
            var option = document.createElement('option');
            option.text = '[SELECCIONE]';
            option.value = '';
            combo.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.text = data[i].sucursal;
                option.value = data[i].idsucursal;               
                combo.appendChild(option);
            }
            if (isselect) {
                $('#' + cmb).select2({
                    placeholder: 'Seleccione laboratorio',
                    allowClear: true,
                    width: '100%',
                });
            }

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarSucursalesByTipoLocalSinCombo(tipo, fn) {
        var url = ORIGEN + '/Administrador/Sucursal/ListarSucursalesByTipoLocal?tipo=' + tipo;
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarListasSucursal(idsucursal,cmb, fn) {
        var url = ORIGEN + '/Comercial/ListaPrecios/ListarPreciosSucursal?idsucursal=' + idsucursal;
        $.post(url).done(function (data) {          
           
            if (cmb === null || cmb === '')
                if (fn != null) {
                    fn(data);
                    return;
                }
            var combo = document.getElementById(cmb);
            combo.innerHTML = '';
            var option = document.createElement('option');
            option.text = '[SELECCIONE]';
            option.value = '';
            combo.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.text = data[i].descripcion;
                option.value = data[i].idlista;      
                option.setAttribute('idsucursal', data[i].idsucursal);      
                if (i === 0)
                    option.selected = true;
                combo.appendChild(option);
            }
            if (fn != null)
                fn();

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarLaboratorioSucursal(idsucursal, cmb, fn) {
        var url = ORIGEN + '/Administrador/Sucursal/ListarLaboratorioSucursal?sucursal=' + idsucursal;
        $.post(url).done(function (data) {          
            if (cmb === null || cmb === '')
                if (fn != null) {
                    fn(data);
                    return;
                }
            var combo = document.getElementById(cmb);
            combo.innerHTML = '';
            var option = document.createElement('option');
            option.text = '[SELECCIONE]';
            option.value = '';
            combo.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.text = data[i].descripcion;
                option.value = data[i].idlaboratorio;                     
                combo.appendChild(option);
            }
            if (idsucursal == '154') {
                cmblaboratorio.value='153'
            }

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarSucursalDelivery(idcmb, fn) {
        var url = ORIGEN + '/Administrador/Sucursal/ListarSucursalDelivery';
        $.post(url).done(function (data) {          
            var lugares = fnObtenerLugaresSucursal(data);
            if (idcmb != null && idcmb != '') {
                var cmb = document.getElementById(idcmb);
                cmb.innerHTML = '';
                var option = document.createElement('option');
                option.value = '';
                option.text = '[SELECCIONE]';
                cmb.appendChild(option);
                for (var i = 0; i < lugares.length; i++) {
                    var opgroup = document.createElement('optgroup');

                    if (lugares[i]) {
                        opgroup.label = lugares[i];
                        opgroup.className = 'text-primary';
                    }
                    else { opgroup.label = 'NO ASIGNADO'; opgroup.className = 'text-danger'; }

                    for (var j = 0; j < data.length; j++) {
                        if (lugares[i] === data[j].lugar) {
                            option = document.createElement('option');
                            option.value = data[j].idsucursal;
                            option.text = data[j].descripcion;
                            option.className = 'text-dark';
                            opgroup.appendChild(option);
                        }
                    }
                    cmb.appendChild(opgroup);
                }

            } else
                fn(data);

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    AsignarListaPrecios(obj, ischeck,fn) {
        var url = ORIGEN + '/Administrador/Sucursal/AsignarListaPrecios';
        $.post(url, obj).done(function (data) {          
            if (data.mensaje === 'ok') {
                if (ischeck)
                    mensaje('S', 'LISTA ASIGNADA');
                else
                    mensaje('S', 'LISTA REMOVIDA');
            } else {
                mensaje('W', data.mensaje);
            }
        }).fail(function (data) {
            mensaje("D", 'Error en el servidor');
        });
    }
    ListarSucursalxEmpresaEnTable(idempresa, fn) {
        var url = ORIGEN + '/Administrador/Sucursal/ListarSucursalxEmpresa?idempresa=' + idempresa;
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });

    }
    ListarTodasSucursales(idcmb, idsucursal, fn, isselect) {
        console.log(idcmb+"-"+idsucursal+"-"+fn+"-"+isselect)
        if (idsucursal == undefined)
            idsucursal = '';
        var url = ORIGEN + '/Administrador/Sucursal/ListarSucursales';
        $.post(url).done(function (data) {
            if (idcmb != '' && idcmb != null) {
                var empresas = fnObtenerEmpresa(data);

                var cmb = document.getElementById(idcmb);
                cmb.innerHTML = '';
                var option = document.createElement('option');
                option.value = '';
                option.text = '[SELECCIONE]';
                cmb.appendChild(option);
                for (var i = 0; i < empresas.length; i++) {
                    var opgroup = document.createElement('optgroup');

                    if (empresas[i]) {
                        opgroup.label = empresas[i];
                        opgroup.className = 'text-primary';
                    }
                    else { opgroup.label = 'NO ASIGNADO'; opgroup.className = 'text-danger';  }

                    for (var j = 0; j < data.length; j++) {
                        if (empresas[i] === data[j].empresa) {
                            option = document.createElement('option');
                            option.value = data[j].idsucursal;
                            option.text = data[j].sucursal;
                            option.className = 'text-dark';
                            if (idsucursal.toString() === data[j].idsucursal.toString())
                                option.selected = true;
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
            } else
                if (fn!=null)
                      fn(data);

        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    // LISTADO DE SUCURSAL INCLUIDO LOS LABORATORIOS ---YEX


    ListarTodasSucursalesMLaboratorios(idcmb, idsucursal, fn, isselect) {
        console.log(idcmb + "-" + idsucursal + "-" + fn + "-" + isselect)
        if (idsucursal == undefined)
            idsucursal = 'LOCAL|PRODUCCIÓN';
        var tiposucursal = 'LOCAL|PRODUCCIÓN'
        let obj = {
            tipo: tiposucursal
        };
        var url = ORIGEN + '/Administrador/Sucursal/ListarSucursales';
        $.post(url, obj).done(function (data) {
            if (idcmb != '' && idcmb != null) {
                var empresas = fnObtenerEmpresa(data);

                var cmb = document.getElementById(idcmb);
                cmb.innerHTML = '';
                var option = document.createElement('option');
                option.value = '';
                option.text = '[SELECCIONE]';
                cmb.appendChild(option);
                for (var i = 0; i < empresas.length; i++) {
                    var opgroup = document.createElement('optgroup');

                    if (empresas[i]) {
                        opgroup.label = empresas[i];
                        opgroup.className = 'text-primary';
                    }
                    else { opgroup.label = 'NO ASIGNADO'; opgroup.className = 'text-danger'; }

                    for (var j = 0; j < data.length; j++) {
                        if (empresas[i] === data[j].empresa) {
                            option = document.createElement('option');
                            option.value = data[j].idsucursal;
                            option.text = data[j].sucursal;
                            option.className = 'text-dark';
                            if (idsucursal.toString() === data[j].idsucursal.toString())
                                option.selected = true;
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
            } else
                if (fn != null)
                    fn(data);

        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    //FIN

    ListarEmpleadosSucursal(idsucursal, fn) {
      
        var url = ORIGEN + '/Administrador/Sucursal/ListarEmpleadosSucursal?=idlaboratorio' + idsucursal;
        $.post(url).done(function (data) {
            if (data.mensaje == 'ok')
                fn(data.objeto);
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ListarSucursalEntrega( cmb, fn) {
        var url = ORIGEN + '/Administrador/Sucursal/ListarSucursalEntrega';
        $.post(url).done(function (data) {
          
            if (cmb === null || cmb === '')
                if (fn != null) {
                    fn(data);
                    return;
                }
            var combo = document.getElementById(cmb);
            combo.innerHTML = '';
            var option = document.createElement('option');
            option.text = '[SELECCIONE]';
            option.value = '';
            combo.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.text = data[i].descripcion;
                option.value = data[i].idsucursal;
                combo.appendChild(option);
            }


        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarLaboratorio(cmb, fn, idsucursal, isselect) {

        var url = ORIGEN + '/Administrador/Sucursal/ListarLaboratorio';
        $.post(url).done(function (data) {

            if (cmb === null || cmb === '')
                if (fn != null) {
                    fn(data);
                    return;
                }

            var combo = document.getElementById(cmb);
            combo.innerHTML = '';
            var option = document.createElement('option');
            option.text = '[SELECCIONE]';
            option.value = '';
            combo.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.text = data[i].descripcion;
                option.value = data[i].idlaboratorio;
                if (idsucursal == data[i].idlaboratorio)
                    option.selected = true;
                combo.appendChild(option);
            }
            if (isselect) {
                $('#' + cmb).select2({
                    placeholder: 'TODOS',
                    allowClear: true
                });
            }

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarCorrelativos(idsucursal, fn) {
        var url = ORIGEN + "/Administrador/Sucursal/ListarCorrelativos?idsucursal=" + idsucursal;
        $.post(url).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}
function fnObtenerEmpresa(array) {
    var empresas = [];
    for (var i = 0; i < array.length; i++) {
        //if (array[i].lugar === null || array[i].lugar === '') array[i].lugar = 'NO ASIGNADO';
        var res = false;
        for (var j = 0; j < empresas.length; j++) {
            if (array[i].empresa === empresas[j]) {
                res = true;
                break;
            }
        }
        if (!res)
            empresas.push(array[i].empresa);
    }
    return empresas.sort();
}
function  fnObtenerLugaresSucursal(array) {
    var lugares = [];
    for (var i = 0; i < array.length; i++) {
        //if (array[i].lugar === null || array[i].lugar === '') array[i].lugar = 'NO ASIGNADO';
        var res = false;
        for (var j = 0; j < lugares.length; j++) {
            if (array[i].lugar === lugares[j]) {
                res = true;
                break;
            }
        }
        if (!res)
            lugares.push(array[i].lugar);

    }
    return lugares.sort();
}