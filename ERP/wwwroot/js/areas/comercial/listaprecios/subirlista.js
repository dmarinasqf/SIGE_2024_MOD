var cmblista = document.getElementById('cmblista');
var checkadesy = document.getElementById('checkadesy');
var btnguardar = document.getElementById('btnguardar');
var txtfile = document.getElementById('txtfile');
var tbllista;

$(document).ready(function () {
    var datatable = new DataTable();
    datatable.searching = true;
    datatable.lengthChange = true;
    datatable.ordering = true;
    datatable.buttons = [];
    var util = new UtilsSisqf();
    tbllista = util.Datatable('tbllista', false, datatable);
});
txtfile.addEventListener('change', function () {
    var txt = txtfile.files[0];
    BLOQUEARCONTENIDO('cardlista', 'Leendo excel...');
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(txt);
});
btnguardar.addEventListener('click', function () {
    if (cmblista.value == '' || tbllista.rows().data().length==0) {
        mensaje('I', 'Seleccione lista, o carge datos.');
        return;
    };
    BLOQUEARCONTENIDO('cardlista', 'Guardando datos.');
    let controller = new ListaPreciosController();
    var obj = {
        lista: JSON.stringify(fngetdatosdetalle()),
        codadesy: checkadesy.checked
    };
    controller.SubirLista(obj, function (data) {
        console.log(data);
        DESBLOQUEARCONTENIDO('cardlista');
        fnnuevo();
    }, function () {
            DESBLOQUEARCONTENIDO('cardlista');
    });
});

function fncargarexcel(data) {
  
    tbllista.clear().draw(false);
    for (var i = 0; i < data.length; i++) {
        tbllista.row.add([
            data[i].codigoproducto??'',
            data[i].nombre ?? '',
            (data[i].precio??0).toFixed(2),
            (data[i].precioxfraccion??0).toFixed(2),
        ]).draw(false);
    }
    tbllista.columns.adjust().draw(false);
}
function fngetdatosdetalle() {
    var array = [];
    var filas = tbllista.rows().data();
    for (var i = 0; i <filas. length; i++) {
        var obj = new PreciosProducto();
        obj.codigoproducto = filas[i][0];
        obj.precio = filas[i][2];
        obj.precioxfraccion = filas[i][3];
        obj.idlistaprecio = cmblista.value;
        array.push(obj);
    }
    return array;
}
function fnnuevo() {
    cmblista.value = '';
    txtfile.value = '';
    tbllista.clear().draw(false);
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
           
                fncargarexcel(JSON.parse(json_object));
            })
        };
        reader.onerror = function (ex) {
            console.log(ex);
        };
        reader.readAsBinaryString(file);
        DESBLOQUEARCONTENIDO('cardlista');
    };
};