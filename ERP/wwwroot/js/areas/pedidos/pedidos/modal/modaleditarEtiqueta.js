var txtfechaEtiqueta = $('#txtfechaEtiqueta');
var txtnombresucursalEtiqueta = $('#txtnombresucursalEtiqueta');
var txtnombrelaboratorioEtiqueta = $('#txtnombrelaboratorioEtiqueta');
var txttipopedidoEtiqueta = $('#txttipopedidoEtiqueta');
var txtnrodocumentopacienteEtiqueta = $('#txtnrodocumentopacienteEtiqueta');
var txtnombrespacienteEtiqueta = $('#txtnombrespacienteEtiqueta');
var txttipopacienteEtiqueta = $('#txttipopacienteEtiqueta');
var txtcolegiaturaEtiqueta = $('#txtcolegiaturaEtiqueta');
var txtnombresmedicoEtiqueta = $('#txtnombresmedicoEtiqueta');
var txtnombreempleadoEtiqueta = $('#txtnombreempleadoEtiqueta');
var txtnumpedidoEtiqueta = $('#txtnumpedidoEtiqueta');
var txtordenproduccionEtiqueta = $('#txtordenproduccionEtiqueta');
var txtnumcomprobanteEtiqueta = $('#txtnumcomprobanteEtiqueta');
var txtestadoEtiqueta = $('#txtestadoEtiqueta');
var txtfechaentregaEtiqueta = $('#txtfechaentregaEtiqueta');
var txtindicaciones = $('#txtindicaciones')

var DATAETIQUETA;
var FORMULAETIQUETA = "";
var USOFORMULA = "";
var cmbuso = $('#cmbusoetiqueta');
var cmbcomplejo = $('#cmbcomplejo');
var txtreg = $('#txtreg');
var txtcodigoan = $('#txtcodigoan');
var txtcomposicionproducto = $('#txtcomposicionproducto');
var txtdescripcionproducto = $('#txtdescripcionproducto');
var divetiquetapequeña = $('#divetiquetapequeña');
var divetiquetamediana = $('#divetiquetamediana');
var divetiquetagrande = $('#divetiquetagrande');
var divetiqueta1950 = $('#divetiqueta1950');

var CLIENTE = "";
var ELABORADO = "";
var PACIENTE = "";
var PACIENTE2 = "";
var DOCTOR = "";
var CMP = "";
var DOCTORQF = "";
var CQMP = "";
var TIPO_PRODUCTO = "";
var PRODUCTO = "";
var LIBRO_RECETAS = "";




var dtfechafabricacion = '';
var dtfechavencimiento = '';

var classchecked = $('.check-datos');
var checkmedico = $('#checkmedico');
var checkqf = $('#checkqf');
var checkpaciente = $('#checkpaciente');
var checkcliente = $('#checkcliente');


$(document).ready(function () {
    $('.txteditor').summernote({
        tabsize: 2,
        height: 300,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'italic']],
            ['color', ['color']],
            ['misc', ['print']],
            ['fontname', ['fontname']],
            //['fontsize', ['fontsize']],
            ['para', ['paragraph']],
            ['view', ['codeview']]
        ]
    });
   
});

function fnactualizafab(pcontrol) {

    $("#txtfechavencimiento").val('');

    dtfechafabricacion = pcontrol.value;
    dtfechavencimiento = moment(dtfechafabricacion).add(3, 'months').format('DD/MM/YYYY');

    generarEtiquetaArgox();
}

function fnactualizaven(pcontrol) {
    
    dtfechavencimiento = pcontrol.value;

    generarEtiquetaArgox();
}

