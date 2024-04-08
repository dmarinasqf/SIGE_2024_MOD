class ProformaController {
    RegistrarProforma(obj, idproforma, fn,fnerror) {
        var url = ORIGEN + "/Ventas/Proforma/Proforma";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok") {
                //console.log(data.objeto.idproforma);
                var href = ORIGEN + '/Ventas/Proforma/ImprimirProforma1/' + data.objeto.idproforma;
                ABRIR_MODALIMPRECION(href, 'IMPRIMIR PROFORMA');
                fn(data.objeto);
                if (idproforma === '')
                    alertaSwall('S', 'Se registro la proforma N:' + data.objeto.codigoproforma, '');
                else
                    alertaSwall('S', 'Se actualizo la proforma N:' + data.objeto.codigoproforma, '');

            }
            else {
                alertaSwall('W', data.mensaje, '');
                fnerror();
            }
                
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }
    //string fechainicio, string fechafin, string sucursal, string numdocumento,int top,int numsemanas, estado
    GetHistorialProformas(obj, fn) {
        var url = ORIGEN + "/Ventas/Proforma/GetHistorialProformas";
        $.post(url, obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    GetProformaCompleta(obj, fn) {
        var url = ORIGEN + "/Ventas/Proforma/GetProformaCompletaxId" ;
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok")
                fn(JSON.parse(data.tabla));
            else
                mensaje('W', data.mensaje, 'TC');
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    GetProformaCompletaxCodigoProforma(obj, fn) {
        var url = ORIGEN + "/Ventas/Proforma/GetProformaCompletaxCodigoProforma" ;
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok")
                fn(JSON.parse(data.tabla));
            else
                mensaje('W', data.mensaje, 'TC');
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    GetProformaParaPedido(obj, fn) {
        var url = ORIGEN + "/Ventas/Proforma/GetProformaParaPedido" ;
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok")
                fn(data.objeto);
            else
                mensaje('W', data.mensaje, 'TC');
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}