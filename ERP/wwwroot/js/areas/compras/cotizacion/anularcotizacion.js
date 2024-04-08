

function anularCotizacion(id) {   
    var url = ORIGEN + "/Compras/CCotizacion/AnularCotizacion";  
    var obj= { id:id };
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            mensaje('S', 'Registro anulado');   
            $('#txtestado').val('ANULADO');
            location.reload();
        }
        else {
            mensaje('W', data.mensaje);            
        }
    }).fail(function (data) {        
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
}

function habilitarCotizacion(id) {   
    var url = ORIGEN + "/Compras/CCotizacion/habilitarCotizacion";  
    var obj= { id:id };
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            mensaje('S', 'Registro habilitado');   
            $('#txtestado').val('PENDIENTE');
            location.reload();
        }
        else {
            mensaje('W', data.mensaje);            
        }
    }).fail(function (data) {        
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
}