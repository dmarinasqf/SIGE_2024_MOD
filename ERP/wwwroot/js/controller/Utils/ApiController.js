class ApiController {
    BuscarSunatReniec(num,tipo, fn) {
        var url = ORIGEN + "/Maestros/Cliente/ConsultarRucReniec";

        var obj = {
            numdocumento: num,
            tipo: tipo
        };
        $.get(url, obj).done(function (data) {
            //console.log("HOLA MUNDO");
            console.log(data);
            if (data.mensaje == "ok")
                if(data.objeto==null || data.objeto=='')
                    mensaje('W', 'No se encontro registrado en la SUNAT o RENIEC','','',true);
                else
                    fn(JSON.parse(data.objeto));
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            mensajeError(data);
        });
    }

    BuscarCliente(num, fn) {
        var url = ORIGEN + "/Maestros/Cliente/BuscarCliente";
        var obj = {
            numdocumento: num
        };
        $.get(url, obj).done(function (data) {
            //console.log(data);
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}