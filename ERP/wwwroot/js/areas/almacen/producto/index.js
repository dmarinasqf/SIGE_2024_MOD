var popupproducto;
var tbllista;
var btnbusqueda = $('#btnbusqueda');
var btndescargar = document.getElementById('btndescargar');
//Variables del modal
var idproducto = 0;
//variables del panel de busqueda
var reg_cmbtipoproducto = $('#reg_cmbtipoproducto');
var reg_pro_cmbestado = $('#reg_pro_cmbestado');
var txtproducto = document.getElementById('txtcodproducto');
var timerbusqueda = null;
$(document).ready(function () {
    tbllista = $('#tbllista').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": true,
        "lengthMenu": [[15, 25, 50, -1], [15, 25, 50, "All"]],
        "language": LENGUAJEDATATABLE(),
        "columnDefs": [
            {
                "targets": [0],
                "visible": false,
                "searchable": false
            }
        ] 
    });
    reg_cmbtipoproducto.val("");
    reg_pro_cmbestado.val("HABILITADO");
    listarProductos(txtproducto.value, reg_cmbtipoproducto.val(), reg_pro_cmbestado.val());
});


//LISTAR 
$('#form-busqueda').submit(function (e) {
    e.preventDefault();
    var obj = $('#form-busqueda').serializeArray();
   
    if (obj.length !== null) {
        //alert(txtproducto.value);
        listarProductos(txtproducto.value, reg_cmbtipoproducto.val(), reg_pro_cmbestado.val());
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
function eliminar(id) {
    var url = ORIGEN + "/Almacen/AProducto/Eliminar/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                btnbusqueda.click();
                tbllista.row('.selected').remove().draw(false);
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
function HabilitarProduto(id) {
    var url = ORIGEN + "/Almacen/AProducto/ActivarProducto/" + id;
    $.post(url).done(function (data) {
        if (data.mensaje === "ok") {
            {
                btnbusqueda.click();
                //listarProductos("", "", "", "CONSULTA");
                tbllista.row('.selected').remove().draw(false);
                swal("Registro Activo!", {
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

//EVENTOS 
function mostrarProveedores(id) {
    console.log(id);
    $('#modalproveedores').modal('show');
    listarproveedores(id);
}
//EVENTOS CHANGE
$('#reg_cmbtipoproducto').change(function () {
    btnbusqueda.click();

});
reg_pro_cmbestado.change(function () {
    btnbusqueda.click();

});

$('#tbllista tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tbllista.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});
txtproducto.addEventListener('keyup', function (e) {
 
    clearTimeout(timerbusqueda);
    var $this = this;
    timerbusqueda= setTimeout(function () {
        if (e.key != 'Enter') {
            btnbusqueda.click();
        }

    }, 1500);
});

btndescargar.addEventListener('click', function () {
    var obj = {
        nombreproducto: txtproducto.value.trim(),
        tipoproducto: reg_cmbtipoproducto.val(),
        estado: reg_pro_cmbestado.val(),
        top: 10000000
    };
    let controller = new ProductoController(1);
    controller.ExcelProductos(obj);
});
//$(document).on('click', '.btneditar', function () {
//    var url = this.getAttribute('href');
   
//        popupproducto = window.open(url, "Edición de producto", "width=1100,height=600,Titlebar=NO,Toolbar=NO");  
//        popupproducto.focus();    

//});

//Funciones para listar
function listarProductos(nombre, tipo, estado) {

    var url = ORIGEN + "/Almacen/AProducto/BuscarProductos";
    var obj = {
        nombreproducto: nombre.trim(),
        tipoproducto: tipo,
        estado: estado,
        top: 100
    };
    $.post(url, obj).done(function (data) {
        data = JSON.parse(data);


        tbllista.clear().draw();
        if (data !== null) {
            //console.log(data);
            agregarFila(data, 'PRODUCTO');
        }
        else {
            mensaje("I", "NO HAY INFORMACIÓN");
        }
    }).fail(function (data) {
        console.log(data);
        mensaje("D", 'Error en el servidor');
    });

}
function agregarFila(datos, tipo) {
    for (var i = 0; i < datos.length; i++) {
        var data = datos[i];
        var botones = '';
        var botonespt = '';
        if (data.ESTADO === "HABILITADO") {
            if (data.TIPOPRODUCTO !== "PT")
                botonespt = '';

            botones = `<div class="btn-group btn-group-sm" >                     
                       `+ botonespt + `
                    <a class="btneditar btn btn-sm btn-outline-secondary waves-effect btn-pasar font-10" data-toggle="tooltip" data-placement="top" title="Editar Registro" href="`+ ORIGEN + `/Almacen/AProducto/RegistrarEditar?id=` + data.ID + `"><i class="fas fa-edit"></i></a>
                    <button class="btn btn-sm btn-outline-danger waves-effect font-10" data-toggle="tooltip" data-placement="top" title="Eliminar Registro" onclick="mensajeeliminar(`+ data.ID + `)"><i class="fas fa-lock"></i></button>                                                                           
                </div>`;
        }
        else if (data.ESTADO === "DESHABILITADO")
            botones = `<div class="btn-group btn-group-sm" >            
            <a class="btn btn-sm bg-success waves-effect text-white" onclick="HabilitarProduto(`+ data.ID + `)"><i class="fas fa-unlock"></i></a>                                                                   
             </div>`;

        var fila = tbllista.row.add([
            data.ID,
            botones,
            data.CODIGO,
            data.CODIGOBARRA,
            data.PRODUCTO,
            data.LABORATORIO,
            data.TIPOPRODUCTO,
            data.CLASE,
            //data.subclase,
            //data.unidadmedidaa,
            //data.unidadmedidac,
            data.PRESENTACION,
            data.PVFP.toFixed(2),
            //data.STOCK_MATRIZ,//CAMPO NUEVO AGREGADO
            //data.SALIDA_2MESES//CAMPO NUEVO AGREGADO
        ]).draw(false).node();
        //$(fila).find('td').eq(0).attr({ 'style': 'width:10%' });
        //$(fila).find('td').eq(1).attr({ 'style': 'width:10%' });
        //$(fila).find('td').eq(2).attr({ 'style': 'width:20%' });
        //$(fila).find('td').eq(3).attr({ 'style': 'width:20%' });
        //$(fila).find('td').eq(4).attr({ 'style': 'width:10%' });
        //$(fila).find('td').eq(5).attr({ 'style': 'width:10%' });
        //$(fila).find('td').eq(6).attr({ 'style': 'width:10%' });
        //$(fila).find('td').eq(7).attr({ 'style': 'width:10%' });
        tbllista.columns.adjust().draw();
    }
}

//GENERAR EL CÓDIGO DE BARRAS
function generateBarcode(codigo) {
    console.log(codigo);
    var value = codigo;

    var settings = {
        output: "css",
        bgColor: "#FFFFFF",
        color: "#000000",
        barWidth: "1",
        barHeight: "35",
        moduleSize: "5",
        addQuietZone: "1"

    };
    $("#barcodeTarget").html("").show().barcode(value, "code128", settings);

}
//oculta y muestra los div de codigo de barras de acuerdo
function divcodigoBarras(operacion) {
    //console.log(operacion);
    if (operacion === "editar") {
        //console.log(operacion);
        document.getElementById('div_codigobarra').style.display = 'inline';
        document.getElementById('div_codigobarra_auto').style.display = 'none';
        $('.nav-tabs a[href="#nav-producto"]').tab('show');
    }
    else if (operacion === "nuevo") {
        //console.log(operacion);
        document.getElementById('div_codigobarra_auto').style.display = 'inline';
        document.getElementById('div_codigobarra').style.display = 'none';
        $('.nav-tabs a[href="#nav-producto"]').tab('show');
    }
    //else if (operacion === "ver") {
    //    document.getElementById('div_codigobarra_auto').style.display = 'inline';
    //    document.getElementById('div_codigobarra').style.display = 'none';
    //}
}

