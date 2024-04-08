using ENTIDADES.ventas;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Ventas.INTERFAZ
{
    public interface IProformaEF
    {
        public  Task<mensajeJson> RegistrarProformaDirectaAsync(Proforma proforma);
    }
}
