using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.Text;

namespace INFRAESTRUCTURA.Areas.Administrador.ViewModels
{
    public class SucursalModel
    {
        public List<LugarSucursal> lugares { get; internal set; }
        public List<Empresa> empresas { get; internal set; }
        public List<SUCURSAL> laboratorios { get; internal set; }
    }
}