function editarEtiqueta(idPedido) {

    var idpedido = idPedido;

    let controller = new EtiquetasController();
    controller.DatosEtiquetas(idpedido, function (data) {
        
        if (data != null) {
            DATAETIQUETA = data.datatable
            var htmlTags;
            var total = 0;
            FORMULAETIQUETA = "";
            DOCTOR = DATAETIQUETA[0].medico;
            CMP = DATAETIQUETA[0].cmp;

            if (DATAETIQUETA[0].paciente.includes('CONSUMIDOR')) {
                PACIENTE = "";
                PACIENTE2 = "";
            }
            else {
                PACIENTE = DATAETIQUETA[0].paciente;
                PACIENTE2 = DATAETIQUETA[0].nombrespaciente + " " + DATAETIQUETA[0].apellido1paciente;
            }
                
            if (PACIENTE.length == 0) {
                PACIENTE = 'CONSUMIDOR';
                PACIENTE2 = 'CONSUMIDOR';
            }
                

            if (DATAETIQUETA[0].clienterazonsocial != "") {
                CLIENTE = DATAETIQUETA[0].clienterazonsocial;
                ELABORADO = "Elab. Farmacias Magistrales Q.F.";
            }
            else {
                CLIENTE = "";
                ELABORADO = DATAETIQUETA[0].direccionsucursal;
            }

            DOCTORQF =DATAETIQUETA[0].medicoqf;
            CQMP = DATAETIQUETA[0].cqfp;
            LIBRO_RECETAS = DATAETIQUETA[0].librorecetas;
            TIPO_PRODUCTO = DATAETIQUETA[0].tipoproducto;

            $('#tbldetallepedidoetiqueta tbody').empty();

            for (var i = 0; i < data?.detalle?.length; i++) {
                htmlTags += '<tr tipo-registro="' + DATAETIQUETA[0].tiporegistro + '" sucu-clie="' + DATAETIQUETA[0].sucu_clie + '">' +
                    '<td class="fila-detalle-codigo">' + data.detalle[i].iddetalle + '</td>' +
                    '<td>' + '<div style="word-wrap: break-word; word-break:break-all"><textarea rows="2" maxlength="85" uso="' + data.detalle[i].uso + '" onKeyUp="this.value=this.value.toUpperCase();" style="width:400px;height:50px" class="txt-formula-etiqueta">' +
                    data.detalle[i].descripcion + '</textarea></div>' + '</td>' +
                    '<td>' + parseFloat(data.detalle[i].precio).toFixed(2) + '</td>' +
                    '<td>' + data.detalle[i].cantidad + '</td>' +
                    '<td>' + parseFloat(data.detalle[i].subtotal).toFixed(2) + '</td>' +
                    '<td><button class="btn-seleccionar-formula-etiqueta btn btn-primary"><i class="fa fa-check"></i></button></td>' +

                    '</tr>';
                total = total + parseFloat(data.detalle[i].subtotal);
            }
            htmlTags += '<tr> <td></td> <td></td><td></td><td>TOTAL:</td><td>' + parseFloat(total).toFixed(2) + '</td></tr>';
            $('#tbldetallepedidoetiqueta tbody').append(htmlTags);
            $('#modalEdicionEtiquetas').modal('show');

            generarEtiquetaArgox();
            //generarEtiquetaKiaro();
        }
    });


}

$('#modalEdicionEtiquetas').on('hidden.bs.modal', function (e) {
    txtreg.val("");
    txtdescripcionproducto.val("");
    txtcomposicionproducto.val("");
    txtcodigoan.val("");
    checkmedico.prop('checked', true);
    checkqf.prop('checked', true);
    checkpaciente.prop('checked', true);
    checkcliente.prop('checked', true);
    $('#txteditor-argox-grande').summernote("code", '');
    $('#txteditor-argox-mediana').summernote("code", '');
    $('#txteditor-argox-pequeña').summernote("code", '');
    $('#txteditor-argox-1950').summernote("code", '');
    $('#txteditor-argox-LineaSkinCare').summernote("code", '');
    $('#txteditor-argox-Barton').summernote("code", '');
    $('#txteditor-kiaro-grande').summernote("code", '');
    $('#txteditor-kiaro-mediana').summernote("code", '');
    $('#txteditor-kiaro-pequeña').summernote("code", '');
});


$(document).on('click', '.btn-seleccionar-formula-etiqueta', function (e) {
    var txtformula = $(this).parents("tr").find(".txt-formula-etiqueta");
    FORMULAETIQUETA = txtformula.val();
    USOFORMULA = cmbuso.val();
    IND = txtindicaciones.val();
    var btnformula = $('.btn-seleccionar-formula-etiqueta');
    btnformula.removeClass("btn-success");
    $(this).addClass("btn-success");
    var detalle = $(this).parents("tr").find(".fila-detalle-codigo").text();
    var tipo = $(this).parents("tr").attr('tipo-registro');
    var sucu_clie = $(this).parents("tr").attr('sucu-clie');

    traerCodigoLibroReceta(detalle, tipo, sucu_clie);
    generarEtiquetaArgox();
    

});

cmbuso.change(function () {
    USOFORMULA = cmbuso.val();
    generarEtiquetaArgox();
});
cmbcomplejo.change(function () {
    generarEtiquetaArgox();

});
txtreg.keyup(function () {
    generarEtiquetaArgox();
    
});
txtcodigoan.keyup(function () {
    generarEtiquetaArgox();

});
txtcomposicionproducto.keyup(function () {
    generarEtiquetaArgox();

});
txtdescripcionproducto.keyup(function () {
    generarEtiquetaArgox();

});
txtindicaciones.keyup(function () {
    generarEtiquetaArgox();
    
});



