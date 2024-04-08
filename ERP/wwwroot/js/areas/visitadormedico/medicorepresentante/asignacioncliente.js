var btnbuscarrepmedico = document.getElementById('btnbuscarrepmedico');
var btnexportar = document.getElementById('btnexportar');
var btnsubircuotas = document.getElementById('btnsubircuotas');


var lblnombremedico = document.getElementById('lblnombremedico');
var txtidrepmedico = document.getElementById('txtidrepmedico');
var txtfiltrocliente = document.getElementById('txtfiltrocliente');

var tbclientes;
var timerbusqueda;

$(document).ready(function () {
    MMfnlistarRepresentanteMedico('REP.MEDICO');
});
btnbuscarrepmedico.addEventListener('click', function () {
    $('#modalempleadosxcargo').modal('show');
});
$(document).on('click', '.btnselectempleadoxcargo', function () {
    var fila = this.parentNode.parentNode;
    lblnombremedico.innerText = fila.getElementsByClassName('documento')[0].innerText + ' - ' + fila.getElementsByClassName('nombres')[0].innerText;
    txtidrepmedico.value = fila.getAttribute('id');
    $('#modalempleadosxcargo').modal('hide');
    fnbuscarclientesderepresentante();
});
txtfiltrocliente.addEventListener('keyup', function (e) {
    if (txtidrepmedico.value == '')
        return;
    clearTimeout(timerbusqueda);
    var $this = this;
    timerbusqueda = setTimeout(function () {
        if (e.key == 'Enter') {
            fnbuscarclientesderepresentante();
        }
    }, 0);
});

function fnbuscarclientesderepresentante() {
    let controller = new MedicoRepresentanteController();
    var obj = {
        idrepresentante: txtidrepmedico.value,
        tipo: 'CONSULTA',
        filtro: txtfiltrocliente.value.trim(),
        top: 350,
    };
    BLOQUEARCONTENIDO('contenedor', 'Cargando datos ...');
    controller.ListarClientesRepMedico(obj, (data) => {

        try { tbclientes.clear().draw(); } catch (e) { console.log("x.x"); }
        limpiarTablasGeneradas('#contenedor', 'tbclientes', false, 'thead-dark');
        crearCabeceras(data, '#tbclientes', false);
        fncrearCuerpoPersonalizada(data)
        iniciarTabla();
        DESBLOQUEARCONTENIDO('contenedor');
    });
}
function fncrearCuerpoPersonalizada(datos, nametabla) {
    var fila = "";
    for (var i = 0; i < datos.length; i++) {

        fila += '<tr idcliente="' + datos[i].IDCLIENTE + '">';
        var valores = GetValores(datos[i]);

        for (var j = 0; j < valores.length; j++) {
            if (j < 4) {
                fila += "<td>" + valores[j] + "</td>";
            }
            else {
                let boton = valores[j] == 1 ? '<button type="button" class="btn btn-primary btncanalventacliente" >ASIGNAR</button>' :
                    '<button type="button" class="btn btn-secondary btncanalventacliente" >ASIGNAR</button>';

                fila += "<td >" + boton + "</td>";
            }

        }
        fila += '</tr>';
    }
    $('#tbclientes tbody').append(fila);
}
function iniciarTabla() {
    tbclientes = $('#tbclientes').DataTable({
        destroy: true,
        "searching": false,
        "paging": true,
        lengthChange: false,
        "lengthMenu": [[20, 25, 50, -1], [20, 25, 50, "All"]],
        "ordering": false,
        "info": false,
    });
}

$(document).on('click', '.btncanalventacliente', function () {
    let fila = this.parentNode.parentNode;
    let idcliente = fila.getAttribute('idcliente');
    let idrepresentante = txtidrepmedico.value;
    MACV_ListarCanalVentaxMxRM_CLI(idrepresentante, idcliente);
});