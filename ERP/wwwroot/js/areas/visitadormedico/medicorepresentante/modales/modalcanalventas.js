var MACVlblrepresentante = document.getElementById('MACVlblrepresentante');

var MACVtblcanalventa = document.getElementById('MACVtblcanalventa');
var MACtbodycanalventa = document.getElementById('MACtbodycanalventa');
$(document).ready(function () {
});

function MACV_ListarCanalVentaxMxRM(idrepresentante, idmedico) {
    MACVlblrepresentante.innerHTML = lblnombremedico.innerText;
    $('#MACV_modalcanalventa').modal('show');
    let controller = new MedicoRepresentanteController();
    let obj = {
        idrepresentante: idrepresentante,
        idmedico: idmedico
    };
    controller.ListarCanalVentaMedicoRepMedico(obj, (data) => {
        var fila='';
        for (var i = 0; i < data.length; i++) {
            if (data[i]["canalventa"] == "CALL CENTER" || data[i]["canalventa"] == "E COMMERCE" || data[i]["canalventa"] == "FARMACIAS" || data[i]["canalventa"] == "CUENTAS CLAVES") {
                let state = data[i]["ASIGNADO"] == 0 ? '' : ' checked'
                let check = data[i]["ASIGNADO"] > 1 ?
                    `<input class="primary checkcanalventa" type = "checkbox" ` + state + ` disabled/>` :
                    `<input class="danger checkcanalventa"  type = "checkbox" ` + state + ` />`;

                fila += '<tr idcanal="' + data[i]["IDCANAL"] + '" idmedico=' + data[i]["IDMEDICO"] + ' idrepresentante=' + (data[i]["IDREPRESENTANTE"] == null ? '' : data[i]["IDREPRESENTANTE"]) + '>';
                fila += '<td>' + data[i].canalventa + '</td>';
                fila += '<td>' + check + '</td>';
                fila += '<td>' + (data[i]["REPRESENTANTE"] == null ? '' : data[i]["REPRESENTANTE"]) + '</td>';
                fila += '</tr>';
            }
        }
        MACtbodycanalventa.innerHTML = fila;

    });
}

$(document).on('click', '.checkcanalventa', function () {
    var estadoCheck = this.checked;
    var fila = this.parentNode.parentNode;
    var idmedico = fila.getAttribute('idmedico');
    var idcanalventa = fila.getAttribute('idcanal');
    var idrepresentante = fila.getAttribute('idrepresentante');
    var obj = {
        idmedico: idmedico,
        idrepresentante: idrepresentante,
        idcanalventa: idcanalventa
    };

    let controller = new MedicoRepresentanteController();
    if (estadoCheck) {
        var obj = {
            idmedico: idmedico,
            idcanalventa: idcanalventa,
            idrepresentante: txtidrepmedico.value
        };
        controller.AgregarMedicoRepMedico(obj, (data) => {
            if (data.mensaje == "ok") {
                fila.cells[2].innerText = MACVlblrepresentante.innerHTML.split(" - ")[1];
                fila.setAttribute('idrepresentante', txtidrepmedico.value);
                mensaje('S', 'Operación Completada.');
            } else {
                mensaje('D', 'Error al realizar la operación.');
            }
        });
    } else {
        controller.DeshabilitarMedicoRepMedico(obj, function (data) {
            if (data.mensaje == "ok") {
                fila.cells[2].innerText = "";
                fila.setAttribute('idrepresentante.', '0');
                mensaje('S', 'Operación Completada.');
            }
            else {
                mensaje('D', 'Error al realizar la operación.');
            }
        });
    }
});


function MACV_ListarCanalVentaxMxRM_CLI(idrepresentante, idcliente) {
    MACVlblrepresentante.innerHTML = lblnombremedico.innerText;
    $('#MACV_modalcanalventa').modal('show');
    let controller = new MedicoRepresentanteController();
    let obj = {
        idrepresentante: idrepresentante,
        idcliente: idcliente
    };
    controller.ListarCanalVentaClienteRepMedico(obj, (data) => {
        var fila = '';
        //MACVtblcanalventa.firstElementChild.childNodes[1].cells[2].setAttribute("hidden", "");//Para que no se muestre "REPRESENTANTE MEDICO"
        for (var i = 0; i < data.length; i++) {
            if (data[i]["canalventa"] == "CUENTAS CLAVES") {
                let state = data[i]["ASIGNADO"] == 0 ? '' : ' checked'
                let check = data[i]["ASIGNADO"] > 1 ?
                    `<input class="primary checkcanalventa_CLI" type = "checkbox" ` + state + ` disabled/>` :
                    `<input class="danger checkcanalventa_CLI"  type = "checkbox" ` + state + ` />`;

                fila += '<tr idcanal="' + data[i]["IDCANAL"] + '" idcliente=' + data[i]["IDCLIENTE"] + ' idrepresentante=' + (data[i]["IDREPRESENTANTE"] == null ? '' : data[i]["IDREPRESENTANTE"]) + '>';
                fila += '<td>' + data[i].canalventa + '</td>';
                fila += '<td>' + check + '</td>';
                fila += '<td>' + (data[i]["REPRESENTANTE"] == null ? '' : data[i]["REPRESENTANTE"]) + '</td>';
                fila += '</tr>';
            }
        }
        MACtbodycanalventa.innerHTML = fila;
    });
}

$(document).on('click', '.checkcanalventa_CLI', function () {
    var estadoCheck = this.checked;
    var fila = this.parentNode.parentNode;
    var idcliente = fila.getAttribute('idcliente');
    var idcanalventa = fila.getAttribute('idcanal');
    var idrepresentante = fila.getAttribute('idrepresentante');
    var obj = {
        idcliente: idcliente,
        idrepresentante: idrepresentante,
        idcanalventa: idcanalventa
    };

    let controller = new MedicoRepresentanteController();
    if (estadoCheck) {
        var obj = {
            idcliente: idcliente,
            idcanalventa: idcanalventa,
            idrepresentante: txtidrepmedico.value
        };
        controller.AgregarClienteRepMedico(obj, (data) => {
            if (data.mensaje == "ok") {
                fila.cells[2].innerText = MACVlblrepresentante.innerHTML.split(" - ")[1];
                fila.setAttribute('idrepresentante', txtidrepmedico.value);
                mensaje('S', 'Operación Completada.');
            } else {
                mensaje('D', 'Error al realizar la operación.');
            }
        });
    } else {
        controller.DeshabilitarClienteRepMedico(obj, function (data) {
            if (data.mensaje == "ok") {
                fila.cells[2].innerText = "";
                fila.setAttribute('idrepresentante.', '0');
                mensaje('S', 'Operación Completada.');
            }
            else {
                mensaje('D', 'Error al realizar la operación.');
            }
        });
    }
});