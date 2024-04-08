using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.DAO
{
    public class ConsumoEconomatoDAO
    {
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        private readonly string cadena;
        public ConsumoEconomatoDAO(string _cadena)
        {
            cadena = _cadena;
        }
        public DataTable ListarConsumoEconomato(string numdocumento, int sucursal, DateTime fechainicio, DateTime fechafin, int top)
        {
            try
            {
                if (numdocumento is null) numdocumento = "";
                if (top is 0) top = 10;
                DateTime fechapordefecto = Convert.ToDateTime("1/01/0001");
                if (fechainicio == fechapordefecto) fechainicio = Convert.ToDateTime("01/01/1900");
                if (fechafin == fechapordefecto) fechafin = Convert.ToDateTime("01/01/1900"); ;

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_Lista_ConsumoEconomato", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@numdocumento", numdocumento);
                cmm.Parameters.AddWithValue("@suc_codigo", sucursal);
                cmm.Parameters.AddWithValue("@fechainicio", fechainicio);
                cmm.Parameters.AddWithValue("@fechafin", fechafin);
                cmm.Parameters.AddWithValue("@top", top);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "CONSUMO ECONOMATO";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }
        public DataTable BuscarUltimos10ConsumoEconomato(int idproducto)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.BuscarUltimos10ConsumoEconomato_PorProducto", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idproducto", idproducto);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "CONSUMO ECONOMATO";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }
    }
}
