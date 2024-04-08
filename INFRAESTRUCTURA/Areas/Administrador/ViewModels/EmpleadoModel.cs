using ENTIDADES.Generales;
using ENTIDADES.usuarios;
using ENTIDADES.ventas;
using Erp.Entidades.Generales;
using System;
using System.Collections.Generic;
using System.Text;

namespace INFRAESTRUCTURA.Areas.Administrador.ViewModels
{
    public class EmpleadoModel
    {
        public object sucursales { get;  set; }
        public List<Grupo> grupos { get;  set; }
        public List<CanalVenta> canalventas { get;  set; }
        public List<CargoEmpleado> cargoempleado { get;  set; }
    }
}
