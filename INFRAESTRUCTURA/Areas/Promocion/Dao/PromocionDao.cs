using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Promocion.Dao
{
    public  class PromocionDao
    {
        private readonly string cadena;
        SqlConnection cnn;

        SqlCommand cmm;
        public PromocionDao(string cadena)
        {
            this.cadena = cadena;
        }
    }
}