function imprimirEtiqueta(tipo) {
    var val = tipo;
    const arraydatos= val.split('/');
   
    if (arraydatos[1] == "ARGOX") {
        if (arraydatos[0] == "grande")
        etiqueta = $("#txteditor-argox-grande").summernote("code");
        if (arraydatos[0] == "mediana")
        etiqueta = $("#txteditor-argox-mediana").summernote("code");
        if (arraydatos[0] == "pequeña")
            etiqueta = $("#txteditor-argox-pequeña").summernote("code");
        if (arraydatos[0] == "1950")
            etiqueta = $("#txteditor-argox-1950").summernote("code");
        if (arraydatos[0] == "9050")
            etiqueta = $("#txteditor-argox-LineaSkinCare").summernote("code");
        if (arraydatos[0] == "9050")
            etiqueta = $("#txteditor-argox-Barton").summernote("code");
    }
    if (arraydatos[1] == "TERCERO") {
        if (arraydatos[0] == "grande")
            etiqueta = $("#txteditor-grande-tercero").summernote("code");
        if (arraydatos[0] == "mediana")
            etiqueta = $("#txteditor-mediana-tercero").summernote("code");
        if (arraydatos[0] == "pequeña")
            etiqueta = $("#txteditor-pequeña-tercero").summernote("code");
    }

    var data = DATAETIQUETA[0];

    var ppaciente = PACIENTE;
    var pmedico = DOCTOR;
    var pquimico = DOCTORQF;
    var cliente = CLIENTE;
    var pfechafab = moment(dtfechafabricacion).format("DD/MM/YYYY");
    var pfechaven = moment(dtfechavencimiento).format("DD/MM/YYYY");
    var preg = txtreg.val();
    var pcmp = CMP;
    var pcmpq = CQMP;
    var mcomposicion = FORMULAETIQUETA
    var puso = cmbuso.val();
    var pind = txtindicaciones.val()
    var ptipoprod = TIPO_PRODUCTO;
    var pLR = LIBRO_RECETAS;
    //if (arraydatos[1]=="ARGOX") {
    //    var controller = new EtiquetasController();
    //    controller.ImprimirEtiquetas(arraydatos[1],arraydatos[0], ppaciente, pmedico, pquimico, pfechafab, pfechaven, preg, pcmp, pcmpq, mcomposicion, puso, pind);
    //    mensaje('S', "Impriendo Etiqueta");
    //}
    //if (arraydatos[1]=="TERCERO") {
    //    var controller = new EtiquetasController();
    //    controller.ImprimirEtiquetas(arraydatos[1],arraydatos[0], cliente, pmedico, pquimico, pfechafab, pfechaven, preg, pcmp, pcmpq, mcomposicion, puso, pind);
    //    mensaje('S', "Impriendo Etiqueta");
    //}
    var controller = new EtiquetasController();
    if (arraydatos[0] == "1950") {
        controller.ImprimirEtiquetas_V2(arraydatos[1], arraydatos[0], ptipoprod, pcmpq, pfechafab, pfechaven, puso, mcomposicion, pquimico);
    } else if (arraydatos[0] == "9050") {
        controller.ImprimirEtiquetas_V3(arraydatos[1], arraydatos[0], ppaciente, pquimico, pcmpq, pfechafab, pfechaven, preg);
    }
    else {
        controller.ImprimirEtiquetas(arraydatos[1], arraydatos[0], cliente, ppaciente, pmedico, pquimico, pfechafab, pfechaven, preg, pcmp, pcmpq, mcomposicion, puso, pind);
    }
    mensaje('S', "Impriendo Etiqueta");
}


classchecked.change(function () {

    if (checkmedico.is(':checked')) {
        DOCTOR = DATAETIQUETA[0].medico;
        CMP =DATAETIQUETA[0].cmp;
       
    } else {
        DOCTOR ="";
        CMP = "";
        
    }
    if (checkqf.is(':checked')) {
        DOCTORQF =DATAETIQUETA[0].medicoqf;
        CQMP = DATAETIQUETA[0].cqfp;
       
    } else {
        DOCTORQF ="";
        CQMP = "";
        
    }

    if (checkpaciente.is(':checked')) {
        if (DATAETIQUETA[0].paciente.includes('CONSUMIDOR'))
            PACIENTE = "";
        else
            PACIENTE = DATAETIQUETA[0].paciente;
        if (PACIENTE.length == 0)
            PACIENTE = 'CONSUMIDOR';
        
    } else {
        PACIENTE = "";
    }

    if (checkcliente.is(':checked')) {
        if (DATAETIQUETA[0].clienterazonsocial != "") {
            CLIENTE = DATAETIQUETA[0].clienterazonsocial;
            ELABORADO = "Elab. Farmacias Magistrales Q.F.";
        }
        else {
            CLIENTE = "";
            ELABORADO = DATAETIQUETA[0].direccionsucursal;
        }
      
    } else {
        CLIENTE = "";
        ELABORADO="";
    }
     
    generarEtiquetaArgox();
    
});

