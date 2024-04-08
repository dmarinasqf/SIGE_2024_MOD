var btnbuscarrepmedico = document.getElementById('btnbuscarrepmedico');
var btnexportar = document.getElementById('btnexportar');
var btnsubircuotas = document.getElementById('btnsubircuotas');


var lblnombremedico = document.getElementById('lblnombremedico');
var txtidrepmedico = document.getElementById('txtidrepmedico');
var txtfiltromedico = document.getElementById('txtfiltromedico');

var tbmedicos;
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
    fnbuscarmedicosderepresentante();

});

txtfiltromedico.addEventListener('keyup', function (e) {
    if (txtidrepmedico.value == '')
        return;
    clearTimeout(timerbusqueda);
    var $this = this;
    timerbusqueda = setTimeout(function () {
        if (e.key == 'Enter') {
            fnbuscarmedicosderepresentante();
        }

    }, 0);
});
$(document).on('click', '.btncanalventamedico', function () {
    let fila = this.parentNode.parentNode;
    let idmedico = fila.getAttribute('idmedico');
    let idrepresentante = txtidrepmedico.value;
    //let titulo = "¿Desea reasignar?";
    //let mensaje = "El médico seleccionado cuenta con ";
    //let palabra = "representante";
    //let numRepresentantes = 0;
    //let array_final = [];

    //let controller = new MedicoRepresentanteController();
    //let obj = { idmedico: idmedico };
    //controller.BuscarRepresentatesDeUnMedico(obj, (data) => {
    //    if (data.length > 0) {
    //        var representantes = "";
    //        for (var i = 0; i < data.length; i++) {
    //            if (data[i]["emp_codigo"] != idrepresentante) {
    //                numRepresentantes += 1;
    //                array_final.push(data[i]["med_codigo"]);
    //                array_final.push(data[i]["emp_codigo"]);
    //                if (numRepresentantes > 1) {
    //                    if (i == data.length - 1) {
    //                        representantes += " y";
    //                    } else {
    //                        representantes += ",";
    //                    }
    //                }
    //                representantes += " " + data[i]["NOMBREREPRESENTANTE"]
    //            }
    //        }
    //        if (numRepresentantes > 1) palabra += "s";
    //        mensaje += numRepresentantes + " " + palabra + ": " + representantes;

    //        if (numRepresentantes > 0) {
    //            swal(titulo, mensaje, {
    //                icon: "warning",
    //                buttons: {
    //                    confirm: {
    //                        text: "ACEPTAR",
    //                        //clasName: "btn btn-success"
    //                    },
    //                    cancel: {
    //                        visible: true,
    //                        text: "CANCELAR",
    //                        //className: "btn btn-danger"
    //                    }
    //                }
    //            }).then((confirmar) => {
    //                if (confirmar) {
    //                    var obj = {
    //                        array_final: array_final
    //                    };
    //                    console.log(obj);
    //                    controller.DeshabilitarMedicoRepMedico(obj, function (data) {
    //                        if (data.mensaje == "ok") {
    //                            MACV_ListarCanalVentaxMxRM(idrepresentante, idmedico);
    //                        }
    //                        else {
    //                            alertaSwall('D', 'Error al deshabilitar.', '');
    //                        }
    //                    });
    //                } else {
    //                    swal.close();
    //                }
    //            });
    //        } else {
    //            MACV_ListarCanalVentaxMxRM(idrepresentante, idmedico);
    //        }
    //    }
    //    else {
            MACV_ListarCanalVentaxMxRM(idrepresentante, idmedico);
    //    }
    //});
});
function fnbuscarmedicosderepresentante() {
    let controller = new MedicoRepresentanteController();
    var obj = {
        idrepresentante: txtidrepmedico.value,
        tipo: 'CONSULTA',
        filtro: txtfiltromedico.value.trim(),
        top: 350,
    };
    BLOQUEARCONTENIDO('contenedor','Cargando datos ...');
    controller.ListarMedicosRepMedico(obj, (data) => {
  
        try { tbmedicos.clear().draw(); } catch (e) { console.log("x.x"); }
        limpiarTablasGeneradas('#contenedor', 'tbmedicos', false,'thead-dark');
        crearCabeceras(data, '#tbmedicos',false);
        fncrearCuerpoPersonalizada(data)
        iniciarTabla();
        DESBLOQUEARCONTENIDO('contenedor');
    });
}
btnexportar.addEventListener('click', function () {
    let controller = new MedicoRepresentanteController();
    var obj = {
        idrepresentante: txtidrepmedico.value,
        tipo: 'EXPORTAR',
        filtro: txtfiltromedico.value.trim(),        
    };  
    controller.ListarMedicosRepMedico(obj, (data) => {            
       location.href = data.objeto;
    });
});

function fncrearCuerpoPersonalizada(datos, nametabla) {
    var fila = "";
    console.log(datos);
    for (var i = 0; i < datos.length; i++) {
        
        fila += '<tr idmedico="'+datos[i].IDMEDICO+'">';
        var valores = GetValores(datos[i]);

        for (var j = 0; j < valores.length; j++) {
            if (j < 6) {
                fila += "<td>" + valores[j] + "</td>";
            }
            else {
                let boton = valores[j] == 1 ? '<button type="button" class="btn btn-primary btncanalventamedico" >ASIGNAR</button>' :
                    '<button type="button" class="btn btn-secondary btncanalventamedico" >ASIGNAR</button>';

                fila += "<td >" + boton + "</td>";
            }
         
        }
        fila += '</tr>';
    }
    $('#tbmedicos tbody').append(fila);
}
function iniciarTabla() {
    tbmedicos = $('#tbmedicos').DataTable({
        destroy: true,
        "searching": false,
        "paging": true,
        lengthChange: false,
        "lengthMenu": [[20, 25, 50, -1], [20, 25, 50, "All"]],
        "ordering": false,
        "info": false,
    });
}