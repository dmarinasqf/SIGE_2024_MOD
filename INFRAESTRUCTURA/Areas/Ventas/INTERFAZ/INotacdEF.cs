using ENTIDADES.ventas;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Ventas.INTERFAZ
{
    public interface INotacdEF
    {
        public  Task<mensajeJson> RegistrarVentaDirectaAsync(NotaCD nota,int idCajasucursal);
        public Task<mensajeJson> VerificarSiVentaTieneNotaAsync(long idventa);
    }
}
