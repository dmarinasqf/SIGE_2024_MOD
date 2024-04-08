

//var formvalidarusuario = document.getElementById('formvalidarusuario');
var MVUtxtusuario = document.getElementById('MVUtxtusuario');
var MVUtxtclave = document.getElementById('MVUtxtclave');
var MVUbtnaceptar = document.getElementById('MVUbtnaceptar');
var MVUtxttipo = document.getElementById('MVUtxttipo');

//formvalidarusuario.addEventListener('submit', function (e) {
//    e.preventDefault();
//});
function MVUfnvalidarcredenciales(fn) {
    if (MVUtxtusuario.value == '' ||  MVUtxtclave.value == '' )
    {
        mensaje('I', 'Complete los campos');
        return;
    }
    var obj = {
        usuario: MVUtxtusuario.value,
        clave: MVUtxtclave.value
    };
    let controller = new EmpleadoController();
    controller.ValidarCredenciales(obj, function (data) {
        fn(data);
    });
}