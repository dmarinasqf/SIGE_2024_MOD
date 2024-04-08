var txtcodigo = $('#txtcodigo');
var cmbalmacen = $('#cmbalmacen');
var cmbareaalmacen = $('#cmbareaalmacen');
var cmbsucursal = $('#cmbsucursal');
var cmbestado = $('#cmbestado');
var txtoperacion = $('#txtoperacion');
var tbllista;
var btnguardar = $('#btn-guardar');

$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = true;
    datatable.ordering = true;
  
    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', true, datatable);
    $('#btndatatablenuevo').click(function () {
        $('#modalregistro').modal('show');
    });

    listarempleados();
    listarAlmacenxEmpleado();
});





function limpiar() {
    $('#form-registro-empeladoalmacen').trigger('reset');
    txtoperacion.val("nuevo");    
    //cmbsucursal.val("0");
    txtcodigo.val("");
    cmbalmacen.val("");
    cmbareaalmacen.val("");   
}

$('#tbllista tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbllista.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});


function mensajeeliminar(data) {
    swal({
        title: '¿Desea deshabilitar?',
        text: "",
        type: 'warning',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'No',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Si',
                className: 'btn btn-success'
            }
        }
    }).then((willDelete) => {
        if (willDelete) {
            eliminar(data);
        }
        else
            swal.close();
    });
}

function listarAlmacenxSucursal(idsucursal) {
    console.log(idsucursal);
    let controller = new AlmacenSucursalController();
    let params = { idsucursal: idsucursal };
    controller.ListarAlmacenesxSucursal_dt(params, listarAlmacenSucursal);

}
 

function eliminar(id) {
    var url = ORIGEN + "/Almacen/AAlmacenSucursal/Eliminar/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                listarAlmacenxSucursal(cmbsucursal.val());
                swal("Registro deshabilitado!", {
                    icon: "success",
                    buttons: {
                        confirm: { className: 'btn btn-success' }
                    }
                });
            }
        }
        else {
            mensaje("W", data.mensaje);
        }

    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });

}



//eventos change

$('#cmbsucursal').change(function () {
 
  
    listarempleados();
    listarAlmacenxEmpleado();
});

//habilitar y deshabilitar almacenes
function habilitarAlmacen(tabla, evento) {
    var columna = tbllista.row($(tabla).parents('tr')).data();
    console.log(columna);

    if (!evento.target.checked) {
        var url = ORIGEN + "/Almacen/AAlmacenSucursal/Habilitar";
        var data = {
            id: columna[0]
        };
        console.log(data);
        $.post(url, data).done(function (data) {
            if (data.mensaje == "ok") {

                listarAlmacenxSucursal(cmbsucursal.val());
                mensaje('S', 'ALMACÉN HABILITADO');
            }
            else {
                mensaje('W', data.mensaje);
            }
        }).fail(function (data) {
            console.log(data);
            mensaje("D", "Error en el servidor");
        });
    }

}


//FUNCION LISTAR EMPLEADOS
var datoscomboempeladoeditar = [];
function listarempleados() {
    var selectElement = document.getElementById("cmbsucursal");

    // Obtener el valor seleccionado
    var selectedValue = selectElement.value;

    let obj = {
        idsucursal: selectedValue
    };
    var url = ORIGEN + "/Almacen/AColaboradorAlmacen/listarempledo";
    $.post(url, obj).done(function (data) {
        let datos = JSON.parse(data); 
        datoscomboempeladoeditar = datos;
        $('#cmbempleado').empty();
        $('#cmbempleadomod').empty();

        // Agrega la opción por defecto
        $('#cmbempleado').append('<option value="" selected>[SELECCIONE]</option>');

        $('#cmbempleadomod').append('<option value="" selected>[SELECCIONE]</option>');

 

        // Itera sobre los datos y agrega opciones al select
        for (var i = 0; i < datos.length; i++) {
            var empleado = datos[i];
            $('#cmbempleado').append('<option value="' + datos[i].ID + '">' + datos[i].NOMBRES + '</option>');
            $('#cmbempleadomod').append('<option value="' + datos[i].ID + '">' + datos[i].NOMBRES + '</option>');     
        }

        if (selectedidempleado!="") {


        }

    }).fail(function (data) {
        console.log(data);
        mensajeError(data);
    })
}


function listarcboalmacenempelado(){
    var idempleado = document.getElementById("cmbempleado");
    var selectedidempleado = idempleado.value;
    // Seleccionar automáticamente el valor en el combo de empleado
    $('#cmbempleadomod').val(selectedidempleado);
}

