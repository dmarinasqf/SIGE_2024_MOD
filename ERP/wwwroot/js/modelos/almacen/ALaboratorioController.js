class LaboratorioController {

    //ATRIBUTOS QUE RECIBE
    //string nombrelaboratorio,string estado
    //RETORNA UNA LISTA DE OBJETOS 
    ListarLaboratoriosxProveedor(params, fn) {
        var url = ORIGEN + "/Almacen/Laboratorio/ListarLaboratorioAsignadoxProveedor/";
        $.post(url, params).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });
    }
    //ATRIBUTOS QUE RECIBE
    //string nombrelaboratorio
    //RETORNA UNA LISTA DE OBJETOS 
    BuscarLaboratoriosHabilitadosxDescripcion(params, fn) {
        var url = ORIGEN + "/Almacen/Laboratorio/ListarHabilitadosxDescripcion/";
        $.post(url, params).done(function (data) {
            //console.log(data);
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });
    }
    //ATRIBUTOS QUE RECIBE
    //string idlaboratorio
    //RETORNA UNA UN MENSAJEJSON 
    BuscarLaboratoriosxId(params, fn) {
        console.log(params);
        var url = ORIGEN + "/Almacen/ALaboratorio/Buscar/";
        $.post(url, params).done(function (data) {
            fn(data);
        }).fail(function (data) {
            console.log(data);
            mensajeError(data);
        });
    }
}