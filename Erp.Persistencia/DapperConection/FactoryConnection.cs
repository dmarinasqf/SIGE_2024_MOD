using Microsoft.Extensions.Options;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Persistencia.DapperConection
{
   public class FactoryConnection : IFactoryConnection
    {
        private IDbConnection cmm;
        private readonly IOptions<DapperConection> config; 
        public FactoryConnection(IOptions<DapperConection> _config)
        {
            config = _config;
        }
        public string getconnectionstring()
        {
            return config.Value.Modelo;
        }
        public void closeconnection()
        {
            if (cmm is not null && cmm.State is ConnectionState.Open) 
                cmm.Close();
        }

        public IDbConnection getconection()
        {
            if (cmm is null)
                cmm = new SqlConnection(config.Value.Modelo);
            if (cmm.State is not ConnectionState.Open)
                cmm.Open();
            return cmm;
        }
    }
}
