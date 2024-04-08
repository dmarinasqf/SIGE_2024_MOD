class ProductoProveedorController {
    //string idproveedor,string tipo,int top, string producto
    BuscarProductos(obj, fn) {
        var url = ORIGEN + "/Compras/CProductoProveedor/ListarProductosProveedor";
        $.post(url, obj).done(function (data) {
            var datos = JSON.parse(data);
            fn(datos);
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });

    }
}