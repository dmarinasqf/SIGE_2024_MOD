
var txtoperacion = $('#txtoperacion');
var txtidproducto = $('#txtidproducto');
var txtidinsumo = $('#txtidinsumo');
var cmbtipoproducto = $('#cmbtipoproducto');
var txtcodigo = $('#txtcodigo');
var txtcodigobarra = $('#txtcodigobarra');
var txtnombre = $('#txtnombre');
var txtnombreabre = $('#txtnombreabre');
var txtcodintuictive = $('#txtcodintuictive');
var txtcodigoCAS = $('#txtcodigoCAS');
var cmbclase = $('#cmbclase');
var cmbsubclase = $('#cmbsubclase');
var cmbuma = $('#cmbuma');
var cmbumc = $('#cmbumc');
var cmbpresentacion = $('#cmbpresentacion');
var cmbequivalencia = $('#cmbequivalencia');
var txtcodigodigemid = $('#txtcodigodigemid');
//var txtcodigodigemidgenerico = $('#txtcodigodigemidgenerico');
var txtvvf = $('#txtvvf'); //precio compra sin igv
var txtpvf = $('#txtpvf'); //precio compra con igv
var txtporcentajeigv = $('#txtporcentajeigv');
var txtigv = $('#txtigv');
var txtporcentajeganancia = $('#txtporcentajeganancia');
var txtpvfp = $('#txtpvfp'); //precio de venta final
var txtprecioxfraccion = document.getElementById('txtprecioxfraccion');
//var txtprecioxblister = document.getElementById('txtprecioxblister');
var cmbtipotributo = document.getElementById('cmbtipotributo');
var txtingfarmaceutivoactivo = document.getElementById('txtingfarmaceutivoactivo');
var txtconcentracion = document.getElementById('txtconcentracion');
var cmbformafarma = document.getElementById('cmbformafarma');
var cmbtemperatura = document.getElementById('cmbtemperatura');
//variables adicionales para producto terminado
var cmblaboratorio = document.getElementById('cmblaboratorio');
var txtmultiplo = document.getElementById('txtmultiplo');
//var txtmultiploblister = document.getElementById('txtmultiploblister');
var checkmventas = document.getElementById('checkmventas');
var checklote = document.getElementById('checklote');
var checkfvence = document.getElementById('checkfvence');
var checkrsanitario = document.getElementById('checkrsanitario');
var checkpreceta = document.getElementById('checkpreceta');
//var checkvsblister = document.getElementById('checkvsblister');
var checkproteccionluz = document.getElementById('checkproteccionluz');
var checkproteccionhumedad = document.getElementById('checkproteccionhumedad');
var checkescovid = document.getElementById('checkescovid');
var checkesesencial = document.getElementById('checkesesencial');
var checkisgenerico = document.getElementById('checkisgenerico');
var checkiscontrolado = document.getElementById('checkiscontrolado');
var checktodosdatosadic = document.getElementById('checktodosdatosadic');

var checkisinmediato = document.getElementById('checkisinmediato');//EARTCOD1016
var checkisinmediatomediato = document.getElementById('checkisinmediatomediato');//EARTCOD1016


var txtunidades = document.getElementById('txtunidades');
//buttons
var btnlistarproductos = $('#btnlistarproductos');
var btn_editarproductos = $('#btn_editarproductos');
var btn_detallegenerico = $('#btn_detallegenerico');
var btnguardar = $('#btn-guardar');
var btnnuevo = $('#btnnuevo');
var btneditar = document.getElementById('btneditar');


//containes
var cardprincipal = document.getElementById('cardprincipal');

var idproducto = 0;
var _IDPRODUCTO;


$(document).ready(function () {
    init();
    txtporcentajeganancia.removeAttr("min");
    txtporcentajeganancia.removeAttr("max");
});
function init() {
    if (MODELO.idproducto != 0) {
        cardprincipal.classList.add('deshabilitartodo');
        txtidproducto.val(MODELO.idproducto);
        _IDPRODUCTO = MODELO.idproducto;
        cmbtipoproducto.prop('disabled', true);
        buscarProducto(MODELO.idproducto);


    } else {
        btn_detallegenerico.prop('style', 'display:none');
        btn_editarproductos.prop('style', 'display:none');
        btneditar.classList.add('ocultar');
    }
    fnactivartabs();

    $('#txtnombre').blur(function () {
        let pcodigoprod = $('#txtcodigo').val();
        let pnombre = $('#txtnombre').val();
        if (pcodigoprod == "" && pnombre != "") {
            validarProducto($('#txtnombre'));
        }
    });
    $('#txtcodigobarra').blur(function () {
        let pcodigoprod = $('#txtcodigo').val();
        let pbarra = $('#txtcodigobarra').val();
        if (pcodigoprod == "" && pbarra != "") {
            validarProducto($('#txtcodigobarra'));
        }
    });
}

