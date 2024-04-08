using Erp.Persistencia.Repositorios.Common;
using Erp.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Almacen.stock.query
{
    public class GetStockProducto
    {
        public class Ejecutar : IRequest<mensajeJson>
        {
            public int idproducto { get; set; }
            public int idsucursal { get; set; }
            public int idalmacen { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, mensajeJson>
        {
            private readonly IEjecutarProcedimiento ejecutarProcedimiento;
           
            public Manejador(IEjecutarProcedimiento ejecutarProcedimiento_)
            {
                ejecutarProcedimiento = ejecutarProcedimiento_;
              
            }

            public async Task<mensajeJson> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var storeprocedure = "Almacen.sp_getstock_sucursal_x_producto";
                var parametros = new Dictionary<string, object>();
                parametros.Add("idproducto", e.idproducto);
                parametros.Add("idsucursal", e.idsucursal);
                parametros.Add("idalmacensucursal", e.idalmacen);
                
                var ejecutar = await ejecutarProcedimiento.HandlerDictionaryAsync(storeprocedure, parametros);

                return new mensajeJson("ok", ejecutar);

            }
        }
    }
}
