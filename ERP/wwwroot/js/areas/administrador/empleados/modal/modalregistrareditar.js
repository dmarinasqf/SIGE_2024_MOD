var cmbsucursal = $('#cmbsucursal');
var cmbgrupo = $('#cmbgrupo');
var txtnombre = $('#txtnombre');
var txtappaterno = $('#txtapp');
var txtapmaterno = $('#txtapm');
var txtdocumento = $('#txtndocumento');
var txtsueldo = $('#txtsueldo');
var cmbperfil = $('#cmbperfil');
var txtusuario = $('#txtusuario');
var txtclave = $('#txtclave');
var txtcodigo = $('#txtemp_codigo');
var txtoperacion = $('#txtoperacion');
var txtemail = $('#txtemail');
var cmbestado = document.getElementById('cmbestado');
var txtcelular = document.getElementById('txtcelular');
var cmbcargo = document.getElementById('cmbcargo');
//var cmbcanalventa = document.getElementById('cmbcanalventa');
var txtfoto = document.getElementById('txtfoto');
var imgfoto = document.getElementById('imgfoto');
var btnGuardar = $('#btnGuardar');
var tbodycanalventa = document.getElementById('tbodycanalventa');
var tbodysucursal = document.getElementById('tbodysucursal');

$(document).ready(function () {
    fnlistarsucursales();
    document.getElementById('txtclave').type = 'password';
});

function vermodal() {

    $('#modalempleado').modal('show');
}

function limpiarmodal() {
    $('#form-registro')[0].reset();

    // Limpiar la imagen y otros elementos
    $('#imgfoto').attr('src', '');

    // Limpiar todos los campos del formulario
    $('#txtnombre').val('');
    $('#txtapp').val('');
    $('#txtapm').val('');
    $('#txtndocumento').val('');
    $('#txtemail').val('');
    $('#txtcelular').val('');
    $('#cmbsucursal').val('');
    $('#cmbcargo').val('');
    $('#cmbgrupo').val('');
    $('#txtusuario').val('');
    $('#txtclave').val('');
    $('#cmbestado').val('');
    $('#tbodyalmacen').empty();
    $('#tbodysucursal').empty();
    $('#tbodycanalventa').empty();
}

