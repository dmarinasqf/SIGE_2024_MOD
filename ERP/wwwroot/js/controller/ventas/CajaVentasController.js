class CajaVentasController {
    ListarCajaSucursal(idsucursal, idcmb) {
        var url = ORIGEN + "/Ventas/Caja/ListarCajaSucursal?idsucursal=" + idsucursal;
        $.post(url).done(function (data) {
       
            var cmb = document.getElementById(idcmb);
            cmb.innerHTML = '';
            var option = document.createElement('option');
            option.value = '';
            option.text = '[SELECCIONE]';
            cmb.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.value = data[i].idcajasucursal;
                option.text = data[i].descripcion;                
                if (data[i].aperturado) {
                    option.disabled = true;
                    option.classList.add('text-info');
                    option.text += '-Aperturada';
                }
                cmb.appendChild(option);
            }
        }).fail(function (data) {            
            mensajeError(data);
        });
    }
    //int idcajasucursal,decimal montoinicial
    AperturarCaja(obj) {
        var url = ORIGEN + "/Ventas/Caja/AperturarCaja";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok")
                alertaSwall('S', 'Caja aperturada', '');
            else
                alertaSwall('W', data.mensaje,'');
        }).fail(function (data) {            
            mensajeError(data);
        });
    }
    CerrarCaja(obj,fn) {
        var url = ORIGEN + "/Ventas/Caja/CerrarCaja" ;
        
        $.post(url,obj).done(function (data) {
            if (data.mensaje === "ok")
            {
                alertaSwall('S', 'Caja Cerrada', '');
                console.log(data);
                fn(data.objeto);
            }
            else
                alertaSwall('W', data.mensaje, '');
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    GetDatosCierre(idaperturacaja,fn) {
        var url = ORIGEN + "/Ventas/Caja/GetDatosCierre?idaperturacaja=" + idaperturacaja;
        $.post(url).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarCajaAbiertas( fn) {
        var url = ORIGEN + "/Ventas/Caja/ListarCajaAbiertas" ;
        $.post(url).done(function (data) {
            fn((data));
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    GetCajasCerradas(obj,fn) {
        var url = ORIGEN + "/Ventas/Caja/GetCajasCerradas" ;
        $.post(url,obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarCajasPorfechaYUsuario(obj, fn) {
        var url = ORIGEN + "/Ventas/Caja/ListarCajasPorfechaYUsuario" ;
        $.post(url,obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    GuardarPreCierre(obj, fn) {
        var url = ORIGEN + "/Ventas/Caja/GuardarPreCierre" ;
        $.post(url,obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarCuadreCajeLocales(obj, fn) {
        var url = ORIGEN + "/Ventas/Caja/ListarCuadreCajeLocales";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarCajaMontosXFechaXSucursal(obj, fn) {
        var url = ORIGEN + "/Ventas/Caja/ListarCajaMontosXFechaXSucursal";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    RegistrarDepositoCaja(obj, fn) {
        var url = ORIGEN + "/Ventas/Caja/RegistrarDepositoCaja";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
}