using ENTIDADES.preingreso;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.PreIngreso.INTERFAZ
{
    public interface IGuiaDevolucionEF
    {
        public  Task<mensajeJson> RegistrarEditarAsync(PIGuiaDevolucion obj);
    }
}
