class AnalisisOrganolepticoController {
    // 
    registrar(params, fn) {
        var url = ORIGEN + "/Preingreso/PIAnalisisOrganoleptico/Registrar";
        $.post(url, params).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensaje("D", "Error en el servidor");
        });
    }
//    recibe  (string codigo,string sucursal,string factura,string estado, int top)
            
    getHistorial(params, fn) {
        var url = ORIGEN + "/Preingreso/PIAnalisisOrganoleptico/getListaAnalisisOrganoleptico";
        $.post(url, params).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensaje("D", "Error en el servidor");
        });
    }
    //recibe  (int id)
    getAnalisisOrganolepticoCompleto(params, fn) {
        var url = ORIGEN + "/Preingreso/PIAnalisisOrganoleptico/getAnalisisOrganolepticoCompleto";
        $.post(url, params).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensaje("D", "Error en el servidor");
        });
    }

}