$(window).on('load', function () {

    if (window.opener) {
        _fnocultarbarra();
    } else {

    }

});

function validarProducto(pcontrol) {
    var url = ORIGEN + "/Almacen/AProducto/ObtenerProductos";
    var obj = {
        filtro: pcontrol.val().trim(),
        estado: "HABILITADO",
        top: 10
    };
    $.post(url, obj).done(function (data) {
        data = JSON.parse(data);
        if (data.length > 0) {
            mensaje("I", "EL NOMBRE DEL PRODUCTO YA EXISTE \nCANTIDAD DE PRODUCTOS: " + data.length);
            pcontrol.focus();
            pcontrol.css("background-color", "#f2f7c8");
        } else {
            pcontrol.css("background-color", "#ffffff");
        }
        let pmensaje = "";
        for (var i = 0; i < data.length; i++) {
            mensaje("I", "CODIGO: " + data[i].CODIGO);
        }

    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });
}

$('#form-registro').submit(function (e)
{
    e.preventDefault();

    var codigoBarra = txtcodigobarra.val();
    var urlCheck = ORIGEN + "/Almacen/AProducto/SP_ListarDatos";

    // Usando POST para validar el código de barras
    $.post(urlCheck, { idcodigobarra: codigoBarra }).done(function (data) {
        //if (data.existe) {
            //mensaje("W", 'Ya existe un producto con ese codigo de barra');
            //return; // Detiene el proceso
        //}

        // Si el código de barras no existe, continúa con el envío
        var url = ORIGEN + "/Almacen/AProducto/RegistrarEditar";
        var obj = $('#form-registro').serializeArray();
        obj[obj.length] = { name: 'idtipoproducto', value: cmbtipoproducto.val() };

        btnguardar.disabled = true;

        $.post(url, obj).done(function (response) {
            if (response.mensaje === "ok") {
                mensaje('S', 'Datos guardados');
                txtidproducto.val(response.objeto.idproducto);
                _IDPRODUCTO = response.objeto.idproducto;
                txtcodigo.val(response.objeto.codigoproducto);
                fnactivartabs();
            } else {
                mensaje('W', response.mensaje);
            }
        }).fail(function (error) {
            console.log(error);
            mensaje("D", "Error en el servidor");
        });
    });
});