function generarEtiquetaArgox() {
    $('#txteditor-argox-grande').summernote("code", crearEtiquetaArgox('grande/ARGOX'));
    $('#txteditor-argox-mediana').summernote("code", crearEtiquetaArgox('mediana/ARGOX'));
    $('#txteditor-argox-pequeña').summernote("code", crearEtiquetaArgox('pequeña/ARGOX'));
    $('#txteditor-argox-1950').summernote("code", crearEtiquetaArgox('1950/ARGOX'));
    $('#txteditor-argox-LineaSkinCare').summernote("code", crearEtiquetaArgox('LineaSkinCare/ARGOX'));
    $('#txteditor-argox-Barton').summernote("code", crearEtiquetaArgox('Barton/ARGOX'));

    $('#txteditor-grande-tercero').summernote("code", crearEtiquetaArgox('grande/TERCERO'));
    $('#txteditor-mediana-tercero').summernote("code", crearEtiquetaArgox('mediana/TERCERO'));
    $('#txteditor-pequeña-tercero').summernote("code", crearEtiquetaArgox('pequeña/TERCERO'));

}
function generarEtiquetaKiaro() {
    $('#txteditor-kiaro-grande').summernote("code", crearEtiquetaKiaro('grande'));
    $('#txteditor-kiaro-mediana').summernote("code", crearEtiquetaKiaro('mediana'));
    $('#txteditor-kiaro-pequeña').summernote("code", crearEtiquetaKiaro('pequeña'));

}

function imprimirEtiquetakiaro(tipo) {
    var etiqueta;

    if (tipo == "grande")
        etiqueta = $("#txteditor-kiaro-grande").summernote("code");
    if (tipo == "mediana")
        etiqueta = $("#txteditor-kiaro-mediana").summernote("code");
    if (tipo == "pequeña")
        etiqueta = $("#txteditor-kiaro-pequeña").summernote("code");

    localStorage.setItem("etiquetakiaro", etiqueta);
    localStorage.setItem("tipoetiquetakiaro", tipo);
    var url = URLIMPRECION + "EtiquetaKiaro.html";
    window.open(url, '_blank');
}


