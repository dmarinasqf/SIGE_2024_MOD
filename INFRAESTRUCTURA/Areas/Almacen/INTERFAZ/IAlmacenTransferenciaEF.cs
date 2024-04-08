using ENTIDADES.Almacen;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.INTERFAZ
{
    public interface IAlmacenTransferenciaEF
    {
        public Task<mensajeJson> RegistrarEditarAsync(AAlmacenTransferencia obj);
        public Task<mensajeJson> RegistrarEditarProduccionAsync(AAlmacenProduccion obj);
        public Task<mensajeJson> ServiceTransferenciaProduccion(DataTable dt,string urlws);
    }
}
