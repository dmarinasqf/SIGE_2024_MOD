

using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ENTIDADES.Identity
{
    public class AppRol : IdentityRole
    {
        [MaxLength(50)]
        public string area { get; set; }
        [MaxLength(50)]
        public string grupo { get; set; }
        public string descripcion { get; set; }
        public string tipo { get; set; }

        //para mapear si el ususario tiene el permiso
        [NotMapped]
        public bool tiene { get; set; }
    }
}
