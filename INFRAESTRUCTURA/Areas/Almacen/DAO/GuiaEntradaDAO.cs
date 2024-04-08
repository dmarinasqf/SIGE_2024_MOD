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
  public  class GuiaEntradaDAO
    {      
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;

        public GuiaEntradaDAO(string cadena)
        {            
            this.cadena = cadena;
        }
        public async Task<mensajeJson> getListaGuiaEntrada(string codigo, string idsucursalenvia, string idsucursalrecepciona, string fechainicio,
            string fechafin, string estado,int top)
        {
            try
            {
                var task = await Task.Run(() => { 
                return getGuiasEntrada(codigo,idsucursalenvia,idsucursalrecepciona,fechainicio,fechafin,estado,top);
                });
                return task;
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }
        public async Task<mensajeJson> GetGuiaEntradaCompleta(string id)
        {
            try
            {
                var task =await Task.Run(()=> { 
                var data = getTablaGuiaEntradaCompleta(id);
                return new mensajeJson("ok", JsonConvert.SerializeObject(data));
                });
                return task;
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }
       
        private mensajeJson getGuiasEntrada(string codigo, string idsucursalenvia, string idsucursalrecepciona, string fechainicio,string fechafin, string estado,int top)
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
            if (top == 0) top = 9999;
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GETGUIASENTRADA", cnn);
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
                tabla.TableName = "TABLA GUIAS ENTRADA";
                cnn.Close();
                return new mensajeJson("ok",JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {

                return new mensajeJson( e.Message, null);
            }
        }
        private DataTable getTablaGuiaEntradaCompleta(string id)
        {
            if (id == null)
                id = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GETGUIAENTRADACOMPLETA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);                
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA GUIAS ENTRADA";
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
