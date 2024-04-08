var tbllista;
var rango = 0;
var CC_cmbrango = $('#CC_cmbrango');
var CC_tblsucursal;

var CC_fechatraslado = $('#CC_fechatraslado');
var CC_cmbserie = $('#CC_cmbserie');
var CC_cmbempresa = $('#CC_cmbempresa');

var btnConsumirTxt = document.getElementById("btnConsumirTxt");

//otras variables
var totalseleccionados = 0;
var SUCURSALES;
var IDEMPRESA;
var IDSUCURSAL;

$(document).ready(function () {
    CC_tblsucursal = $('#CC_tblsucursal').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        "lengthMenu": [[100, 200, 500, -1], [100, 200, 500, "All"]],
        responsive: true,
        buttons: BOTONESDATATABLE('LISTA SUCURSALES ', 'H', false),
        "language": LENGUAJEDATATABLE()        
    });

    tbllista = $('#tbllista').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        paging: false,
        info: false,
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }
        ]
    });

    fn_listarSucursalesconCheckBoxs(IDEMPRESA);

    CD_cmbsucursal.val(IDSUCURSAL);    
    fncc_listarseriescajaxsucursal(IDSUCURSAL,'GUIA');
    let fechaa30dias = moment().add(0, 'd').format('YYYYY-MM-DD');
    CC_fechatraslado.val(fechaa30dias);
});

function getRango() {   
    let rango = 2;
    if (CC_cmbrango.val() == "BIMESTRE")
        rango = 2
    else if (CC_cmbrango.val() == "TRIMESTRE")
        rango = 3;
    else if (CC_cmbrango.val() == "CUATRIMESTRE")
        rango = 4;
    else if (CC_cmbrango.val() == "SEMESTRE")
        rango = 6;
    return rango;
}

function CC_seleccionarTodo() {
    var checkbox = document.getElementById('CC_chk_todosucursal');
    var checked = checkbox.checked;
    if (checked)
        $('.checkbox').prop('checked', true);
    else
        $('.checkbox').prop('checked', false);
}

function fncc_listarseriescajaxsucursal(idsucursal, nombredocumento) {
    let controller = new CajaController();
    let obj = { idsucursal: idsucursal, nombredocumento: nombredocumento };
    // console.log(obj);
    controller.ListarCorrelativosPorCajaPorDocumento('CC_cmbserie', obj, '', '');
    setTimeout(function () {
        CC_cmbserie.val("T038");
    }, 1000);
}
//$('#btnnextview').click(function () {
//    console.log("ok");
    
//});
//CARGAR COMBOBOX
$('#CC_cmbempresa').change(function () {
    fn_listarSucursalesconCheckBoxs(this.value);
});


var datosFiltrados = [];
function fn_listarSucursalesconCheckBoxs(idempresa) {
    tbllista.clear().draw(false);

    var url = ORIGEN + "/Almacen/AGuiaSalida/listarSucursalesconCheckBoxs";

    $.post(url, { idempresa: idempresa }).done(function (data) {
        if (Array.isArray(data)) {
            tbllista.clear().draw(false); // Limpiamos la tabla antes de agregar las nuevas filas
            datosFiltrados = data;
            if (idempresa == 1000) {
                //data = data.filter(x => x.descripcion.includes("QF"));
            }

            data.forEach(function (sucursal) {
                tbllista.row.add([
                    sucursal.suc_codigo,
                    sucursal.descripcion,
                    '<input type="checkbox" id="' + sucursal.suc_codigo + '" class="chk-col-red checkbox" />'
                ]).draw(false).node();
            });

            tbllista.columns.adjust().draw();
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error en la solicitud: ", textStatus, errorThrown);
        mensajeError(jqXHR.responseText || "Ocurrió un error desconocido.");
    });
}


function fn_listarSucursalesperzonalizado(numeroempresa) {
    var datosFiltradosFiltrados = [];
    datosFiltradosFiltrados = [...datosFiltrados];

    // Utilizar los datos almacenados en la variable global
    if (Array.isArray(datosFiltradosFiltrados)) {

        if (numeroempresa == 3) {
            datosFiltradosFiltrados = datosFiltradosFiltrados.filter(x => x.tipoSucursal.includes("LOCAL"));
        } else if (numeroempresa == 2) {
            datosFiltradosFiltrados = datosFiltradosFiltrados.filter(x => x.tipoSucursal.includes("LOCAL") || x.tipoSucursal.includes("PRODUCCIÓN"));
        } else if (numeroempresa == 1) {
            datosFiltradosFiltrados = datosFiltradosFiltrados.filter(x => x.tipoSucursal.includes("PRODUCCIÓN"));
        }
        tbllista.clear().draw(false);
        // Llenar la tabla con los datos filtrados
        datosFiltradosFiltrados.forEach(function (sucursal) {
            tbllista.row.add([
                sucursal.suc_codigo,
                sucursal.descripcion,
                '<input type="checkbox" id="' + sucursal.suc_codigo + '" class="chk-col-red checkbox" />'
            ]).draw(false).node();
        });

        tbllista.columns.adjust().draw();
    }
}

//btnConsumirTxt.addEventListener("click", function () {
//    var url = ORIGEN + "/Almacen/AGuiaSalida/ConsumirTxt";
//    $.post(url).done(function (data) {
//        fn(data);
//    }).fail(function (data) {
//        fn(null);
//        mensajeError(data);
//    });
//});