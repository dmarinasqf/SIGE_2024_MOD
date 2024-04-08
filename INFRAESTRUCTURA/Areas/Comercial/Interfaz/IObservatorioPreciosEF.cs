using ENTIDADES.Almacen;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Comercial.Interfaz
{
    public interface IObservatorioPreciosEF
    {
        public  Task<mensajeJson> ActualizarPreciosDigemidAsync(List<AProductoDigemid> productos);
    }
}
