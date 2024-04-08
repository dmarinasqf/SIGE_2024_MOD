using Erp.Persistencia.Repositorios.SeedWork;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Persistencia.Repositorios.Common
{
    public interface IEjecutarProcedimiento
    {
        public Task<List<IDictionary<string, object>>> HandlerDictionaryAsync(string storeprocedure, Dictionary<string, object> parametros);
        public  Task<DataTable> HandlerDatatableAsync(string storeprocedure, Dictionary<string, object> parametros, string nombretabla);
        public  Task<PagineModel> HandlerPaginateAsync(PagineParams pagine, string storeprocedure, Dictionary<string, object> parametros);
        public Task<PagineModel> HandlerPaginateSqlAsync(PagineParams pagine, string storeprocedure, Dictionary<string, object> parametros);
        public Task<List<IDictionary<string, object>>> HandlerSaveBlockAsync(string storeprocedure, List<Dictionary<string, object>> parametros);
    }
}
