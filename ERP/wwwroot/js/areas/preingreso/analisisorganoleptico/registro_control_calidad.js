//variables de preingreso
var txtidpreingreso = $('#txtidpreingreso');
var txtnropreingreso = $('#txtnropreingreso');
var txtfecha = $('#fecha');
var txtempresa = $('#empresa_descripcion');
var txtsucursal = $('#sucursal_descripcion');
var txtquimico = $('#quimico_userName');
var txtobservacion = $('#observacion');

var cmbdocumentotributario = $('#cmbdocumentotributario');
var txtserie_numdoc = $('#txtserie_numdoc');
var cmbalmacen = $('#cmbalmacen');
var cmbestado = $('#cmbestado');
var txtidanalisisorganoleptico = $('#txtidanalisisorganoleptico');
var txtcodigocontrolanalisis = $('#txtcodigoanalisisorganoleptico');
var txtsucursalpreingreso = $('#txtsucursalpreingreso');
//var tblpreingreso = $("#tblpreingreso");
//MODALES
var modalpreingreso = $('#modalpreingresos');

//MODAL DETALLE PRODUCTOS
var txtidfactura = $('#idfactura');
var txtrucempresa = $('#txtrucempresa');
var txtproveedor = $('#txtproveedor');

//ARRAY 
var ARRAYRANGOAO = [];

//TABLE
var tbldetalle = [];
//botones
var btnanular = $('#btn-anular');
var btnguardar = $('#btn-guardar');
var btnimprimir = document.getElementById('btnimprimir');

$(document).ready(function () {
    tbldetalle = $('#tbldetalle').DataTable({
        fixedHeader: true,
        "searching": true,
        lengthChange: false,
        "ordering": false,
        paging: false,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        //dom: 'Bfrtip',
        responsive: true,
        buttons: BOTONESDATATABLE('DETALLE DE ANALISIS ', 'V', false),
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [1],
                "visible": false,
                "searchable": false
            }, {
                "targets": [2],
                "visible": false,
                "searchable": false
            }, {
                "targets": [3],
                "visible": false,
                "searchable": false
            }, {
                "targets": [4],
                "visible": false,
                "searchable": false
            }
            , {
                "targets": [5],
                "visible": false,
                "searchable": false
            }
            //EARTCOD1016
            //, {
            //    "targets": [14],
            //    "visible": false,
            //    "searchable": false
            //}
            //EARTCOD1016
        ]
    });
    fnListarRangoAO();
    MDAO_fnListarCategorias();
    if (MODELO.idanalisisorganoleptico != 0 && MODELO.idanalisisorganoleptico != undefined) {
        fnBuscarAnalisisCompleto(MODELO.idanalisisorganoleptico);       
    } 
    //ListarHabilitados().then(data => {
    //    console.log(data);
    //}).catch((error) => { console.log(error); });

    //EARTCOD1012//
    /*calendariofechainput();*/
    datetimepikerinput();
});

//REGISTRO DE CONTROL DE CÁLIDAD
$('#form-registro').submit(function (e) {
    e.preventDefault();
    let obj = $('#form-registro').serializeArray();

    let detalle = JSON.stringify(MDAO_ARRAYDETALLEAO);
    obj[obj.length] = { name: "estado", value: 'HABILITADO' };
    obj[obj.length] = { name: "jsondetalle", value: detalle };
    obj[obj.length] = { name: "idalmacensucursal", value: cmbalmacen.val() };
    obj[3].value = formatoFecha(obj[3].value);

    console.log(obj);
    let totalfilas = tbldetalle.rows().data().length;
    let totalanalizados = MDAO_ARRAYDETALLEAO.length;
    if (totalfilas == totalanalizados && totalfilas>0) {
        BLOQUEARCONTENIDO('form-registro', 'Guardando datos...');
        let controller = new AnalisisOrganolepticoController();
        controller.registrar(obj, fnRegistrarAO);
       
    } else {
        mensajeConfirmacion("W", "Analice todos los items del detalle",'','');
    }
});
function fnRegistrarAO(data) {
    if (data.mensaje == "ok") {
        mensajeConfirmacion("S", "Registro completado", '', '');
     
        let datos = data.objeto;
        txtcodigocontrolanalisis.val(datos.codigoanalisisorganoleptico);
        txtidanalisisorganoleptico.val(datos.idanalisisorganoleptico);
        btnimprimir.removeAttribute('disabled')
        btnimprimir.setAttribute('href', ORIGEN + "/Preingreso/PIAnalisisOrganoleptico/Imprimir/" + datos.idanalisisorganoleptico);
    }
    else
        mensajeConfirmacion("W", data.mensaje, '', '');
    DESBLOQUEARCONTENIDO('form-registro');
}

