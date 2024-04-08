
var MLScmblistapreios = document.getElementById('MLScmblistapreios');
var MLScmblistalabs = document.getElementById('MLScmblistalabs');
var MLStxtfiltro = document.getElementById('MLStxtfiltro');
var MLStbodyplista = document.getElementById('MLStbodyplista');
var MLStxtidsucursal = document.getElementById('MLStxtidsucursal');

$('document').ready(function () {
    MLStxtfiltro.focus();

    let controller = new LaboratorioController();
    var fn = controller.BuscarLaboratoriosSelect2();

    var $cmblaboratorio = $("#MLScmblistalabs");

    function cargarDatosAjax() {
        $.ajax({
            url: fn.url,
            dataType: 'json',
            data: { laboratorio: '' },
            success: function (data) {
                // Formatear datos
                var formattedData = $.map(data, function (obj) {
                    return {
                        id: obj.idlaboratorio,
                        text: obj.descripcion
                    };
                });
                formattedData.unshift({ id: 'seleccione_option', text: "[SELECCIONE LABORATORIO]" });

                // Inicializar select2 con los datos cargados
                $cmblaboratorio.select2({
                    allowClear: true,
                    //dropdownParent: $('#select2-parent'),
                    data: formattedData
                });

                $cmblaboratorio.on('select2:select', function (e) {
                    if (e.params.data.id === 'seleccione_option') {
                    } else {
                        MLSfnbuscarproductos(1, 30);
                    }
                });
            }
        });
    }

    cargarDatosAjax();
});


$('#modallistaprecios').on('shown.bs.modal', function (e) {
    if (MLScmblistapreios.getElementsByTagName('option').length == 0) {
        let controller = new SucursalController();
        controller.ListarListasSucursal(MLStxtidsucursal.value, 'MLScmblistapreios', function () {
            MLSfnbuscarproductos(1, 20);
        });
    } else {
        var idsucu = '';
        var options = MLScmblistapreios.getElementsByTagName('option');
        if (options.length != 1)
            idsucu = options[1].getAttribute('idsucursal');
        if (idsucu != MLStxtidsucursal.value) {
            let controller = new SucursalController();
            controller.ListarListasSucursal(MLStxtidsucursal.value, 'MLScmblistapreios', function () {
                MLSfnbuscarproductos(1, 20);
            });
        }
    }
});

MLStxtfiltro.addEventListener('keyup', function (e) {
    MLSfnbuscarproductos(1, 20);
});
MLScmblistapreios, addEventListener('change', function () {
    MLSfnbuscarproductos(1, 30);
});

