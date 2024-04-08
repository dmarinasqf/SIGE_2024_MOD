using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ERP.Controllers;
using ENTIDADES.Identity;
using ENTIDADES.Generales;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using INFRAESTRUCTURA.Areas.Maestros.INTERFAZ;
using INFRAESTRUCTURA.Areas.Maestros.DAO;
using ERP.Models.Ayudas;
using Newtonsoft.Json;
using System.Net;
using System.IO;
using INFRAESTRUCTURA.Areas.Maestros.cliente.command;
using INFRAESTRUCTURA.Areas.Maestros.cliente.query;
using Microsoft.AspNetCore.Hosting;
using Erp.SeedWork;

namespace ERP.Areas.Maestros.Controllers
{
    [Area("Maestros")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ClienteController : _baseController
    {
        private readonly Modelo db;
        private readonly ClienteDAO DAO;
        private readonly IClienteEF EF;
        private readonly IWebHostEnvironment ruta;

        public ClienteController(IWebHostEnvironment ruta_,IClienteEF EF_, Modelo context, ICryptografhy cryptografhy, SignInManager<AppUser> signInManager) : base(cryptografhy, signInManager)
        {
            db = context;
            EF = EF_;
            LeerJson settings = new LeerJson();
            DAO = new ClienteDAO(settings.GetConnectionString());
            ruta = ruta_;
        }
        [Authorize(Roles = "ADMINISTRADOR, MANTENEDOR_CLIENTE")]
        public IActionResult Index()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR, MANTENEDOR_CLIENTE")]

        public IActionResult RegistrarEditar(int? id)
        {
            datosinicio();
            ViewBag.idcliente = id;
            if(id!=null)
            {
                var cliente = db.CLIENTE.Find(id.Value);
                if (cliente is null)
                    return NotFound();
            }
            return View();
        }
        [HttpPost]
        public IActionResult RegistrarEditar(Cliente cliente)
        {

            var demo = cliente;
            return Json(EF.RegistrarEditar(cliente));
        }
        public IActionResult BuscarClientes(string filtro, int top)
        {
            return Json(JsonConvert.SerializeObject(DAO.BuscarClientes(filtro, top)));
        } 
        public async Task<IActionResult> BuscarClientesPaginacion(BuscarClientes.Ejecutar obj)
        {
            var data = DAO.BuscarClientes(obj.filtro, obj.top);
            return Json(await _mediator.Send(obj));
        } 
        public IActionResult BuscarCliente(string numdocumento)
        {
            return Json(EF.BuscarCliente(numdocumento));
        }
        public IActionResult BuscarClientebyId(int idcliente)
        {
            return Json(EF.BuscarClientebyId(idcliente));
        }
        public async Task<IActionResult> BuscarClientesEF(string filtro)
        {
            return Json(await EF.BuscarClientesAsync(filtro));
        }
          public async Task<IActionResult> RegistrarEditarCliente(RegistrarEditarCliente.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> RegistrarImagen(RegistrarImagen.Ejecutar obj)
        {
            obj.ruta = ruta.WebRootPath;
            return Json(await _mediator.Send(obj)); 
        }
        public async Task<IActionResult> BuscarClienteCompleto(BuscarClienteCompleto.Ejecutar obj)
        {
         
            return Json(await _mediator.Send(obj));
        }
        
          public async Task<IActionResult> RegistrarEditarClienteAsociado(RegistrarEditarAsociado.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj)) ;
        }

        public IActionResult ConsultarRucReniec(string numdocumento,string tipo)
        {
            try
            {
                tipo = tipo.ToLower();
                LeerJson settings = new LeerJson();
                var endpoint = "";
                endpoint = settings.LeerDataJson("apisperu:urldni");
                endpoint += "persona/consulta/";
                if (tipo == "ruc") { 
                    endpoint += "ruc/" + numdocumento;
                    //endpoint += "ruc?numero=" + numdocumento;
                }
                if (tipo == "dni") {
                    endpoint += "dni?numero=" + numdocumento;
                    endpoint += "dni/" + numdocumento;
                }
                //endpoint += $"{numdocumento}?{settings.LeerDataJson("apisperu:token")}";
                //endpoint += $"{numdocumento}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFkbWluQHFmLmNvbS5wZSJ9.5h-kFNtc43d0K-6X2wJHF3Lir2wYlV4OiTBbcTMHjns";
                //endpoint += $"{numdocumento}";
                //string endpoint = "https://api.reniec.cloud/dni/73514059";
                HttpWebRequest request = WebRequest.Create(endpoint) as HttpWebRequest;
                request.Method = "GET";
                request.ContentType = "application/json";
               HttpWebResponse response = request.GetResponse() as HttpWebResponse;
                StreamReader reader = new StreamReader(response.GetResponseStream());
                string json = reader.ReadToEnd();
                //var demo= Json(new mensajeJson("ok", json));
                return Json(new mensajeJson("ok", json));
            }
            catch (Exception e)
            {
                return Json(new mensajeJson( e.Message,null));
            }
          
        }

        public async Task<IActionResult> GenerarExcelClientes(string text)
        {
            var data = await DAO.GenerarExcelClientes(ruta.WebRootPath);
            return Json(data);
        }
    }
}
