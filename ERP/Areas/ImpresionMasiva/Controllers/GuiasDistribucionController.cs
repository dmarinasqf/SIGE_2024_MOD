using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using DinkToPdf.Contracts;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using ERP.Controllers;
using ERP.Models.Ayudas;
using INFRAESTRUCTURA.Areas.Almacen.DAO;
using INFRAESTRUCTURA.Areas.PreIngreso.DAO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace ERP.Areas.ImpresionMasiva.Controllers
{
    [Area("ImpresionMasiva")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class GuiasDistribucionController : _baseController
    {
        private readonly Modelo db;
        private readonly IConverter pdf;
        //private readonly MantenimientoGuiaDAO DAO;
        private readonly GuiaSalidaDAO DAO;
        public GuiasDistribucionController(IConverter pdf_, Modelo db_, ICryptografhy crytografy, SignInManager<AppUser> signInManager) : base(crytografy, signInManager)
        {
            db = db_;
            pdf = pdf_;
            LeerJson settings = new LeerJson();
            DAO = new GuiaSalidaDAO(settings.GetConnectionString());
        }
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }
        public IActionResult Imprimir(string codigos)
        {
            try
            {
                var codigosSeparados = codigos.Split("_");
                List<DataTable> lDtDatos = new List<DataTable>();
                for (int i = 0; i < codigosSeparados.Length; i++)
                {
                    lDtDatos.Add(DAO.getTablaGuiasSalidaImpresion(codigosSeparados[i]));
                }
                //var abc = JsonConvert.SerializeObject(data);
                return View(lDtDatos);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
    }
}
