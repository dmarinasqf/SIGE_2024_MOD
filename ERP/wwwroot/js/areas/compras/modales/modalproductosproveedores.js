var tblproductosdeproveedor;
$(document).ready(function () {
    tblproductosdeproveedor = $('#tblproductosdeproveedor').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE() 
    });    
});






function listarproductosproveedores(idproveedor) {
    var url = ORIGEN + "/Compras/CProveedor/listarproductosproveedor/"+idproveedor;
    $.post(url).done(function (data) {
        if (data != null) {
            tblproductosdeproveedor.clear().draw(false);
            for (var i = 0; data.length < length; i++) {
                tblproductosdeproveedor.row.add([
                   '',
                   '',
                   '',
                    ''
                ]).draw(false);                
            }
            divgrupodelaboratorios.append(concatenar);
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