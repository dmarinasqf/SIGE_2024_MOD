using ENTIDADES.compras;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Compras.INTERFAZ
{
   public interface IProveedorLaboratorioEF
    {
        public  Task<mensajeJson> RegistrarEliminarAsync(CProveedorLaboratorio obj);
        public  Task<mensajeJson> EliminarAsync(int? id);
    }
}
