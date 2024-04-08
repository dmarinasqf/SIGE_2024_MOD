using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Compras.DAO
{
    public class RequerimientoDAO
    {
        private readonly string cadena;
        SqlConnection cnn;

        SqlCommand cmm;
        public RequerimientoDAO(string cadena)
        {
            this.cadena = cadena;
        }

        public DataTable ListarRequerimientos(int? top, int? suc_codigo, int? idgrupo, string estado, string tipoConsulta)
        {
            try
            {
                if (top is null) top = 100;
                if (suc_codigo is null) suc_codigo = 0;
                if (idgrupo is null) idgrupo = 0;
                if (estado is null) estado = "";
                if (tipoConsulta is null) tipoConsulta = "LISTA";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.sp_listar_requerimiento", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@top", top);
                cmm.Parameters.AddWithValue("@suc_codigo", suc_codigo);
                cmm.Parameters.AddWithValue("@idgrupo", idgrupo);
                cmm.Parameters.AddWithValue("@tipoConsulta", tipoConsulta);
                cmm.Parameters.AddWithValue("@estado", estado);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "REQUERIMIENTOS";

                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public DataTable BuscarRequerimientoCompleto(int idrequerimiento)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.sp_buscar_requerimiento_completo", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idrequerimiento", idrequerimiento);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "REQUERIMIENTO";

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
