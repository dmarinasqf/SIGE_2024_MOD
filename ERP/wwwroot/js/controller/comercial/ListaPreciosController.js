class ListaPreciosController {
    RegistrarEditar(obj, fn) {
        var url = ORIGEN + "/Comercial/ListaPrecios/RegistrarEditar";      
        $.post(url, obj).done(function (data) {
            if (data.mensaje === 'ok') 
            {
                mensaje('S', 'Datos guardados', 'TC');
                fn(data);
            }
             else 
                mensaje('W', data.mensaje, 'TC');
             
            
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ListarListas( fn) {
        var url = ORIGEN + "/Comercial/ListaPrecios/ListarListas";      
        $.post(url).done(function (data) {           
                fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    ListarCanalesPrecios(fn) {
        var url = ORIGEN + "/Comercial/ListaPrecios/ListarCanalesPrecios";
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }

    ListarListasHabilitadas(fn) {
        var url = ORIGEN + "/Comercial/ListaPrecios/ListarListasHabilitadas";      
        $.post(url).done(function (data) {           
                fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ListarPreciosxListasyProducto(obj,fn) {
        var url = ORIGEN + "/Comercial/ListaPrecios/ListarPreciosxListasyProducto";      
        $.post(url,obj).done(function (data) {           
                fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    BuscarProductosListaPrecios(obj,fn) {
        var url = ORIGEN + "/Comercial/ListaPrecios/BuscarProductosListaPrecios";      
        $.post(url, obj).done(function (data) {              
            fn((data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    BuscarProductosListaConIncentivo(obj, fn) {
        var url = ORIGEN + "/Comercial/ListaPrecios/BuscarProductosListaConIncentivo";      
        $.post(url, obj).done(function (data) {  
            //console.log("este es el controlador");//TEMPORAL
            //console.log(data);//TEMPORAL
            fn((data));
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
        
    }
    EditarPreciosProducto(obj, fn) {
        var url = ORIGEN + "/Comercial/ListaPrecios/EditarPreciosProducto";  
        console.log(obj);
        $.post(url,obj).done(function (data) {           
            if (data.mensaje === 'ok') {
                fn(data);
                alertaSwall('S', 'Se actualizo el precio de ' + obj.lista.length + ' productos', '');
            }              
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    DuplicarPreciosLista(obj, fn) {
        var url = ORIGEN + "/Comercial/ListaPrecios/DuplicarPreciosLista";        
        $.post(url,obj).done(function (data) {           
            if (data === 'ok')             
                alertaSwall('S', 'Precios copiados', '');                          
            else
                mensaje('W', data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    ListarListaXProducto(idproducto, fn) {
        var url = ORIGEN + "/Comercial/ListaPrecios/ListarListaXProducto?idproducto=" + idproducto;        
        $.post(url).done(function (data) {           
            fn(data);
        }).fail(function (data) {
            fn(null);
            mensajeError(data);
        });
    }
    BuscarProductoByItemLista(idprecio, fn,fnerror) {
        var url = ORIGEN + "/Comercial/ListaPrecios/BuscarProductoByItemLista?idprecio=" + idprecio;        
        $.post(url).done(function (data) {       
            if (data.mensaje == 'ok')
                fn(data.objeto);
            else { mensaje('W', data.mensaje); fnerror(); }
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }
    ExportarLista(obj, fn) {
        var url = ORIGEN + "/Comercial/ListaPrecios/DescargarLista";
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
    SubirLista(obj, fn,fneeror) {
        var url = ORIGEN + "/Comercial/ListaPrecios/SubirLista";
        $.post(url, obj).done(function (data) {
            if (data.mensaje == 'ok') {
                mensaje('S', 'Datos guardados');
                fn(data);
            } else {
                mensaje('W', data.mensaje);
                fneeror();
            }
        }).fail(function (data) {
            mensajeError(data);
            fneeror();
        });
    }
    ActualizarPrecios(obj, fn) {
        var url = ORIGEN + "/Comercial/ListaPrecios/ActualizarPrecios";
        console.log(obj);
        $.post(url, obj).done(function (data) {
            if (data === 'ok') {
                //fn(data);
                alertaSwall('S', 'Se actualizo el precio de ' + obj.lista.length + ' productos', '');
            }
            else
                mensaje('W', data.mensaje);
        }).fail(function (data) {
            //fn(null);
            mensajeError(data);
        });
    }
}