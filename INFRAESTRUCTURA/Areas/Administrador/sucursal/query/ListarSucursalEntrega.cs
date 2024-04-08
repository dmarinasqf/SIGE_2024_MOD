using Erp.Persistencia.Modelos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Administrador.sucursal.query
{
    public class ListarSucursalEntrega
    {
        public class Ejecutar : IRequest<object>
        {

        }
        public class Manejador : IRequestHandler<Ejecutar, object>
        {
            private readonly Modelo db;
            public Manejador(Modelo context)
            {
                db = context;

            }
            public async Task<object> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                var data =await  db.SUCURSAL.Where(x => x.issucursalentrega.Value && x.estado == "HABILITADO")
                                                 .OrderBy(x => x.descripcion).ToListAsync();
                for (int i = 0; i < data.Count; i++)
                {
                    if (data[i].idlugar != null)
                        data[i].lugar = db.LUGARSUCURSAL.Find(data[i].idlugar).descripcion;
                }
                return data.Select(x => new { idsucursal = x.suc_codigo, descripcion = x.descripcion, lugar = x.lugar }).ToList();

            }

        }
    }
}

