using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using ERP.Models;
using Microsoft.AspNetCore.Http;
using ERP.Controllers;
using ERP.Models.DAO;
using ENTIDADES.Identity;
using Erp.Persistencia.Modelos;
using ERP.Models.Ayudas;
using Erp.Persistencia.Servicios;
using INFRAESTRUCTURA.Areas.General.DAO;
using INFRAESTRUCTURA.Areas.Administrador.INTERFAZ;

namespace ERP.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    public class LoginModel : PageModel
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ILogger<LoginModel> _logger;
        private readonly Modelo db;
        private readonly ICryptografhy cryptografhy;

        public LoginModel(SignInManager<AppUser> signInManager,
            ILogger<LoginModel> logger,
            UserManager<AppUser> userManager, Modelo _db, ICryptografhy _cryptografhy)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            db = _db;
            cryptografhy = _cryptografhy;

        }

        [BindProperty]
        public InputModel Input { get; set; }

        public IList<AuthenticationScheme> ExternalLogins { get; set; }

        public string ReturnUrl { get; set; }

        [TempData]
        public string ErrorMessage { get; set; }

        public class InputModel
        {
            [Required(ErrorMessage = "El campo de usuario es obligatorio")]
            public string Email { get; set; }
            [Required(ErrorMessage = "La empresa es obligatoria")]
            public int idempresa { get; set; }
            [Required(ErrorMessage = "La sucursal es obligatoria")]
            public int idsucursal { get; set; }

            [Required(ErrorMessage = "La contraseña es obligatoria")]
            [DataType(DataType.Password)]
            public string Password { get; set; }

            [Display(Name = "Remember me?")]
            public bool RememberMe { get; set; }

            public string DefaultSucursalId { get; set; }
        }

        public async Task OnGetAsync(string returnUrl = null)
        {
            ViewData["empresas"] = db.EMPRESA.Where(x => x.estado != "ELIMINADO" && x.estado != "DESHABILITADO").ToList();

            if (!string.IsNullOrEmpty(ErrorMessage))
            {
                ModelState.AddModelError(string.Empty, ErrorMessage);
            }

            returnUrl = returnUrl ?? Url.Content("~/");

            // Clear the existing external cookie to ensure a clean login process
            await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

            ExternalLogins = (await _signInManager.GetExternalAuthenticationSchemesAsync()).ToList();

            ReturnUrl = returnUrl;
        }

        public async Task<IActionResult> OnPostAsync(string returnUrl = null)
        {
            returnUrl = returnUrl ?? Url.Content("~/");
            ViewData["error"] = "";

            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(Input.Email, Input.Password, Input.RememberMe, lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    _logger.LogInformation("funciona");
                    var aux = await _userManager.FindByNameAsync(Input.Email);
                    ViewData["empresas"] = db.EMPRESA.Where(x => x.estado != "ELIMINADO").ToList();
                    if (aux.tipoUsuario != "EMPLEADO")
                    {
                        ErrorMessage = "No es un empleado de la empresa";
                        await _signInManager.SignOutAsync();
                        return Page();
                    }
                    var empleado = db.EMPLEADO.Find(int.Parse(aux.Id));
                    if (empleado.suc_codigo != Input.idsucursal)
                    {
                        if (!await _userManager.IsInRoleAsync(aux, "ADMINISTRADOR"))
                        {
                            var verificarrol = await _userManager.IsInRoleAsync(aux, "ACCESO A TODAS LAS SUCURSALES");
                            if (!verificarrol)
                            {
                                var sucursal = db.SUCURSAL.Find(empleado.suc_codigo).descripcion;
                                ErrorMessage = "No tiene permisos para acceder a otra sucursal, Ud. pertenece a " + sucursal;
                                await _signInManager.SignOutAsync();
                                return Page();
                            }
                        }

                    }
                    var respuesta = crearCookie(Input.idsucursal, Input.idempresa.ToString(), Input.Email);
                    if (respuesta == "x")
                    {
                        ErrorMessage = "Error al crear sesión.";
                        await _signInManager.SignOutAsync();
                        return Page();
                    }
                    _logger.LogInformation("User logged in.");
                    return LocalRedirect(returnUrl);
                }
                if (result.RequiresTwoFactor)
                {
                    return RedirectToPage("./LoginWith2fa", new { ReturnUrl = returnUrl, RememberMe = Input.RememberMe });
                }
                if (result.IsLockedOut)
                {
                    _logger.LogWarning("User account locked out.");
                    return RedirectToPage("./Lockout");
                }
                else
                {
                    ViewData["empresas"] = db.EMPRESA.Where(x => x.estado != "ELIMINADO").ToList();
                    ModelState.AddModelError(string.Empty, "Credenciales incorrectas");
                    return Page();
                }
            }

            ViewData["empresas"] = db.EMPRESA.Where(x => x.estado != "ELIMINADO").ToList();
            // If we got this far, something failed, redisplay form
            return Page();
        }


        private string crearCookie(int IDSUCURSAL, string IDEMPRESA, string USER)
        {
            CookieOptions options = new CookieOptions();
            options.Expires = DateTime.Now.AddDays(5);
            Response.Cookies.Append("IDEMPRESA", cryptografhy.Encryt(IDEMPRESA), options);
            Response.Cookies.Append("USUARIO", USER, options);
            LeerJson settings = new LeerJson();
            UsuarioDAO dao = new UsuarioDAO(settings.GetConnectionString());
            var data = dao.getUsuario(USER);
            if (data.Rows.Count == 0)
                return "x";
            var row = data.Rows[0];
            var empresa = db.EMPRESA.Find(int.Parse(IDEMPRESA));
            var sucursal = db.SUCURSAL.Find(IDSUCURSAL);
            if (sucursal is null)
                return "x";
            var empleado = db.EMPLEADO.Find(int.Parse(row["IDEMPLEADO"].ToString()));
            Response.Cookies.Append("EMPLEADONOMBRES", row["NOMBREEMPLEADO"].ToString(), options);
            Response.Cookies.Append("IDEMPLEADO", cryptografhy.Encryt(row["IDEMPLEADO"].ToString()), options);
            Response.Cookies.Append("DOCEMPLEADO", cryptografhy.Encryt(empleado.documento), options);
            Response.Cookies.Append("IDSUCURSAL", cryptografhy.Encryt(sucursal.suc_codigo.ToString()), options);
            Response.Cookies.Append("SUCURSAL", sucursal.descripcion, options);
            Response.Cookies.Append("FOTOEMPLEADO", row["FOTO"].ToString(), options);
            Response.Cookies.Append("USERNAME", empleado.userName.ToString(), options);
            Response.Cookies.Append("EMPRESA", empresa.descripcion, options);
            Response.Cookies.Append("GRUPO", row["GRUPO"].ToString(), options);
            Response.Cookies.Append("NOMBREAPP", row["NOMBREAPP"].ToString(), options);
            Response.Cookies.Append("LOGOEMPRESA", row["LOGOEMPRESA"].ToString(), options);
            return "ok";
        }

    }
}