function MLSfnbuscarproductos(numpagina, tamanopagina) {
    var controller = new ListaPreciosController();
    var obj = {
        producto: MLStxtfiltro.value,
        lista: MLScmblistapreios.value,
        laboratorio: MLScmblistalabs.value,
        idcanalventa: $('#cmbcanalventas').val(),//EARTCOD1009
        //idtipoPedido: $('#cmbidtipopedido').val(),//EARTC1000
        //idcanalventa: $('#cmbcanalventas').val(),//EARTC1000
        pagine: {
            numpagina: numpagina,
            tamanopagina: tamanopagina,
        }
    };
    //console.log("producto " + MLStxtfiltro.value);//TEMPORAL
    //console.log("listaSucursal " + MLScmblistapreios.value);//TEMPORAL

    controller.BuscarProductosListaConIncentivo(obj, function (response) {
        var fila = '';
        var textofiltrop = MLStxtfiltro.value;
        var datos = response.data;

        // Función de comparación para ordenar según los nuevos criterios  ----LA FUNCION SE ENCARGA DEL FILTRO
        function compararPorPalabraClave(a, b) {
            var nombreProductoA = a.nombre.toLowerCase();
            var nombreProductoB = b.nombre.toLowerCase();

            // Criterio 1: Priorizar los que comienzan con la palabra clave
            if (nombreProductoA.startsWith(textofiltrop) && !nombreProductoB.startsWith(textofiltrop)) {
                return -1; // a debe ir antes que b
            } else if (!nombreProductoA.startsWith(textofiltrop) && nombreProductoB.startsWith(textofiltrop)) {
                return 1; // b debe ir antes que a
            } else {
                // Criterio 2: Priorizar los que tienen la palabra clave al inicio de una palabra
                var alInicioA = nombreProductoA.includes(' ' + textofiltrop);
                var alInicioB = nombreProductoB.includes(' ' + textofiltrop);

                if (alInicioA && !alInicioB) {
                    return -1; // a debe ir antes que b
                } else if (!alInicioA && alInicioB) {
                    return 1; // b debe ir antes que a
                } else {
                    // Criterio 3: Priorizar los que contienen la palabra clave en algún lugar de una palabra pero no al inicio
                    var contieneA = nombreProductoA.includes(textofiltrop) && !alInicioA;
                    var contieneB = nombreProductoB.includes(textofiltrop) && !alInicioB;

                    if (contieneA && !contieneB) {
                        return -1; // a debe ir antes que b
                    } else if (!contieneA && contieneB) {
                        return 1; // b debe ir antes que a
                    } else {
                        // Criterio 4: Priorizar los que tienen palabras que terminan con la palabra clave
                        var palabrasTerminanA = nombreProductoA.split(' ').filter(palabra => palabra.endsWith(textofiltrop)).length > 0;
                        var palabrasTerminanB = nombreProductoB.split(' ').filter(palabra => palabra.endsWith(textofiltrop)).length > 0;

                        if (palabrasTerminanA && !palabrasTerminanB) {
                            return -1; // a debe ir antes que b
                        } else if (!palabrasTerminanA && palabrasTerminanB) {
                            return 1; // b debe ir antes que a
                        } else {
                            // Si no hay diferencias, ordenar alfabéticamente
                            return nombreProductoA.localeCompare(nombreProductoB);
                        }
                    }
                }
            }
        }

        datos.sort(compararPorPalabraClave);
        console.log(datos);
        //console.log("HOLA MUNDO AQUI ESTA");//EARTCOD1009
        //console.log(obj);//EARTCOD1009

        for (var i = 0; i < datos.length; i++) {


            var btnstocksucursales = '';
            if (datos[i].tipoproducto == 'PT')
                btnstocksucursales = '<button class="btn-dark MLSbtnstocksucursal"><i class="fas fa-warehouse"></i></button>';

            var tienestock = false;
            //if (datos[i].stock != '0') tienestock = true;
            if (datos[i].stock != '0' && datos[i].stock != null) tienestock = true;//EARTCOD1009
            if (datos[i].precio == null) datos[i].precio = 0;
            if (datos[i].precioxfraccion == null) datos[i].precioxfraccion = 0;
            datos[i].incentivo = datos[i].incentivo ?? '';
            fila += '<tr class="' + (tienestock ? 'table table-success' : '') + '" idproducto=' + datos[i].idproducto + ' idlistaprecio=' + datos[i].idprecioproducto + ' + idlista=' + datos[i].idlista + '>';

            //EARTCOD1009
            if (datos[i].tipoproducto == 'PK') {
                //fila += '<td><div class="btn-group btn-group-sm"><button class="btn-primary" onclick="PromocionesPackbuscarDetalle(\'' + datos[i].idproducto + '\')"><i class="fas fa-shopping-bag"></i></button></div></td>';
                fila += '<td><div class="btn-group btn-group-sm"><button class="btn-primary" onclick="PromocionBuscarProductoStockVenta(\'' + datos[i].idproducto + '\')"><i class="fas fa-shopping-bag"></i></button></div></td>';
            } else {
                fila += '<td><div class="btn-group btn-group-sm"><button class="btn-success MLSbtnseleccionar"><i class="fas fa-check"></i></button>' + btnstocksucursales + '</div></td>';
            }
            //fila += '<td><div class="btn-group btn-group-sm"><button class="btn-success MLSbtnseleccionar"><i class="fas fa-check"></i></button>' + btnstocksucursales + '</div></td>';
            var stock_ = datos[i].stock == null ? 0 : datos[i].stock;
            //-EARTCOD1009

            fila += '<td class="info">' + datos[i].codigoproducto + '</td>';
            fila += '<td class="info nombre">' + datos[i].nombre + '</td>';
            fila += '<td class="info font-9">' + datos[i].laboratorio + '</td>';
            //fila += '<td class="info font-9">' + datos[i].listaprecio + '</td>';
            fila += '<td class="info" style="color:blue; font-weight: bold; text-align:center; font-size:15px">' + datos[i].incentivo.toFixed(2) + '</td>';
            fila += '<td class="info text-right" style="font-size:15px">' + datos[i].precio.toFixed(2) + '</td>';
            fila += '<td class="info text-right" style="font-size:15px">' + datos[i].precioxfraccion.toFixed(2) + '</td>';
            fila += '<td class="info tipoproducto">' + datos[i].tipoproducto + '</td>';
            fila += '<td class="info text-right" style="font-size:15px">' + stock_ + '</td>';//-EARTCOD1009
            fila += '<td class="info text-right">' + datos[i].multiplo + '</td>';
            fila += '</tr>';

        }
        MLStbodyplista.innerHTML = fila;
        var pagine = new UtilsSisqf();
        pagine.PaggingTemplate(response.totalpaginas, response.paginaactual, 'MLSlinkpage', 'MLSpaginacion');
    });

}
$(document).on('click', '.MLSlinkpage', function () {
    var numpagina = this.getAttribute('numpagina');
    MLSfnbuscarproductos(numpagina, 20);
    var pages = document.getElementsByClassName('MLSlinkpage');
    for (var i = 0; i < pages.length; i++) {
        pages[i].classList.remove('activelink');
    }
    this.classList.add('activelink');
});
$('#MLStbodyplista').on('click', 'tr', function () {

    var filas = document.querySelectorAll('#MLStbodyplista tr');
    filas.forEach(function (e) {
        e.classList.remove('selected');
    });
    $(this).addClass('selected');
});
$(document).on('click', '.MLSbtnstocksucursal', function () {
    var fila = $(this).parents('tr')[0];
    txtMCCidproducto.value = fila.getAttribute('idproducto');
    $('#modalstocksucursales').modal('show');
});