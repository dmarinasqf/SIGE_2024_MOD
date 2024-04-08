
using ENTIDADES.compras;
using ENTIDADES.Generales;
using ENTIDADES.preingreso;
using Erp.Persistencia.Servicios;
using Erp.SeedWork;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.PreIngreso.DAO
{
    public class AnalisisOrganolepticoDAO
    {        
        private readonly string cadena;
        SqlConnection cnn;
        SqlCommand cmm;
        public AnalisisOrganolepticoDAO(string cadena)
        {
            this.cadena = cadena;
        }
        public async Task<mensajeJson> GetListaAnalisisOrganolepticoAsync(string codigo, string sucursal, string factura, string estado, string fechainicio, string fechafin, int top)
        {
            try
            {
                var task = await Task.Run(() => {
                    var data = getAnalisisOrganoleptico(codigo, sucursal, factura, estado,fechainicio,fechafin, top);
                    return data;
                });
                return task;
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }
        public async Task<mensajeJson> GetAnalisisOrganolepticoCompletoAsync(int id)
        {
            try
            {
                var task = await Task.Run(() => {
                    var data = getAnalisisOrganolepticoCompleto(id);
                    return data;
                });
                return task;
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, new DataTable());
            }
        }
        public mensajeJson getAnalisisOrganoleptico(string codigo, string sucursal, string factura, string estado, string fechainicio, string fechafin,  int top)
        {
            if (codigo is null)  codigo = "";
            if (sucursal is null) sucursal = "";
            if (factura is null) factura = "";
            if (estado is null) estado = "";
            if (fechainicio is null) fechainicio = "";
            if (fechafin is null) fechafin = "";
            if (top == 0) top = 1000;


            try
            {
                //CadenaConeccion cadena = new cadena();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Preingreso.SP_LISTAR_ANALISISORGANOLEPTICO", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@CODIGO", codigo);
                //cmm.Parameters.AddWithValue("@EMPRESA", );
                cmm.Parameters.AddWithValue("@ESTADO", estado);
                cmm.Parameters.AddWithValue("@SUCURSAL", sucursal);                
                cmm.Parameters.AddWithValue("@FACTURA", factura);
                cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                cmm.Parameters.AddWithValue("@TOP", top);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "ANALISIS ORGANOLEPTICO";
                cnn.Close();
                return new mensajeJson("ok",JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {
                string msj = "";
                if (e.InnerException != null)
                    msj = e.InnerException.Message;
                return new mensajeJson(e.Message + " " + msj,JsonConvert.SerializeObject(new DataTable())) ;
            }
        }
        public mensajeJson getAnalisisOrganolepticoCompleto(int id)
        {
            try
            {
                //CadenaConeccion cadena = new cadena();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Preingreso.SP_BUSCARANALISISORGANOLEPTICOCOMPLETO", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@ID", id);               
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "ANALISIS ORGANOLEPTICO";
                cnn.Close();
                return new mensajeJson("ok",JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {
                string msj = "";
                if (e.InnerException != null)
                    msj = e.InnerException.Message;
                return new mensajeJson(e.Message + " " + msj, JsonConvert.SerializeObject(new DataTable()));
            }
        }
        public DataTable getAnalisisOrganolepticoImprimir(int id)
        {
            try
            {
                //CadenaConeccion cadena = new cadena();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Preingreso.SP_BUSCARANALISISORGANOLEPTICOIMPRIMIR_V2", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@ID", id);               
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "ANALISIS ORGANOLEPTICO";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                //string msj = "";
                //if (e.InnerException != null)
                //    msj = e.InnerException.Message;
                return new DataTable();
            }

        }

        //EARTCOD1012//
        public string BuscarEmpleadoQuimico(int idempleado)
        {
            string respuesta = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("PreIngreso.SP_BUSCAR_EMPLEADO_QUIMICO", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idempleado", idempleado);
                cmm.Parameters.Add("@nombrecompleto", SqlDbType.VarChar,250).Direction = ParameterDirection.Output;

                cmm.ExecuteNonQuery();
                respuesta = cmm.Parameters["@nombrecompleto"].Value.ToString();
                cnn.Close();
                return respuesta;
            }
            catch (Exception e)
            {
                respuesta = "error" + e.Message;
                return respuesta;
            }
        }
    }
}
