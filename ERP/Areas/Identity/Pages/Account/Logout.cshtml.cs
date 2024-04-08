using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using ERP.Controllers;
using ENTIDADES.Identity;

namespace ERP.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    public class LogoutModel : PageModel
    {
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ILogger<LogoutModel> _logger;

        public LogoutModel(SignInManager<AppUser> signInManager, ILogger<LogoutModel> logger)
        {
            _signInManager = signInManager;
            _logger = logger;
        }

        public void OnGet()
        {
        }

        public async Task<IActionResult> OnPost(string returnUrl = null)
        {
           
            await _signInManager.SignOutAsync();
            cerrarSesion();
            _logger.LogInformation("User logged out.");
            if (returnUrl != null)
            {
                return LocalRedirect(returnUrl);
            }
            else
            {
                return RedirectToPage();
            }
        }
        private void cerrarSesion()
        {
            try
            {
                Response.Cookies.Delete("EMPRESA");
                Response.Cookies.Delete("IDEMPRESA");
                Response.Cookies.Delete("USUARIO"); 
                Response.Cookies.Delete("IDSUCURSAL");
                Response.Cookies.Delete("SUCURSAL");
                Response.Cookies.Delete("IDEMPLEADO");
                Response.Cookies.Delete("EMPLEADONOMBRES");
                Response.Cookies.Delete("GRUPO");
                Response.Cookies.Delete("FOTOEMPLEADO");
                Response.Cookies.Delete("LOGOEMPRESA");
                Response.Cookies.Delete("NOMBREAPP");
                Response.Cookies.Delete("DOCEMPLEADO");
            }
            catch (Exception )
            {

                throw;
            }

        }
    }
}
