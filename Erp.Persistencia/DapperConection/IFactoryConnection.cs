using System;

using System.Data;

namespace Erp.Persistencia.DapperConection
{
    public interface IFactoryConnection
    {
        public string getconnectionstring();

        void closeconnection();
        IDbConnection getconection();
    }
}
