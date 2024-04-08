

using ENTIDADES.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace Erp.Persistencia.Servicios.Users
{
    public class User:IUser
    {
        private readonly IHttpContextAccessor Http;
        private readonly ICryptografhy cryptografhy;
        private readonly UserManager<AppUser> Appuser;
        public User(IHttpContextAccessor http, UserManager<AppUser> _Appuser, ICryptografhy _cryptografhy)
        {
            Http = http;
            Appuser = _Appuser;
            cryptografhy = _cryptografhy;
        }
        public string getUserName()
        {
            return Http.HttpContext.User.Identity.Name;
        }
        public string getUserNameAndLast()
        {
            var nameCookie = Http.HttpContext.Request.Cookies["EMPLEADONOMBRES"];
            return nameCookie.ToString();
        }
        public string getIdUserSession()
        {
            return (Appuser.GetUserId(Http.HttpContext.User));
        }
        public string getIdSucursalUsuario()
        {
            return Appuser.GetUserAsync(Http.HttpContext.User).Result.idSucursal;
        }

        public AppUser getUsuario()
        {
            return Appuser.GetUserAsync(Http.HttpContext.User).Result;
        }

        public int getIdEmpresaCookie()
        {
            var nameCookie = cryptografhy.Decrypt( Http.HttpContext.Request.Cookies["IDEMPRESA"]);
            return int.Parse( nameCookie.ToString());
        }
        public string getNombreEmpresaCookie()
        {
            var nameCookie = Http.HttpContext.Request.Cookies["EMPRESA"];
            return nameCookie.ToString();
        }
        public int getIdSucursalCookie()
        {
            var nameCookie = cryptografhy.Decrypt( Http.HttpContext.Request.Cookies["IDSUCURSAL"]);
            return int.Parse(nameCookie.ToString());
        }
    }
}
