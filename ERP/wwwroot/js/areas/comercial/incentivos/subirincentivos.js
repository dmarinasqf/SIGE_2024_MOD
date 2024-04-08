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
    init();
   
});
function init() {
    let sucucontroller = new SucursalController();
    sucucontroller.ListarTodasSucursales('cmbsucursales', null, function () {
        var demo1 = $('#cmbsucursales').bootstrapDualListbox({
            nonSelectedListLabel: 'Non-selected',
            selectedListLabel: 'Selected',
            preserveSelectionOnMove: 'moved',
            moveOnSelect: true,
        });
        var container1 = demo1.bootstrapDualListbox('getContainer');
        container1.find('.btn').removeClass('btn-default').addClass('btn-xs btn-outline-info btn-h-outline-info btn-bold m-0')
            .find('.glyphicon-arrow-right').attr('class', 'fa fa-arrow-right').end()
            .find('.glyphicon-arrow-left').attr('class', 'fa fa-arrow-left')
    });
}

function fngetsucursales() {
    var options = $('select[name="cmbsucursales[]_helper2"]').find('option');
    var sucursales = '';
    for (var i = 0; i < options.length; i++) {
        if (options[i].value != '') {
            if (options.length - 1 != i)
                sucursales += options[i].value + '|';
            else
                sucursales += options[i].value;
        }
       

    }
    return sucursales;
}
txtfile.addEventListener('change', function () {
    var txt = txtfile.files[0];
    BLOQUEARCONTENIDO('cardlista', 'Leendo excel...');
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(txt);
});
btnguardar.addEventListener('click', function () {
    if (tbllista.rows().data().length == 0) {
        mensaje('I', 'Carge datos.');
        return;
    };
    if (fngetsucursales().length == 0) {
        mensaje('I', 'Seleccione sucursales.');
        return;
    };
    BLOQUEARCONTENIDO('cardlista', 'Guardando datos.');
    let controller = new IncentivoController();
    var obj = {
        data: JSON.stringify(fngetdatosdetalle()),
        sucursales: fngetsucursales()
    };
    controller.RegistrarIncentivosBloque(obj, function (data) {       
        DESBLOQUEARCONTENIDO('cardlista');
        fnnuevo();
    }, function () {
        DESBLOQUEARCONTENIDO('cardlista');
    });
});

function fncargarexcel(data) {

    tbllista.clear().draw(false);
    for (var i = 0; i < data.length; i++) {
        if ((data[i].codigoproducto??'')!='')
            tbllista.row.add([
                data[i].codigoproducto ?? '',
                data[i].nombre ?? '',
                parseFloat(data[i].incentivo ?? 0).toFixed(2),
                parseFloat(data[i].incentivoreceta ?? 0).toFixed(2),
                (data[i].fechainicio ?? ''),
                (data[i].fechafin ?? ''),
            ]).draw(false);
    }
    tbllista.columns.adjust().draw(false);
}
function fngetdatosdetalle() {
    var array = [];
    var filas = tbllista.rows().data();
    for (var i = 0; i < filas.length; i++) {
        var obj = new Incentivo();
        obj.codigoproducto = filas[i][0];
        obj.incentivo = filas[i][2];
        obj.incentivoreceta = filas[i][3];
        obj.fechainicio = filas[i][4];
        obj.fechafin = filas[i][5];
        array.push(obj);
    }
    return array;
}
function fnnuevo() {
  
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