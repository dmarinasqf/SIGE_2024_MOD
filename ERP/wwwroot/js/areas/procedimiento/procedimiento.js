var tbllista;//=document.getElementById('tbllista');
var arrayguias = [];
var btnconsultar = document.getElementById('btnconsultar');
var tbodydetalle = document.getElementById('tbodydetalle');
var txtfecharango = document.getElementById('txtfecharango');
//var divAddArticulo = document.getElementById('divAddArticulo');

var btnregistrar = document.getElementById('btnregistrar');
var btnBuscarPaciente = document.getElementById('btnBuscarPaciente');

var txtidpaciente = document.getElementById('txtidpaciente');
var txtdocpaciente = document.getElementById('txtdocpaciente');
var txtnombrepaciente = document.getElementById('txtnombrepaciente');

var btnBuscarMedico = document.getElementById('btnBuscarMedico');
var txtcmpmedico = document.getElementById('txtcmpmedico');
var txtnommedico = document.getElementById('txtnommedico');

var txtidmedico = document.getElementById('txtidmedico');

var cmbtipoprocedimiento = document.getElementById('cmbtipoprocedimiento');
var txtcostoprocedimiento = document.getElementById('txtcostoprocedimiento');

var txtobservacion = document.getElementById('txtobservacion');
var txtidarticulo = $('#txtidarticulo');
var txtmaterial = $('#txtmaterial');
var txtunidades = $('#txtunidades');
var txtUnidadMedida = $('#txtUnidadMedida');
var txtnumdocumento = document.getElementById('txtnumdocumento');
var cmbprocedimientoarticulo = $('#cmbprocedimientoarticulo');
var operacion = document.getElementById('TIPOOPERACION');

var divAddArticulo = $('#divAddArticulo');
var lblnombreprocedimiento = $('#lblnombreprocedimiento');
var _listaProcedimientos = [];
var _listaArticulos = [];
var _modelo;
var _Conta = 0;
var _index = 0;
var _ContaDPA = 0;
var contarTotal = 0;
var tblprocedimientosregistro = document.getElementById('tblprocedimientosregistro');

var txtfechainicio = '';
var txtfechafin = '';

var btnGuardar =document.getElementById('btnGuardar');

$(document).ready(function () {
    var GRUPO = document.getElementById("viewbaggrupo");
    if (GRUPO == 'ADMINISTRADOR') {
        listarSucursales();
        document.getElementById("divsucursal").style.display = "inline";
    }
    else if (GRUPO == 'SUPERVISOR') {
        listarSucursalesSupervisor(); document.getElementById("divsucursal").style.display = "inline";
        document.getElementById("btnNuevo").style.display = "none";

    }
    else if (GRUPO == 'REP.MEDICO') {
        listarSucursalesRepMedico();
        document.getElementById("divsucursal").style.display = "inline";
        document.getElementById("btnNuevo").style.display = "none";
    }
    //tblprocedimientos
    tblprocedimientoslistar = $('#tblprocedimientos').DataTable({
        "searching": false,
        lengthChange: true,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "ordering": false,
        "language": {
            "sSearch": "Buscar",
            "lengthMenu": "",
            "zeroRecords": "No hay registros",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ Entradas",
            "infoEmpty": "No hay información",
            "infoFiltered": "(filtered from _MAX_ total records)",
            "search": "Buscar:",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "order": [[1, 'asc']]
        }
    });

    tblprocedimientosregistro = $('#tblprocedimientosregistro').DataTable({
        "searching": false,
        lengthChange: false,
        paging: false,
        "ordering": false,
        "language": {
            "sSearch": "Buscar",
            "lengthMenu": "",
            "zeroRecords": "No hay registros",
            "infoEmpty": "",
            "info": ""
        },
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [1],
                "visible": false,
                "searchable": false
            }, {
                "targets": [2],
                "visible": false,
                "searchable": false
            }, {
                "targets": [5],
                "visible": false,
                "searchable": false
            }

        ]
    });

    tblarticulosregistro = $('#tblmaterialesregistro').DataTable({
        "searching": false,
        lengthChange: false,
        paging: false,
        "ordering": false,
        "language": {
            "sSearch": "Buscar",
            "lengthMenu": "",
            "zeroRecords": "No hay registros",
            "infoEmpty": "",
            "info": ""
        },
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [1],
                "visible": false,
                "searchable": false
            }
            ,
            {
                "targets": [2],
                "visible": false,
                "searchable": false
            },
            {
                "targets": [6],
                "visible": false,
                "searchable": false
            }]
    });

    divAddArticulo.hide('fast')
    $('input[id="txtrangofecha"]').daterangepicker({
        showDropdowns: true,
        minYear: 2015,
        maxYear: parseInt(moment().format('YYYY'), 10) + 1,
        autoUpdateInput: false,
        "alwaysShowCalendars": true,
        "showCustomRangeLabel": false,
        locale: {
            cancelLabel: 'Limpiar'
        }
    });
    listarTipoProcedimientos();
});

