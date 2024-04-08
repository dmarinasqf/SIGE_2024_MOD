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
    public class GetSucursalConLaboratorios
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
                var data = await (from SL in db.SUCURSALLABORATORIO
                            join S in db.SUCURSAL on SL.idsucursal equals S.suc_codigo
                            where SL.estado == "HABILITADO" orderby S.descripcion

                            select new
                            {
                                idsucursal = S.suc_codigo,
                                descripcion = S.descripcion
                            }
                             ).Distinct().ToListAsync();
                return data;

            }

        }
    }

}
