using ENTIDADES.Almacen;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using Erp.SeedWork;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using INFRAESTRUCTURA.Areas.Almacen.INTERFAZ;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Erp.AppWeb.Areas.Almacen.Controllers
{
    [Area("Almacen")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class AAlmacenProduccionController : _baseController
    {
        private readonly IAlmacenTransferenciaEF EF;
        private readonly AlmacenTransferenciaDAO DAO;
        public AAlmacenProduccionController(Modelo context, IAlmacenTransferenciaEF _EF, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            //db = context;
            EF = _EF;
            LeerJson settings = new LeerJson();
            DAO = new AlmacenTransferenciaDAO(settings.GetConnectionString());
        }
        [Authorize(Roles = ("ADMINISTRADOR"))]
        public IActionResult Index()
        {
            datosinicio();
            return View();
            //return View(await EF.ListarAsync());
        }
        [Authorize(Roles = ("ADMINISTRADOR"))]
        public IActionResult RegistrarEditar(int? id)
        {
            datosinicio();
            if (id != null || id is not null)
            {
                //AAlmacenTransferencia oAlmacenTransferencia = new AAlmacenTransferencia();
                //oAlmacenTransferencia.idalmacentransferencia = Convert.ToInt32(id);
                //return View(oAlmacenTransferencia);
            }
            //else
                return View();
        }

        [Authorize(Roles = ("ADMINISTRADOR"))]
        [HttpPost]
        public async Task<IActionResult> RegistrarEditar(AAlmacenProduccion oAlmacenproduccion)
        {
            oAlmacenproduccion.usuariocrea =getIdEmpleado().ToString();
            
            var rpt = await EF.RegistrarEditarProduccionAsync(oAlmacenproduccion);
            
            if (rpt.mensaje == "ok")
            {
                var rptws = await EnvioAlmacenProduccion(oAlmacenproduccion.jsondetalle);
                return Json(rptws);
            }
            else {
                return Json(rpt);
            }
        }

        public  Task<mensajeJson> EnvioAlmacenProduccion(string transferencia) {
            try {
                //SCRIPT PARA GENERAR LA ESTRUCTURA JSON CON LOS DATOS A GUARDAR
                DataTable dtreposicion = new DataTable("reposicion");
                dtreposicion.Columns.Add("detalle_reposicion", typeof(DataTable));
                dtreposicion.Columns.Add("detalle_inventario", typeof(DataTable));
                DataTable dtdetalle_reposicion = new DataTable("detalle_reposicion");
                DataTable dtdetalle_inventario = new DataTable("detalle_inventario");
                DataTable dtgrid = new DataTable("dtgrid");
                //CAMPOS DEL GRID
                dtgrid.Columns.Add("idproducto", typeof(int));
                dtgrid.Columns.Add("codigo", typeof(string));
                dtgrid.Columns.Add("descripcion_producto", typeof(string));
                dtgrid.Columns.Add("cant_existencial", typeof(string));
                dtgrid.Columns.Add("idunidad", typeof(string));
                dtgrid.Columns.Add("numlote", typeof(string));
                dtgrid.Columns.Add("fechafabricacion", typeof(string));
                dtgrid.Columns.Add("fechavalidez", typeof(string));
                dtgrid.Columns.Add("porcentaje_dilucion", typeof(int));
                dtgrid.Columns.Add("densidad", typeof(int));
                dtgrid.Columns.Add("cant_agua", typeof(int));
                dtgrid.Columns.Add("porcentaje_alcohol", typeof(int));
                dtgrid.Columns.Add("din", typeof(string));
                dtgrid.Columns.Add("escala", typeof(string));
                dtgrid.Columns.Add("idfornecedor", typeof(int));
                dtgrid.Columns.Add("idlocalizacion_lote", typeof(int));
                dtgrid.Columns.Add("idempresa", typeof(int));
                dtgrid.Columns.Add("idsucursal", typeof(int));
                dtgrid.Columns.Add("usuariocrea", typeof(int));
                dtgrid.Columns.Add("precio_compra", typeof(decimal));
                dtgrid.Columns.Add("descripcion_unidad", typeof(string));
                dtgrid.Columns.Add("factor_conversion_gramo", typeof(decimal));

                //CAMPOS PARA EL DETALLE DEL INVENTARIO
                dtdetalle_inventario.Columns.Add("idproducto", typeof(int));
                dtdetalle_inventario.Columns.Add("numero_lote", typeof(string));
                dtdetalle_inventario.Columns.Add("nombre_usuario", typeof(string));
                dtdetalle_inventario.Columns.Add("cantidad_movimiento", typeof(string));
                dtdetalle_inventario.Columns.Add("descripcion_historico", typeof(string));
                dtdetalle_inventario.Columns.Add("idempresa", typeof(int));
                dtdetalle_inventario.Columns.Add("idsucursal", typeof(int));
                dtdetalle_inventario.Columns.Add("usuariocrea", typeof(int));
                dtdetalle_inventario.Columns.Add("stock_actual", typeof(decimal));
                dtdetalle_inventario.Columns.Add("stock_anterior", typeof(decimal));
                dtdetalle_inventario.Columns.Add("idtipo_operacion", typeof(int));

                var dtproductos_ = JsonConvert.DeserializeObject<DataTable>(transferencia);

                foreach (DataRow row in dtproductos_.Rows) {
                    DataRow newrow = dtgrid.NewRow();
                    newrow["idproducto"] =Convert.ToInt64(row["prod_intuictive"].ToString());
                    newrow["codigo"] = row["prod_intuictive"].ToString();
                    newrow["descripcion_producto"] = row["descripcion"].ToString();
                    newrow["cant_existencial"] = row["cantidad"].ToString();
                    newrow["idunidad"] = row["iduma"].ToString();
                    newrow["numlote"] = row["lote"].ToString();
                    newrow["fechafabricacion"] = "";
                    newrow["fechavalidez"] = row["fechavencimiento"].ToString();
                    newrow["porcentaje_dilucion"] = 0;                                                                 
                    newrow["densidad"] = 0;
                    newrow["cant_agua"] = 0;
                    newrow["porcentaje_alcohol"] = 0;
                    newrow["din"] = "";
                    newrow["escala"] = "";
                    newrow["idfornecedor"] = 18;
                    newrow["idlocalizacion_lote"] = 2;
                    newrow["idempresa"] = getEmpresa();
                    newrow["idsucursal"] = 18;
                    newrow["usuariocrea"] = getIdEmpleado();
                    newrow["precio_compra"] = 0;
                    newrow["descripcion_unidad"] = row["iduma"].ToString();
                    newrow["factor_conversion_gramo"] = 1;

                    dtgrid.Rows.Add(newrow);
                }

                var dtproductos = dtgrid.Copy();
                
                foreach (DataRow dr in dtproductos.Rows) {
                    dr["idfornecedor"] = "18";
                    dr["idlocalizacion_lote"] = "2";//valor estatico del almacen de intuictive
                    dr["idempresa"] = getEmpresa();//1000
                    dr["idsucursal"] = dr["idsucursal"];//18
                    dr["usuariocrea"] = getIdEmpleado();//emp_codigo
                    dr["cant_existencial"] = dr["cant_existencial"]; //Convert.ToInt64(dr["cant_existencial"].ToString()) * Convert.ToDecimal(dr["factor_conversion_gramo"]);//cantidad_transferencia

                    dtdetalle_inventario.Rows.Add(
                        dr["idproducto"].ToString(),
                        dr["numlote"].ToString(),
                        getIdEmpleado().ToString(),
                        dr["cant_existencial"],
                        "INGRSO POR TRANSFERENCIA DESDE SIGE POR " + dr["cant_existencial"] +" "+dr["descripcion_unidad"] +" DE " + dr["descripcion_producto"] + "'S",
                        getEmpresa(),
                        dr["idsucursal"],
                        getIdEmpleado().ToString(),
                        dr["cant_existencial"],
                        dr["cant_existencial"],
                        "1"
                        );
                }
                dtdetalle_reposicion = dtproductos;

                dtreposicion.Rows.Add(dtdetalle_reposicion, dtdetalle_inventario);
                LeerJson settings = new LeerJson();
                string urlws = "";
                urlws = settings.LeerDataJson("apisperu:urlws");
                var respuesta = EF.ServiceTransferenciaProduccion(dtreposicion,urlws); //serviceInventario.reposicionstock_agregar(dtreposicion);

                return respuesta;
            }
            catch (Exception vex) {
                return null;
            }            
        }

    }
}
