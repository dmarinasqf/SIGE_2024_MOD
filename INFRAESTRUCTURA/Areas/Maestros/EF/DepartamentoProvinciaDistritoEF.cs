using ENTIDADES.Generales;
using Erp.Persistencia.Modelos;
using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Maestros
{
    public class DepartamentoProvinciaDistritoEF
    {
        private readonly Modelo db;
        public DepartamentoProvinciaDistritoEF(Modelo _db)
        {
            db = _db;
        }
        public async Task<List<DEPARTAMENTO>> ListarDepartamentoAsync()
        {
            return await db.DEPARTAMENTO.Where(x => x.estado == "HABILITADO").ToListAsync();
        }
        public async Task<List<PROVINCIA>> ListarProvinciasAsync(int departamento)
        {
            return await db.PROVINCIA.Where(x => x.estado == "HABILITADO" && x.dep_codigo==departamento).ToListAsync();
        }
        public async Task<List<DISTRITO>> ListarDistritosAsync(int provincia)
        {
            return await db.DISTRITO.Where(x => x.estado == "HABILITADO" && x.pro_codigo== provincia).ToListAsync();
        }
    }
}
