using ENTIDADES.Finanzas;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Finanzas.INTERFAZ
{
    public interface ICondicionPagoEF
    {
        public Task<List<FCondicionPago>> ListarAsync();
        public Task<mensajeJson> RegistrarEditarAsync(FCondicionPago obj);
        public Task<mensajeJson> EliminarAsync(int? id);
        public  Task<List<FCondicionPago>> ListarHabilitadasAsync();
    }
}
