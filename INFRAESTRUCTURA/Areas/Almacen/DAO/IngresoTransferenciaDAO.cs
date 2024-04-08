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
  public  class IngresoTransferenciaDAO
    {      
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;

        public IngresoTransferenciaDAO(string cadena)
        {            
            this.cadena = cadena;
        }
        public async Task<mensajeJson> GetListaIngresoTransferencia(string codigo, string idsucursalenvia, string idsucursalrecepciona, string fechainicio,string fechafin, string estado,int top)
        {
            try
            {
                return getIngresoTransferencia(codigo,idsucursalenvia,idsucursalrecepciona,fechainicio,fechafin,estado,top);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }
        public async Task<mensajeJson> GetIngresoTransferenciaCompleta(string id)
        {
            try
            {
                var data = getTablaIngresoTransferenciaCompleta(id);
                return data;
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message,JsonConvert.SerializeObject(new DataTable()));
            }
        }
       
        private mensajeJson getIngresoTransferencia(string codigo, string idsucursalenvia, string idsucursalrecepciona, 
            string fechainicio, string fechafin, string estado, int top)
        {
            if (codigo == null)
                codigo = "";
            if (idsucursalenvia == null)
                idsucursalenvia = "";
            if (idsucursalrecepciona == null)
                idsucursalrecepciona = "";
            if (fechainicio == null) fechainicio = "";
            if (fechafin == null) fechafin = "";
            if (estado == null) estado = "";
            if (top == 0) top = 0;
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GETINGRESOSTRANSFERENCIA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@CODIGO", codigo);
                cmm.Parameters.AddWithValue("@IDSUCURSALRECEPCIONA", idsucursalrecepciona);
                cmm.Parameters.AddWithValue("@IDSUCURSALENVIA", idsucursalenvia);
                cmm.Parameters.AddWithValue("@ESTADO", estado);
                cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                cmm.Parameters.AddWithValue("@TOP", top);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA INGRESO TRANSFERENCIA";
                cnn.Close();
                return new mensajeJson("ok",JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {

                return new mensajeJson( e.Message, JsonConvert.SerializeObject(new DataTable()));
            }
        }
        private mensajeJson getTablaIngresoTransferenciaCompleta(string id)
        {
            if (id == null)
                id = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GETINGRESOTRANSFERENCIACOMPLETA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);                
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA GUIAS ENTRADA";
                cnn.Close();
                return new mensajeJson("ok", JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, JsonConvert.SerializeObject(new DataTable())); 
            }
        }
    }
}