$('#tblprocedimientosregistro tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        //console.log();
    }
    else {
        tblprocedimientosregistro.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});


function listarprodecimiento(data) {
    var filas = '';
    try {
        if (data.mensaje === "ok") {
            let datos = JSON.parse(data.objeto);
            
            for (let i = 0; i < datos.length; i++) {
                filas += '<tr>';
                filas += '<td>' + (datos[i]["procedimiento_codigo"]) +'</td>';
                filas += '<td>' + moment(datos[i]["fecha"]).format("DD/MM/YYYY") + '</td>';
                filas += '<td>' + (datos[i]["numDocumento"]) + '</td>';
                filas += '<td>' + (datos[i]["total"]) + '</td>';
                filas += '<td>' + (datos[i]["sucursal"]) + '</td>';
                filas += '<td>' + (datos[i]["paciente"]) + '</td>';
                filas += '<td>' + (datos[i]["medico"]) + '</td>';
                filas += `<td><div class="btn-group btn-group-sm" >            
                            <a class="btn  btn-warning btn-xs" data-toggle="tooltip" data-placement="top" title="EDITAR" onclick="mostrarProcedimiento(`+ datos[i]["procedimiento_codigo"] + `)"><i class="fas fa-edit fa-1x"></i></a>
                            <a class="btn btn-xs btn-danger" data-toggle="tooltip" data-placement="top" title="ELIMINAR" href="`+ ORIGEN + `/Almacen/AGuiaSalida/RegistrarEditar/?id=` + datos[i]["procedimiento_codigo"] + `"><i class="fas fa-trash-alt fa-1x"></i></a>
                            </div></td></tr>`;
            }
            tbodydetalle.innerHTML = filas;
        }
        else
            mensaje('W', data.mensaje);
    } catch (error) {
        console.log(error);
    }
}

btnconsultar.addEventListener('click', function () {
    let obj = $('#form-busqueda').serializeArray();
    obj[obj.length] = { name: "fecha", value: txtfecharango.value };
    let controller = new ProcedimientoController();
    controller.ListarProcedimiento(obj, listarprodecimiento);
    //divAddArticulo.style.display = "none";
});

btnregistrar.addEventListener('click', function () {
    $('#modalregistrarprocedimiento').modal('show');
});

function MODPROCEDIMIENTO_cerrarmodal() {
    $('#modalregistrarprocedimiento').modal('hide');
    limpiar();
}

$('#btnbuscarpaciente').click(function () {
    $('#modalcliente').modal('show');

});

$(document).on('click', '.MCC_btnseleccionarcliente', function () {
    var fila = this.parentNode.parentNode.parentNode;
    txtidpaciente.value = this.getAttribute('idcliente');
    txtdocpaciente.value = fila.getElementsByTagName('td')[2].innerText;
    //txtdocpaciente.setAttribute('numdoc', fila.getElementsByTagName('td')[2].innerText);
    txtnombrepaciente.value = fila.getElementsByTagName('td')[3].innerText;
    $('#modalcliente').modal('hide');
});

