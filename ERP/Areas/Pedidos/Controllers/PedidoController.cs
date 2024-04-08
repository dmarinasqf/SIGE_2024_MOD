using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using Gdp.Infraestructura.Maestros.estadopedido;
using Gdp.Infraestructura.Pedidos.listarpedidos;
using Gdp.Infraestructura.Pedidos.listarpedidos.command;
using Gdp.Infraestructura.Pedidos.listarpedidos.query;
using Gdp.Infraestructura.Pedidos.registro;
using Gdp.Infraestructura.Pedidos.registro.command;
using Gdp.Infraestructura.Pedidos.Registro;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Erp.Infraestructura.Areas.Pedido.DAO;
using ERP.Models.Ayudas;
using Newtonsoft.Json;
using Erp.Persistencia.Servicios.Users;
using INFRAESTRUCTURA.Areas.Ventas.INTERFAZ;
using System.IO;
using Microsoft.AspNetCore.Http;
using Erp.SeedWork;
using System.Data;

namespace ERP.Areas.Pedidos.Controllers
{
    [Area("Pedidos")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class PedidoController : _baseController
    {
        private readonly Modelo db;
        private readonly IWebHostEnvironment ruta;
        private readonly PedidoDAO DAO;
        private readonly IUser user;

        private readonly ICajaVentaEF cajaEF;//EARTCOD1011
        public PedidoController(IUser _user,IWebHostEnvironment _webHostEnvironment,Modelo _db, ICryptografhy cryptografhy, ICajaVentaEF _cajaEF, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            LeerJson settings = new LeerJson();
            db = _db;
            DAO = new PedidoDAO(settings.GetConnectionString());
            ruta = _webHostEnvironment;
            user = _user;

            cajaEF = _cajaEF;//EARTCOD1011
        }

        [Authorize(Roles = "ADMINISTRADOR, REGISTRAR PEDIDO")]
        public async Task<IActionResult> Registrar()
        {

            var inicio = await _mediator.Send(new DatosInicioRegistro.Ejecutar());
            ViewBag.tipoentrega = inicio.tipoentrega;
            ViewBag.tipoformulacion = inicio.tipoformulacion;
            ViewBag.tipopedido = inicio.tipopedido;
            ViewBag.canalventa = inicio.canalventa;
            ViewBag.tipopaciente = inicio.tipopaciente;
            ViewBag.sucursales = inicio.sucursales;
            ViewBag.tipoventa = inicio.tipoVentas;
            ViewBag.LineaAtencion = DAO.LineaAtencionListar();
            ViewBag.Tipopagos = db.FTIPOPAGO.Where(x => x.estado == "HABILITADO").ToList();
            ViewBag.IGV = inicio.IGV;
            datosinicio();
            ViewBag.verificarcaja = cajaEF.VerificarAperturaCaja(getIdEmpleado().ToString());//EARTCOD1011

            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, HISTORIAL PEDIDO")]

        public IActionResult ListarPedidos()
        {
            //ViewBag.estadopedido = await _mediator.Send(new ListarEstado.Ejecutar { tipo = "pedido" });
            ViewBag.estadopedido = DAO.ListarEstado("pedido");
            datosinicio();
            return View();
        }
        public async Task<IActionResult> ImprimirFormato1(int id)
        {
            var pedido = await _mediator.Send(new BuscarPedidoCompleto.Ejecutar { id = id });
            ViewBag.pedido = pedido;
            return View();
        }
        public async Task<IActionResult> ImprimirFormato2(int id)
        {
            var pedido = await _mediator.Send(new BuscarPedidoCompleto.Ejecutar { id = id });
            ViewBag.pedido = pedido;
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, REGISTRAR PEDIDO")]

        public async Task<IActionResult> RegistrarPedido(RegistrarPedido.Ejecutar obj)
        {
            datosinicio();//EARTCOD1011
            /*obj.idaperturacaja = Convert.ToInt32(cajaEF.ObtenerCajaAbierta(ViewBag.IDEMPLEADO));*///EARTCOD1011
            obj.ruta = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }




        // --------CODIGO PARA LA EXPORTACION GENERAL
        //[HttpPost]
        //public IActionResult GetHistorialVentas1()
        //{
        //    var pedidos = DAO.ProcesarExcel2(@"D:\proyectos\excelimportar.xlsx");

        //    foreach (var pedido in pedidos)
        //    {
        //        DAO.registro_adelantoexcel(pedido);
        //    }

        //    return Json(pedidos);
        //}



        //--------EXPORTACION



        public async Task<IActionResult> RegistrarImagenPedido(RegistrarImagenPedido.Ejecutar obj)
        {
            obj.path = ruta.WebRootPath;
            return Json(await _mediator.Send(obj));
        }


        [Authorize(Roles = "ADMINISTRADOR, HISTORIAL PEDIDO")]
        public async Task<IActionResult> ListarPedidosVista(ListarPedidos.Ejecutar obj)
        {
            if (!User.IsInRole("ADMINISTRADOR") && !User.IsInRole("ACCESO A TODAS LAS SUCURSALES"))
                obj.sucursal = getIdSucursal().ToString();
            obj.empconsulta = getIdEmpleado().ToString();
            //obj.vista = "pedidos";
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> BuscarDetallePedido(BuscarDetallePedido.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> BuscarPedidoCompleto(BuscarPedidoCompleto.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }

        public async Task<IActionResult> ListarArchivosPedido(ListarArchivosPedido.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> EliminarPedido(EliminarPedido.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> DevolverPedido(DevolverPedido.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> EntregarPedido(EntregarPedido.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> BuscarPedidoParaEntregar(BuscarPedidoParaEntregar.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> EditarPedido(EditarPedido.Ejecutar obj)
        {
            string idusu = user.getIdUserSession();
            obj.idusuario =idusu;
            return Json(await _mediator.Send(obj));
        } 
        public async Task<IActionResult> BuscarPagosPedido(BuscarPagosPedido.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> AdelantoPedido(AdelantoPedido.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> BuscarPedidoParaFacturar(BuscarPedidoParaFacturar.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }  
        public async Task<IActionResult> HistorialPedidoPacCli(HistorialPedidoPacCli.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> DatosAdicionalesDetallePrecio(DatosAdicionalesDetallePrecio.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }

        public async Task<IActionResult> BuscarArticulo(BuscarArticulo.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        //LR
        public IActionResult listarxproductocliente(string idcliente,int idproducto) {
            var data = DAO.listarxproductocliente(idcliente,idproducto);
            return Json(JsonConvert.SerializeObject(data));
        }
        public void RegistarAdelanto(int idtipopago,double total,double pagado,string numtarjeta,int idtipotarjeta,int iddpedido) {
            string usuario = user.getIdUserSession().ToString();
            if (pagado > 0) {
                DAO.registro_adelanto(usuario, idtipopago, total, pagado, numtarjeta, idtipotarjeta, iddpedido);
            }
            
        }

        //public IActionResult BuscarNumeroPedidosPendientes(int suc_codigo)
        //{
        //    var data = DAO.BuscarNumeroPedidosPendientes(suc_codigo);
        //    return Json(JsonConvert.SerializeObject(data));
        //}

        public IActionResult ListarLineaAtencion()
        {
            var data = DAO.LineaAtencionListar();
            return Json(data);
        }

        //public IActionResult BuscarArticulo(int id)
        //{
        //    var dato = db.CATALAGOPRECIOS.Find(id);
        //    return Json(dato);
        //}


        //GUARDAR IMAGEN BIT YEX



        public async Task<IActionResult> RegistrarImagenPedidoBit(int idpedido, string tipo, List<IFormFile> archivos, List<string> tipos, List<int> idimagen, List<string> nombre)
        {
            string path = ruta.WebRootPath;
            try
            {
                // Manejar imágenes
                if (archivos != null && archivos.Count > 0)
                {
                    for (int i = 0; i < archivos.Count; i++)
                    {
                        byte[] imageBytes;
                        using (var ms = new MemoryStream())
                        {
                            await archivos[i].CopyToAsync(ms);
                            imageBytes = ms.ToArray();
                        }

                        var data = DAO.guardarimagenpedidobit(idpedido, nombre[i], tipos[i], imageBytes); // se envia la imagen en bit como imageBytes
                    }
                }
              

                return Json(new { success = true, message = "ok" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        public IActionResult listartablaimagenpedidobit(int idpedido)
        {
            var data = DAO.listartablaimagenpedidobit(idpedido);
            return Json(JsonConvert.SerializeObject(data));
        }



        public async Task<IActionResult> editarImagenPedidobit(List<int> imagen_codigo, int idpedido)
        {
            string path = ruta.WebRootPath;
            try
            {
                // Itera sobre todos los imagen_codigo
                foreach (var codigo in imagen_codigo)
                {
                    var data = DAO.editarImagenPedidobit(codigo, idpedido);
                    // Continúa con tu lógica de procesamiento...
                }

                return Json(new { success = true, message = "ok" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        //CAMBIOS PARA PROBAR MAS A DELANTE
        //public IActionResult listartablaimagenpedidobitaimagen(int idpedido)
        //{
        //    var data = DAO.listartablaimagenpedidobitaimagen(idpedido);
        //    List<object> output = new List<object>();

        //    foreach (DataRow row in data.Rows)
        //    {
        //        byte[] imageBytes = (byte[])row["imagenbit"];
        //        string base64String = Convert.ToBase64String(imageBytes);

        //        Creando un objeto anónimo para enviar al cliente
        //        var imageObj = new
        //        {

        //            imagen_codigo = Convert.ToInt32(row["imagen_codigo"]),
        //            pedido_codigo = Convert.ToInt32(row["pedido_codigo"]),
        //            imagen = Convert.ToString(row["imagen"]),
        //            tipo = Convert.ToString(row["tipo"]),
        //            imagenBase64 = base64String
        //        };

        //        output.Add(imageObj);
        //    }

        //    return Json(output);
        //}

        public IActionResult listartablaimagenpedidobitaimagen(int idpedido)
        {
            var data = DAO.listartablaimagenpedidobitaimagen(idpedido);
            List<object> output = new List<object>();

            foreach (DataRow row in data.Rows)
            {
                string base64String;

                // Verificando si 'imagenbit' es null o está vacío
                if (row["imagenbit"] == DBNull.Value || ((byte[])row["imagenbit"]).Length == 0)
                {
                    base64String = null; // o puedes usar "null" o una cadena especial que identifiques en JS
                }
                else
                {
                    byte[] imageBytes = (byte[])row["imagenbit"];
                    base64String = Convert.ToBase64String(imageBytes);
                }

                // Creando un objeto anónimo para enviar al cliente
                var imageObj = new
                {
                    imagen_codigo = Convert.ToInt32(row["imagen_codigo"]),
                    pedido_codigo = Convert.ToInt32(row["pedido_codigo"]),
                    imagen = Convert.ToString(row["imagen"]),
                    tipo = Convert.ToString(row["tipo"]),
                    imagenBase64 = base64String
                };

                output.Add(imageObj);
            }

            return Json(output);
        }








        public IActionResult GetImagebi(int idpedido)
        {
            var data = DAO.listartablaimagenpedidobitaimagen(idpedido);

            if (data.Rows.Count > 0)
            {
                byte[] imageBytes = (byte[])data.Rows[0]["imagenbit"];
                return File(imageBytes, "image/jpeg"); // Ajusta el tipo MIME según corresponda
            }

            return NotFound();
        }

        [HttpGet]
        public IActionResult GetFile(int imagen_codigo)
        {
            var dataTable = DAO.listartablaimagenpedidobitapdf(imagen_codigo);

            // Verifica que el DataTable tiene al menos una fila
            if (dataTable.Rows.Count == 0)
            {
                return NotFound(); // O alguna otra respuesta adecuada
            }

            DataRow dataRow = dataTable.Rows[0]; // Toma la primera fila
            byte[] fileBytes = (byte[])dataRow["imagenbit"];
            string fileName = Convert.ToString(dataRow["imagen"]);

            if (fileName.ToLower().EndsWith(".pdf"))
            {
                return File(fileBytes, "application/pdf");
            }
            else
            {
                // Asume que todas las demás son imágenes PNG; ajusta según tus necesidades
                return File(fileBytes, "image/png");
            }
        }


        //public async Task<IActionResult> RegistrarImagenPedidoBit(int idpedido, List<IFormFile> imagenes, List<IFormFile> otrosArchivos, List<string> tiposImagen, List<string> tiposArchivo, List<int> idimagenImagen, List<int> idimagenArchivo,string tipo)
        //{
        //   string path = ruta.WebRootPath;
        //    try
        //    {
        //        // Manejar imágenes
        //        if (imagenes != null && imagenes.Count > 0)
        //        {
        //            for (int i = 0; i < imagenes.Count; i++)
        //            {
        //                byte[] imageBytes;
        //                using (var ms = new MemoryStream())
        //                {
        //                    await imagenes[i].CopyToAsync(ms);
        //                    imageBytes = ms.ToArray();
        //                }

        //                var data = DAO.guardarimagenpedidobit(idpedido, null, tiposImagen[i], imageBytes); // se envia la imagen en bit como imageBytes
        //            }
        //        }
        //        // Manejar otros archivos
        //        if (otrosArchivos != null && otrosArchivos.Count > 0)
        //        {
        //            for (int i = 0; i < otrosArchivos.Count; i++)
        //            {
        //                var file = otrosArchivos[i];
        //                var categoria = tiposArchivo[i];
        //                if (file != null)
        //                {
        //                    var extension = System.IO.Path.GetExtension(file.FileName);
        //                    var nombre = $"sisqf_{idpedido}_{i}_{categoria}_{DateTime.Now.ToString("ddMMyyyyhhmm")}{extension}";

        //                    // Guarda el archivo en el sistema de archivos.
        //                    GuardarElementos elemento = new GuardarElementos();
        //                    string respuesta = elemento.SaveFile(file, $"{path}/imagenes/pedido/{categoria}/", nombre);  // Modifica la ruta para otros archivos, no imágenes.

        //                    // Si el archivo se guardó con éxito, agregamos sus detalles a la lista y enviamos el nombre del archivo al DAO.
        //                    if (respuesta == "ok")
        //                    {
        //                        // Aquí puedes agregar lógica específica para guardar detalles de otros archivos, si es necesario.
        //                        // Por ejemplo, si tienes una clase separada para otros archivos, la usarías aquí en lugar de ImagenPedido.

        //                        var data = DAO.guardarimagenpedidobit(idpedido, nombre, tiposArchivo[i], null);  // Puede que necesites un DAO diferente o un método diferente si estás tratando archivos que no son imágenes.
        //                    }
        //                }
        //            }
        //        }

        //        // Cualquier otra lógica común para ambos tipos
        //        // ...

        //        return Json(new { success = true, message = "Imagenes y archivos guardados correctamente" });
        //    }
        //    catch (Exception ex)
        //    {
        //        return Json(new { success = false, message = ex.Message });
        //    }
        //}





        //listar pedido
        public async Task<IActionResult> GetListarPedidolistarArray(string fechafin, string fechainicio, string horafin, string horainicio, string sucursal, string estadopedido, string cliente, string paciente, string empconsulta, string laboratorio, bool porusuario, int tipo, string vista)
        {
            if (sucursal is null)
                sucursal = getIdSucursal().ToString();

            var rows = await DAO.listarpedidoArrayAsync(fechafin, fechainicio, horafin, horainicio, sucursal, estadopedido, cliente, paciente, empconsulta, laboratorio, porusuario, tipo, vista);
            return Json(new { rows });
        }
        //

        public async Task<IActionResult> GetHistorialVentaslistarArray(string numdocumento, string cliente, string fechainicio, string fechafin, string sucursal)
        {
            if (sucursal is null)
                sucursal = getIdSucursal().ToString();

            var rows = await DAO.HistorialVentasArrayAsync(numdocumento, cliente, fechainicio, fechafin, sucursal);
            return Json(new { rows });
        }



        public IActionResult Listartipopedido()
        {
            var data = DAO.listartipopedido();
            return Json(JsonConvert.SerializeObject(data));
        }

        // CODIGO PARA VERIFICAR SI EL PACIENTE YA COBRO SU BONO POR CUMPLEAÑOS
        public IActionResult verificionDescuentoGlobal( int idcliente )
        {
            var data = DAO.verificionDescuentoGlobal(idcliente);
            return Json(JsonConvert.SerializeObject(data));
        }
    }
}
