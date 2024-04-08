var tblaccionesfarma;

$(document).ready(function () {
    tblaccionesfarma = $('#tblaccionesfarma').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE() 
    });
   
});
$('#modalaccionesfama').on('shown.bs.modal', function () {   
    listar_accionfarma();
});
//ListarAccionesFarma
function listar_accionfarma() {
    var url = ORIGEN + "/Almacen/AAccionFarmacologica/ListarAccionesFarma";    
    // console.log(obj);    
    $.post(url).done(function (data) {
        tblaccionesfarma.clear().draw(false);
        if (data !== null) {
            for (var i = 0; i < data.length; i++) {
                tblaccionesfarma.row.add([
                    data[i].idaccionfarma,
                    data[i].descripcion,                    
                    '<button class="btn btn-sm btn-success btnpasaraccionfarma" idaccionfarma="' + data[i].idaccionfarma+'"><i class="fas fa-check "></i></button>'
                ]).draw(false);
            }
        }
        else {
            mensaje("I", "NO HAY INFORMACIÓN");
        }

    }).fail(function (data) {
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
}


$('#tblaccionesfarma tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tblaccionesfarma.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});