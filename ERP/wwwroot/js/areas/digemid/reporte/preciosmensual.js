var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');
var txtfechafin = document.getElementById('txtfechafin');
var txtfechainicio = document.getElementById('txtfechainicio');
var cmbsucursal = document.getElementById('cmbsucursal');
var cmbempresa = document.getElementById('cmbempresa');
var cmbprecios = document.getElementById('cmbprecios');
var cmbtipo = document.getElementById('cmbtipo');

var tblreporte;
$(document).ready(function () {
    let controller = new EmpresaController();
    controller.ListarEmpresas('cmbempresa');
});

function iniciarTabla() {
    tblreporte = $('#tblreporte').DataTable({
        destroy: true,
        "searching": false,
        "paging": true,
        lengthChange: false,
        "lengthMenu": [[20, 25, 50, -1], [20, 25, 50, "All"]],
        "ordering": false,
        "info": false,
    });
}
cmbempresa.addEventListener('click', function () {
    if (cmbempresa.value == '') return;
    let controller = new SucursalController();
    controller.ListarSucursalxEmpresaEnCombo('cmbsucursal', cmbempresa.value);
});
cmbsucursal.addEventListener('click', function () {
    if (cmbsucursal.value == '') return;
    let controller = new SucursalController();
    controller.ListarListasSucursal(cmbsucursal.value, 'cmbprecios');
});
btnconsultar.addEventListener('click', function () {
    if (cmbsucursal.value == '') return;
    if (cmbprecios.value == '') return;
    if (cmbtipo.value == '') return;
    var obj = {
        sucursal: cmbsucursal.value,
        lista: cmbprecios.value,
        tipo: cmbtipo.value
    };
    let controller = new ReporteController();
    controller.GetPreciosMensual(obj, function (data) {

        if (data.length > 0) {
            try {
                for (var i = 0; i < data.length; i++) {
                    if (data[i]['Precio 1'] != undefined)
                        data[i]['Precio 1'] = data[i]['Precio 1'].toFixed(2);
                    if (data[i]['Precio 2'] != undefined)
                        data[i]['Precio 2'] = data[i]['Precio 2'].toFixed(2);
                    if (data[i]['Precio 3'] != undefined)
                        data[i]['Precio 3'] = data[i]['Precio 3'].toFixed(2);
                }
                tblreporte.clear().draw();
            } catch (e) { console.log("x.x"); }

            limpiarTablasGeneradas('#contenedor', 'tblreporte', false);
            fncrearcabeceras(data, '#tblreporte', false);
            fncrearcuerpo(data, '#tblreporte');
            iniciarTabla();
        } else
            mensaje('I', 'No hay datos en la consulta');


    });
});
btnexportar.addEventListener('click', function () {
    if (cmbsucursal.value == '') return;
    if (cmbprecios.value == '') return;
    if (cmbtipo.value == '') return;
    var obj = {
        sucursal: cmbsucursal.value,
        lista: cmbprecios.value,
        tipo: cmbtipo.value
    };
    let controller = new ReporteController();
    controller.ExcelPreciosMensual(obj);
});

function fncrearcabeceras(datos, tablename) {

    var cabeceras = GetHeaders(datos);
    var tabla = $(tablename + ' thead');
    var nuevaFila = "<tr>";

    for (var i = 0; i < cabeceras.length - 1; i++) {
        nuevaFila += "<th >" + cabeceras[i] + "</th>";
    }
    nuevaFila += '<th></th>';
    nuevaFila += "</tr>";
    $(tablename + ' thead').append(nuevaFila);
}
function fncrearcuerpo(datos, tablename) {
    var fila = "";
    for (var i = 0; i < datos.length; i++) {
        fila += '<tr>';
        var valores = GetValores(datos[i]);
        for (var j = 0; j < valores.length - 1; j++) {
            if (valores[j] == null) valores[j] = '';
            fila += "<td>" + valores[j] + "</td>";
        }
        fila += '<td><button class="btn btn-sm btn-info btnverproducto" idproducto=' + datos[i].idproducto + '><i class="fas fa-eye"></i></button></td>';
        fila += '</tr>';
    }
    $(tablename + " tbody").append(fila);
}
var popupproductos = null;
var idanterior = '';
$(document).on('click', '.btnverproducto', function () {
    var idproducto = this.getAttribute('idproducto');   
    if (idproducto != '') {
        if (idanterior == '') {
            idanterior = idproducto;
            popupproductos = window.open(ORIGEN + "/Almacen/AProducto/RegistrarEditar?id=" + idproducto, "Producto", "width=1100,height=600,Titlebar=NO,Toolbar=NO");

        }
        else {
            if (idanterior != idproducto)
                popupproductos = window.open(ORIGEN + "/Almacen/AProducto/RegistrarEditar?id=" + idproducto, "Producto", "width=1100,height=600,Titlebar=NO,Toolbar=NO");
            idanterior = idproducto;
        }

        if (popupproductos == null || popupproductos.closed) {
            popupproductos.addEventListener('DOMContentLoaded', function () {
                popupproductos.init();

            });
            popupproductos.focus();
        }
        else {
            popupproductos.addEventListener('DOMContentLoaded', function () {
                popupproductos.init();

            });
            popupproductos.focus();
        }
    }
});