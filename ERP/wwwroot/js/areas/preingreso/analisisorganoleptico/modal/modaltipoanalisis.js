var tbltipoanalisis;
$(document).ready(function () {
    tbltipoanalisis = $('#tbltipoanalisis').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE() 
    });
    listar_tiposanalisis();
});

function listar_tiposanalisis() {
    var url = ORIGEN + "/Preingreso/PITipoAnalisis/ListarTiposAnalisis";
    $.post(url).done(function (data) {
        if (data.mensaje == "ok") {
            var datos = data.objeto;
            
            for (var i = 0; i < datos.length; i++) {
                tbltipoanalisis.row.add([
                    datos[i].idtipoanalisis,
                    datos[i].descripcion,                                                
                    '<a class="fas fa-check fa-2x bg-success btn-pasar-tipoanalisis"></a>'                  
                   ]).draw(false);
                }
        }
        else 
            mensaje('W', data.mensaje);
            
        
    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });
}

function cerrartipoanalisis() {
    $('#modaltipoanalisis').modal("hide");
}