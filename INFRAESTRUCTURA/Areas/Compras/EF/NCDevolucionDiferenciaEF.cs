using Erp.Persistencia.Modelos;
using Erp.Persistencia.Servicios.Users;
using INFRAESTRUCTURA.Areas.Compras.INTERFAZ;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Compras.EF
{
    public class NCDevolucionDiferenciaEF : INCDevolucionDiferenciaEF
    {
        private readonly Modelo db;
        private readonly IUser user;

        public NCDevolucionDiferenciaEF(Modelo _db, IUser _user)//IPreingresoEF _preingresoEF
        {
            db = _db;
            user = _user;
            //preingresoEF = _preingresoEF;
        }
    }
}