//EVENTOS
btnimprimir.addEventListener('click', function () {
    fnimprimir();
});
$(document).on('click', '.btn-pasar-preingreso', function (e) {
    var columna = MDP_tblpreingreso.row($(this).parents('tr')).data();
   
    txtidpreingreso.val(columna[0]);
    txtnropreingreso.val(columna[3]);
    tbldetalle.clear().draw();
    fnBuscarPreingresoCompleto(columna[1]);
    MDAO_ARRAYDETALLEAO = [];
});
$('#tbldetalle tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbldetalle.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
$('#txtnropreingreso').click(function () {
    MDP_fnCargarPreingreso();
    $('#modalpreingresos').modal('show');

});

//Buscar analisis completo
function fnBuscarAnalisisCompleto(id) {
    let controller = new AnalisisOrganolepticoController();
    let obj = { id: id };
    controller.getAnalisisOrganolepticoCompleto(obj, fnCargarDatosAnalisisOrganoleptico);
}
function fnCargarDatosAnalisisOrganoleptico(data) {
    
    let datos = JSON.parse(data.objeto);
    var cabecera = JSON.parse(datos[0]["CABECERA"]);
    var detalle = JSON.parse(datos[0]["DETALLE"]);
    var caracteristicas = JSON.parse(datos[0]["CARACTERISTICAS"]);

    /*cabecera[0]["FECHA"].value = formatoFecha(cabecera[0]["FECHA"]);*/
    btnimprimir.removeAttribute('disabled');
    btnimprimir.setAttribute('href', ORIGEN + "/Preingreso/PIAnalisisOrganoleptico/Imprimir/" + cabecera[0]["ID"]);
    txtsucursal.val(cabecera[0]["SUCURSAL"]);
    txtempresa.val(cabecera[0]["EMPRESA"]);
    txtquimico.val(cabecera[0]["QUIMICO"]);
    txtobservacion.val(cabecera[0]["OBSERVACION"]);
    //DATOS PREINGRESO
    txtrucempresa.val(cabecera[0]["PRO_RUC"]);
    txtproveedor.val(cabecera[0]["PRO_RAZONSOCIAL"]);

    txtidpreingreso.val(cabecera[0]['IDPREINGRESO']);
    txtnropreingreso.val(cabecera[0]['CODIGOPREINGRESO']);
    fnListarAlmacenPorSucursal(cabecera[0]['ORCP IDSUCURSALDESTINO'], cabecera[0]['PREINGRESO IDALMACEN']);
    txtsucursalpreingreso.val(cabecera[0]['PREINGRESO SUCURSAL']);
    cmbdocumentotributario.val(cabecera[0]["IDDOCUMENTO"]);
    txtidfactura.val(cabecera[0]["IDFACTURA"]);
    txtserie_numdoc.val(cabecera[0]["SERIEDOC"] + "-" + cabecera[0]["NUMDOC"]);
    cmbestado.val(cabecera[0]["ESTADOPREINGRESO"]);
    modalpreingreso.modal('hide');
    var index = 0; //tbldetalle.rows().data().length;
    tbldetalle.clear().draw(false);

    for (var i = 0; i < detalle.length; i++) {
        let obj_AnaOrgDet = new PIAnalisisOrgDetalle();
        obj_AnaOrgDet.idanalisisorgdetalle = detalle[i]["IDDETALLEAO"];
        obj_AnaOrgDet.iddetallepreingreso = detalle[i]["IDPRE"];
        obj_AnaOrgDet.idproducto = detalle[i]["IDPRODUCTO"];
        obj_AnaOrgDet.idstock = detalle[i]["IDSTOCK"];
        obj_AnaOrgDet.idlote = detalle[i]["IDLOTE"];
        obj_AnaOrgDet.cantidadmuestra = detalle[i]["CANTIDAMUESTRA"];
        obj_AnaOrgDet.cantidadaprobada = detalle[i]["CANTIDAAPROBADA"];
        obj_AnaOrgDet.cantidadrechazada = detalle[i]["CANTIDARECHAZADA"];
        obj_AnaOrgDet.resultado = detalle[i]["RESULTADO"];
        obj_AnaOrgDet.observacion = detalle[i]["OBSERVACION"];
        //obj_AnaOrgDet.idproductoenvase = detalle[i]["IDTIPOENVASE"];//EARTCOD1016

        var arr_filtrado = caracteristicas.filter(item => item.idanalisisorgdetalle == detalle[i]["IDDETALLEAO"] && item.estado == "HABILITADO");
        obj_AnaOrgDet.detallecaracteristicajson = JSON.stringify(arr_filtrado);

        MDAO_ARRAYDETALLEAO.push(obj_AnaOrgDet);
       // if (detalle[i]["CANINGRESADA"] > 0) {
            index++;
            //let lote = detalle[i]["LOTES"];        
            var auxtfila = tbldetalle.row.add([
                '<label class="index bold">' + (index) + '</label>',
                detalle[i]["IDDETALLEAO"],
                detalle[i]["IDAO"],
                detalle[i]["IDPRE"],
                detalle[i]["IDPRODUCTO"],
                detalle[i]["IDSTOCK"],
                detalle[i]["LOTE"] ?? '',
                //detalle[i]["FVENCIMIENTO"]
                detalle[i]["PRODUCTO"],
                detalle[i]["LABORATORIO"],
                detalle[i]["CANTIDAD PREINGRESO"],
                `<div  >      
                <button type="button" class="btn btn-sm btn-primary  btn-pasaranalisisorganoletico font-10" id="`+ detalle[i]["IDSTOCK"] + `"><i class="fas fa-tachometer-alt text-light"></i></button>                                                                   
                </div>`,
                //detalle[i]["CANTIDAD INGRESADA"],//Se agregó
                detalle[i]["CANTIDAMUESTRA"],
                `<input type="number" class="text-center txtcantidadaprobado" style="width:80px;" value="` + detalle[i]["CANTIDAAPROBADA"]+`" min="1" disabled/>`,
                `<input type="number" class="text-center txtcantidadrechazado" style="width:80px;" value="` + detalle[i]["CANTIDARECHAZADA"] +`" min="1" disabled/>`
                //, detalle[i]["IDTIPOENVASE"]//EARTCOD1016*/

            ]).draw(false);
            $(auxtfila.node()).find('td').eq(0).attr({ 'class': 'sticky' });
        auxtfila.nodes().to$().attr('id', 'TR_' + detalle[i]["IDSTOCK"]);
        auxtfila.node().setAttribute('idlote', detalle[i]["IDLOTE"]);
        //}
    }
}
//buscar datos de preingreso
function fnBuscarPreingresoCompleto(idfactura) {
    let controller = new PreingresoController();
    BLOQUEARCONTENIDO('form-registro', 'Cargando datos...');
    controller.BuscarPreingresoCompleto_StockxFactura(idfactura, fnCargarDatosPreingreso);
}
function fnCargarDatosPreingreso(data) {
    var cabecera = JSON.parse(data[0]["CABECERA"]);
    var detalle = JSON.parse(data[0]["DETALLE"]);
  
    //DATOS PREINGRESO
    txtrucempresa.val(cabecera[0]["PRO_RUC"]);
    txtproveedor.val(cabecera[0]["PRO_RAZONSOCIAL"]);
    //btnimprimir.removeAttribute('disabled');
    //btnimprimir.setAttribute('href', ORIGEN + "/Preingreso/PIAnalisisOrganoleptico/Imprimir/" + cabecera[0]["ID"]);
    txtidpreingreso.val(cabecera[0]['ID']);
    fnListarAlmacenPorSucursal(cabecera[0]['IDSUCURSAL DESTINO'], cabecera[0]['IDALMACEN']);
    txtsucursalpreingreso.val(cabecera[0]['SUCURSAL']);
    cmbdocumentotributario.val(cabecera[0]["IDDOCUMENTO"]);
    txtidfactura.val(cabecera[0]["IDFACTURA"]);
    txtserie_numdoc.val(cabecera[0]["SERIEDOC"] + "-" + cabecera[0]["NUMDOC"]);
    cmbestado.val(cabecera[0]["ESTADO"]);
    modalpreingreso.modal('hide');
    var index = 0; //tbldetalle.rows().data().length;
    tbldetalle.clear().draw(false);
    var contadorEC = 0;
    for (var i = 0; i < detalle.length; i++) {
        if (detalle[i]["CANINGRESADA"] > 0 && detalle[i]["TIPOPRODUCTO"] != "EC") {
            index++;
            //let lote = detalle[i]["LOTES"];        
            var auxtfila = tbldetalle.row.add([
                '<label class="index bold">' + (index) + '</label>',
                '0',
                '0',
                detalle[i]["ID"],
                detalle[i]["IDPRODUCTO"],
                detalle[i]["IDSTOCK"],
                detalle[i]["LOTE"] ?? '',
                //detalle[i]["FVENCIMIENTO"],
                detalle[i]["PRODUCTO"],
                detalle[i]["LABORATORIO"],
                detalle[i]["CANFACTURA"],
                `<div class="" >      
                <button type="button" class="btn btn-sm btn-primary btn-pasaranalisisorganoletico font-10" id="`+ detalle[i]["IDSTOCK"] + `"><i class="fas fa-tachometer-alt text-light"></i></button>                                                                   
                </div>`,
                //detalle[i]["CANINGRESADA"],
                fnGetValorMuestra(detalle[i]["CANINGRESADA"]),
                `<input type="number" class="text-center txtcantidadaprobado" style="width:80px;" value="0" min="1" disabled/>`,
                `<input type="number" class="text-center txtcantidadrechazado" style="width:80px;" value="0" min="1" disabled/>`,
                detalle[i]["IDTIPOENVASE"]//EARTCOD1016

            ]).draw(false);
            $(auxtfila.node()).find('td').eq(0).attr({ 'class': 'sticky' });
            auxtfila.nodes().to$().attr('id', 'TR_' + detalle[i]["IDSTOCK"]);
            auxtfila.node().setAttribute('idlote', detalle[i]["IDLOTE"]);
            //$(auxtfila.node()).find('tr').attr({ 'id': 'BotonAO_' + detalle[i]["IDSTOCK"] });
            //$(auxtfila.node()).find('td').eq(5).attr({ 'style': 'width:30%' });
            //$(auxtfila.node()).find('td').eq(6).attr({ 'style': 'width:25%' });
            //$(auxtfila.node()).find('td').eq(7).attr({ 'style': 'width:10%' });
            //$(auxtfila.node()).find('td').eq(8).attr({ 'style': 'width:10%' });
            //$(auxtfila.node()).find('td').eq(9).attr({ 'style': 'width:10%' });
            //$(auxtfila.node()).find('td').eq(10).attr({ 'style': 'width:10%' });

        } else {
            contadorEC += 1;
        }
    }
    if (contadorEC == detalle.length) {
        mensaje("W", "La factura " + cabecera[0]["SERIEDOC"] + "-" + cabecera[0]["NUMDOC"] + " solo cuenta con Economatos.");
        btnguardar.attr("disabled", true);
    } else {
        btnguardar.attr("disabled", false);
    }
    DESBLOQUEARCONTENIDO('form-registro');
}

$(document).on('click', '.btn-pasaranalisisorganoletico', function (e) {
    let fila = $(this).parents('tr');  
    let columna = tbldetalle.row(fila).data();

    MDAO_txtidanalisisorgdetalle.val(columna[1]);
    MDAO_txtiddetallepreingreso.val(columna[3]);
    MDAO_txtidproducto.val(columna[4]);
    MDAO_txtidstock.val(columna[5]);
    MDAO_txtidlote.val(columna[5]);
    MDAO_lote.html(columna[6]);
    MDAO_producto.html(columna[7]);
    MDAO_txtcingreso.val(columna[9]);
    MDAO_txtcmuestra.val(columna[11]);


    let pos = MDAO_fnBuscarDetalle(MDAO_ARRAYDETALLEAO, columna[5]);
    if (pos >= 0) {
        MDAO_txtrechazada.val(MDAO_ARRAYDETALLEAO[pos].cantidadrechazada);
        MDAO_cmbresultado.val(MDAO_ARRAYDETALLEAO[pos].resultado);
        MDAO_txtobservacion.val(MDAO_ARRAYDETALLEAO[pos].observacion);
        MDAO_fnCargarCaracteristicasSeleccionadas(MDAO_ARRAYDETALLEAO[pos].detallecaracteristicajson)
        $('#MDAO_modaldetalleao').modal('show');
        //MDAO_fnListarCategorias();    
        console.log("HOLA MUNDO 1");
    } else {        
        MDAO_txtrechazada.val(fila.find(".txtcantidadrechazado").val());        
        MDAO_cmbresultado.val('LB');
        MDAO_txtobservacion.val('');
        $('#MDAO_modaldetalleao').modal('show');
        MDAO_fnModificarSeleccionxEstado();
        //MDAO_fnListarCategorias();        
    }

    //EARTCOD1016
    if (columna[14] == 1) {
        $("#MDAO_Caracteristica1000").prop("checked", true);
        $("#MDAO_Caracteristica1001").prop("checked", true);
        $("#MDAO_Caracteristica1002").prop("checked", true);
        $("#MDAO_Caracteristica1003").prop("checked", true);
        $("#MDAO_Caracteristica1004").prop("checked", true);
        $("#MDAO_Caracteristica1005").prop("checked", true);

        $("#MDAO_Caracteristica1006").prop("checked", false);
        $("#MDAO_Caracteristica1007").prop("checked", false);
        $("#MDAO_Caracteristica1008").prop("checked", false);
        $("#MDAO_Caracteristica1009").prop("checked", false);
        $("#MDAO_Caracteristica1010").prop("checked", false);
        $("#MDAO_Caracteristica1011").prop("checked", false);
    } else if (columna[14]===" ") {
        $("#MDAO_Caracteristica1000").prop("checked", false);
        $("#MDAO_Caracteristica1001").prop("checked", false);
        $("#MDAO_Caracteristica1002").prop("checked", false);
        $("#MDAO_Caracteristica1003").prop("checked", false);
        $("#MDAO_Caracteristica1004").prop("checked", false);
        $("#MDAO_Caracteristica1005").prop("checked", false);

        $("#MDAO_Caracteristica1006").prop("checked", false);
        $("#MDAO_Caracteristica1007").prop("checked", false);
        $("#MDAO_Caracteristica1008").prop("checked", false);
        $("#MDAO_Caracteristica1009").prop("checked", false);
        $("#MDAO_Caracteristica1010").prop("checked", false);
        $("#MDAO_Caracteristica1011").prop("checked", false);
    }
    /////EARTCOD1016

});





//cargar datos
function fnListarAlmacenPorSucursal(idsucursal, idseleccion) {
    let controller = new AlmacenSucursalController();
    controller.ListarAlmacenxSucursal('cmbalmacen', idsucursal, idseleccion, function () {
        if ($("#cmbalmacen").value != '')
            $("#cmbalmacen option:contains(CUARENTENA PT)").attr('selected', true);
    });
}
//Rango AO
function fnListarRangoAO() {
    let controller = new RangoAOController();
    controller.ListarHabilitados('', function (data) {
        if (data.mensaje == "ok") {
            let datos = data.objeto;
            for (let i = 0; i < datos.length; i++) {
                ARRAYRANGOAO.push(datos[i]);
            }
        } else {
            mensaje("W", data.mensaje, "BR");
        }
    });
}

function fnGetValorMuestra(valor) {
    
    for (let i = 0; i < ARRAYRANGOAO.length; i++) {
        if (valor >= ARRAYRANGOAO[i].intervaloinicial && valor <= ARRAYRANGOAO[i].intervalofinal) {
          
            return ARRAYRANGOAO[i].numeromuestra;
        }
    }
    return 0;
}

//CAMBIAR DATOS DE TABLAS DESPUES DE GUARDAR LOS DETALLES 
function fnCambiarDatosTabla(idstock, cantidaddevuelta) {
     var filas = document.querySelectorAll("#tbldetalle tbody tr");
    var c = 0;   
    var cantidadaprobada = 0;
     var datatable = tbldetalle.rows().data();     
    if (datatable.length > 0)
        filas.forEach(function (e) {
            if (idstock == datatable[c][5]) {
                cantidadaprobada = datatable[c][9] - cantidaddevuelta;
                document.getElementsByClassName("txtcantidadaprobado")[c].value = cantidadaprobada;
                document.getElementsByClassName("txtcantidadrechazado")[c].value = cantidaddevuelta;
                $('#' + datatable[c][5]).removeClass('btn-sucess');
                $('#' + datatable[c][5]).removeClass('btn-primary');
                $('#' + datatable[c][5]).removeClass('btn-danger');
                $('#TR_' + datatable[c][5]).removeClass('table-success');   
                $('#TR_' + datatable[c][5]).removeClass('table-danger');   
                console.log(cantidadaprobada);
                if (cantidadaprobada > 0) {                   
                    $('#' + datatable[c][5]).addClass('btn-success');     
                    $('#TR_' + datatable[c][5]).addClass('table-success');    
                    
                } else {
                    $('#' + datatable[c][5]).addClass('btn-danger');
                    $('#TR_' + datatable[c][5]).addClass('table-danger'); 
                }
            }
            c++;
        });
}


function limpiar() {
    let quimico=txtquimico.val();
    let empresa=txtempresa.val();   
    let sucursal=txtsucursal.val();

    $('#form-registro').trigger('reset');
    btnimprimir.setAttribute('href', '');
    txtidpreingreso.val("");
    txtnropreingreso.val("");
    txtidanalisisorganoleptico.val("");
    txtidfactura.val("");
    txtquimico.val(quimico);
    txtempresa.val(empresa);
    txtsucursal.val(sucursal);
    MDAO_ARRAYDETALLEAO = [];
    tbldetalle.clear().draw(false);
}

function fnimprimir() {
    var id = txtidanalisisorganoleptico.val();
    if (txtidanalisisorganoleptico.val() != '') {
        var href = btnimprimir.getAttribute('href');
        ABRIR_MODALIMPRECION(href, 'IMPRIMIR ANALÍSIS ORGANOLÉPTICO');
    }
}

//EARTCOD1012//
//function calendariofechainput() {
//    var fecha = new Date();
//    var strFecha = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear();
//    $('.fecha').val(strFecha);

//    var date_input = $('input[name="fecha"]'); //our date input has the name "date"
//    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "modal_body";
//    var options = {
//        dateFormat: 'dd/mm/yy',
//        container: container,
//        todayHighlight: true,
//        autoclose: true
//    };
//    date_input.datepicker(options);
//}

function datetimepikerinput() {
    $("#datetimepicker").datetimepicker({
        format: "d/m/Y H:m:s",
    });
}

function formatoFecha(sfechaeeuu) {
    let fechaeeuu = sfechaeeuu.split("/");
    let mes = fechaeeuu[0];
    let dia = fechaeeuu[1];
    let separarAnioHora = fechaeeuu[2].split(" ");
    let anio = separarAnioHora[0];
    let horaminseg = separarAnioHora[1];
    var fechareturn = "";
    if (mes < 10)
        fechareturn = `0${mes}/${dia}/${anio} ${horaminseg}`;
    else
        fechareturn = `${mes}/${dia}/${anio} ${horaminseg}`;
    //fechareturn = `${mes}/${dia}/${anio} ${horaminseg}`;

    return fechareturn;
}