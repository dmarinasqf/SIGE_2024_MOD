using ENTIDADES.Finanzas;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Finanzas.INTERFAZ
{
    public interface  ITipoPagoEF
    {
        public  Task<List<FTipoPago>> ListarAsync();
        public  Task<List<FTipoPago>> ListarHabilitadosAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(FTipoPago obj);
        public  Task<mensajeJson> EliminarAsync(int? id);
    }
}
