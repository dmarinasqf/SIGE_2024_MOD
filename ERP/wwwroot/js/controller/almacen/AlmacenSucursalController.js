class AlmacenSucursalController {

    ListarAlmacenxSucursal(idcmb, idsucursal, seleccionar, fn) {

        var url = ORIGEN + "/Almacen/AAlmacenSucursal/BuscarAlmacenxSucursal2?idsucursal=" + idsucursal;
        $.post(url).done(function (data) {

            if (idcmb != '' && idcmb != null) {
                var almacenes = fnObtenerTipoALmacen(data);
                var cmb = document.getElementById(idcmb);
                if (cmb != null) {
                    cmb.innerHTML = '';
                    var option = document.createElement('option');
                    option.value = '';
                    option.text = '[SELECCIONE]';
                    cmb.appendChild(option);
                    for (var i = 0; i < almacenes.length; i++) {
                        var opgroup = document.createElement('optgroup');

                        if (almacenes[i]) {
                            opgroup.label = almacenes[i];
                            opgroup.className = 'text-primary';
                        }
                        else { opgroup.label = 'NO ASIGNADO'; opgroup.className = 'text-danger'; }

                        for (var j = 0; j < data.length; j++) {
                            if (almacenes[i] === data[j].almacen) {
                                option = document.createElement('option');
                                option.value = data[j].idalmacensucursal;
                                option.text = data[j].areaalmacen + ' ' + data[j].idtipoproducto;
                                option.className = 'text-dark';
                                option.setAttribute('idareaalmacen', data[j].idareaalmacen);
                                if (seleccionar == data[j].idalmacensucursal)
                                    option.selected = true;
                                opgroup.appendChild(option);
                            }
                        }
                        cmb.appendChild(opgroup);
                    }
                    if (fn != null)
                        fn(data);
                }

            } else
                fn(data);

        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    LllenarComboAlmacenSucursalAux(cmb, data, seleccionar) {
        if (cmb != '' || cmb != null) {
            var almacenes = fnObtenerTipoALmacen(data);
            cmb.innerHTML = '';
            var option = document.createElement('option');
            option.value = '';
            option.text = '[SELECCIONE]';
            cmb.appendChild(option);
            for (var i = 0; i < almacenes.length; i++) {
                var opgroup = document.createElement('optgroup');
                if (almacenes[i]) {
                    opgroup.label = almacenes[i];
                    opgroup.className = 'text-primary';
                }
                else { opgroup.label = 'NO ASIGNADO'; opgroup.className = 'text-danger'; }

                for (var j = 0; j < data.length; j++) {
                    if (almacenes[i] === data[j].almacen) {
                        option = document.createElement('option');
                        option.value = data[j].idalmacensucursal;
                        option.text = data[j].areaalmacen;
                        option.className = 'text-dark';
                        if (seleccionar == data[j].idalmacensucursal) {
                            option.setAttribute('selected', true);
                        }
                        opgroup.appendChild(option);
                    }
                }
                cmb.appendChild(opgroup);
            }

        }
        return cmb;
    }


    //ATRIBUTOS QUE RECIBE
    //string idsucursal
    //RETORNA UN DATATABLE DE OBJETOS 
    ListarAlmacenesxSucursal_dt(params, fn) {

        var url = ORIGEN + "/Almacen/AAlmacenSucursal/buscarAlmacenxSucursal";
        $.post(url, params).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });
    }

    // CODIGO LISTADO DE ALMACENES FILTRADO POR SUCURSAL Y EMPLEADO
    ListarAlmacenxSucursalEmpleado(idcmb, idsucursal, seleccionar, fn) {

        var url = ORIGEN + "/Almacen/AAlmacenSucursal/BuscarAlmacenxSucursalempleado?idsucursal=" + idsucursal;
        $.post(url).done(function (data) {

            if (idcmb != '' && idcmb != null) {
                var almacenes = fnObtenerTipoALmacen(data);

                var cmb = document.getElementById(idcmb);
                cmb.innerHTML = '';
                var option = document.createElement('option');
                option.value = '';
                option.text = '[SELECCIONE]';
                cmb.appendChild(option);
                for (var i = 0; i < almacenes.length; i++) {
                    var opgroup = document.createElement('optgroup');

                    if (almacenes[i]) {
                        opgroup.label = almacenes[i];
                        opgroup.className = 'text-primary';
                    }
                    else { opgroup.label = 'NO ASIGNADO'; opgroup.className = 'text-danger'; }

                    for (var j = 0; j < data.length; j++) {
                        if (almacenes[i] === data[j].almacen) {
                            option = document.createElement('option');
                            option.value = data[j].idalmacensucursal;
                            option.text = data[j].areaalmacen + ' ' + data[j].idtipoproducto;
                            option.className = 'text-dark';
                            option.setAttribute('idareaalmacen', data[j].idareaalmacen);
                            if (seleccionar == data[j].idalmacensucursal)
                                option.selected = true;
                            opgroup.appendChild(option);
                        }
                    }
                    cmb.appendChild(opgroup);
                }
                if (fn != null)
                    fn(data);
            } else
                fn(data);

        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

}

function fnObtenerTipoALmacen(array) {
    var almacenes = [];
    for (var i = 0; i < array.length; i++) {
        //if (array[i].lugar === null || array[i].lugar === '') array[i].lugar = 'NO ASIGNADO';
        var res = false;
        for (var j = 0; j < almacenes.length; j++) {
            if (array[i].almacen === almacenes[j]) {
                res = true;
                break;
            }
        }
        if (!res)
            almacenes.push(array[i].almacen);

    }
    return almacenes.sort();

}






