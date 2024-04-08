var tblproveedores;
$(document).ready(function () {   
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = false;
    datatable.ordering = true;
    datatable.buttons = [];
    var util = new UtilsSisqf();
    tblproveedores = util.Datatable('tblproveedores', false, datatable);
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
                    data[i].des1,                             
                    '<button class="btn btn-sm btn-success btnpasarproveedor"><i class="fas fa-check"></i></button>'                  
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