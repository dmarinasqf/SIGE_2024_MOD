
class ProductoController {
    //string codigoproducto, string nombreproducto, string tipoproducto, string estado,string laboratorio, int top
    BuscarProductos(obj, fn) {
        var url = ORIGEN + "/Almacen/AProducto/BuscarProductos";
        $.post(url, obj).done(function (data) {
            var datos = JSON.parse(data);
            fn(datos);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }

    ExcelProductos(obj, fn) {
        var url = ORIGEN + "/Almacen/AProducto/DescargarExcelProductos";
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
    ListarProductosxAlmacenSucursal(obj, fn) {
        var url = ORIGEN + "/Almacen/AProducto/ListarProductoxAlmacenSucusal";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
    ListarProductosxAlmacenSucursal_V2(obj, fn) {
        var url = ORIGEN + "/Almacen/AProducto/ListarProductoxAlmacenSucusal_V2";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
    ListarProductosNuevosDistribucion(obj, fn) {
        var url = ORIGEN + "/Almacen/AProducto/ListarProductosNuevosDistribucion";
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
    ListarTipoProducto(cmb) {
        var url = ORIGEN + "/Almacen/AProducto/ListarTipoProducto";
        $.get(url).done(function (data) {
            var combo = document.getElementById(cmb);
            combo.innerHTML = '';
            var option = document.createElement('option');
            option.value = '';
            option.text = '[TODOS]';
            combo.appendChild(option);
            for (var i = 0; i < data.length; i++) {
                option = document.createElement('option');
                option.text = data[i].descripcion;
                option.value = data[i].idtipoproducto;
                combo.appendChild(option);
            }
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
    BuscarProducto(id, fn) {

        var url = ORIGEN + "/Almacen/AProducto/buscarProducto?id=" + id;
        var obj = { id: id };
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarProductoRegSanFecVenLote(id, fn) {

        var url = ORIGEN + "/Almacen/AProducto/buscarProductoRegSanFecVenLote?id=" + id;
        var obj = { id: id };
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarProductosxLaboratorio(idlab, fn) {
        
        var url = ORIGEN + "/Almacen/AProducto/ListarProductoxLaboratorio?idlaboratorio="+idlab;        
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    //by Gustavo
    BuscarProductoDistribucion(params, fn) {
        var url = ORIGEN + "/Almacen/AProducto/ListarProductoDistribucionxLote";
        let obj = params
        $.post(url, obj).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    BuscarProductoconStockxAlmacen(params, fn) {
        var url = ORIGEN + "/Almacen/AProducto/getProductosconStockxAlmacen";
        let obj = params
        $.post(url, obj).done(function (data) {
            console.log(data);
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    GetDetalleProducto(idproducto, fn) {
        var url = ORIGEN + "/Almacen/AProductoDetalle/GetDetalleProducto/" + idproducto;
        $.post(url).done(function (data) {          
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    //genericos
    BuscarGenericos(obj, fn) {
        var url = ORIGEN + "/Almacen/AProductoDetalle/BuscarGenericos";
        $.post(url, obj).done(function (data) {
            data = JSON.parse(data);
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    RegistrarGenerico(obj, fn) {
        var url = ORIGEN + "/Almacen/AProductoDetalle/RegistrarDetalleGenerico";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok") {
                mensaje('S', 'Registro guardado');
                fn(data);

            } else {
                mensaje('W', data.mensaje);
            }

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    EditarGenerico(obj, fn) {
        var url = ORIGEN + "/Almacen/AProductoDetalle/EditarDetalleGenerico";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok") {
                mensaje('S', 'Registro actualizado');
                fn(data);

            } else {
                mensaje('W', data.mensaje);
            }

        }).fail(function (data) {
            mensajeError(data);
        });
    }
    ListarGenericos(idproducto, fn) {
        var url = ORIGEN + "/Almacen/AProductoDetalle/BuscarDetalleGenerico/" + idproducto;
        $.post(url).done(function (data) {
            data = JSON.parse(data);
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    EliminarGenerico(id, fn) {
        var url = ORIGEN + "/Almacen/AProductoDetalle/EliminarDetalleGenerico/" + id;
        $.post(url).done(function (data) {
            if (data.mensaje === "ok") 
                    fn(data);              
            else
                mensaje("W", data.mensaje);


        }).fail(function (data) {
            mensajeError(data);
        });
    }
    //accion farmacologia
    RegistrarAccionFarmacologica(obj, fn) {
        var url = ORIGEN + "/Almacen/AProductoDetalle/RegistrarDetalleAccionFarmacologico";    
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok") {
                mensaje('S', 'Registro guardado');
                fn(data);
            } else 
                mensaje('W', data.mensaje);                         
        }).fail(function (data) {
            mensajeError(data);
        });
    }   
    ListarAccionFarmacologica(id, fn) {
        var url = ORIGEN + "/Almacen/AProductoDetalle/BuscarDetalleAccionFarma/"+id;     
        $.post(url).done(function (data) {            
                fn(data);                    
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    EliminarAccionFarmacologica(id, fn) {
        var url = ORIGEN + "/Almacen/AProductoDetalle/EliminarDetalleAccionFarmacologico/" + id;
        $.post(url).done(function (data) {
            if (data.mensaje === "ok")                 
            {
               
                fn(data);   
            }                         
            else 
                mensaje("W", data.mensaje);
            
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    //principio activo
    RegistrarEditarPrincipio(obj, fn) {
        var url = ORIGEN + "/Almacen/AProductoDetalle/RegistrarEditarPrincipioActivo";
        $.post(url, obj).done(function (data) {
            if (data.mensaje === "ok") {
                mensaje('S', 'Registro guardado');
                fn(data);

            } else {
                mensaje('W', data.mensaje);
            }

        }).fail(function (data) {
            mensajeError(data);
        });
    }   
    ListarPrincipiosActivos(idproducto, fn) {
        var url = ORIGEN + "/Almacen/AProductoDetalle/BuscarDetallePrincipiosActivos/" + idproducto;
        $.post(url).done(function (data) {         
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    EliminarPrincipioACtivo(id, fn) {
        var url = ORIGEN + "/Almacen/AProductoDetalle/EliminarPrincipioActivo/" + id;
        $.post(url).done(function (data) {
            if (data.mensaje === "ok")
                fn(data);
            else
                mensaje("W", data.mensaje);


        }).fail(function (data) {
            mensajeError(data);
        });
    }
    //lista precios
    ListarListapreciosConproducto(obj, fn) {
        var url = ORIGEN + "/Almacen/AProductoDetalle/BuscarListaPrecioConProducto" ;
        $.post(url,obj).done(function (data) {
            fn(JSON.parse(data));
        }).fail(function (data) {
            mensajeError(data);
        });
    }
    AgregarEliminarProductoLista(obj, fn) {
        var url = ORIGEN + "/Almacen/AProductoDetalle/AgregarEliminarProductoLista";
        $.post(url,obj).done(function (data) {
            if (data.mensaje == 'ok') {
                fn();
                mensaje('S', 'Datos guardados');
            }
            else
                mensaje('W', data.mensaje);

        }).fail(function (data) {
            mensajeError(data);
        });
    }

    GetProductosxLaboratorio(obj,fn,fnerror) {
        var url = ORIGEN + "/Almacen/AProducto/GetProductosxLaboratorio";
        $.post(url, obj).done(function (data) {          
            fn(data);
        }).fail(function (data) {
            fnerror();
            mensajeError(data);
        });
    }
    BuscarProductosSelect2(tipo) {
        return {
            url: ORIGEN + "/Almacen/AProducto/BuscarProductos1",
            dataType: 'json',
            data: function (params) {
                var query = {
                    producto: params.term,
                    top: 10,
                    tipo:tipo
                }
                return (query);
            },
            processResults: function (data) {
                return {
                    results: $.map(data, function (obj) {
                        return {
                            id: obj.idproducto,
                            text: obj.codigoproducto+' - '+ obj.nombre
                        };
                    })
                };
            }
        }
    }
    BuscarProductosRequerimiento(obj, fn) {
        var url = ORIGEN + "/Almacen/AProducto/BuscarProductosRequerimiento";
        $.post(url, obj).done(function (data) {
            var datos = JSON.parse(data);
            fn(datos);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
}