using Dapper;
using Erp.Persistencia.DapperConection;
using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using Erp.Persistencia.Repositorios.SeedWork;

namespace Erp.Persistencia.Repositorios.Common
{
    public class EjecutarProcedimiento : IEjecutarProcedimiento
    {
        private readonly IFactoryConnection factory;
        public EjecutarProcedimiento(IFactoryConnection factoryConnection_)
        {
            factory = factoryConnection_;
        }
        public async Task<PagineModel> HandlerPaginateAsync(PagineParams pagine, string storeprocedure, Dictionary<string, object> parametros)
        {
            pagine = pagine ?? new PagineParams();
            int PageNumber = pagine.numpagina;
            int PageSize = pagine.tamanopagina;
            if (PageNumber == 0) PageNumber = 1; 
            if (PageSize == 0) PageSize = 20;
            PagineModel model = new PagineModel();
            var data = new List<IDictionary<string, object>>();
            try
            {
                var cmm = factory.getconection();
                DynamicParameters parametrosaux = new DynamicParameters();
                foreach (var item in parametros)
                    parametrosaux.Add("@" + item.Key, item.Value ?? "");
                var result = await cmm.QueryAsync(storeprocedure, parametrosaux, commandType: CommandType.StoredProcedure);
                data = result.Select(x => (IDictionary<string, object>)x).Skip(PageSize * (PageNumber - 1)).Take(PageSize).ToList();
                factory.closeconnection();
                model.data = data;
                model.numregistros = result.Count();
                model.totalpaginas = Convert.ToInt32(Math.Ceiling((double)model.numregistros / PageSize));
                model.paginaactual = PageNumber;
            }
            catch (Exception e)
            { }
            finally
            { factory.closeconnection(); }
            return model;
        }
        public async Task<PagineModel> HandlerPaginateSqlAsync(PagineParams pagine, string storeprocedure, Dictionary<string, object> parametros)
        {
            pagine = pagine ?? new PagineParams();
            int PageNumber = pagine.numpagina;
            int PageSize = pagine.tamanopagina;
            if (PageNumber == 0) PageNumber = 1;
            if (PageSize == 0) PageSize = 20;
            PagineModel model = new PagineModel();
            try
            {
                var cmm = factory.getconection();
                DynamicParameters parametrosaux = new DynamicParameters();
                foreach (var item in parametros)
                    parametrosaux.Add("@" + item.Key, item.Value ?? "");
                var result = await cmm.QueryAsync(storeprocedure, parametrosaux, commandType: CommandType.StoredProcedure);
                var itotalreg = result?.Select(dr => (IDictionary<string, object>)dr).Where(d => d.ContainsKey("TotalReg")).Select(d => d["TotalReg"]).FirstOrDefault();
           
                factory.closeconnection();
                model.data = result?.Select(x => (IDictionary<string, object>)x).ToList(); 
                model.numregistros = Convert.ToInt32(itotalreg);
                model.totalpaginas = Convert.ToInt32(Math.Ceiling((double)model.numregistros / PageSize));
                model.paginaactual = PageNumber;
            }
            catch (Exception ex)
            {

            }
            finally
            { factory.closeconnection(); } 
            return model;
        }


        public async Task<List<IDictionary<string, object>>> HandlerDictionaryAsync(string storeprocedure, Dictionary<string, object> parametros)
        {
            var data = new List<IDictionary<string, object>>();
            try
            {
                var cmm = factory.getconection();
                DynamicParameters parametrosaux = new DynamicParameters();
                foreach (var item in parametros)
                {
                    
                    parametrosaux.Add("@" + item.Key, item.Value ?? "");
                }

                var result = await cmm.QueryAsync(storeprocedure, parametrosaux, commandType: CommandType.StoredProcedure,commandTimeout:0);
                data = result.Select(x => (IDictionary<string, object>)x).ToList();
                factory.closeconnection();
            }
            catch (Exception e)
            {

                data = new List<IDictionary<string, object>>();
            }
            finally
            {
                factory.closeconnection();
            }
            return data;
        }

        public async Task<DataTable> HandlerDatatableAsync(string storeprocedure, Dictionary<string, object> parametros, string nombretabla)
        {
            SqlConnection cnn = new SqlConnection(); ;
            SqlCommand cmm;
            DataTable tabla = new DataTable();
            var tarea = await Task.Run(() =>
            {
                try
                {
                    DynamicParameters parametrosaux = new DynamicParameters();
                    cnn.ConnectionString = factory.getconnectionstring();
                    cnn.Open();
                    cmm = new SqlCommand(storeprocedure, cnn);
                    cmm.CommandType = CommandType.StoredProcedure;
                    cmm.CommandTimeout = 0;
                    foreach (var item in parametros)
                    {
                        cmm.Parameters.AddWithValue("@" + item.Key, item.Value ?? "");
                    }
                    SqlDataAdapter da = new SqlDataAdapter(cmm);
                    da.Fill(tabla);
                    tabla.TableName = nombretabla ?? "";
                    cnn.Close();
                    return tabla;
                }
                catch (Exception)
                {
                    cnn.Close();
                    return new DataTable();
                }

            });
            return tarea;

        }
        public async Task<List<IDictionary<string, object>>> HandlerSaveBlockAsync(string storeprocedure, List<Dictionary<string, object>> parametros)
        {
            var data = new List<IDictionary<string, object>>();
            try
            {
                var cmm = factory.getconection();
                foreach (var parametro in parametros)
                {
                    DynamicParameters parametrosaux = new DynamicParameters();
                    foreach (var item in parametro)
                    {
                        parametrosaux.Add("@" + item.Key, item.Value ?? "");
                    }
                    var result = await cmm.QueryAsync(storeprocedure, parametrosaux, commandType: CommandType.StoredProcedure);
                    data.AddRange(result.Select(x => (IDictionary<string, object>)x).ToList());
                }

                factory.closeconnection();
            }
            catch (Exception e)
            {

                data = new List<IDictionary<string, object>>();
            }
            finally
            {
                factory.closeconnection();
            }
            return data;
        } 
    }
}
