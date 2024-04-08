using ENTIDADES.gdp;
using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.ViewModels
{
    public class EmpleadoPermisoModel
    {
        public EMPLEADO empleado { get; set; }
        public List<AreaModel> areas { get; set; }
    }
}
