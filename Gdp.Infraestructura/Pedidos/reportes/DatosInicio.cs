using Erp.Persistencia.Modelos;
using Gdp.Infraestructura.Pedidos.ViewModels;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.reportes
{
   public class DatosInicio
    {
        public class Ejecutar : IRequest<ReporteModel>
        {  }
        public class Manejador : IRequestHandler<Ejecutar, ReporteModel>
        {

            private readonly Modelo db;

            public Manejador(Modelo _db)
            {
                db = _db;
            }
            public async Task<ReporteModel> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var data = new ReporteModel();

                data.empresas = await db.EMPRESA.Where(x => x.estado == "HABILITADO").OrderBy(x => x.descripcion).ToListAsync();
                data.tipoformulacion = await db.TIPOFORMULACION.Where(x => x.estado == "HABILITADO").OrderBy(x => x.descripcion).ToListAsync();
                data.tipopedido = await db.TIPOPEDIDO.Where(x => x.estado == "HABILITADO").OrderBy(x => x.descripcion).ToListAsync();
                data.tipoproducto = await db.ATIPOPRODUCTO.Where(x => x.estado == "HABILITADO").OrderBy(x => x.descripcion).ToListAsync();
                data.estadopedido = await db.ESTADOPEDIDO.Where(x => x.estado == "HABILITADO" && x.tipo=="pedido" ).OrderBy(x => x.descripcion).ToListAsync();
                return data;

            }
           
        }
    }
}
