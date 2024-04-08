class LaboratorioController {

    BuscarLaboratorios(laboratorio, fn) {
        var url = ORIGEN + "/Almacen/ALaboratorio/BuscarLaboratorios";
        var data = { laboratorio: laboratorio };
        $.post(url, data).done(function (data) {
            fn(data);

        }).fail(function (data) {
            mensajeError(data);
        });

    }

    BuscarLaboratoriosYCantidadDeCompras(laboratorio, fn) {
        var url = ORIGEN + "/Almacen/ALaboratorio/BuscarLaboratoriosYCantidadDeCompras";
        var data = { laboratorio: laboratorio };
        $.post(url, data).done(function (data) {
            fn(data);

        }).fail(function (data) {
            mensajeError(data);
        });

    }

    BuscarLaboratoriosSelect2() {
        return {
            url: ORIGEN + "/Almacen/ALaboratorio/BuscarLaboratorios",
            dataType: 'json',
            data: function (params) {
                var query = {
                    laboratorio: params.term,
                }
                return (query);
            },
            processResults: function (data) {
                data.sort(function (a, b) {
                    var descripcionA = a.descripcion.toUpperCase(); // Convertir a mayúsculas para ordenar correctamente
                    var descripcionB = b.descripcion.toUpperCase();
                    if (descripcionA < descripcionB) {
                        return -1;
                    }
                    if (descripcionA > descripcionB) {
                        return 1;
                    }
                    return 0;
                });
                return {
                    results: $.map(data, function (obj) {
                        return {
                            id: obj.idlaboratorio,
                            text: obj.descripcion
                        };
                    })
                };
            }
        }
    }

    ListarLaboratorios(fn) {
        var url = ORIGEN + "/Almacen/ALaboratorio/ListarLaboratorios";
        $.post(url).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });

    }
    ListarLaboratoriosPorAlmacenSucursal(idalmacensucursal, fn) {
        var url = ORIGEN + "/Almacen/ALaboratorio/ListarLaboratoriosPorAlmacenSucursal";
        var data = { idalmacensucursal: idalmacensucursal };
        $.post(url, data).done(function (data) {
            fn(data);
        }).fail(function (data) {
            mensajeError(data);
        });

    }
    //BuscarLaboratoriosParaSelect(laboratorio, fn) {
    //    var url = ORIGEN + "/Almacen/ALaboratorio/BuscarLaboratorios";
    //    var data = { laboratorio: laboratorio };
    //    $.post(url, data).done(function (data) {
    //        fn(data);

    //    }).fail(function (data) {
    //        mensajeError(data);
    //    });
    //}

    ////ATRIBUTOS QUE RECIBE
    ////string nombrelaboratorio,string estado
    ////RETORNA UNA LISTA DE OBJETOS 
    //ListarLaboratoriosxProveedor(params, fn) {
    //    var url = ORIGEN + "/Almacen/Laboratorio/ListarLaboratorioAsignadoxProveedor/";
    //    $.post(url, params).done(function (data) {
    //        fn(data);
    //    }).fail(function (data) {
    //        console.log(data);
    //        mensajeError(data);
    //    });
    //}
    ////ATRIBUTOS QUE RECIBE
    ////string nombrelaboratorio
    ////RETORNA UNA LISTA DE OBJETOS 
    //BuscarLaboratoriosHabilitadosxDescripcion(params, fn) {
    //    var url = ORIGEN + "/Almacen/Laboratorio/ListarHabilitadosxDescripcion/";
    //    $.post(url, params).done(function (data) {
    //        //console.log(data);
    //        fn(data);
    //    }).fail(function (data) {
    //        console.log(data);
    //        mensajeError(data);
    //    });
    //}
    ////ATRIBUTOS QUE RECIBE
    ////string idlaboratorio
    ////RETORNA UNA UN MENSAJEJSON 
    //BuscarLaboratoriosxId(params, fn) {
    //    console.log(params);
    //    var url = ORIGEN + "/Almacen/Laboratorio/Buscar/";
    //    $.post(url, params).done(function (data) {
    //        fn(data);
    //    }).fail(function (data) {
    //        console.log(data);
    //        mensajeError(data);
    //    });
    //}
}