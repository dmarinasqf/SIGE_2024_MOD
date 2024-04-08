
var cmbempresa = document.getElementById('cmbempresa');
var cmbsucursal = document.getElementById('cmbsucursal');
var Input_Password = document.getElementById('Input_Password');
var Input_Email = document.getElementById('Input_Email');


$(document).ready(function () {
    fnlistarucursal();
    
});
cmbempresa.addEventListener('change', function () {
    fnlistarucursal();
});
function fnlistarucursal() {
    let controller = new PublicController();
    controller.ListarSucursalxEmpresa('cmbsucursal', cmbempresa.value);
}
Input_Password.addEventListener('focus', function () {
    if (Input_Email.value.trim().length != 0) {
        let controller = new PublicController();
        var obj = {
            username: Input_Email.value.trim()
        };
        console.log(obj);
        controller.GetDatosSucursalEmpresaxUserName(obj, (data) => {           
            cmbempresa.value = data.idempresa;
            let controller = new PublicController();
            controller.ListarSucursalxEmpresa('cmbsucursal', data.idempresa, data.idsucursal);
        });
    }
});



document.addEventListener('keydown', (event) => {
    var valtecla = event.keyCode;

    if (valtecla == 13) {
        var el=document.getElementsByClassName('btn-success');
        for (var i = 0; i < el.length; i++) {
            el[i].click();
        }
    }


}, false);