function crearEtiquetaArgox(tipo) {
    var val = tipo;
    const arraydatos = val.split('/');

    var etiqueta = "";
    var etiquetamediana = "";
    var etiquetapequeña = "";
    var etiqueta1950 = "";
    var etiquetaLineaSkinCare = "";
    var etiquetaBarton = "";
   
    var REG = "REG: " + txtreg.val();
    var IND = txtindicaciones.val();

    var CODIGOAN = txtcodigoan.val();
    var COMPLEJO = cmbcomplejo.val();
    var COMPOSICIONPRODUCTO = txtcomposicionproducto.val();
    var DESCRIPCIONPRODUCTO = txtdescripcionproducto.val();
    
    var COMPOSICION = FORMULAETIQUETA;
       

    dtfechafabricacion = $("#txtfechafabricacion").val();
    dtfechavencimiento = $("#txtfechavencimiento").val();

    if (dtfechafabricacion == null || dtfechafabricacion == "")
        dtfechafabricacion = new Date();

    
    if (dtfechavencimiento == null || dtfechavencimiento == "") {
        dtfechavencimiento = dtfechafabricacion;
        dtfechavencimiento = moment(dtfechavencimiento).add(3, 'months');
    } 

    var FF = "F.F.: " + moment(dtfechafabricacion).format("DD/MM/YYYY");

    var FV = "F.V.:" + moment(dtfechavencimiento).format('DD/MM/YYYY');

    var USO = 'USO ' + USOFORMULA;

   

    PACIENTE = PACIENTE.toUpperCase();
    DOCTOR = DOCTOR.toUpperCase();
    DOCTORQF = DOCTORQF.toUpperCase();
    DOCTOR = DOCTOR.toUpperCase();

    var AUXFILA = '';
    if (arraydatos[1] == "ARGOX") {
        if (arraydatos[0] == "grande") {
            var etiqueta = ` <table border="1" id="tabla-etiqueta-argox-grande" class="tabla-etiqueta">
                        <tbody><tr>
                           <td width="45%"></td>
                           <td width="55%">
                             <table width="100%">
                                  <tbody><tr>`;
            if (checkpaciente.prop('checked'))
                etiqueta += ` <td width="80%"> PAC: ` + PACIENTE + `</td> `;
            else
                etiqueta += ` <td width="80%"> </td> `;
            etiqueta += `<td style="width:20%">` + REG + `</td>   </tr>`;

            if (checkmedico.prop('checked')) {
                etiqueta += `<tr> <td width="80%"> DR(A)` + DOCTOR + `</td>
                <td  width="20%"> CMP:`+ CMP + `</td>
            </tr>`;
            } else
                AUXFILA += `<tr>  <td width="80%">&nbsp;</td>
            <td width="20%">&nbsp;</td></tr>`;

            if (checkqf.prop('checked')) {
                etiqueta += `<tr  >
                <td width="80%"> Q.F.:`+ DOCTORQF + `</td>
                <td  width="20%"> CQFP:`+ CQMP + `</td>
            </tr>`;
            } else
                AUXFILA += ` <tr> <td width="80%">&nbsp;</td>
            <td width="20%">&nbsp;</td></tr>`;


            etiqueta += `<tr class="fecha">
                <td id='celdafechas' colspan="2" width="80%">`+ FF + '     ' + FV + `</td></tr>`;
            etiqueta += AUXFILA;

            etiqueta += ` <tr> <td colspan="2" height="40%"><p><br></p><p><br></p><p><br></p></td></tr>
        <tr>`;


            etiqueta += `<tr>
           <td colspan='2' width="100%" style="text-align:center" class="composicion">	`+ COMPOSICION + `</td>
        </tr>
        <tr>
          <td>`+ IND + `</td>
          <td>`+ USO + `</td>
          <td></td>
                </tr></tbody></table>
           </td>
        </tr>
        </tbody></table><table></table>`;
            return etiqueta;
        }
        if (arraydatos[0] == "mediana") {

            etiquetamediana += `<table id="tabla-etiqueta-argox-mediana" border="1">
                         <tbody>
                          <tr><td colspan="2" height="20%">&nbsp;&nbsp;</td> </tr>
                          <tr>
                              <td>            
                                <table width="100%" class="tablecontenido">
                              <tbody>`;
            etiquetamediana += ` <tr>
                   <td colspan="2" class="composicion">`+ COMPOSICION + `</td>
                </tr>`;

            etiquetamediana += `<tr height="40%"><td width="40%"></td><td width="60%" >` + REG + `</td>   </tr>`;

            etiquetamediana += '<tr> <td colspan="2" height="40%"><p><br></p></td></tr>';
            etiquetamediana += '<tr> <td colspan="2" ><p></p></td></tr>';
            if (checkpaciente.prop('checked'))
                etiquetamediana += ` <td colspan="2" > PAC: ` + PACIENTE + `</td></tr> `;
            else
                etiquetamediana += ` <td colspan="2"> </td> </tr>`;

            if (checkmedico.prop('checked')) {
                etiquetamediana += `<tr> <td width="70%" > DR(A):` + DOCTOR + `</td>
                <td  width="30%"> CMP:`+ CMP + `</td>
            </tr>`;
            }
            if (checkqf.prop('checked')) {
                etiquetamediana += `<tr  >
                <td width="70%" >Q.F.:`+ DOCTORQF + `</td>
                <td  width="30%"> CQFP:`+ CQMP + `</td>
            </tr>`;
            }
            etiquetamediana += `<tr>
           <td width="70%" id='cdfechafab'> ` + FF + `</td>
           <td width="30%"></td>
          </tr>      
            <tr>
           <td width="70%" class="fechas" id='cdfechaven'>` + FV + `</td>
           <td width="30%"></td>
          </tr>      
           <tr>
           <td width="70%">` + USO + `</td>
          </tr>
           <tr>
           <td width="70%">` + IND + `</td>
           </tr>
            </tbody></table>
         </td>
      </tr>
</tbody>
</table>`;


            return etiquetamediana;
        }
        if (arraydatos[0] == 'pequeña') {
            var etiquetapequeña = ` <table id="tabla-etiqueta-argox-pequeña" class="tabla-etiqueta" >
                        <tbody><tr>
                           <td width="35%"></td>
                           <td width="65%">
                             <table width="100%" style="margin-top:-5px;margin-bottom:-8px">
                                  <tbody><tr>`;
            if (checkpaciente.prop('checked'))
                etiquetapequeña += ` <td width="80%"> PAC: ` + PACIENTE + `</td> `;
            else
                etiquetapequeña += ` <td width="80%"> </td> `;
            etiquetapequeña += `<td style="width:20%">` + REG + `</td>   </tr>`;

            if (checkmedico.prop('checked')) {
                etiquetapequeña += `<tr> <td width="80%"> DR(A):` + DOCTOR + `</td>
                <td  width="20%"> CMP:`+ CMP + `</td>
            </tr>`;
            } else
                AUXFILA += `<tr>  <td width="80%">&nbsp;</td>
            <td width="20%">&nbsp;</td></tr>`;

            if (checkqf.prop('checked')) {
                etiquetapequeña += `<tr  >
                <td width="80%"> Q.F.:`+ DOCTORQF + `</td>
                <td  width="20%"> CQFP:`+ CQMP + `</td>
            </tr>`;
            } else
                AUXFILA += ` <tr> <td width="80%">&nbsp;</td>
            <td width="20%">&nbsp;</td></tr>`;


            etiquetapequeña += `<tr class="fecha">
                <td id='celdafechas' width="80%">`+ FF + '     ' + FV + `</td></tr>`;
            etiquetapequeña += AUXFILA;

            etiquetapequeña += ` <tr> <td colspan="2" height="40%"><p><br></p><p><br></p></td></tr>
        <tr>`;


            etiquetapequeña += `<tr>
           <td width="80%" style="text-align:center" class="composicion">	`+ COMPOSICION + `</td>
            <td></td>
        </tr>
        <tr>
        <td width="80%" style="text-align:center" class="composicion">	`+ IND + `</td>
        <td class="uso">` + USO + `</td>
        </tr>
        </tbody></table>
           </td>
        </tr>
        </tbody></table><table></table>`;
            return etiquetapequeña;

        }
        if (arraydatos[0] == '1950') {
            var etiqueta1950 = ` <table id="tabla-etiqueta-argox-1950" class="tabla-etiqueta" >
                        <tbody><tr>
                           <td width="35%"></td>
                           <td width="65%">
                             <table width="100%" style="margin-top:-5px;margin-bottom:-8px">
                                  <tbody><tr>`;
            etiqueta1950 += ` <td width="40%"> ` + TIPO_PRODUCTO + `</td> `;
            etiqueta1950 += ` <td width="80%"> </td> `;
            etiqueta1950 += `<td style="width:60%"> L.R. :` + LIBRO_RECETAS + `</td>   </tr>`;
            etiqueta1950 += `<tr  ><td width="80%"> Q.F.:`+ DOCTORQF + `</td></tr>`;
            etiqueta1950 += `<td width="20%">&nbsp;</td></tr>`;

            etiqueta1950 += `<tr class="fecha">
                <td id='celdafechas' width="80%">`+ FF + '     ' + FV + `</td></tr>`;
            etiqueta1950 += AUXFILA;

            etiqueta1950 += ` <tr> <td colspan="2" height="40%"><p><br></p><p><br></p></td></tr>
        <tr>`;


            etiqueta1950 += `<tr>
           <td width="80%" style="text-align:center" class="composicion">	`+ COMPOSICION + `</td>
            <td></td>
        </tr>
        <tr>
        <td width="80%" style="text-align:center" class="composicion">	`+ IND + `</td>
        <td class="uso">` + USO + `</td>
        </tr>
        </tbody></table>
           </td>
        </tr>
        </tbody></table><table></table>`;
            return etiqueta1950;

        }
        if (arraydatos[0] == 'LineaSkinCare') {
            var etiquetaLineaSkinCare = ` <table id="tabla-etiqueta-argox-9050" class="tabla-etiqueta" >
                        <tbody><tr>
                           <td width="30%"></td>
                           <td width="70%">
                             <table width="100%" style="margin-top:-5px;margin-bottom:-8px">
                                  <tbody><tr>`;
            if (checkpaciente.prop('checked'))
                etiquetaLineaSkinCare += ` <td width="100%"> PAC: ` + PACIENTE2 + `</td> `;
            else
                etiquetaLineaSkinCare += ` <td width="100%"> </td> `;

            if (checkqf.prop('checked')) {
                etiquetaLineaSkinCare += `<tr><td width="80%"> Q.F.: ` + DOCTORQF + `</td></tr>`;
            } else
                AUXFILA += `<tr><td width="100%">&nbsp;</td><td width="20%">&nbsp;</td></tr>`;

            etiquetaLineaSkinCare += `<tr><td  width="20%"> CQFP:` + CQMP + `</td></tr>`;
            etiquetaLineaSkinCare += `<tr class="fecha">
                <td id='celdafechas' width="100%">`+ FF + '     ' + FV + `</td></tr>`;
            etiquetaLineaSkinCare += AUXFILA;
            etiquetaLineaSkinCare += `<tr><td  width="100%"> ` + REG + `</td></tr>`;

            etiquetaLineaSkinCare += `</tbody></table></td></tr></tbody></table><table></table>`;
            return etiquetaLineaSkinCare;

        }
        if (arraydatos[0] == 'Barton') {
            var etiquetaBarton = ` <table id="tabla-etiqueta-argox-9050" class="tabla-etiqueta" >
                        <tbody><tr>
                           <td width="30%"></td>
                           <td width="70%">
                             <table width="100%" style="margin-top:-5px;margin-bottom:-8px">
                                  <tbody><tr>`;
            etiquetaBarton += `<tr><td  width="100%"> CodigoAN:` + CODIGOAN + `</td></tr>`;
            etiquetaBarton += `<tr><td  width="100%"> Complejo:` + COMPLEJO + `</td></tr>`;
            etiquetaBarton += `<tr><td  width="100%"> Composición:` + COMPOSICIONPRODUCTO + `</td></tr>`;
            etiquetaBarton += `<tr><td  width="100%"> Descripción:` + DESCRIPCIONPRODUCTO + `</td></tr>`;
            etiquetaBarton += `<tr><td  width="100%"> Q.F:` + DOCTORQF + `</td></tr>`;
            etiquetaBarton += `<tr><td  width="100%"> Tipo Uso:` + USOFORMULA + `</td></tr>`;
            etiquetaBarton += `<tr><td  width="100%"> Reg:` + txtreg.val() + `</td></tr>`;
            etiquetaBarton += `<tr class="fecha">
                <td id='celdafechas' width="100%">`+ FF + '     ' + FV + `</td></tr>`;

            etiquetaBarton += `</tbody></table></td></tr></tbody></table><table></table>`;
            return etiquetaBarton;

        }
    }
    if (arraydatos[1] == "TERCERO") {
        if (arraydatos[0] == "grande") {
            var etiqueta = ` <table border="1" id="tabla-etiqueta-argox-grande" class="tabla-etiqueta">
                        <tbody><tr>
                           <td width="45%"></td>
                           <td width="55%">
                             <table width="100%">
                                  <tbody><tr>`;
            if (checkpaciente.prop('checked'))
                etiqueta += ` <td width="80%"> PAC: ` + PACIENTE + `</td> `;
            else
                etiqueta += ` <td width="80%"> </td> `;
            etiqueta += `<td style="width:20%">` + REG + `</td>   </tr>`;

            if (checkmedico.prop('checked')) {
                etiqueta += `<tr> <td width="80%"> DR(A)` + DOCTOR + `</td>
                <td  width="20%"> CMP:`+ CMP + `</td>
            </tr>`;
            } else
                AUXFILA += `<tr>  <td width="80%">&nbsp;</td>
            <td width="20%">&nbsp;</td></tr>`;

            if (checkqf.prop('checked')) {
                etiqueta += `<tr  >
                <td width="80%"> Q.F.:`+ DOCTORQF + `</td>
                <td  width="20%"> CQFP:`+ CQMP + `</td>
            </tr>`;
            } else
                AUXFILA += ` <tr> <td width="80%">&nbsp;</td>
            <td width="20%">&nbsp;</td></tr>`;


            etiqueta += `<tr class="fecha">
                <td id='celdafechas' colspan="2" width="80%">`+ FF + '     ' + FV + `</td></tr>`;
            etiqueta += AUXFILA;
            etiqueta += `<tr>
                <td width="80%"> ELABORADO POR: CORPORACION QF</td></tr>
                <tr><td  width="80%"> PARA: `+ CLIENTE + `</td>
            </tr>`;
            etiqueta += ` <tr> <td colspan="2" height="40%"><p><br></p><p><br></p><p><br></p></td></tr>
        <tr>`;


            etiqueta += `<tr>
           <td colspan='2' width="100%" style="text-align:center" class="composicion">	`+ COMPOSICION + `</td>
        </tr>
        <tr>
          <td>`+ IND + `</td>
          <td>`+ USO + `</td>
          <td></td>
                </tr></tbody></table>
           </td>
        </tr>
        </tbody></table><table></table>`;
            return etiqueta;
        }
        if (arraydatos[0] == "mediana") {

            etiquetamediana += `<table id="tabla-etiqueta-argox-mediana" border="1">
                         <tbody>
                          <tr><td colspan="2" height="20%">&nbsp;&nbsp;</td> </tr>
                          <tr>
                              <td>            
                                <table width="100%" class="tablecontenido">
                              <tbody>`;
            etiquetamediana += ` <tr>
                   <td colspan="2" class="composicion">`+ COMPOSICION + `</td>
                </tr>`;

            etiquetamediana += `<tr height="40%"><td width="40%"></td><td width="60%" >` + REG + `</td>   </tr>`;

            etiquetamediana += '<tr> <td colspan="2" height="40%"><p><br></p></td></tr>';
            etiquetamediana += '<tr> <td colspan="2" ><p></p></td></tr>';
            if (checkpaciente.prop('checked'))
                etiquetamediana += ` <td colspan="2" > PAC: ` + PACIENTE + `</td></tr> `;
            else
                etiquetamediana += ` <td colspan="2"> </td> </tr>`;

            if (checkmedico.prop('checked')) {
                etiquetamediana += `<tr> <td width="70%" > DR(A):` + DOCTOR + `</td>
                <td  width="30%"> CMP:`+ CMP + `</td>
            </tr>`;
            }
            if (checkqf.prop('checked')) {
                etiquetamediana += `<tr  >
                <td width="70%" >Q.F.:`+ DOCTORQF + `</td>
                <td  width="30%"> CQFP:`+ CQMP + `</td>
            </tr>`;
            }
            etiquetamediana += `<tr>
           <td width="70%" id='cdfechafab'> ` + FF + `</td>
           <td width="30%"></td>
          </tr>      
            <tr>
           <td width="70%" class="fechas" id='cdfechaven'>` + FV + `</td>
           <td width="30%"></td>
          </tr>      
           <tr>
           <td width="70%">` + USO + `</td>
          </tr>
           <tr>
           <td width="70%">` + IND + `</td>
           </tr>
            </tbody></table>
         </td>
      </tr>
</tbody>
</table>`;


            return etiquetamediana;
        }
        if (arraydatos[0] == 'pequeña') {
            var etiquetapequeña = ` <table id="tabla-etiqueta-argox-pequeña" class="tabla-etiqueta" >
                        <tbody><tr>
                           <td width="35%"></td>
                           <td width="65%">
                             <table width="100%" style="margin-top:-5px;margin-bottom:-8px">
                                  <tbody><tr>`;
            if (checkpaciente.prop('checked'))
                etiquetapequeña += ` <td width="80%"> PAC: ` + PACIENTE + `</td> `;
            else
                etiquetapequeña += ` <td width="80%"> </td> `;
            etiquetapequeña += `<td style="width:20%">` + REG + `</td>   </tr>`;

            if (checkmedico.prop('checked')) {
                etiquetapequeña += `<tr> <td width="80%"> DR(A):` + DOCTOR + `</td>
                <td  width="20%"> CMP:`+ CMP + `</td>
            </tr>`;
            } else
                AUXFILA += `<tr>  <td width="80%">&nbsp;</td>
            <td width="20%">&nbsp;</td></tr>`;

            if (checkqf.prop('checked')) {
                etiquetapequeña += `<tr  >
                <td width="80%"> Q.F.:`+ DOCTORQF + `</td>
                <td  width="20%"> CQFP:`+ CQMP + `</td>
            </tr>`;
            } else
                AUXFILA += ` <tr> <td width="80%">&nbsp;</td>
            <td width="20%">&nbsp;</td></tr>`;


            etiquetapequeña += `<tr class="fecha">
                <td id='celdafechas' width="80%">`+ FF + '     ' + FV + `</td></tr>`;
            etiquetapequeña += AUXFILA;

            etiquetapequeña += ` <tr> <td colspan="2" height="40%"><p><br></p><p><br></p></td></tr>
        <tr>`;


            etiquetapequeña += `<tr>
           <td width="80%" style="text-align:center" class="composicion">	`+ COMPOSICION + `</td>
            <td></td>
        </tr>
        <tr>
        <td width="80%" style="text-align:center" class="composicion">	`+ IND + `</td>
        <td class="uso">` + USO + `</td>
        </tr>
        </tbody></table>
           </td>
        </tr>
        </tbody></table><table></table>`;
            return etiquetapequeña;

        }
    }
}

