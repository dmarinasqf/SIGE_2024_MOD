var listasucursalesseleccionadas = [];
var CC_cmbempresa = document.getElementById("CC_cmbempresa");

$('#CC_form-registro').submit(function (e) {
    e.preventDefault();
    totalseleccionados = 0;
    $('.checkbox').each(function () {
        let id = $(this).attr('id');
        if ($(this).is(':checked')) {            
            if ($(this).attr('id') !== "CC_chk_todosucursal") {               
                totalseleccionados++;
                if (fn_buscarIdEnListaSucursales(id) == -1 && id != IDSUCURSAL && id !='CD_sugerido')
                    listasucursalesseleccionadas.push(id);
            }
        } else {
            let pos = fn_buscarIdEnListaSucursales(id);
            if (pos >= 0)
                listasucursalesseleccionadas.splice(pos, 1);
        }
    });

    var contadorInterno = 0;
    var sAlmacenSucursal = "";
    var obj = $('#CC_form-registro').serializeArray();
    for (var i = 0; i < obj.length; i++) {
        if (obj[i].name.includes("Almacen")) {
            if (contadorInterno == 0)
                sAlmacenSucursal += obj[i].value;
            else
                sAlmacenSucursal += "_" + obj[i].value;
            
            contadorInterno += 1;
        }
    }
    if (CC_cmbrango.val() === "")
        return;
    if (sAlmacenSucursal == "")//CD_cmbsucursalalmacen.val() === ""
        return;
    if (totalseleccionados == 0) {
        alertaSwall("W", "Seleccione una sucursal para realizar la transferencia.", "")
    } else {
        var vEmpresa = $("#CC_cmbempresa").val();
        if (vEmpresa != 1000) {//vEmpresa != 1000 cuando se habilite el CC_cmbempresa en _comcriterios
            var url = ORIGEN + "/Ventas/Venta/VerificarAperturaCaja";
            $.post(url).done(function (data) {
                let datos = data;
                if (datos.mensaje == "ok") {
                    limpiarTablasGeneradas('#CD_tabla-distribucion', 'CD_tbldistribucion', true);
                    CD_tblproductos.clear().draw(false);
                    $('#btnnextview').click();
                    CD_ListarProductos();

                    CD_fnCargarGuiasSucursales();
                } else {
                    mensaje("W", "Debe abrir una caja.");
                }
            }).fail(function (data) {
                mensajeError(data);
            });
        } else {
            limpiarTablasGeneradas('#CD_tabla-distribucion', 'CD_tbldistribucion', true);
            CD_tblproductos.clear().draw(false);
            $('#btnnextview').click();
            procesarCheckbox();
            CD_fnCargarGuiasSucursales();
        }
    }
});


//var tbllistasugerido;
//$(document).ready(function () {

//    tbllistasugerido = $('#tbllistasugerido').DataTable({
//        "searching": false,
//        lengthChange: false,
//        "ordering": true,
//        info: false,
//        paging: true,
//        //pageLength: [15]
//    });

//    $('#miBoton').click(function () {
//        fnGetHistorial();
//    });


//});



function fn_buscarIdEnListaSucursales(id) {
    for (let i = 0; i < listasucursalesseleccionadas.length; i++) {
        if (listasucursalesseleccionadas[i] == id) 
            return i;
    }
    return -1;
}
//function fnGetHistorial() {

//    tbllistasugerido.clear().draw();
//    // Limpiar el contador de registros
//    $('#numRegistros').text('0');
//    var cliente = $('#cmbbuscarcliente').text().split('-');
//    var fechaActual = new Date().toISOString().split('T')[0];
//    var fechaInicioDefault = "2023-10-01";
//    var obj = {
//        numdocumento: '',
//        cliente: '',
//        fechainicio: fechaInicioDefault,
//        fechafin: fechaActual,
//        sucursal: ''
//    };

//    var url = ORIGEN + "/Almacen/AGuiaSalida/GetHistorialVentaslistarArray";

//    BLOQUEARCONTENIDO('cardreport', 'Buscando ..');

//    $.post(url, obj).done(function (data) {
//        console.log(data);
//        if (data && data.rows && data.rows.length > 0) {
//            agregarFila(data.rows);
//            $('#numRegistros').text(data.rows.length);
//        } else {
//            mensaje('I', 'No hay datos en la consulta');
//        }
//        $("#btnbusqueda").prop("disabled", false);
//        DESBLOQUEARCONTENIDO('cardreport');
//    }).fail(function () {
//        DESBLOQUEARCONTENIDO('cardreport');
//        $("#btnbusqueda").prop("disabled", false);
//        console.error("Error en la solicitud:", textStatus, errorThrown);
//    });
//}

//function agregarFila(data) {
//    var rows = [];
//    for (var i = 0; i < data.length; i++) {

//        // Logic for btntxt
//        console.log("Procesando fila", i);
//        // Create the row
//        var fila = [
//            data[i][1], // SUCURSAL
//            data[i][3], // CODIGOPRODUCTO
//            data[i][4], // PRODUCTO
//            data[i][5], // VENTA2
//            data[i][6], // DOC VENTA1
//            data[i][7], // VENTA0 
//            data[i][8], // STOCKACTUAL
//            data[i][9], // STOCK EN TRANSITO
//            data[i][10], // SUGERIDO
//            data[i][11], // 
          

//        ];

//        rows.push(fila);

//    }
//    tbllistasugerido.rows.add(rows).draw(false);
//    console.log("Procesando fila", i);
//}
