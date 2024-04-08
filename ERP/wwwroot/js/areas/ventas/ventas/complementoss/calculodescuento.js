$(document).on('click', '.btndescuento', function (e) {
    $('#modalverdescuentokit').modal('show');
});

function fnverificarsitienedescuento(registro) {
    //EARTCOD1008 **
    if (registro.split('|')[1] == 'cc') {
        //console.log("DESCUENTO POR CUENTA CLAVE")
        return [registro.split('|')[0], registro.split('|')[1]];
    }
    ////////////


    //MPTEMPORAL
    //console.log("ESTA ES LA FUNCION DE DESCUENTO");
    //console.log(registro);
    if (registro == 'x')
        return 'x';
    else {
        var array = registro.split('|');
        var numdes = array[0];
        var tipo = array[1];
        if (tipo == 'uno' && numdes == 1) {
            var despro = array[4].split('=')[1];
            var dessucu = array[3].split('=')[1];
            var id = array[2].split('=')[1];
            var descuentoglobal = parseFloat(dessucu) + parseFloat(despro);
            return [descuentoglobal,id];
        } else
            return [tipo];
    }
}