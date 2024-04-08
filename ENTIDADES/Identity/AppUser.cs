

using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace ENTIDADES.Identity
{
    public class AppUser : IdentityUser
    {
        [MaxLength(10)]
        public string idSucursal { get; set; }
        [MaxLength(30)]
        public string sucursal { get; set; }
        [MaxLength(100)]
        public string nombres { get; set; }
        [MaxLength(100)]
        public string grupo { get; set; }
        [MaxLength(30)]

        public string perfil { get; set; }
        [MaxLength(50)]
        public string clave { get; set; }
        [MaxLength(100)]
        public string tipoUsuario { get; set; }


        
    }
}
