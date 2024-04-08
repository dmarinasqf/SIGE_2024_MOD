
var btnbusqueda = document.getElementById("btnbusqueda");
var btnGuardarDeposito = document.getElementById("btnGuardarDeposito");

//var txtidsucursal = document.getElementById("txtidsucursal");
var txtfechainicio = document.getElementById("txtfechainicio");
var txtfechafin = document.getElementById("txtfechafin");

var tbldetalle;

$(document).ready(function () {
    tbldetalle = $('#tbldetalle').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        paging: false,
        info: false,
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            { "className": "text-center", "targets": [0] },
            { "className": "text-center", "targets": [2] },
            { "className": "text-center", "targets": [3] },
            { "className": "text-center", "targets": [4] },
            { "className": "text-center", "targets": [5] },
            { "className": "text-center", "targets": [6] }
        ]
    });
    //let controller = new SucursalController();
    //controller.ListarSucursalxEmpresaEnCombo('txtidsucursal', 'LOCAL', null, null, true);
});

btnbusqueda.addEventListener('click', function () {
    buscarCajas()
});

function buscarCajas() {
    var obj = {
        //idsucursal: txtidsucursal.value,
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value
    }
    BLOQUEARCONTENIDO('tbldetalle', 'Cargando...');
    let controller = new CajaVentasController();
    controller.ListarCajaMontosXFechaXSucursal(obj, function (data) {
        var data = JSON.parse(data);
        tbldetalle.clear().draw(false);
        for (var i = 0; i < data.length; i++) {
            tbldetalle.row.add([
                data[i]["idaperturacaja"],
                data[i]["cajero"],
                data[i]["sucursal"],
                moment(data[i]["fecha"]).format('DD-MM-YYYY'),
                data[i]["caja"],
                data[i]["monto"],
                '<input type="date" class="form-control form-control-sm text-center txtfechadeposito" style="width: 120px;"/>',
                '<input type="number" class="form-control form-control-sm text-center txtmontodeposito" style="width: 100px;"/>',
            ]).draw(false).node();
        }
        DESBLOQUEARCONTENIDO('tbldetalle');
    });
}

btnGuardarDeposito.addEventListener("click", function () {
    try {
        var filas = document.querySelectorAll("#tbldetalle tbody tr");
        var arrayMontosDepositados = [];
        var c = 0;
        filas.forEach(function (e) {
            var monto = document.getElementsByClassName("txtmontodeposito")[c].value;
            var fecha = document.getElementsByClassName("txtfechadeposito")[c].value;
            var idaperturacaja = e.childNodes[0].innerText;
            if (monto > 0) {
                if (fecha != "") {
                    //var arryinterno = { idaperturacaja, monto, fecha }
                    arrayMontosDepositados.push([ idaperturacaja, monto, fecha ]);
                } else {
                    throw mensaje("W", "Ingrese una fecha válida");
                }
            }
            c++;
        });

        if (arrayMontosDepositados.length > 0) {
            BLOQUEARCONTENIDO('tbldetalle', 'Cargando...');
            var obj = {
                jsondeposito: JSON.stringify(arrayMontosDepositados)
            }
            let controller = new CajaVentasController();
            controller.RegistrarDepositoCaja(obj, function (data) {
                if (data.mensaje == "ok") {
                    mensaje("S", "Depósito guardado correctamente.");
                    buscarCajas();
                } else {
                    mensaje("W", "Error al guardar el depósito.");
                }
                DESBLOQUEARCONTENIDO('tbldetalle');
            });
        }
    } catch (e) {
        console.log(e);
    }
});