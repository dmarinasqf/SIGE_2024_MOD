﻿using Erp.Persistencia.Repositorios.Common;
using Erp.Persistencia.Repositorios.SeedWork;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Almacen.producto.query
{
    public class GetProductosxLaboratorio
    {
        public class Ejecutar : IRequest<object>
        {
            public int laboratorio { get; set; }
            public string producto { get; set; }
            public int top { get; set; }
            
            public PagineParams pagine { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly IEjecutarProcedimiento ejecutarProcedimiento;

            public Manejador(IEjecutarProcedimiento ejecutarProcedimiento_)
            {
                ejecutarProcedimiento = ejecutarProcedimiento_;

            }

            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
              
                    var storeprocedure = "almacen.sp_getproductos_xlaboratorio";
                    var parametros = new Dictionary<string, object>();
                    parametros.Add("laboratorio", e.laboratorio);
                    parametros.Add("producto", e.producto);
                    parametros.Add("top", e.top);
                    if (e.pagine == null)
                        return await ejecutarProcedimiento.HandlerDictionaryAsync(storeprocedure, parametros);
                    else
                        return await ejecutarProcedimiento.HandlerPaginateAsync(e.pagine, storeprocedure, parametros);
            }


        }
    }
}