function listarAlmacenxEmpleado() {
    var idsucursalop= document.getElementById("cmbsucursal");
    var idempleadoop = document.getElementById("cmbempleado");
    // Obtener el valor seleccionado
    tbllista.clear().draw(false);

    let obj = {
        idsucursal: idsucursalop.value,
        idempleado: idempleadoop.value,
        idalmacenempleado:0,
    };
    var url = ORIGEN + "/Almacen/AColaboradorAlmacen/listaralmacenempelado";
    $.post(url, obj).done(function (data) {
   
        let datos = JSON.parse(data);
        for (var i = 0; i < datos.length; i++) {
            let buttonsHtml;          
            if (datos[i].estado === "HABILITADO") {
                buttonsHtml = `
            <div class="btn-group btn-group-sm">
                <button class="btn btn-sm btn-outline-warning waves-effect btn-pasar font-10" data-toggle="tooltip" data-placement="top" title="Deshabilitar Registro" onclick="abrireditar(${datos[i].idalmacenempleado})">
                    <i class="fa fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger waves-effect font-10" onclick="mensajeeliminarempeladosucursal(${datos[i].idalmacenempleado})">
                    <i class="fa fa-lock"></i>
                </button>
            
            </div>`;
            } else {
                buttonsHtml = `
            <div class="btn-group btn-group-sm">
     <button class="btn btn-sm btn-outline-success waves-effect font-10" onclick="habilitaRempeladosucusal(${datos[i].idalmacenempleado})">
                    <i class="fa fa-unlock"></i>
                </button>
            </div>`;
            }

            tbllista.row.add([
                datos[i].idalmacenempleado,
                datos[i].NOMBRES,
                datos[i].sucusal,
                datos[i].almacen,
                datos[i].areaalmacen,
                datos[i].fechacreacion,
                datos[i].estado,
                buttonsHtml
            ]).draw(false);

        }
    });

}

$('#cmbempleado').change(function () {
    listarAlmacenxEmpleado();
    listarcboalmacenempelado();
});

$('#btn-guardar').click(function (event) {
    event.preventDefault(); // Evita la recarga de la página
    guardarempleadoalmacen();

});

function guardarempleadoalmacen() {
    var idempleado = document.getElementById("cmbempleadomod");
    var idalmacen = document.getElementById("cmbalmacenmod");
    var idareaalmacen = document.getElementById("cmbareaalmacen");
    let obj = {
        emp_codigo: idempleado.value,
        idalmacen: idalmacen.value,
        idareaalmacen: idareaalmacen.value,
    };

    var url = ORIGEN + "/Almacen/AColaboradorAlmacen/guardaralmacenempelado";
    $.post(url, obj).done(function (data) {
            console.log(data.mensaje);
        
        if (data.mensaje === "Guardado") {
            console.log(data.mensaje);
            alertaSwall('S', 'ALMACEN GUARDADO CORRECTAMENTE', '');
            listarAlmacenxEmpleado();
        } else {
            alertaSwall('W', 'ERROR  ' + data.mensaje, '');
        }
        limpiar();
        $("#modalregistro").modal("hide");
        }).fail(function (xhr, status, error) {
            console.error("Error en la solicitud AJAX:", status, error);
        });
 
}
var idEmpeladoSucursalGlobal = 0;
function abrireditar(idempleadosucursal) {
    // Asignar el valor al variable global
    idEmpeladoSucursalGlobal = null;
    idEmpeladoSucursalGlobal = idempleadosucursal;

    console.log(idEmpeladoSucursalGlobal);
    var idsucursalop = document.getElementById("cmbsucursal");
    var idempleadoop = document.getElementById("cmbempleado");
    let obj = {
        idsucursal: idsucursalop.value,
        idempleado: idempleadoop.value,
        idalmacenempleado: idempleadosucursal,
    };
    var url = ORIGEN + "/Almacen/AColaboradorAlmacen/listaralmacenempelado";
    $.post(url, obj).done(function (data) {
        let datos = JSON.parse(data);
        listarcomboseditar(datos);
        $('#modaleditar').modal('show');
        
    });
 
}

$(document).ready(function () {




});

var datosAlmacengeneral = [];
var datosAreaAlmacengeneral = [];
function manejarDatosAlmacen(datosAlmacen, datosAreaAlmacen){
    datosAlmacengeneral = datosAlmacen;
    datosAreaAlmacengeneral = datosAreaAlmacen;
}
// Definir una función que maneje los datos del almacén
function listarcomboseditar(datoslistabd) {
    console.log(datosAlmacengeneral);
    console.log(datosAreaAlmacengeneral);

    // Obtener los datos del primer elemento de datoslistabd
    var primerElemento = datoslistabd[0];

    // Llenar el combo de almacén
    var cmbAlmacen = $("#cmbalmacenedit");
    cmbAlmacen.empty(); // Limpiar las opciones actuales

    // Agregar una opción predeterminada
    cmbAlmacen.append($("<option>", {
        value: "",
        text: "[SELECCIONE]"
    }));

    // Recorrer los datos y agregar opciones al combo de almacén
    $.each(datosAlmacengeneral, function (index, item) {
        cmbAlmacen.append($("<option>", {
            value: item.idalmacen,
            text: item.descripcion + " - " + item.idtipoproducto.substring(0, 1)
        }));
    });

    // Seleccionar automáticamente el valor en el combo de almacén
    cmbAlmacen.val(primerElemento.idalmacen);

    // Llenar el combo de área
    var cmbArea = $("#cmbareaalmacenedit");
    cmbArea.empty(); // Limpiar las opciones actuales

    // Agregar una opción predeterminada
    cmbArea.append($("<option>", {
        value: "",
        text: "[SELECCIONE]"
    }));

    // Recorrer los datos de área y agregar opciones al combo de área
    $.each(datosAreaAlmacengeneral, function (index, item) {
        cmbArea.append($("<option>", {
            value: item.idareaalmacen,
            text: item.descripcion
        }));
    });

    // Seleccionar automáticamente el valor en el combo de área
    cmbArea.val(primerElemento.idareaalmacen);

    //SELECIONAR 
    $('#cmbempleadoedit').empty();
    $('#cmbempleadoedit').append('<option value="" selected>[SELECCIONE]</option');
    var datos = datoscomboempeladoeditar;

    // Itera sobre los datos y agrega opciones al select
    for (var i = 0; i < datos.length; i++) {
        $('#cmbempleadoedit').append('<option value="' + datos[i].ID + '">' + datos[i].NOMBRES + '</option>');
    }

 
    // Seleccionar automáticamente el valor en el combo de empleado
    $('#cmbempleadoedit').val(primerElemento.emp_codigo);


}