txtcodigobarra.keyup(function () {
    generateBarcode(txtcodigobarra.val());
    //jquery('#barcodeTarget').qrcode("this plugin is great");   
});
$('#cmbclase').change(function () {
    listarSubclase($('#cmbclase').val(), '');
});
$('#cmbuma').change(function () {
    if (cmbuma.val() !== "" && cmbumc.val() !== "") {
        listarEquivalencias(cmbuma.val(), cmbumc.val(), '');
    }
});
$('#cmbumc').change(function () {
    if (cmbuma.val() !== "" && cmbumc.val() !== "") {
        listarEquivalencias(cmbuma.val(), cmbumc.val(), '');
    }
});
cmbtipotributo.addEventListener('change', function () {
    if (cmbtipotributo.value != '1000') {
        txtporcentajeigv.val(0);
    } else {
        txtporcentajeigv.val(18);
        calcularIGV(18);
    }
});
cmbtipoproducto.change(function () {
    mostrarFormulario(cmbtipoproducto.val());
});
checkrsanitario.click(function () {
    if (this.checked)
        this.value = true;
    else
        this.value = false;
})
$('input[type=checkbox]').click(function () {
    if (this.checked)
        this.value = true;
    else
        this.value = false;
});
btneditar.addEventListener('click', function () {
    if (cardprincipal.classList.contains('deshabilitartodo'))
        cardprincipal.classList.remove('deshabilitartodo');
    else
        cardprincipal.classList.add('deshabilitartodo');


});
//EVENTOS DE TECLADO
txtporcentajeigv.keyup(function () {
    calcularIGV(txtporcentajeigv.val());
    calcularMontoGanancia(txtporcentajeganancia.val());

});
txtvvf.keyup(function () {
    calcularIGV(txtporcentajeigv.val());
    calcularMontoGanancia(txtporcentajeganancia.val());
});
txtpvf.keyup(function () {
    calcularpreciocompra(txtporcentajeganancia.val());

});
txtporcentajeganancia.keyup(function () {
    calcularMontoGanancia(txtporcentajeganancia.val());
});
//calcula el porcentaje de ganancia
txtpvfp.keyup(function () {
    //calcularpreciocompra(txtpvfp.val());
    calcularPorcentajeGanancia(txtpvfp.val());
});
btnnuevo.click(function () {
    location.href = ORIGEN + '/Almacen/AProducto/RegistrarEditar';
});
checktodosdatosadic.addEventListener('click', function () {
    if (this.checked) {
        checkmventas.val(true);
        checklote.val(true);
        checkfvence.val(true);
        checkrsanitario.val(true);
        checkpreceta.val(true);
        checkproteccionluz.val(true);
        checkisgenerico.value = (true);
        checkproteccionhumedad.val(true);
        checkmventas.prop('checked', true);
        checklote.prop('checked', true);
        checkfvence.prop('checked', true);
        checkrsanitario.prop('checked', true);
        checkpreceta.prop('checked', true);
        checkproteccionluz.prop('checked', true);
        checkproteccionhumedad.prop('checked', true);
        checkisgenerico.checked = true;
        checkiscontrolado.prop('checked', true);
        checkiscontrolado.checked = true;
    }
    else {
        checkmventas.val(false);
        checklote.val(false);
        checkfvence.val(false);
        checkrsanitario.val(false);
        checkpreceta.val(false);
        checkproteccionluz.val(false);
        checkproteccionhumedad.val(false);
        checkisgenerico.value = (false);
        checkiscontrolado.value = (false);
        checkmventas.prop('checked', false);
        checklote.prop('checked', false);
        checkfvence.prop('checked', false);
        checkrsanitario.prop('checked', false);
        checkpreceta.prop('checked', false);
        checkproteccionluz.prop('checked', false);
        checkproteccionhumedad.prop('checked', false);
        checkisgenerico.checked = false;
        checkiscontrolado.checked = false;
    }

});

//EARTCOD1016
checkisinmediato.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        $("#checkisinmediatomediato").prop("checked", false);
        $("#idproductoenvase").val("1");
    } else {
        $("#idproductoenvase").val(null);
    }
});
checkisinmediatomediato.addEventListener('change', (event) => {
    if (event.currentTarget.checked) {
        $("#checkisinmediato").prop("checked", false);
        $("#idproductoenvase").val("2");
    } else {
        $("#idproductoenvase").val(null);
    }
});
///EARTCOD1016

function deshab() {
    var ele;
    var frm = document.forms['form-registro'];
    for (var i = 0; ele = frm.elements[i]; i++)
        ele.disabled = true;
}

function mostrarFormulario(tipoproducto) {
    cmbtipoproducto.val(tipoproducto);
    var tipo = 'REGISTRO';
    if (MODELO.idproducto != 0)
        tipo = 'EDICIÓN';
    //DESACTIVAR
    document.getElementById('div_umc').style.display = 'none';
    document.getElementById('div_equivalencia').style.display = 'none';


    document.getElementById('div_laboratorio').style.display = 'none';
    document.getElementById('div_multiplo').style.display = 'none';
    //document.getElementById('div_multiploblister').style.display = 'none';

    document.getElementById("txttiporegistro").innerHTML = tipo + " DE " + $('#cmbtipoproducto option:selected').text() + " " + txtnombre.val();
    if (tipoproducto === "PT") {
        //ACTIVAR
        document.getElementById('div_laboratorio').style.display = 'inline';
        document.getElementById('div_multiplo').style.display = 'inline';
        //document.getElementById('div_multiploblister').style.display = 'inline';
        document.getElementById('divdigemid').classList.remove('ocultar');

    } else if (tipoproducto === "IM") {
        document.getElementById("txttiporegistro").innerHTML = tipo + " DE INSUMO" + txtnombre.val();
        //ACTIVAR
        document.getElementById('div_umc').style.display = 'inline';
        document.getElementById('div_equivalencia').style.display = 'inline';
        //document.getElementById('div_laboratorio').style.display = 'inline'; Cambiar según el correo de Joana.
    } else if (tipoproducto == 'FM') {
        document.getElementById('div_laboratorio').style.display = 'inline';
    }
    //CAMBIOS SEMANA1
    if (tipoproducto == 'EC') {
        document.getElementById('div_laboratorio').style.display = 'inline';

        document.getElementById('div_temperatura').style.display = 'none';
        document.getElementById('div_farmaceutica').style.display = 'none';    
    }
}

