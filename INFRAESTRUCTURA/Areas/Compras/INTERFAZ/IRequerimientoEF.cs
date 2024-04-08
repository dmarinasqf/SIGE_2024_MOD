using ENTIDADES.compras;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Compras.INTERFAZ
{
    public interface IRequerimientoEF
    {
        Task<mensajeJson> RegistrarEditarAsync(CRequerimiento oRequerimiento);
        Task<mensajeJson> RegistrarAsync(CRequerimiento oRequerimiento);
        Task<mensajeJson> EditarAsync(CRequerimiento oRequerimiento);
        Task<mensajeJson> EditarIdOrdenEnRequerimiento(int idrequerimiento, int idordencompra);
    }
}
