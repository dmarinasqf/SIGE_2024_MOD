using ENTIDADES.Almacen;
using Erp.SeedWork;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.DAO
{
  public  class MantenimientoGuiaDAO
    {      
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;

        public MantenimientoGuiaDAO(string cadena)
        {            
            this.cadena = cadena;
        }
       
        public async Task<mensajeJson> getGuiaSalida(string codigo, string idsucursalorigen, string idsucursaldestino, string fecha, string estado)
        {
            try
            {
                var data = getTablaGuiasSalidas(codigo,idsucursalorigen, idsucursaldestino, fecha, estado);
                return new mensajeJson("ok", JsonConvert.SerializeObject(data));
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }      
        public DataTable getTablaGuiasSalidas(string codigo,string idsucursalorigen, string idsucursaldestino, string fecha, string estado)
        {
            if (codigo == null)
                codigo = "";
            if (idsucursalorigen == null)
                idsucursalorigen = "";
            if (idsucursaldestino == null)
                idsucursaldestino = "";
            if (fecha == null)
                fecha = "";
            if (estado == null)
                estado = "";
            
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GETGUIASGENERADAS", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@CODIGO", codigo);                
                cmm.Parameters.AddWithValue("@SUCURSALORIGEN", idsucursalorigen);                
                cmm.Parameters.AddWithValue("@SUCURSALDESTINO", idsucursaldestino);                
                cmm.Parameters.AddWithValue("@ESTADO", estado);                
                cmm.Parameters.AddWithValue("@FECHA", fecha);                
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA GUIAS";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public DataTable getTablaGuiasSalidaImpresion(string id)
        {
            if (id == null)
                id = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GETGUIASSALIDAIMPRESION", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA GUIAS";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public DataTable getTablaPreGuiasSalidaImpresion(string id)
        {
            if (id == null)
                id = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GETPREGUIASSALIDAIMPRESION", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA GUIAS";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

    }
}