function getimagen(img) {
    if (img.length < 10)
        return '<p><img class="logo-etiqueta" src="data:image/png;base64,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" data-filename="logo.png" ></p>';
    else
        return '<p><img class="logo-etiqueta" src="/imagenes/clientes/' + img + '" data-filename="logo.png" ></p>';
}

function traeridlibroreceta() {

}


function traerCodigoLibroReceta(detalle, tipo, sucu_clie) {
    var controller = new LibroRecetasController();
  
    controller.codigoLibroRecetas(tipo, sucu_clie, detalle, function (data) {
       // console.log('', data);
        if (data.mensaje == "ok")
            txtreg.val(data.objeto.codigo);
        else if (data.mensaje == "0")
            txtreg.val("");
        else
            mensaje('W', data.mensaje);
        generarEtiquetaArgox();
       
    });
}

var tipoEtiqueta = "";
function darValortipoEtiqueta(value) {
    tipoEtiqueta = value;
}

function imprimirEtiqueta_V2() {
    var val = tipoEtiqueta;
    etiqueta = $("#txteditor-argox-LineaSkinCare").summernote("code");

    var ppaciente = "";
    if (checkpaciente.prop('checked')) {
        ppaciente = PACIENTE2
    }
    
    var pquimicoSplit = DOCTORQF.split(" ");
    var pquimico = pquimicoSplit[0] + " " +pquimicoSplit[1];

    var BTfechafab = moment(dtfechafabricacion).format("DD/MM/YYYY");
    var BTfechaven = moment(dtfechavencimiento).format("DD/MM/YYYY");

    var BTfechafabSplit = BTfechafab.split("/");
    var pfechafab = BTfechafabSplit[1] + "/" + BTfechafabSplit[2];
    var BTfechaVenSplit = BTfechaven.split("/");
    var pfechaven = BTfechaVenSplit[1] + "/" + BTfechaVenSplit[2];

    var preg = txtreg.val();
    var pcmpq = CQMP;
    var controller = new EtiquetasController();
    controller.ImprimirEtiquetas_V3(val, ppaciente, pquimico, pcmpq, pfechafab, pfechaven, preg);
    mensaje('S', "Impriendo Etiqueta");
}

