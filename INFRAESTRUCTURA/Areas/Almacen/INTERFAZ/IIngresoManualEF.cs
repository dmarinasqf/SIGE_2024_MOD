using ENTIDADES.Almacen;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
   public interface IIngresoManualEF
    {
        public Task<mensajeJson> RegistrarAsync(AIngresoManual ingreso);
        public  Task<mensajeJson> RegistrarSalidaAsync(ASalidaManual salida);
    }
}
