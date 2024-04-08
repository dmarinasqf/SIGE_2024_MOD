using ENTIDADES.usuarios;

using ENTIDADES.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.ViewModels
{
    public class AreaModel
    {
        public Grupo grupo { get; set; }
        public List<AppRol> roles { get; set; }
    }
}
