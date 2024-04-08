var listaproveedoresseleccionadas = [];

$('#CC_form-registro').submit(function (e) {
    e.preventDefault();
    totalseleccionados = 0;
    if (CC_cmbproveedorcliente.value == "PROVEEDOR") {
        $("#CD_campoLoteCliente")[0].hidden = true;
        $("#CD_campoFechaVencimientoCliente")[0].hidden = true;
        tbllista.$('.checkbox').each(function () {
            let id = $(this).attr('id');
            let ruc = $(this).attr('ruc');
            let descripcion = $(this).attr('descripcion');
            if ($(this).is(':checked')) {
                if ($(this).attr('id') !== "CC_chk_todoproveedor") {
                    totalseleccionados++;
                    if (fn_buscarIdEnListaProveedor(id) == -1 && id != IDSUCURSAL && id != 'CD_sugerido')
                        listaproveedoresseleccionadas.push({ id: id, ruc: ruc, descripcion: descripcion });
                }
            } else {
                let pos = fn_buscarIdEnListaProveedor(id);
                if (pos >= 0)
                    listaproveedoresseleccionadas.splice(pos, 1);
            }
        });
        if (totalseleccionados == 0) {
            alertaSwall("W", "Seleccione proveedores para realizar la transferencia.", "");
        } else {
            CD_tbldistribucion.clear().draw(false);
            CD_tblproductos.clear().draw(false);
            $('#btnnextview').click();
            CD_ListarProductos();
        }
    } else {//CLIENTE
        if (CC_txtidcliente.value != "") {
            $("#CD_campoLoteCliente")[0].hidden = false;
            $("#CD_campoFechaVencimientoCliente")[0].hidden = false;
            listaproveedoresseleccionadas.push({ id: CC_txtidcliente.value, ruc: CC_txtnrodocumento.value, descripcion: CC_txtnombrecliente.value });
            CD_tbldistribucion.clear().draw(false);
            CD_tblproductos.clear().draw(false);
            $('#btnnextview').click();
            CD_ListarProductos();
        } else {
            alertaSwall("W", "Seleccione un cliente para realizar la guia.", "");
        }
    }
    

    if (CC_cmbrango.val() === "")
        return;
});

function fn_buscarIdEnListaProveedor(id) {
    for (let i = 0; i < listaproveedoresseleccionadas.length; i++) {
        if (listaproveedoresseleccionadas[i].id == id)
            return i;
    }
    return -1;
}
MCC_formregistro.addEventListener('submit', function (e) {

    e.preventDefault();
    MCC_fnregistrar(function (data) {
        CC_txtnrodocumento.value = data.nrodocumento;
        data.apematerno = data.apematerno == null ? "" : data.apematerno;
        data.apepaterno = data.apepaterno == null ? "" : data.apepaterno;
        CC_txtnombrecliente.value = data.descripcion + " " + (data.apepaterno ?? '') + " " + data.apematerno ?? '';
        CC_txtidcliente.value = data.idcliente;
        MCC_formregistro.reset();
        $('#modalcliente').modal('hide');
    });
});