$('#btnBuscarMedico').click(function () {
    $('#modalmedico').modal('show');
});
//MMbtnpasarmedico
$(document).on('click', '.MMbtnpasarmedico', function () {
    var fila = this.parentNode.parentNode;
    txtidmedico.value = this.getAttribute('id');
    txtcmpmedico.value = fila.getElementsByTagName('td')[2].innerText;
    //txtdocpaciente.setAttribute('numdoc', fila.getElementsByTagName('td')[2].innerText);
    txtnommedico.value = fila.getElementsByTagName('td')[3].innerText;
    $('#modalmedico').modal('hide');
});

$('input[id="txtfecharango"]').on('apply.daterangepicker', function (ev, picker) {
    $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    txtfechainicio = picker.startDate.format('DD/MM/YYYY');
    txtfechafin = picker.endDate.format('DD/MM/YYYY');
});

$('input[id="txtfecharango"]').on('cancel.daterangepicker', function (ev, picker) {
    $(this).val('');
    txtfechainicio = "";
    txtfechafin = "";
});

function listarTipoProcedimientos() {
    let controller = new ProcedimientoController();
    controller.ListadoTipoProcedimiento('cmbtipoprocedimiento');
}

$('#cmbtipoprocedimiento').change(function () {
    var costo = $('#cmbtipoprocedimiento option:selected').attr('costo');
    txtcostoprocedimiento.value=(parseFloat(costo).toFixed(2));
});
//AGREGAR DETALLE PROCEDIMIENTO
$('#btnagregarprocedimiento').click(function () {
    if (cmbtipoprocedimiento.value == 0) {
        return mensaje("W", "Seleccione un tipo de procedimiento");
    }
    if (cmbtipoprocedimiento.value != 0) {
        for (var r = 0; r < _listaProcedimientos.length; r++) {
            if (cmbtipoprocedimiento.value == _listaProcedimientos[r].tipodeproc_codido) {
                return mensaje("W", "Seleccione otro tipo de procedimiento, porque en el detalle ya se ha registrado");
            }
        }
        var idtipoproce = cmbtipoprocedimiento.value;
        var descripcion = $('#cmbtipoprocedimiento option:selected').text();
        //servidor
        var costo = 0;
        //if (APPESTADO == 'SERVIDOR')
            costo = parseFloat(txtcostoprocedimiento.value.replace(',', '.')).toFixed(2);
        //local
        //if (APPESTADO == 'LOCAL')
        //    costo = (txtcostoprocedimiento.val().replace('.', ','));
        contarTotal = parseFloat(contarTotal) + parseFloat(txtcostoprocedimiento.value);

        tblprocedimientosregistro.row.add([
            _Conta,
            '0',
            idtipoproce,
            descripcion,
            parseFloat(costo).toFixed(2),
            'AGREGAR',
            '<button class="btn  btn-danger btn-xs btn-quitarprocedimiento"><i class="fas fa-trash-alt fa-1x"></i></button>'
        ]).draw(false);
        actualizarCombox();
        //cmbtipoprocedimiento.val("0");
        //txtcostoprocedimiento.value("");
        var procedimiento = new Procedimiento('', '0', idtipoproce, costo, descripcion, _Conta, 'AGREGAR');
        //(procedimiento_codigo, detalleproc_codigo, tipodeproc_codido, costo, descripcion, index, estadoDP)
        _listaProcedimientos[_Conta] = procedimiento;
        _Conta = _Conta + 1;
    }
});
//Agregar el detalle
function actualizarCombox() {
    var columnas = tblprocedimientosregistro.rows().data();
    cmbprocedimientoarticulo.empty();
    for (var i = 0; i < columnas.length; i++) {
        var codigo = columnas[i][1];
        var descripcion = columnas[i][2];
        cmbprocedimientoarticulo.prepend('<option value= "' + codigo + '">' + descripcion + '</option>');
    }
}
//Eliminar el detalle
$(document).on('click', '.btn-quitarprocedimiento', function (e) {
    var columna = tblprocedimientosregistro.row('.selected').data();
    var index = columna[0];
    var id = columna[1];
    if (id == 0) {
        _listaProcedimientos[index] = null;
    } else if (id > 0) {
        _listaProcedimientos[index].estadoDP = "ELIMINAR";
    }
    divAddArticulo.hide('fast');
    tblprocedimientosregistro.row('.selected').remove().draw(false);
    contarTotal = parseFloat(contarTotal) - parseFloat(columna[4]);

});

