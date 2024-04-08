using Erp.Persistencia.Repositorios.Common;
using Erp.Persistencia.Repositorios.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Comercial.listaprecios.busqueda
{
   public class BuscarProductosListaConIncentivo
    {
        public class Ejecutar : IRequest<PagineModel>
        {
            public PagineParams pagine { get; set; }      
            public int lista { get; set; }
            public int laboratorio { get; set; }
            public int sucursal { get; set; }
            public string producto { get; set; }
            public int idtipoPedido { get; set; }//EARTC1000
            public string idcanalventa { get; set; }//EARTC1000

        }
        public class Manejador : IRequestHandler<Ejecutar, PagineModel>
        {
            private readonly IEjecutarProcedimiento ejecutarProcedimiento;

            public Manejador(IEjecutarProcedimiento ejecutarProcedimiento_)
            {
                ejecutarProcedimiento = ejecutarProcedimiento_;

            }
            //
            public async Task<PagineModel> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                var stroreprocedure = "Comercial.sp_get_buscarproducto_enlista_conincentivo_v3";//EARTC1000 //EARTCOD1009
                //var stroreprocedure = "Comercial.sp_get_buscarproducto_enlista_conincentivo";
                //var stroreprocedure = "Comercial.sp_get_buscarproducto_enlista_conincentivo_v1";//EARTC1000
                var parametros = new Dictionary<string, object>();
               
                parametros.Add("IDLISTA", request.lista);
                parametros.Add("LABORATORIO", request.laboratorio);
                parametros.Add("PRODUCTO", request.producto);
                parametros.Add("SUCURSAL", request.sucursal);
                parametros.Add("idtipopedido", request.idtipoPedido);//EARTC1000
                parametros.Add("idcanalventa", request.idcanalventa);//EARTCOD1009 //EARTC1000
                parametros.Add("PageSize", request.pagine?.tamanopagina);
                parametros.Add("PageNumber", request.pagine?.numpagina);
                return await ejecutarProcedimiento.HandlerPaginateSqlAsync(request.pagine, stroreprocedure, parametros);

            }
        }
    }
}
