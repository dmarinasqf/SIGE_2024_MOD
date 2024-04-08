var tblproveedores;
$(document).ready(function () {
    tblproveedores = $('#tblproveedores').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE() 
    });
    listarproveedores();
});

function listarproveedores() {
    var url = ORIGEN + "/Compras/CProveedor/listarproveedores";
    $.post(url).done(function (data) {
        if (data != null) {
            for (var i = 0; i < data.length; i++) {
                tblproveedores.row.add([
                    data[i].idproveedor,
                    data[i].ruc,
                    data[i].razonsocial,
                   
                    '<a class="fas fa-check fa-2x bg-success btnseleccionar btnpasarproveedor"></a>'
                ]).draw(false);
            }
        }
        else {
            mensaje('W', 'Valores nulos para proveedores');
            console.log(data);
        }
    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });
}