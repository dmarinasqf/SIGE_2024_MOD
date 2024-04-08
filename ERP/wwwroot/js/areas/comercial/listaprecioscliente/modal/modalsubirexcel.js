var MSEtxtidlista = document.getElementById('MSEtxtidlista');
var MSEtxtarchivo = document.getElementById('MSEtxtarchivo');
var MSEbtnguardar = document.getElementById('MSEbtnguardar');
var MSEtbodyprecio = document.getElementById('MSEtbodyprecio');
var MSEtbllista;

$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = true;
    datatable.ordering = true;
    datatable.buttons = [];
    var util = new UtilsSisqf();
    MSEtbllista = util.Datatable('MSEtbllista', false, datatable);
});
MSEtxtarchivo.addEventListener('change', function () {
    var txt = MSEtxtarchivo.files[0];
    BLOQUEARCONTENIDO('modalsubirexcel', 'Leendo excel...');
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(txt);
});
function MSEfncargarexcel(data) {
   
    MSEtbllista.clear().draw(false);
    for (var i = 0; i < data.length; i++) {
       var fila= MSEtbllista.row.add([
            data[i].codigoproducto ?? '',
            data[i].codcliente ?? '',
            (data[i].precio ?? 0).toFixed(2),
            //(data[i].precioxfraccion ?? 0).toFixed(2),
            data[i].descripcion ?? '',
            data[i].formulacion ?? '',
            data[i].presentacion ?? '',
            data[i].etiqueta ?? '',
            data[i].observacion ?? ''
        ]).draw(false).node();
        if ((data[i].codcliente ?? '') == '' || (data[i].codigoproducto ?? '') == '' || (data[i].descripcion ?? '') == '')
            fila.classList.add('table-danger');
    }
    MSEtbllista.columns.adjust().draw(false);
}
//cuidar que las pocisiones del array sean iguales a la tabla 
function MSEfngetdetalle() {
    var array = [];
    var filas = MSEtbllista.rows().data();
    for (var i = 0; i < filas.length; i++) {
        var obj = new Object();
        obj.codigoproducto = filas[i][0];
        obj.codcliente = filas[i][1];
        obj.precio = filas[i][2];
        obj.descripcion = filas[i][3];
        //obj.precioxfraccion = filas[i][4];
        obj.idlistaprecio = MSEtxtidlista.value;
        obj.formulacion = filas[i][4];
        obj.presentacion = filas[i][5];
        obj.etiqueta = filas[i][6];
        obj.observacion = filas[i][7];
        if (filas[i][0] != '' && filas[i][1] != '' && filas[i][3]!='')
            array.push(obj);
    }
    return array;
}
var ExcelToJSON = function () {
    this.parseExcel = function (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            workbook.SheetNames.forEach(function (sheetName) {
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                var json_object = JSON.stringify(XL_row_object);

                MSEfncargarexcel(JSON.parse(json_object));
            })
        };
        reader.onerror = function (ex) {
            console.log(ex);
        };
        reader.readAsBinaryString(file);
        DESBLOQUEARCONTENIDO('modalsubirexcel');
    };
};
function MSEfnlimpiar() {
    MSEtbllista.clear().draw(false);
    MSEtxtarchivo.value = '';
    MSEtbllista.clear().draw(false);
}

MSEbtnguardar.addEventListener('click', function () {
    var data = MSEfngetdetalle();
    if (data.length == 0) {
        mensaje('I', 'No hay data para guardar, verifique que estee correcta');
        return;
    }
    let controller = new ListaPreciosClienteController();
    MSEbtnguardar.disabled = true;
    var obj = {
        data: data,
        idlista: MSEtxtidlista.value
    };
    controller.RegistrarPreciosClienteBloque(obj, (data) => {
        mensaje('S', 'Datos guardados');
        MSEfnlimpiar();
        MSEbtnguardar.disabled = false;
    }, () => { MSEbtnguardar.disabled = true; });
});