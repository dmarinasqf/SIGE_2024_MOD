var MDDIFPtbodydetalle = document.getElementById('MDDIFPtbodydetalle');
var txtfechainicio = document.getElementById('txtfechainicio');
var txtfechafin = document.getElementById('txtfechafin');
var txtlaboratorio = document.getElementById('txtlaboratorio');
var txtsucursal = document.getElementById('txtsucursal');

//function MDDIFPListar(iddificultad) {
//    var obj = {
//        iddificultad: iddificultad,
//        fechainicio: txtfechainicio.value,
//        fechafin: txtfechafin.value,
//        laboratorio: txtlaboratorio.value,
//        sucursal: txtsucursal.value
//    }
//    let controller = new LaboratorioPedidoController();
//    controller.ListarDificultadDetallePedido(obj, (data) => {
//        var fila = '';
//        if (data.data.length > 0)
//            for (var i = 0; i < data.data.length; i++) {
//                fila += '<tr id= ' + data.data[i].iddetalle + '>' +
//                    "<td>" + data.data[i].iddetalle + "</td>" +
//                    "<td>" + data.data[i].formula + "</td>" +
//                    "<td>" + data.data[i].codprecioanterior + "</td>" +
//                    "<td>" + data.data[i].tiempo + "</td>" +
//                    "</tr > ";
//            }
//        MDDIFPtbodydetalle.innerHTML = fila;
//    });
//}

function MDDIFPListar(iddificultad) {
    var obj = {
        iddificultad: iddificultad,
        fechainicio: txtfechainicio.value,
        fechafin: txtfechafin.value,
        laboratorio: txtlaboratorio.value,
        sucursal: txtsucursal.value
    }

    // Variables para contar el número de registros para cada dificultad
    var countBaja = 0;
    var countMedia = 0;
    var countAlta = 0;

    let controller = new LaboratorioPedidoController();
    controller.ListarDificultadDetallePedido(obj, (data) => {
        var fila = '';
        if (data.data.length > 0) {
            for (var i = 0; i < data.data.length; i++) {
                // Utiliza includes para buscar palabras clave en el texto del tiempo
                var tiempo = data.data[i].tiempo.toLowerCase();
                var color = 'black'; // Color predeterminado

                if (tiempo.includes('expiró')) {
                    color = 'red';
                } else if (tiempo.includes('a punto de expirar')) {
                    color = 'red';
                } else if (tiempo.includes('en proceso')) {
                    color = 'green';  // Cambiado a verde, ajusta según tus preferencias
                }

                fila += '<tr id=' + data.data[i].iddetalle + '>' +
                    "<td>" + data.data[i].iddetalle + "</td>" +
                    "<td>" + data.data[i].formula + "</td>" +
                    "<td>" + data.data[i].codprecioanterior + "</td>" +
                    "<td style='color: " + color + ";'>" + data.data[i].tiempo + "</td>" +
                    "</tr>";
            }
        }

        if (iddificultad == 3) {
            document.getElementById('lbldifBaja').innerText = data.data.length.toString();
        }

        if (iddificultad == 1) {
            document.getElementById('lbldifMedia').innerText = data.data.length.toString();
        }

        if (iddificultad == 2) {
            document.getElementById('lbldifAlta').innerText = data.data.length.toString();
        }

        MDDIFPtbodydetalle.innerHTML = fila;
    });
}





