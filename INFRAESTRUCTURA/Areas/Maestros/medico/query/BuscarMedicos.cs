using Erp.Persistencia.Modelos;
using Erp.Persistencia.Repositorios.Common;
using Erp.Persistencia.Repositorios.SeedWork;
using INFRAESTRUCTURA.Areas.Maestros.DAO;
using MediatR;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Maestros.medico.mantenimiento
{
   public class BuscarMedicos
    {
        public class Ejecutar : IRequest<PagineModel>
        {
            public PagineParams pagine { get; set; }
            public string filtro { get; set; }
            public string colegio { get; set; }
            public int top { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecutar, PagineModel>
        {
            private readonly Modelo db;
            private readonly IEjecutarProcedimiento procedimiento;

            public Manejador(Modelo db_, IEjecutarProcedimiento procedimiento_)
            {
                db = db_;
                procedimiento = procedimiento_;

            }

            public async Task<PagineModel> Handle(Ejecutar e, CancellationToken cancellationToken)
            {
                
                var stroreprocedure = "SP_BUSCARMEDICO";
                var parametros = new Dictionary<string, object>();
                parametros.Add("colegio", e.colegio);
                parametros.Add("filtro", e.filtro);
                parametros.Add("top", e.top);
                var data = await procedimiento.HandlerPaginateAsync(e.pagine, stroreprocedure, parametros);
                return data;

            }
        }
    }
}
