var tbllista
var txtnumdocumento = document.getElementById('txtnumdocumento');
var txtfecharegistro = document.getElementById('txtfecharegistro');
var btnbusqueda = document.getElementById('btnbusqueda');
var txtsucursal = document.getElementById('txtsucursal');
$(document).ready(function () {
    tbllista = $('#tbllista').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        info: false,
        paging: true,
        pageLength: [15]
    });
    fnGetHistorial();
    if (txtsucursal.getAttribute('tipo') == 'select') {
        let controller = new SucursalController();
        controller.ListarSucursalxEmpresaEnCombo('txtsucursal');
    }
});

function fnGetHistorial() {
    let controller = new ProformaController();
    var obj = {
        fechainicio: txtfecharegistro.value,
        fechafin: txtfecharegistro.value,
        numdocumento: txtnumdocumento.value,
        sucursal: txtsucursal.value,
        top: 100,
        estado:'HABILITADO|APLICADO'
    };
    controller.GetHistorialProformas(obj, function (data) {
        tbllista.clear().draw(false);
        for (var i = 0; i < data.length; i++) {
            //<button class="btn btn-dark btnimprimir" href="`+ ORIGEN + `/Ventas/Venta/ImprimirTicket?idproforma=` + data[i].idproforma + `"><i class="fas fa-print" ></i></button>

            tbllista.row.add([
                `<div class="btn-group btn-group-sm">
                    <button class="btn btn-primary btnver" idproforma="`+ data[i].idproforma + `"><i class="fas fa-eye" ></i></button>
                    <button class="btn btn-dark btnimprimir" idproforma="`+ data[i].idproforma + `"><i class="fas fa-print" ></i></button>
                </div>`,
                data[i].codigoproforma,
                data[i].sucursal,
                data[i].fecha,
                data[i].cliente,
                data[i].importe.toFixed(2),
                data[i].estado,
                data[i].usuario
            ]).draw(false);
        }
        tbllista.columns.adjust().draw(false);
    });
}

btnbusqueda.addEventListener('click', function () {
    fnGetHistorial();
});

$(document).on('click', '.btnver', function () {
    var idproforma = this.getAttribute('idproforma');
    var a = document.createElement('a');
    a.href = ORIGEN + "/Ventas/Proforma/Proforma?idproforma=" + idproforma;
    a.target = "_blank";
    a.click();
});
txtfecharegistro.addEventListener('change', function () {
    fnGetHistorial();
});
$(document).on('click', '.btnimprimir', function () {
    var href = ORIGEN +'/Ventas/Proforma/ImprimirProforma1/'+this.getAttribute('idproforma');
    ABRIR_MODALIMPRECION(href, 'IMPRIMIR PROFORMA');
});