function mostrarDatosEditar(tipoproducto) {
    cmbtipoproducto.val(tipoproducto);
    mostrarFormulario(tipoproducto);
}

function desactivarBotones() {
    btnguardar.prop("disabled", true);
    btnnuevo.prop("disabled", true);
    document.getElementById('previous2').style.display = 'none';

}

function activarBotones() {
    btnguardar.prop("disabled", false);
    btnnuevo.prop("disabled", false);
    document.getElementById('previous2').style.display = 'inline';
}

function buscarProducto(id) {

    var url = ORIGEN + "/Almacen/AProducto/buscarProducto";
    var obj = { id: id };

    $.post(url, obj).done(function (data) {
        console.log(data);
        if (data !== null) {
            $('#btnNuevo').click();
            mostrarDatosEditar(data.idtipoproducto);
            listarEquivalencias(data.uma, data.umc, data.idequivalencia);
            listarSubclase(data.idclase, data.idsubclase);
            //txtidproducto.val(data.idproducto);
            //txtcodigo.val(data.codigoproducto);
            txtcodigobarra.val(data.codigobarra);
            generateBarcode(data.codigobarra);
            //txtunidades.val(data.STK_MIN_ESE)
            //txtnombre.val(data.nombre);
            //txtnombreabre.val(data.nombreabreviado);
            //cmbclase.val(data.idclase);
            //cmbpresentacion.val(data.idpresentacion);
            //cmbuma.val(data.uma);
            //cmbumc.val(data.umc);
            //txtcodigodigemid.val(data.codigodigemid);          
            //txtvvf.val(data.vvf);
            //txtprecioxfraccion.value = (data.precioxfraccion);
            //txtprecioxblister.value = (data.precioxblister);
            //cmbtipotributo.value = (data.idtipotributo);
            //txtporcentajeigv.val(data.porcentajeigv);
            //txtigv.val(data.igv);
            //txtpvf.val(data.pvf);
            //txtpvfp.val(data.pvfp);
            //txtporcentajeganancia.val(data.porcentajeganancia);
            //cmbtemperatura.val(data.idtemperatura);
            //cmblaboratorio.val(data.idlaboratorio);
            //txtmultiplo.val(data.multiplo);
            //txtmultiploblister.val(data.multiploblister);
            //DATOS ADICIONALES
            checkproteccionluz.setAttribute("value", data.proteccionluz);
            checkproteccionluz.checked = data.proteccionluz;
            //checkproteccionluz.val(data.proteccionluz);

            checkproteccionhumedad.setAttribute("value", data.proteccionhumedad);
            checkproteccionhumedad.checked = data.proteccionhumedad;
            //checkproteccionhumedad.val(data.proteccionhumedad);

            checkmventas.setAttribute("value", data.mostrarventas);
            checkmventas.checked = data.mostrarventas;
            //checkmventas.val(data.mostrarventas);

            checklote.setAttribute("value", data.aceptalote);
            checklote.checked = data.aceptalote;
            //checklote.val(data.aceptalote);

            checkfvence.setAttribute("value", data.aceptafechavence);
            checkfvence.checked = data.aceptafechavence;
            //checkfvence.val(data.aceptafechavence);

            checkpreceta.setAttribute("value", data.pedirreceta);
            checkpreceta.checked = data.pedirreceta;
            //checkpreceta.val(data.pedirreceta);

            checkesesencial.setAttribute("value", data.isesencial);
            checkesesencial.checked = data.isesencial;
            if (data.isesencial) {
                txtunidades.removeAttribute("disabled");
            } else {
                txtunidades.setAttribute("disabled", "");
            }
            //checkesesencial.prop('checked', data.isesencial);
            //checkesesencial.value = (data.isesencial);

            checkisgenerico.setAttribute("value", data.isgenerico);
            checkisgenerico.checked = data.isgenerico;
            //checkisgenerico.value = (data.isgenerico);

            checkiscontrolado.setAttribute("value", data.iscontrolado);
            checkiscontrolado.checked = data.iscontrolado;
            //checkiscontrolado.value = (data.iscontrolado);
            //??false

            //checkvsblister.prop('checked', data.venderblister);
            //checkvsblister.val( data.venderblister);

            checkrsanitario.setAttribute("value", data.aceptaregsanitario);
            checkrsanitario.checked = data.aceptaregsanitario;
            //checkrsanitario.val(data.aceptaregsanitario);

            checkescovid.setAttribute("value", data.iscovid);
            checkescovid.checked = data.iscovid;
            //checkescovid.val(data.iscovid);

            //EARTCOD1016
            if (data.idproductoenvase == '1') {
                checkisinmediato.checked = true;
            } else if (data.idproductoenvase == '2') {
                checkisinmediatomediato.checked = true;
            }
            ///EARTCOD1016

        } else {
            mensaje("I", 'NO INFO');
        }

    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });

}
//funciones de calculo
function calcularIGV(porcentaje) {
    var igv = (parseFloat(porcentaje) / 100) * parseFloat(txtvvf.val());
    txtigv.val(igv.toFixed(2));
    var pvf = parseFloat(txtvvf.val()) + igv;
    txtpvf.val(pvf.toFixed(2));

    //if (isNaN(txtpvf.val())) {
    //    txtpvf.val(0);    
    //    txtigv.val(0);
    //    txtpvfp.val(0);
    //}
}

