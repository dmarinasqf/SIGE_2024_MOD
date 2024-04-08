using ENTIDADES.Identity;
using Erp.Persistencia.Servicios;
using Erp.SeedWork;
using ERP.Controllers;
using ERP.Models.Ayudas;
using Gdp.Infraestructura.Asistencia.control.command;
using Gdp.Infraestructura.Asistencia.control.query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;

namespace Erp.AppWeb.Areas.Asistencia.Controllers
{
    [Area("Asistencia")]
    [Authorize]
    [ResponseCache(NoStore = true, Duration = 0)]
    public class ControlController : _baseController
    {
        private readonly IWebHostEnvironment ruta;
        public ControlController(IWebHostEnvironment ruta_, ICryptografhy _cryptografhy, SignInManager<AppUser> signInManager) : base(_cryptografhy, signInManager)
        {
            ruta = ruta_;
        }

        public IActionResult Index()
        {
            datosinicio();
            return View();
        }
        [Authorize(Roles = "ADMINISTRADOR,SUPERVISOR")]
        public IActionResult AgregarAutoridad()
        {
            datosinicio();
            return View();
        }
        public IActionResult EnviarEmail1(string email, string htmlbody)
        {
            
            try 
            {
                LeerJson settings = new LeerJson();
                var correoenvia = settings.LeerDataJson("Correo:Email");
                var clave = settings.LeerDataJson("Correo:Password");
                var host = settings.LeerDataJson("Correo:Host");
                var port = settings.LeerDataJson("Correo:Port");

                // Crea el mensaje estableciendo quién lo manda y quién lo recibe
                MailMessage correo = new MailMessage();
                correo.From = new MailAddress(correoenvia);//de:
                correo.To.Add(email);//para
                correo.Subject = "prueba";
                correo.Body = htmlbody;
                correo.IsBodyHtml = true;
                correo.Priority = MailPriority.Normal;

                //string path = ruta.WebRootPath + '/Email';
                SmtpClient smtp = new SmtpClient();
                smtp.Host = host;//"smtp.gmail.com";
                smtp.EnableSsl = true;
                smtp.UseDefaultCredentials = true;
                smtp.Port = int.Parse(port);
                smtp.Credentials=new System.Net.NetworkCredential(correoenvia , clave);
                smtp.Send(correo);
                smtp.Dispose();

                return Json(new mensajeJson("ok", correo));
            }
            catch (Exception e)
            {
                return Json(new mensajeJson(e.Message, null));
            }
        }

        public async Task<IActionResult> AccederRegistro(GetEmpleadoXDoc.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        //public async Task<IActionResult> ListarEmpleadosA(GetListarEmpleadosA.Ejecutar obj)
        //{
        //    return Json(await _mediator.Send(obj));
        //}
        //public async Task<IActionResult> ListaEmpleadosNA(GetListaEmpleadosNA.Ejecutar obj)
        //{
        //    return Json(await _mediator.Send(obj));
        //}
        public async Task<IActionResult> getUltimoRegistro(GetUltimoRegistro.Ejecutar obj)
        {
            return Json(await _mediator.Send(obj));
        }
        public async Task<IActionResult> RegistrarEditar(RegistrarEditarAsistencia.Ejecutar data)
        {
            return Json(await _mediator.Send(data));
        }
        public async Task<IActionResult> AutorizarEmp(RegistrarEmpleadoAutorizado.Ejecutar data)
        {
            return Json(await _mediator.Send(data));
        }

    }
}
