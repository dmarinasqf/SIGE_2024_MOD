using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ERP.Models;
using Microsoft.AspNetCore.Authorization;
using ERP.Models.Ayudas;
using MimeKit;
using Wkhtmltopdf.NetCore;
using Rotativa.AspNetCore;
using Erp.Persistencia.Servicios;
using Microsoft.AspNetCore.Identity;
using ENTIDADES.Identity;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
namespace ERP.Controllers
{

    public class _baseController : Controller
    {
        private readonly ICryptografhy cryptografhy;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IMediator mediator;
        protected IMediator _mediator => mediator ?? HttpContext.RequestServices.GetService<IMediator>();
        public _baseController(ICryptografhy _cryptografhy, SignInManager<AppUser> signInManager)
        {
            cryptografhy = _cryptografhy;
            _signInManager = signInManager;
        }
        public void datosinicio()
        {

            try
            {
                ViewBag.IDEMPLEADO = cryptografhy.Decrypt(Request.Cookies["IDEMPLEADO"]);
                ViewBag.NOMBREUSUARIO = Request.Cookies["EMPLEADONOMBRES"];
                ViewBag.IDSUCURSAL = cryptografhy.Decrypt(Request.Cookies["IDSUCURSAL"]);
                ViewBag.IDEMPRESA = cryptografhy.Decrypt(Request.Cookies["IDEMPRESA"]);
                ViewBag.SUCURSAL = Request.Cookies["SUCURSAL"];
                ViewBag.EMPRESA = Request.Cookies["EMPRESA"];
                ViewBag.GRUPO = Request.Cookies["GRUPO"];
                ViewBag.FOTOEMPLEADO = Request.Cookies["FOTOEMPLEADO"];
                ViewBag.LOGOEMPRESA = Request.Cookies["LOGOEMPRESA"];
                try
                {
                    if(Request.Cookies["USERNAME"] != null)
                        ViewBag.USERNAME = Request.Cookies["USERNAME"].ToString();
                    else
                        ViewBag.USERNAME = "";
                }
                catch (Exception) { }
                ViewBag.VERSION = "V 4.0.0.0";
                ViewBag.NOMBREAPP = Request.Cookies["NOMBREAPP"];
            }
            catch (ArgumentNullException)
            {
                _signInManager.SignOutAsync();
            }
        }
        public int getEmpresa()
        {
            try
            {
                if (Request.Cookies["IDEMPRESA"] is null)
                    _signInManager.SignOutAsync();
                var nameCookie = cryptografhy.Decrypt(Request.Cookies["IDEMPRESA"]);
                return int.Parse(nameCookie.ToString());
            }
            catch (ArgumentNullException)
            {
                _signInManager.SignOutAsync();
                throw;
            }

        }
        public string getNombreEmpresa()
        {
            try
            {
                if (Request.Cookies["EMPRESA"] is null)
                    _signInManager.SignOutAsync();
                var nameCookie = Request.Cookies["EMPRESA"];
                return nameCookie.ToString();
            }
            catch (ArgumentNullException)
            {
                _signInManager.SignOutAsync();
                throw;
            }

        }
        public int getIdSucursal()
        {
            try
            {
                if (Request.Cookies["IDSUCURSAL"] is null)
                    _signInManager.SignOutAsync();
                var nameCookie = cryptografhy.Decrypt(Request.Cookies["IDSUCURSAL"]);
                return int.Parse(nameCookie.ToString());
            }
            catch (ArgumentNullException)
            {
                _signInManager.SignOutAsync();
                throw;
            }

        }
        public int getIdEmpleado()
        {
            try
            {
                if (Request.Cookies["IDEMPLEADO"] is null)
                    _signInManager.SignOutAsync();

                var Cookie = cryptografhy.Decrypt(Request.Cookies["IDEMPLEADO"]);
                return int.Parse(Cookie);
            }
            catch (ArgumentNullException)
            {
                _signInManager.SignOutAsync();
                throw;
            }

        }
        public string getdocumentoempleado()
        {
            try
            {
                if (Request.Cookies["DOCEMPLEADO"] is null)
                    _signInManager.SignOutAsync();

                var Cookie = cryptografhy.Decrypt(Request.Cookies["DOCEMPLEADO"]);
                return (Cookie);
            }
            catch (ArgumentNullException)
            {
                _signInManager.SignOutAsync();
                throw;
            }

        }
    }
}