function calcularpreciocompra(porcentaje) {
    var igv = 0;
    if (porcentaje === "") porcentaje = 0;
    if (txtporcentajeigv.val() == "")
        igv = 0;
    else
        igv = (parseFloat(txtporcentajeigv.val()) / 100);
    var compra = (parseFloat(txtpvf.val()) / (1 + igv));
    txtvvf.val(compra.toFixed(2));
    var pigv = igv * parseFloat(compra);
    txtigv.val(pigv.toFixed(2));
    var ganancia = parseFloat(parseFloat(porcentaje) / 100);
    var precioventa = parseFloat(txtvvf.val()) * (1 + ganancia);
    var pvpf = parseFloat(precioventa * (1.18));
    txtpvfp.val(pvpf.toFixed(2));

    //fncalcularprecioporunidad();
}

function calcularMontoGanancia(porcentaje) {

    var igv = 0;
    if (porcentaje === "") porcentaje = 0;
    if (txtporcentajeigv.val() === "")
        igv = 0;
    else
        igv = (parseFloat(txtporcentajeigv.val()) / 100);
    var compraigv = (parseFloat(txtvvf.val()) * (1 + igv));
    txtpvf.val(compraigv.toFixed(2));

    var ganancia = parseFloat(parseFloat(porcentaje) / 100);
    var precioventa = parseFloat(txtvvf.val()) * (1 + ganancia);
    var pvpf = parseFloat(precioventa * (1 + igv));
    txtpvfp.val(pvpf.toFixed(2));

    //var ganancia = (parseFloat(porcentaje) / 100) * parseFloat(txtvvf.val());
    //var precioventa = parseFloat(txtvvf.val()) + parseFloat(ganancia) + parseFloat(txtigv.val());
    //txtpvfp.val(precioventa.toFixed(2));
}

function calcularPorcentajeGanancia(monto) {
    
    var compra = parseFloat(txtpvf.val());
    var porcentaje = (((parseFloat(monto) - compra) / (compra/100)));
    txtporcentajeganancia.val(porcentaje.toFixed(2));
}