$('#btneditarempleadoalmacen').click(function (event) {
    event.preventDefault(); // Evita la recarga de la página
    editaarempleadoalmacen();
});

function editaarempleadoalmacen() {

    console.log(idEmpeladoSucursalGlobal);
    var idempleado = document.getElementById("cmbempleadoedit");
    var idalmacen = document.getElementById("cmbalmacenedit");
    var idareaalmacen = document.getElementById("cmbareaalmacenedit");
    let obj = {
        emp_codigo: idempleado.value,
        idalmacen: idalmacen.value,
        idareaalmacen: idareaalmacen.value,
        idalmacenempleado: idEmpeladoSucursalGlobal,
    };

    var url = ORIGEN + "/Almacen/AColaboradorAlmacen/editaralmacenempelado";
    $.post(url, obj).done(function (data) {
        console.log(data.mensaje);

        if (data.mensaje === "Editado") {
            console.log(data.mensaje);
            alertaSwall('S', 'ALMACEN EDITADO CORRECTAMENTE', '');
            listarAlmacenxEmpleado();
        } else {
            alertaSwall('S', 'FALLO AL EDITAR' + data.mensaje, '');
        }
        $("#modaleditar").modal("hide");
    }).fail(function (xhr, status, error) {
        console.error("Error en la solicitud AJAX:", status, error);
    });

}

function habilitaRempeladosucusal(idEmpeladoSucursalacti) {
  
    swal({
        title: 'Se habilitara el almacen para el usuario',
        text: '',
        icon: 'warning',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'Cancelar',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Continuar',
                className: 'btn btn-success'
            }
        }
    }).then((result) => {
        // Verificar si se hizo clic en el botón de confirmar
        if (result) {

            let obj = {
                idalmacenempleado: idEmpeladoSucursalacti,
                estado: "HABILITADO",
            };

            var url = ORIGEN + "/Almacen/AColaboradorAlmacen/activardesactivaralmacenempelado";
            $.post(url, obj).done(function (data) {
                console.log(data.mensaje);

                if (data.mensaje === "HABILITADO" || data.mensaje === "DESABILITADO") {
                    console.log(data.mensaje);
                    alertaSwall('S', 'EL ALMACEN FUE ' + data.mensaje + ' CORRECTAMENTE', '');
                    listarAlmacenxEmpleado();
                } else {
                    alertaSwall('W', 'FALLO AL' + data.mensaje, '');
                }
                limpiar();
                $("#modaleditar").modal("hide");
            }).fail(function (xhr, status, error) {
                console.error("Error en la solicitud AJAX:", status, error);
            });
        } else {
            swal.close();
        }
    });
   
}
function mensajeeliminarempeladosucursal(idEmpeladoSucursaldesa) {


    swal({
        title: 'Se desabilitara el almacen para el colaborador y  perdera el permiso',
        text: '',
        icon: 'warning',
        class: 'text-center',
        buttons: {
            cancel: {
                visible: true,
                text: 'Cancelar',
                className: 'btn btn-danger'
            },
            confirm: {
                text: 'Continuar',
                className: 'btn btn-success'
            }
        }
    }).then((result) => {
        // Verificar si se hizo clic en el botón de confirmar
        if (result) {

            let obj = {
                idalmacenempleado: idEmpeladoSucursaldesa,
                estado: "DESABILITADO",
            };

            var url = ORIGEN + "/Almacen/AColaboradorAlmacen/activardesactivaralmacenempelado";
            $.post(url, obj).done(function (data) {
                console.log(data.mensaje);

                if (data.mensaje === "HABILITADO" || data.mensaje === "DESABILITADO") {
                    console.log(data.mensaje);
                    alertaSwall('S', 'EL ALMACEN FUE ' + data.mensaje + ' CORRECTAMENTE', '');
                    listarAlmacenxEmpleado();
                } else {
                    alertaSwall('W', 'FALLO AL' + data.mensaje, '');
                }
                limpiar();
                $("#modaleditar").modal("hide");
            }).fail(function (xhr, status, error) {
                console.error("Error en la solicitud AJAX:", status, error);
            });
        } else {
            swal.close();
        }
    });

}


