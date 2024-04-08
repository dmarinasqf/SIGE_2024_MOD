

var txtfecharango = document.getElementById('txtfecharango');
var tblreporte = document.getElementById('tblreporte');

var btnconsultar = document.getElementById('btnconsultar');
var btnexportar = document.getElementById('btnexportar');

btnconsultar.addEventListener('click', function () {  
    fngetreporte();
});


function fngetreporte() {
    var obj = {
        fecha: txtfecharango.value
    };
    //console.log("esta es la fecha");
    //console.log(obj);
    BLOQUEARCONTENIDO('contenedor', 'CARGANDO ...');
    let controller = new OrdenCompraController();
    //
    controller.ReporteCompras(obj, function (data) {

        var total=0;
        data.forEach(function (sum) {
            total += parseFloat(sum.IMPTOTAL);
        });

        const noTruncarDecimales = { maximumFractionDigits: 2 };
        var importetotal = total.toLocaleString('en-US', noTruncarDecimales);

        $("#idimportetotal").text("IMPORTE TOTAL S/ " + importetotal);

        //var data_json=[];
        //$.each(data, function (i, item) {
        //    var obj = {
        //        NROORDEN: data[i].NROORDEN, FECHA: data[i].FECHA,
        //        MES: data[i].MES, ANO: data[i].ANO,
        //        PROVEEDOR: data[i].PROVEEDOR, CONDIPAGO: data[i].CONDIPAGO
        //    };
        //    data_json.push(obj);
        //});
        //ERTTEMPORAL
        //console.log("nuevo json");
        //console.log(JSON.parse(JSON.stringify(data_json)));
        //data = JSON.parse(JSON.stringify(data_json));

        try { tblreporte.clear().draw(); } catch (e) { console.log("x.x " + e); }
        limpiarTablasGeneradas('#contenedor', 'tblreporte', false);
        crearCabeceras(data, '#tblreporte', false);
        crearCuerpo(data, '#tblreporte');
        iniciarTabla();
        DESBLOQUEARCONTENIDO('contenedor');
    });
}

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
btnexportar.addEventListener('click', function () {
    //btnexportar.disabled = true;
    //btnexportar.style.background = "#235223";
    var obj = {
        fecha: txtfecharango.value
    };
    let controller = new OrdenCompraController();
    controller.ExportarCompras(obj);
});