function listarSubclase(dato, select) {
    var url = ORIGEN + "/Almacen/ASubClase/listarSubclase";
    var obj = { id: dato };
    $.post(url, obj).done(function (data) {
        $('#cmbsubclase option').remove();
        $('#cmbsubclase').append('<option value="">- SELECCIONE -</option>');
        $(data).each(function (i, e) {
            descripcion = [e.descripcion];
            codigo = [e.idsubclase];
            if (codigo == select)
                $('#cmbsubclase').append('<option value="' + codigo + '" selected>' + descripcion + '</option>');
            else
                $('#cmbsubclase').append('<option value="' + codigo + '">' + descripcion + '</option>');
        });
    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });
}

function listarEquivalencias(uma, umc, select) {
    if (cmbtipoproducto.val() === "INSUMO") {
        var url = ORIGEN + "/Almacen/AEquivalencia/getEquivalencias";
        var obj = {
            uma: uma,
            umc: umc
        };
        $.post(url, obj).done(function (data) {
            console.log(data);
            if (data !== null) {
                $('#cmbequivalencia option').remove();
                $('#cmbequivalencia').append('<option value="">- SELECCIONE -</option>');
                if (data.length === 0) { mensaje("I", "No existe equivalencias, para esas unidades de medida, contactese con el administrador para agregar equivalencias."); }
                $(data).each(function (i, e) {
                    descripcion = [e.unidadmedidai + ' => ' + e.unidadmedidaf + ' = ' + e.equivalencia];
                    codigo = [e.idequivalencia];
                    if (codigo == select)
                        $('#cmbequivalencia').append('<option value="' + codigo + '" selected>' + descripcion + '</option>');
                    else
                        $('#cmbequivalencia').append('<option value="' + codigo + '">' + descripcion + '</option>');
                });
            }
        }).fail(function (data) {
            console.log(data);
            mensaje("D", 'Error en el servidor');
        });
    }

}

function limpiar() {
    $('#form-registro').trigger('reset');
    txtoperacion.val("nuevo");
    txtidproducto.val("");
    txtidinsumo.val("");
    txtcodigo.val("");
    txtcodigobarra.val("");
    txtnombre.val("");
    txtnombreabre.val("");
    txtcodintuictive.val("");
    txtcodintuictive.val("");
    cmbclase.val("");
    cmbsubclase.val("");
    cmbuma.val("");
    cmbumc.val("");
    cmbequivalencia.val("");
    checkproteccionluz.val("");
    checkproteccionhumedad.val("");
    cmbtipoproducto.val("");
    txtvvf.val(0);
    txtporcentajeigv.val(18);
    txtigv.val(0);
    txtpvf.val("");
    cmbpresentacion.val("");
    txtpvfp.val(18);
    txtporcentajeganancia.val(30);
    cmbtemperatura.val("");
    
    //limpiar combobox
    $('#cmbsubclase option').remove();
    $('#cmbsubclase').append('<option value="">- SELECCIONE -</option>');

    $('#cmbequivalencia option').remove();
    $('#cmbequivalencia').append('<option value="">- SELECCIONE -</option>');
}

function generateBarcode(codigo) {
    if (codigo === null || codigo == undefined)
        codigo = "";
    var value = codigo;

    var settings = {
        output: "css",
        bgColor: "#FFFFFF",
        color: "#000000",
        barWidth: "1",
        barHeight: "30",
        moduleSize: "5",
        addQuietZone: "1"
    };
    $("#barcodeTarget").html("").show().barcode(value, "code128", settings);
    //$("#barcodeTarget").html("").show().barcode(value, "qrcode", settings);

}

function fnactivartabs() {
    if (txtidproducto.val() == '') {
        document.getElementById('nav-regsanitario-tab').disabled = true;
        document.getElementById('nav-generico-tab').disabled = true;
        document.getElementById('nav-listaprecios-tab').disabled = true;
    } else {
        document.getElementById('nav-regsanitario-tab').disabled = false;
        document.getElementById('nav-generico-tab').disabled = false;
        document.getElementById('nav-listaprecios-tab').disabled = false;

    }
}

//checkesesencial.addEventListener('change', (event) => {
//    if (checkesesencial.checked==true) {
//        txtunidades.removeAttribute("disabled");
//    } else {
//        txtunidades.setAttribute("disabled","");
//    }
//});

function txtesencial() {
    if (checkesesencial.checked == true) {
        txtunidades.removeAttribute("disabled");
    } else {
        txtunidades.setAttribute("disabled", "");
    }
}