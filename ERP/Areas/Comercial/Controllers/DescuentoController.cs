using ENTIDADES.comercial;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Comercial.DAO;
using INFRAESTRUCTURA.Areas.Comercial.descuentos;
using INFRAESTRUCTURA.Areas.Comercial.Interfaz;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;

using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Erp.Infraestructura.Areas.Ventas.DAO;
using ENTIDADES.ventas;
using Erp.Entidades.comercial;

namespace ERP.Areas.Comercial.Controllers
{
    [Authorize]
    [Area("Comercial")]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class DescuentoController : _baseController
    {
        private readonly Modelo db;
        private readonly IDescuentoEF EF;
        private readonly DescuentoDAO dao;
        //private readonly CanalVentaDAO dao_cv;

        public DescuentoController(IDescuentoEF EF_, Modelo db_, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            db = db_;
            EF = EF_;
            LeerJson settings = new LeerJson();
            dao = new DescuentoDAO(settings.GetConnectionString());
            //dao_cv = new CanalVentaDAO(settings.GetConnectionString());
        }
        [Authorize(Roles = "CREAR DESCUENTOS, ADMINISTRADOR")]
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "CREAR DESCUENTOS, ADMINISTRADOR")]
        public IActionResult Mantenimiento()
        {
            //ViewBag.canalVentas = dao_cv.ListarCanalesPrecios();
            datosinicio();
            return View();
        }
        [Authorize(Roles = "REPORTE DESCUENTOS A COBRAR, ADMINISTRADOR")]
        public IActionResult ReporteDescuentosACobrar()
        {
            datosinicio();
            return View();
        }

        public async Task<IActionResult> RegistrarEditar(Descuento descuento, string detalle, string canalVentas)
        {
            var jsondetalle = JsonConvert.DeserializeObject<List<DescuentoDetalle>>(detalle); //EARTCOD1022
            return Json(await EF.RegistrarEditarAsync(descuento, jsondetalle, canalVentas));
        }

        public async Task<IActionResult> RegistrarEditarValidacionUsuario(string usuario, string clave, Descuento descuento, List<DescuentoDetalle> detalle, string canalVentas)
        {
            return Json(await EF.RegistrarEditarValidacionUsuario(usuario, clave, descuento, detalle, canalVentas));
        }
        public async Task<IActionResult> ListarDescuentos(ListarDescuentos.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public IActionResult ListarSucursalDescuento(int iddescuento)
        {
            return Json(EF.ListarSucursalDescuento(iddescuento));
        }
        public IActionResult AsignarDescuentoSucursalEnBloque(int iddescuento, List<string> idsucursal)
        {
            return Json(EF.AsignarDescuentoSucursalEnBloque(iddescuento, idsucursal));
        }
        public IActionResult GetDescuentoCompleto(int id)
        {
            var data = dao.GetDescuentoCompleto(id);
            return Json(JsonConvert.SerializeObject(data));
        }
        public async Task<IActionResult> EditarDescuento(Descuento descuento, List<string> detalle)
        {
            return Json(await EF.EditarDescuentoAsync(descuento, detalle));
        }
        public IActionResult ListarDescuentosxProducto(int idprecio, int idproducto, int idsucursal)
        {
            if (idsucursal is 0)
                idsucursal = getIdSucursal();
            var data = dao.ListarDescuentosxProducto(idprecio, idproducto, idsucursal);
            return Json(JsonConvert.SerializeObject(data));
        }
        public IActionResult GetReporteDescuentosCobrar(string fechainicio, string fechafin, string estado, string tipo, string idlabpro)
        {

            var data = dao.ReporteDescuentosCobrar(fechainicio, fechafin, estado, tipo, idlabpro);
            return Json(JsonConvert.SerializeObject(data));
        }

        //EARTCOD1008 - OPCION DESCUENTO PERSONAL 
        [Authorize(Roles = "CREAR DESCUENTOS, ADMINISTRADOR")]
        public IActionResult DescuentoPersonal()
        {
            datosinicio();
            return View();
        }

        [Authorize(Roles = "CREAR DESCUENTOS, ADMINISTRADOR")]
        public IActionResult AgregarDescuentoCliente(DescuentoCliente oDescuentoCliente)
        {
            datosinicio();
            int usuario = Convert.ToInt32(ViewBag.IDEMPLEADO);
            string fecha = DateTime.Now.ToString();

            oDescuentoCliente.usuariocrea = usuario;
            oDescuentoCliente.fechacreacion = fecha;
            oDescuentoCliente.usuariomodifica = usuario;
            oDescuentoCliente.fechaedicion = fecha;
            oDescuentoCliente.estado = 1;

            string clientes = "";
            int contador = 0;
            var lDescuentoClienteDetalle = JsonConvert.DeserializeObject<List<DescuentoClienteDetalle>>(oDescuentoCliente.jsondetalle);
            foreach (var item in lDescuentoClienteDetalle)
            {
                if (contador == 0)
                    clientes += item.idcliente;
                else
                    clientes += "," + item.idcliente;

                item.estado = 1;
                item.usuariocrea = usuario;
                item.fechacreacion = fecha;
                item.usuariomodifica = usuario;
                item.fechaedicion = fecha;
            }
            oDescuentoCliente.jsondetalle = JsonConvert.SerializeObject(lDescuentoClienteDetalle);
            oDescuentoCliente.clientes = clientes;
            var respuesta = dao.AgregarDescuentoCliente(oDescuentoCliente);
            return Json(JsonConvert.SerializeObject(respuesta));
        }

        //EARTCOD1008.1//--------------
        public IActionResult ListarDescuentoCliente(string nombredescuento)
        {
            string nombre = nombredescuento == null ? "" : nombredescuento;
            var data = dao.ListarDescuentoCliente(nombre);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult BuscarDescuentoCliente(int iddescuentocliente)
        {
            var data = dao.BuscarDescuentoCliente(iddescuentocliente);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult EditarDescuentoCliente(DescuentoCliente oDescuentoCliente)
        {
            int usuario = Convert.ToInt32(ViewBag.IDEMPLEADO);
            string fecha = DateTime.Now.ToString();

            oDescuentoCliente.usuariomodifica = usuario;
            oDescuentoCliente.fechaedicion = fecha;
            oDescuentoCliente.estado = 1;

            string clientes = "";
            int contador = 0;
            var lDescuentoClienteDetalle = JsonConvert.DeserializeObject<List<DescuentoClienteDetalle>>(oDescuentoCliente.jsondetalle);
            foreach (var item in lDescuentoClienteDetalle)
            {
                if (contador == 0)
                    clientes += item.idcliente;
                else
                    clientes += "," + item.idcliente;

                item.estado = 1;
                item.usuariocrea = usuario;
                item.fechacreacion = fecha;
                item.usuariomodifica = usuario;
                item.fechaedicion = fecha;
            }
            oDescuentoCliente.jsondetalle = JsonConvert.SerializeObject(lDescuentoClienteDetalle);
            oDescuentoCliente.clientes = clientes;
            var data = dao.EditarDescuentoCliente(oDescuentoCliente);
            return Json(JsonConvert.SerializeObject(data));
        }
        //FIN EARTCOD1008 - OPCION DESCUENTO PERSONAL 


        //--EARTCOD1009 - OPCION PACK DE PROMOCIONES
        [Authorize(Roles = "CREAR DESCUENTOS, ADMINISTRADOR")]
        public IActionResult PackPromociones()
        {
            datosinicio();
            return View();
        }

        public IActionResult PromocionesPackBuscarProducto(string codigoproducto)
        {
            var data = dao.PromocionesPackBuscarProducto(codigoproducto);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult PromocionesPackAgregar(PromocionPack promocionPack)
        {
            datosinicio();
            promocionPack.usuariocrea = ViewBag.IDEMPLEADO;
            var data = dao.PromocionesPackAgregar(promocionPack);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult PromocionesPackEditar(PromocionPack promocionPack)
        {
            datosinicio();
            promocionPack.usuariomodifica = ViewBag.IDEMPLEADO;
            var data = dao.PromocionesPackEditar(promocionPack);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult PromocionesPackListar(string nombrepack)
        {
            nombrepack = nombrepack != null ? nombrepack : "";
            var data = dao.PromocionesPackListar(nombrepack);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult PromocionesPackbuscar(int idpromopack)
        {
            var data = dao.PromocionesPackbuscar(idpromopack);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult PromocionBuscarProductoStockVenta(int idsucursal, int idlistaprecio, int idpromopack)
        {
            var data = dao.PromocionBuscarProductoStockVenta(idsucursal, idlistaprecio, idpromopack);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult PromocionPackPedidoDetalleAgregar(List<PromocionPackPedidoDetalle> packPedidoDetalle)
        {
            var data = dao.PromocionPackPedidoDetalleAgregar(packPedidoDetalle);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult PromocionPackSucursales(int idempresa)
        {
            var data = dao.PromocionPackSucursales(idempresa);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult PromocionPackSucursalAgregar(List<PromocionPackSucursal> packSucursales, int incentivo, int usuario)
        {
            var data = dao.PromocionPackSucursalAgregar(packSucursales, incentivo, usuario);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult PromocionPackSucursalLista(int idpromopack)
        {
            var data = dao.PromocionPackSucursalLista(idpromopack);
            return Json(JsonConvert.SerializeObject(data));
        }
        //--FIN EARTCOD1009 - OPCION PACK DE PROMOCIONES


        //EARTCOD1008.1 -06-06-2023
        //DESCUENTO PERSONAL CON OPCION DE CANALES Y TIPOS DE PRODUCTOS
        public IActionResult ProductosTiposListar()
        {
            var data = dao.ProductosTiposListar();
            return Json(JsonConvert.SerializeObject(data));
        }


        //--EARTCOD1021 - NUEVA OPCION PARA OBSEQUIAR UN PRODUCTO EN BASE A UNA SUMA
        [Authorize(Roles = "CREAR DESCUENTOS, ADMINISTRADOR")]
        public IActionResult PromoProductoObsequio()
        {
            datosinicio();
            return View();
        }

        public IActionResult ProveedoresListar(string descripcion)
        {
            string _descripcion = descripcion == null ? "" : descripcion;
            var data = dao.ProveedoresListar(_descripcion);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult LaboratoriosListar(int idproveedor, string descripcion)
        {
            string _descripcion = descripcion == null ? "" : descripcion;
            var data = dao.LaboratoriosListar(idproveedor, _descripcion);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult LaboratoriosProductosListar(int idlaboratorio, string nombre)
        {
            string _nombre = nombre == null ? "" : nombre;
            var data = dao.LaboratoriosProductosListar(idlaboratorio, _nombre);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult PromoProductoObsequioAgregar(PromoProductoObsequio promoProductoObsequio)
        {
            datosinicio();
            promoProductoObsequio.usuariocrea = Convert.ToInt32(ViewBag.IDEMPLEADO);
            var data = dao.PromoProductoObsequioAgregar(promoProductoObsequio);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult PromoProductoObsequioListar(string nombrepromo)
        {
            string _nombrepromo = nombrepromo == null ? "" : nombrepromo;
            var data = dao.PromoProductoObsequioListar(_nombrepromo);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult PromoProductoObsequioEditar(PromoProductoObsequio promoProductoObsequio)
        {
            datosinicio();
            promoProductoObsequio.usuarioedita = Convert.ToInt32(ViewBag.IDEMPLEADO);
            var data = dao.PromoProductoObsequioEditar(promoProductoObsequio);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult PromoProductoBuscarObsequio(string productos, string idsucursal, string idcanalventa)
        {
            var data = dao.PromoProductoBuscarObsequio(productos, idsucursal, idcanalventa);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult PromocionBuscarProductoObsequioStockVenta(int idsucursal, int idlistaprecio, int idpromoobsequio)
        {
            var data = dao.PromocionBuscarProductoObsequioStockVenta(idsucursal, idlistaprecio, idpromoobsequio);
            return Json(JsonConvert.SerializeObject(data));
        }

        public IActionResult BuscarDescuentoPorCliente(int idcliente)
        {
            var data = dao.BuscarDescuentoPorCliente(idcliente);
            return Json(JsonConvert.SerializeObject(data));
        }
    }
}