function imprimirEtiqueta_V3() {
    var val = tipoEtiqueta;
    etiqueta = $("#txteditor-argox-Barton").summernote("code");

    var btcodigoAN = txtcodigoan.val();
    var btcomplejo = cmbcomplejo.val();
    var BTnombrecomposicion = txtcomposicionproducto.val();
    var BTdescripcionproducto = txtdescripcionproducto.val();
    var BTtipouso = "Uso " + cmbuso.val().toLowerCase();
    var BTreg = txtreg.val();
    var BTquimicofarmaceutico = DOCTORQF;
    var BTfechafab = moment(dtfechafabricacion).format("DD/MM/YYYY");
    var BTfechaven = moment(dtfechavencimiento).format("DD/MM/YYYY");

    var BTfechafabSplit = BTfechafab.split("/");
    var BTMesAnioFechaFab = BTfechafabSplit[1] + "/" + BTfechafabSplit[2];
    var BTfechaVenSplit = BTfechaven.split("/");
    var BTMesAnioFechaVen = BTfechaVenSplit[1] + "/" + BTfechaVenSplit[2];

    var controller = new EtiquetasController();
    controller.ImprimirEtiquetas_V4(val, btcodigoAN, btcomplejo, BTnombrecomposicion, BTdescripcionproducto, BTtipouso, BTquimicofarmaceutico, BTreg, BTMesAnioFechaFab, BTMesAnioFechaVen);
    mensaje('S', "Impriendo Etiqueta");
}
