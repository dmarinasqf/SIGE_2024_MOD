using Erp.SeedWork;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Almacen.DAO
{
    public class LaboratorioDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;

        public LaboratorioDAO(string cadena)
        {
            this.cadena = cadena;
        }

        public DataTable BuscarLaboratoriosYCantidadDeCompras(string laboratorio)
        {
            try
            {
                if (laboratorio is null) laboratorio = "";
                laboratorio = laboratorio.ToUpper();
                int top = 10;
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_LaboratoriosYCantidadDeCompras", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@laboratorio", laboratorio);
                cmm.Parameters.AddWithValue("@top", top);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "LABORATORIOS";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {

                return new DataTable();
            }
        }
        public DataTable ListarLaboratoriosPorAlmacenSucursal(string idalmacensucursal)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.sp_ListarLaboratorioPorAlmacenSucursal", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idalmacensucursal", idalmacensucursal);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "LABORATORIOS";
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
