using ENTIDADES.Identity;
using Erp.Infraestructura.Areas.Procedimiento.DAO;
using Erp.Persistencia.Servicios;
using Erp.Persistencia.Servicios.Users;
using ERP.Controllers;
using ERP.Models.Ayudas;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;
using Erp.Persistencia.Modelos;
using ENTIDADES.Vinali;
using Newtonsoft.Json;
using Erp.SeedWork;

namespace Erp.AppWeb.Areas.Procedimiento.Controllers
{
    [Area("Procedimiento")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ProcedimientoController : _baseController
    {
        private readonly ProcedimientoDAO DAO;
        private readonly ISucursalEF EF;
        private readonly IWebHostEnvironment ruta;
        private readonly IUser user;
        private readonly Modelo db;
        public ProcedimientoController(Modelo _db, ISucursalEF context,IWebHostEnvironment _ruta, IUser _user, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            EF = context;
            LeerJson settings = new LeerJson();
            DAO = new ProcedimientoDAO(settings.GetConnectionString());
            ruta = _ruta;
            user = _user;
            db = _db;
        }
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }
        public IActionResult RProcedimiento() {

            datosinicio();
            return View();
        }
        public async Task<IActionResult> ListarProcedimiento(string fecha,string sucursal, string perfil, string empconsulta)
        {
            string fechainicio, fechafin;
            if(fecha!=null) { 
                string[] fechas = fecha.Split("-");
                fechainicio = fechas[0].Trim();
                fechafin = fechas[1].Trim();
            }else {
                fechainicio = null;
                fechafin = null;
            }

            sucursal = user.getIdSucursalCookie().ToString();
            empconsulta = user.getUserName();
            var data = DAO.listarproc(fechainicio, fechafin, sucursal, empconsulta);
            return Json(await data);   
        }
        public IActionResult ListadoTipoProcedimiento()
        {
            int idsuc = getIdSucursal();
            return Json(EF.ListadoTipoProcedimiento(idsuc));
        }
        [HttpPost]
        public IActionResult RegistrarProcedimiento(Procedimientos procedimiento, DetalleProcedimiento[] detalle, DetalleProcedimientoArticulo[] articulos)
        {

            using (var transaccion = db.Database.BeginTransaction()) {
                try {
                    string sucursal = user.getIdSucursalCookie().ToString();
                    string iduser = user.getIdUserSession();
                    procedimiento.suc_codigo = Convert.ToInt32(sucursal);
                    procedimiento.usuariocrea = iduser;
                    procedimiento.fechacreacion = DateTime.Now;
                    procedimiento.fecha = DateTime.Now;
                    db.PROCEDIMIENTO.Add(procedimiento);
                    db.SaveChanges();
                    List<DetalleProcedimiento> listadetalle = new List<DetalleProcedimiento>();
                    for (int i = 0; i < detalle.Length; i++) {
                        listadetalle.Add(new DetalleProcedimiento {
                            costo = detalle[i].costo,
                            index = detalle[i].index,
                            procedimiento_codigo = procedimiento.procedimiento_codigo,
                            tipodeproc_codido = detalle[i].tipodeproc_codido,
                            estado = "HABILITADO"
                        });
                    }
                    db.DETALLEPROCEDIMIENTO.AddRange(listadetalle);
                    db.SaveChanges();
                    List<DetalleProcedimientoArticulo> listaarticulos;

                    foreach (var item in listadetalle) {
                        listaarticulos = new List<DetalleProcedimientoArticulo>();
                        for (int i = 0; i < articulos.Length; i++) {
                            if (item.index == articulos[i].index) {
                                listaarticulos.Add(new DetalleProcedimientoArticulo {
                                    articulo_codigo = articulos[i].articulo_codigo,
                                    detalleproc_codigo = item.detalleproc_codigo,
                                    cantidad = articulos[i].cantidad,
                                    estado = "HABILITADO"
                                });
                            }
                        }
                        db.DETALLEPROCEDIMIENTOARTICULO.AddRange(listaarticulos);
                        db.SaveChanges();
                    }


                    transaccion.Commit();
                    return Json(new mensajeJson("ok", procedimiento));
                }
                catch (Exception e) {
                    transaccion.Rollback();
                    return Json(new mensajeJson(e.Message, null));
                }
            }
            
        }
    
        public async Task<IActionResult> BuscarPedidoCompleto(int codigo){
            var data = DAO.BuscarPedidoCompleto(codigo);
            return Json(await data);
        }
    }
}
