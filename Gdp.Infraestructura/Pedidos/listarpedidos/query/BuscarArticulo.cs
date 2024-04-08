using ENTIDADES.pedidos;
using Erp.Persistencia.Modelos;
using Erp.Persistencia.Repositorios.SeedWork;
using Erp.SeedWork;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Gdp.Infraestructura.Pedidos.listarpedidos.query
{
    public class BuscarArticulo
    {
        public class Ejecutar : IRequest<object>
        {
            public int id { get; set; }
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
                var data =  db.CATALAGOPRECIOS.Find(e.id);
                return data;               
            }
        }


    }
}
