using ENTIDADES.comercial;
using ENTIDADES.Finanzas;
using ENTIDADES.Generales;
using ENTIDADES.ventas;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Persistencia.Modelos
{
    public class WorkerContext : DbContext
    {
        public DbSet<Constante> CCONSTANTE { get; set; }
        public DbSet<MensajeSistema > MENSAJESISTEMA { get; set; }
        public DbSet<SUCURSAL> SUCURSAL { get; set; }
        public DbSet<ListaPreciosSucursal> PRECIOSSUCURSAL { get; set; }
        public DbSet<Venta> VENTA { get; set; }
        public DbSet<FDocumentoTributario> FDOCUMENTOTRIBUTARIO { get; set; }
        public DbSet<FMoneda> FMONEDA { get; set; }


        public WorkerContext(DbContextOptions<WorkerContext> options)
         : base(options)
        {

        }
    }
}