function limpiar() {
    $('#form-registro').trigger('reset');
    txtoperacion.val("nuevo");
    txtcodigo.val("");
    $('#imgfoto').replaceWith($('#imgfoto').prop('src', ''));
    $('#txtfoto').replaceWith($('#txtfoto').val('').clone(true));
}
function buscarempleado(id) {
    limpiarmodal();
    var url = ORIGEN + "/Administrador/Empleado/Detalle/" + id;
    limpiar();
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            console.log(data.objeto);
            txtcodigo.val(data.objeto.emp_codigo);
            txtoperacion.val('editar');
            txtnombre.val(data.objeto.nombres);
            txtapmaterno.val(data.objeto.apeMaterno);
            txtappaterno.val(data.objeto.apePaterno);
            txtdocumento.val(data.objeto.documento);
            txtusuario.val(data.objeto.userName);
            txtclave.val(data.objeto.clave);
            txtemail.val(data.objeto.email);
            cmbgrupo.val(data.objeto.idgrupo);
            cmbsucursal.val(data.objeto.suc_codigo);
            cmbestado.value = data.objeto.estado;
            txtcelular.value = data.objeto.celular;
            cmbcargo.value = data.objeto.idcargo;
            //cmbcanalventa.value = data.objeto.idcanalventa;           
            imgfoto.setAttribute('src', '/imagenes/empleados/' + data.objeto.foto);
            vermodal();
            fnllenartablacanalventas(data.objeto.canalVentas ?? []);
            fnllenartablasucursales(data.objeto.sucursales ?? []);
            listaralmacenes(data.objeto.suc_codigo, data.objeto.emp_codigo);
        } else
            mensaje('W', data.mensaje);
    }).fail(function (data) {
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
}

function fnguardarimagen(id) {
    var dataString = new FormData();
    var url = ORIGEN + "/Administrador/Empleado/GuardarFoto";
    var selectFile = ($('#txtfoto'))[0].files[0];
    dataString.append("id", id);
    dataString.append('file', selectFile);

    $.ajax({
        url: url,
        type: "POST",
        data: dataString,
        contentType: false,
        processData: false,
        async: false,
        success: function (data) {
        }, error: function (data) {
            mensajeError(data);
        }

    });
}
function fnllenartablacanalventas(canalempleado) {
    var fila = '';
    for (var i = 0; i < _CANALVENTAS.length; i++) {
        var checked = '';
        for (var j = 0; j < canalempleado.length; j++) {
            if (_CANALVENTAS[i].idcanalventa === canalempleado[j])
                checked = 'checked';
        }
        fila += '<tr id="' + _CANALVENTAS[i].idcanalventa + '">';
        fila += '<td>' + _CANALVENTAS[i].descripcion + '</td>';
        fila += '<td>  <input class="checkcanalventa" type = "checkbox" idcaja = "' + _CANALVENTAS[i].idcanalventa + '"  ' + checked + ' /></td>';
        fila += '</tr>';
    }
    tbodycanalventa.innerHTML = fila;
}
function fnllenartablasucursales(data) {
    var fila = '';
    for (var i = 0; i < _SUCURSALES.length; i++) {
        var checked = '';
        for (var j = 0; j < data.length; j++) {
            if (_SUCURSALES[i].idsucursal === data[j])
                checked = 'checked';
        }
        fila += '<tr id="' + _SUCURSALES[i].idsucursal + '">';
        fila += '<td>' + _SUCURSALES[i].descripcion + '</td>';
        fila += '<td>  <input class="checksucursal" type = "checkbox" idsucursal = "' + _SUCURSALES[i].idsucursal + '"  ' + checked + ' /></td>';
        fila += '</tr>';
    }
    tbodysucursal.innerHTML = fila;
}

txtfoto.addEventListener('change', function () {
    let reader = new FileReader();
    var file = document.querySelector('input[id=txtfoto]')['files'][0];
    reader.readAsDataURL(file);
    imgfoto.removeAttribute('src');

    reader.onload = function () {

        imgfoto.src = reader.result;
        _IMAGEN = reader.result;
    };
});
function fnlistarsucursales() {   
    for (var i = 0; i < _SUCURSALES.length; i++) {
        cmbsucursal.append('<option value="' + _SUCURSALES[i].idsucursal+'">'+_SUCURSALES[i].descripcion+'</option>');
    }
}
$('#form-registro').submit(function (e) {
    e.preventDefault();
    var url = "";
    var operacion = 'editar';
    url = ORIGEN + "/Administrador/Empleado/Editar";
    if (txtcodigo.val() === "") {
        url = ORIGEN + "/Administrador/Empleado/Crear";
        operacion = 'nuevo';
    }


    var obj = $('#form-registro').serializeArray();
    $.post(url, obj).done(function (data) {
        if (data.mensaje === "ok") {
            if (operacion === "nuevo") {
                mensaje('S', 'Empleado registrado');
            } else if (operacion === "editar") {
                mensaje('S', 'Empleado actualizado');
                tblEmpleados.row('.selected').remove().draw(false);
            }
            data.objeto.sucursal = $('#cmbsucursal option:selected').text();
            data.objeto.grupo = $('#cmbgrupo option:selected').text();
            fnguardarimagen(data.objeto.emp_codigo);
            agregarFila(data.objeto);
            limpiar();
        } else
            mensaje('W', data.mensaje);
    }).fail(function (data) {
        console.log(data);
        mensaje("D", "Error en el servidor");
    });
});
$('#btnnuevo').click(function (e) {
    vermodal();
    limpiar();
});



$(document).on('click', '.checkcanalventa', function () {
    var fila = this.parentNode.parentNode;
    var idcanal = fila.getAttribute('id');
    var idempleado = txtcodigo.val();
    var obj = {
        idempleado: idempleado,
        idcanalventa: idcanal
    };
    let controller = new EmpleadoController();
    controller.AsignarCanalVenta(obj);
});
$(document).on('click', '.checksucursal', function () {
    var fila = this.parentNode.parentNode;
    var idsucursal = fila.getAttribute('id');
    var idempleado = txtcodigo.val();
    var obj = {
        idempleado: idempleado,
        idsucursal: idsucursal
    };
    let controller = new EmpleadoController();
    controller.AsignarSucursal(obj);
});


// INICIO DE CODIGO PARA ALMACENES 

function listaralmacenes(idsucusal,idempleado) {

    let obj = {
        idsucursal: idsucusal,
        idempleado: idempleado
    };
    var url = ORIGEN + '/Administrador/Empleado/listaralmacenempelado';
    $.post(url, obj).done(function (data) {
        let datos = JSON.parse(data);     
        llenarTabla(datos);
    }).fail(function (data) {
        console.log(data);
        mensajeError(data);
    })
}


function llenarTabla(datos) {
    $('#tbodyalmacen').empty();
    let tbody = $('#tbodyalmacen');

    datos.forEach(function (fila) {
        let tr = $('<tr>');
        $('<td>').text(fila.almacen).appendTo(tr);

        let checkbox = $('<input>').attr({
            type: 'checkbox',
            class: 'checkalmacen', 
            value: fila.id 
        });

        checkbox.prop('checked', fila.idalmacenempleado !== 0);

        $('<td>').append(checkbox).appendTo(tr);
        tbody.append(tr);
    });
}
// Manejar el clic del checkbox
$(document).on('click', '.checkalmacen', function () {
    var valorCheckbox = $(this).val();
    var selectElement = document.getElementById("cmbsucursal");
    // Obtener el valor seleccionado
    var selectedValue = selectElement.value;

    var idempleado = $("#txtemp_codigo").val();
    var estaSeleccionadocheck = $(this).is(':checked');

    var estadop = 0;
    // Realizar acciones según el estado del checkbox
    if (estaSeleccionadocheck) {
        estadop = 1;
    } else {
        estadop = 0;
    }
    var obj = {

        idalmacensucursal: valorCheckbox,
        idsucursal: selectedValue,
        idempleado: idempleado,
        estado: estadop
    };

    var url = ORIGEN + '/Administrador/Empleado/guardaralmacenempelado';
    $.post(url, obj).done(function (data) {
        console.log(data.mensaje);

        if (data.mensaje === "ACTUALIZADO" || data.mensaje === "GUARDADO" ) {
            console.log(data.mensaje);
            mensaje('S', 'ALMACEN ' + data.mensaje+' CORRECTAMENTE');
            listarAlmacenxEmpleado();
        } else {
            alertaSwall('W', 'ERROR  ' + data.mensaje, '');
        }
    }).fail(function (xhr, status, error) {
        console.error("Error en la solicitud AJAX:", status, error);
    });
});