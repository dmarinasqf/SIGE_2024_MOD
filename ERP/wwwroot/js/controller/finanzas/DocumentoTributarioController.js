class DocumentoTributarioController {
    Listar(idcmb, fn) {
        var url = ORIGEN + '/Finanzas/FDocumentoTributario/ListarDocumentos';
        $.get(url).done(function (data) {
            if (idcmb != null && idcmb != '') {
                var cmb = document.getElementById(idcmb);
                cmb.innerHTML = '';
                var option = document.createElement('option');
                option.value = '';
                option.text = '[SELECCIONE]';
                cmb.appendChild(option); 
                for (var j = 0; j < data.length; j++) {
                    option = document.createElement('option');
                    option.value = data[j].iddocumento;
                    option.text = data[j].descripcion;
                    cmb.appendChild(option);
                }

            } else
                fn(data);
        }).fail(function (data) {
            mensajeError(data);
        }); 
    }
    ListarDocumentoNotas(idcajasucursal, idcmb, iddocumento, fn) {
        console.log(idcajasucursal);
        var url = ORIGEN + '/Finanzas/FDocumentoTributario/ListarDocumentosxCajaSucursalParaVentas?idcajasucursal=' + idcajasucursal;
        $.get(url).done(function (data) {
          
            if (data.mensaje === 'ok') {
                
                data = data.objeto;
                if (idcmb != null && idcmb != '') {
                    var cmb = document.getElementById(idcmb);
                    cmb.innerHTML = '';
                    var option = document.createElement('option');
                    option.value = '';
                    option.text = '[SELECCIONE]';
                    option.setAttribute('serie', '');
                    option.setAttribute('idcajasucursal', '');
                    cmb.appendChild(option);
                    for (var j = 0; j < data.length; j++) {
                        option = document.createElement('option');
                        option.value = data[j].iddocumento;
                        option.text = data[j].descripcion;
                        option.setAttribute('serie', data[j].serie);
                        option.setAttribute('codigosunat', data[j].codigosunat);
                        if (iddocumento === data[j].iddocumento)
                            option.selected = true;
                        option.setAttribute('idcajasucursal', data[j].idcajasucursal);
                        if (data[j].descripcion === 'NOTA DE CREDITO')
                            option.selected = true;
                        if (data[j].codigosunat === '07' || data[j].codigosunat === '08')
                            cmb.appendChild(option);
                    }
                    fn();
                } else
                    fn(data);
            } else
                mensaje('W', data.mensaje);

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarDocumentosxCajaSucursalParaVentas(idcajasucursal,idcmb,iddocumento, fn) {
        var url = ORIGEN + '/Finanzas/FDocumentoTributario/ListarDocumentosxCajaSucursalParaVentas?idcajasucursal=' + idcajasucursal;
        $.get(url).done(function (data) {          
            if (data.mensaje === 'ok') {
                data = data.objeto;
               
                if (idcmb != null && idcmb != '') {
                    var cmb = document.getElementById(idcmb);
                    cmb.innerHTML = '';
                    var option = document.createElement('option');
                    option.value = '';
                    option.text = '[SELECCIONE]';
                    option.setAttribute('serie','');
                    option.setAttribute('idcajasucursal','');
                    cmb.appendChild(option);
                    for (var j = 0; j < data.length; j++) {
                        option = document.createElement('option');
                        option.value = data[j].iddocumento;
                        option.text = data[j].descripcion;
                        option.setAttribute('serie', data[j].serie);
                        option.setAttribute('codigosunat', data[j].codigosunat);
                        if (iddocumento === data[j].iddocumento)
                            option.selected = true;
                        option.setAttribute('idcajasucursal', data[j].idcajasucursal);
                        if (data[j].descripcion === 'BOLETA')
                            option.selected = true;
                        if (data[j].descripcion === 'FACTURA' || data[j].descripcion === 'BOLETA'||data[j].descripcion === 'NOTA DE VENTA')
                            cmb.appendChild(option);
                    }
                    fn();
                } else
                    fn(data);
            } else
                mensaje('W', data.mensaje);
            
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarTipoDocumentoxDocumentoTributario(iddocumento, idcmb, idtipo, fn) {
        var url = ORIGEN + '/Finanzas/FDocumentoTributario/ListarTipoDocumentoxDocumentoTributario?iddocumento=' + iddocumento;
        $.get(url).done(function (data) {          
                
                if (idcmb != null && idcmb != '') {
                    var cmb = document.getElementById(idcmb);
                    cmb.innerHTML = '';
                    var option = document.createElement('option');
                    option.value = '';
                    option.text = '[SELECCIONE]';
                    option.setAttribute('codigosunat','');                 
                    cmb.appendChild(option);
                    for (var j = 0; j < data.length; j++) {
                        option = document.createElement('option');
                        option.value = data[j].idtipodocumento;
                        option.text = data[j].descripcion;                        
                        option.setAttribute('codigosunat', data[j].codigosunat);
                        if (idtipo === data[j].idtipodocumento)
                            option.selected = true;                                                                   
                        cmb.appendChild(option);
                    }
                   
                } else
                    fn(data);
          
            
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarDocumentosxCajaAperturada(idcajaaperturada, idcmb, iddocumento, fn,tipo) {
        var url = ORIGEN + '/Finanzas/FDocumentoTributario/ListarDocumentosxCajaAperturada?idcajaaperturada=' + idcajaaperturada;
        $.get(url).done(function (data) {
            if (data.mensaje === 'ok') {
                data = data.objeto;

                if (idcmb != null && idcmb != '') {
                    var cmb = document.getElementById(idcmb);
                    cmb.innerHTML = '';
                    var option = document.createElement('option');
                    option.value = '';
                    option.text = '[SELECCIONE]';
                    option.setAttribute('serie', '');
                    option.setAttribute('idcajasucursal', '');
                    cmb.appendChild(option);
                    for (var j = 0; j < data.length; j++) {
                        option = document.createElement('option');
                        option.value = data[j].iddocumento;
                        option.text = data[j].descripcion;
                        option.setAttribute('serie', data[j].serie);
                        option.setAttribute('codigosunat', data[j].codigosunat);
                        if (iddocumento === data[j].iddocumento)
                            option.selected = true;
                        option.setAttribute('idcajasucursal', data[j].idcajasucursal);
                        if (tipo === 'nota') {
                           
                            if (data[j].codigosunat === '07' || data[j].codigosunat === '08')
                                cmb.appendChild(option);
                        } else {
                            if (data[j].descripcion === 'BOLETA')
                                option.selected = true;
                            if (data[j].codigosunat === '01' || data[j].codigosunat === '03' || data[j].descripcion =='NOTA DE VENTA')
                                cmb.appendChild(option);
                        }                       
                    }
                    fn();
                } else
                    fn(data);
            } else
                mensaje('W', data.mensaje);

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarDocumentosSucursal(idsucursal, fn) {
        var url = ORIGEN + '/Finanzas/FDocumentoTributario/ListarDocumentoSucursal?idsucursal=' + idsucursal;
        $.get(url).done(function (data) {
            fn(data);

        }).fail(function (data) {
            mensajeError(data);
        });
    }
}