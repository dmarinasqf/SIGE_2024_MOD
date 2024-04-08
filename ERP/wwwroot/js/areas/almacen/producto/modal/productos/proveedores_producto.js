

$(document).ready(function () {
    tblproveedores = $('#tblproveedores').DataTable({
        "searching": true,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE()  
    });
    
    //listarproveedores(idproducto);
});

function listarproveedores(id) {
    var url = ORIGEN + "/Compras/CProveedor/getProveedoresxProducto";
    var obj = { idproducto: id };
    $.post(url, obj).done(function (data) {
        console.log(data);
        if (data.mensaje === "ok") {
            if (data.objeto !== null) {
                tblproveedores.clear().draw();
                for (var i = 0; i < data.objeto.length; i++) {
                    tblproveedores.row.add([
                        data.objeto[i].idproveedor,
                        data.objeto[i].ruc,
                        data.objeto[i].razonsocial,
                        data.objeto[i].producto,
                        data.objeto[i].des1
                    ]).draw(false);
                }
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