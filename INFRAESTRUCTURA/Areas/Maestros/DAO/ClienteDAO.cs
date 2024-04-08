using Erp.SeedWork;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Maestros.DAO
{
    public class ClienteDAO
    {
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        private readonly string cadena;
        private static DataTable dtmedico;
        private static DataTable dtclientes;
        public ClienteDAO(string _cadena)
        {
            cadena = _cadena;
        }
        public DataTable BuscarClientes(string filtro, int top)
        {
            try
            {   
                if (top is 0) top = 10;
                if (filtro is null) filtro = "";
              
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_BUSCARCLIENTES", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@FILTRO", filtro);                
                cmm.Parameters.AddWithValue("@TOP", top);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "CLIENTES";
                dtclientes = tabla;
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }
        public DataTable BuscarMedico(string colegio,string filtro, int top)
        {
            try
            {
                if (colegio is null) colegio = "";
                if (filtro is null) filtro = "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_BUSCARMEDICO", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@COLEGIO", colegio);
                cmm.Parameters.AddWithValue("@FILTRO", filtro);
                cmm.Parameters.AddWithValue("@TOP", top);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "MEDICOS";
                dtmedico = tabla;
                cnn.Close();
                return dtmedico;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }
        public async Task<mensajeJson> GenerarExcelClientes(string path)
        {
            try
            {
                var data = await Task.Run(() =>
                {
                    var DATA = dtclientes;
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reporteclientes" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/clientes/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = save.GenerateExcel(ruta, nombre, DATA);
                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return data;
            }
            catch (Exception e)
            {

                return new mensajeJson(e.Message, null);
            }
        }
        public async Task<mensajeJson> GenerarExcelMedicos(string path)
        {
            try
            {
                var data = await Task.Run(() =>
                {
                    var DATA = dtmedico;
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reportemedicos" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/medicos/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = save.GenerateExcel(ruta, nombre, DATA);
                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return data;
            }
            catch (Exception e)
            {

                return new mensajeJson(e.Message, null);
            }
        }
    }
}
