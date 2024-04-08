
var txtidproducto = document.getElementById("txtidproducto");
var txtcodigoproducto = document.getElementById("txtcodigoproducto");
var txtnombreproducto = document.getElementById("txtnombreproducto");

var btnbuscarproducto = document.getElementById("btnbuscarproducto");
var btnbuscarproductoparecido = document.getElementById("btnbuscarproductoparecido");
var btnnuevo = document.getElementById("btnnuevo");
var btnguardar = document.getElementById("btnguardar");

var tblproductoparecido;
var logicaModalProducto = "";

$(document).ready(function () {
    tblproductoparecido = $('#tblproductoparecido').DataTable({
        "searching": false,
        lengthChange: false,
        "ordering": false,
        responsive: true,
        "paging": false,
        "language": LENGUAJEDATATABLE()
    });

    let urlSearch = window.location.search;
    if (urlSearch.includes("idproducto")) {
        let idproducto = urlSearch.split("=")[1];
        let obj = {
            idproducto: idproducto
        };
        let controller = new ProductoParecidoController();
        controller.ListarProductosParecidos(obj, function (data) {
            var data = JSON.parse(data);
            if (data.length > 0) {
                txtidproducto.value = data[0].idproducto;
                txtcodigoproducto.value = data[0].Pcodigoproducto;
                txtnombreproducto.value = data[0].pnombre;
                for (var i = 0; i < data.length; i++) {
                    tblproductoparecido.row.add([
                        data[i].idproductoparecido,
                        data[i].codigoproducto,
                        data[i].idtipoproducto,
                        data[i].nombre,
                        '<button class="btn btn-sm btn-danger btneliminaritem" idproducto="' + data[i].idproducto + '"><i class="fas fa-trash"></i></button>'
                    ]).draw(false);
                }
                btnbuscarproducto.setAttribute("disabled", "");
            }
        });
    }
});

btnbuscarproducto.addEventListener("click", function () {
    logicaModalProducto = "CABECERA";
    $('#modalproductos').modal('show');
});
btnbuscarproductoparecido.addEventListener("click", function () {
    logicaModalProducto = "DETALLE";
    $('#modalproductos').modal('show');
});
$(document).on('click', '.btnpasarproducto', function () {
    var fila = tbl_CBPtabla.row($(this).parents('tr')).data();
    var nombreproducto = this.parentNode.parentNode.getElementsByClassName('nombreproducto')[0].innerText;
    var codigoproducto = fila[1];
    var idproducto = fila[0];
    var tipoproducto = this.parentNode.parentNode.getElementsByClassName('tipo')[0].innerText;

    if (logicaModalProducto == "CABECERA") {
        txtnombreproducto.value = nombreproducto;
        txtcodigoproducto.value = codigoproducto;
        txtidproducto.value = idproducto;
    } else {
        if (txtidproducto.value == idproducto) {
            mensaje("W", "El producto seleccionado es el mismo de la cabecera.");
        } else {
            var data = tblproductoparecido.data();
            if (data.length > 0) {
                var filtro = data.filter(x => x[0] == idproducto);
                if (filtro.length < 1) {
                    tblproductoparecido.row.add([
                        idproducto,
                        codigoproducto,
                        tipoproducto,
                        nombreproducto,
                        '<button class="btn btn-sm btn-danger btneliminaritem" idproducto="' + idproducto + '"><i class="fas fa-trash"></i></button>'
                    ]).draw(false);
                } else {
                    mensaje("W", "El producto seleccionado ya se encuentra en el detalle.");
                }
            } else {
                tblproductoparecido.row.add([
                    idproducto,
                    codigoproducto,
                    tipoproducto,
                    nombreproducto,
                    '<button class="btn btn-sm btn-danger btneliminaritem" idproducto="' + idproducto + '"><i class="fas fa-trash"></i></button>'
                ]).draw(false);
            }
        }
    }
    $('#modalproductos').modal('hide');
});

$('#tblproductoparecido tbody').on('click', 'tr', function () {
    if ($(this).hasClass('selected')) {
        console.log();
    }
    else {
        tblproductoparecido.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
    }
});

$(document).on('click', '.btneliminaritem', function () {
    tblproductoparecido.row('.selected').remove().draw(false);
});

btnnuevo.addEventListener("click", function () {
    location.href = ORIGEN + "/Almacen/AProductoParecido/Registrar";
});

btnguardar.addEventListener("click", function () {
    var data = tblproductoparecido.data();
    if (data.length > 0) {
        BLOQUEARCONTENIDO("tblproductoparecido", "Guardando");
        btnguardar.setAttribute("disabled", "");
        var idproductosparecidos = "";
        for (var i = 0; i < data.length; i++) {
            if (i == 0) {
                idproductosparecidos += data[i][0];
            } else {
                idproductosparecidos += "_" + data[i][0];
            }
        }

        let oProductoParecido = new Object();
        oProductoParecido.idproducto = txtidproducto.value;
        var obj = {
            oProductoparecido: oProductoParecido,
            idproductosparecidos: idproductosparecidos
        }
        let controller = new ProductoParecidoController();
        controller.RegistrarInicioInventario(obj, function (data) {
            if (data > 0) {
                mensaje("S", "Registro guardado correctamente.");
            } else {
                mensaje("W", "Error al guardar el registro.");
            }
            btnguardar.removeAttribute("disabled", "");
            DESBLOQUEARCONTENIDO("tblproductoparecido");
        });
    }
    else {
        mensaje("W", "La tabla se encuentra vacía.");
    }
});