$('#tblprocedimientosregistro tbody').on('click', 'tr td.details-control', function () {
    var tr = $(this).closest('tr');
    var row = tblprocedimientosregistro.row(tr);
    var columna = tblprocedimientosregistro.row($(this).parents('tr')).data();
    //console.log(columna[1]);
    if (row.child.isShown()) {
        tr.removeClass('details');
        row.child.hide();
    }
    else {
        tr.addClass('details');
        row.child(format(columna[1])).show();
    }
});

function registrarProcedimiento() {
    var procedimientos = tblprocedimientosregistro.rows().data();
    if (!(txtidpaciente.value.length > 0)) {
        mensaje("W", "Seleccione un PACIENTE");
        return;
    }
    if (txtnumdocumento.value.length == 0) {
        mensaje("W", "Ingrese NÚMERO DE DOCUMENTO válido");
        return;
    }
    if (txtidmedico.value.length == 0) {
        mensaje("W", "Seleccione un MÉDICO.");
        return;
    }

    btnGuardar.setAttribute("disabled", true);
    var url;

    if (operacion.value == "NUEVO") {
        url = '/Procedimiento/RegistrarProcedimiento';
        var procedimiento = {
            numDocumento: txtnumdocumento.value,
            cli_codigo: txtidpaciente.value,
            med_codigo: txtidmedico.value,
            fecha: txtfecha.value,
            estado: 'HABILITADO',
            observacion: txtobservacion.val(),
            nombremedico: txtnommedico.value,
            nombrecliente: txtnombrepaciente.value,
            suc_codigo: '',//IDSUCURSAL,
            nombresucursal:'', //NOMBRESUCURSAL,
            total: contarTotal
        };
        //CABECERA
        var detalle = [];
        var c = 0;
        for (var i = 0; i < _listaProcedimientos.length; i++) {
            if (_listaProcedimientos[i] != null) {
                detalle[c] = _listaProcedimientos[i];
                c = c + 1;

            }
        }
        //DETALLE
        var obj = {
            procedimiento: procedimiento,
            detalle: detalle,
            articulos: _listaArticulos
        };
        let controller = new ProcedimientoController();
        controller.RegistrarProcedimiento(obj);

        $.post(url, obj).done(function (data) {
            if (data.mensaje == "ok") {
                mensaje("S", "Datos guardados correctamente.");
                $('#modalProcedimiento').modal('hide');
                //console.log(data);
                limpiar();
                btnGuardar.setAttribute("disabled", false);
            }
            else {
                mensaje('W', data.mensaje);
                btnGuardar.setAttribute("disabled", false);
            }
        }).fail(function (data) {
            btnGuardar.setAttribute("disabled", false);
            //console.log(data);
            mensaje("D", 'Error en el servidor');
        });

    } else if (operacion.value == "EDITAR") {
        url = '/Procedimiento/EditarProcedimiento';
        var procedimiento2 = {
            procedimiento_codigo: txtcodigo.value,
            numDocumento: txtnumdocumento.value,
            cli_codigo: txtidpaciente.value,
            med_codigo: txtidmedico.value,
            fecha: txtfecha.value,
            estado: 'HABILITADO',
            observacion: txtobservacion.val(),
            nombremedico: txtnommedico.value,
            nombrecliente: txtnompaciente.value,
            suc_codigo: IDSUCURSAL,
            nombresucursal: NOMBRESUCURSAL,
            total: contarTotal
        };
        var detalle2 = [];
        var c2 = 0;
        for (var j = 0; j < _listaProcedimientos.length; j++) {
            if (_listaProcedimientos[j] != null) {
                detalle2[c2] = _listaProcedimientos[j];
                c2 = c2 + 1;

            }
        }
        var obj2 = {
            procedimiento: procedimiento2,
            detalle: detalle2,
            articulos: _listaArticulos
        };
        //console.log(obj2);
        $.post(url, obj2).done(function (data) {
            if (data.mensaje == "ok") {
                mensaje("S", "Datos guardados correctamente.");
                $('#modalProcedimiento').modal('hide');
                //console.log(data);
                limpiar();
                tblprocedimientoslistar.row('.selected').remove().draw(false);
                btnGuardar.setAttribute("disabled", false);
            }
            else {
                mensaje('W', data.mensaje);
                btnGuardar.setAttribute("disabled", false);
            }
        }).fail(function (data) {
            btnGuardar.setAttribute("disabled", false);
            //console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }
}

class Procedimiento {
    constructor(procedimiento_codigo, detalleproc_codigo, tipodeproc_codido, costo, descripcion, index, estadoDP) {
        this.procedimiento_codigo = procedimiento_codigo;
        this.detalleproc_codigo = detalleproc_codigo;
        this.costo = costo;
        this.tipodeproc_codido = tipodeproc_codido;
        this.descripcion = descripcion;
        this.index = index;
        this.estadoDP = estadoDP;
    }
}

function mostrarProcedimiento(codigo) {
    limpiar();
    var c = 0;
    $('#modalregistrarprocedimiento').modal('show');
    
    let controller = new ProcedimientoController();
    controller.BuscarProcedimiento(codigo, function (data) {
        //data=data.
    });

    //var url = '/Procedimiento/buscarProcedimiento';
    //$.post(url, obj).done(function (data) {
    //    //console.log(data);
    //    if (data != null) {
    //        operacion.val("EDITAR");
    //        $('#modalregistrarprocedimiento').modal('show');
    //        divAddArticulo.hide('fast');
    //        txtcodigo.val(data.procedimiento_codigo);
    //        txtnumdocumento.val(data.numDocumento);
    //        txtfecha.val(moment(data.fecha).format('DD/MM/YYYY'));
    //        txtidpaciente.val(data.cli_codigo);
    //        buscarPacienteDB(data.cli_codigo);
    //        txtidmedico.val(data.med_codigo);
    //        buscarMedicoDB(data.med_codigo);
    //        txtobservacion.val(data.observacion);
    //        listarDetalleProcedimiento(data.procedimiento_codigo);
    //    } else
    //        mensaje('W', data.mensaje);

    //}).fail(function (data) {
    //    //console.log(data);
    //    mensaje("D", 'Error en el servidor');
    //});
}

function limpiar() {

    tblprocedimientosregistro.clear().draw();
    tblarticulosregistro.clear().draw();
   
    txtnumdocumento.value = '';
    txtdocpaciente.value = '';
    txtidpaciente.value = '';
    txtnombrepaciente.value = '';
    txtidmedico.value = '';
    txtcmpmedico.value = '';
    txtnommedico.value = '';
    txtobservacion.value = '';
    cmbtipoprocedimiento.value = '0';
    txtcostoprocedimiento.value = '';

    lblnombreprocedimiento.value = '';
    contarTotal = 0;
    _Conta = 0;
    _ContaDPA = 0;
    _listaProcedimientos = [];
    _listaArticulos = [];
}