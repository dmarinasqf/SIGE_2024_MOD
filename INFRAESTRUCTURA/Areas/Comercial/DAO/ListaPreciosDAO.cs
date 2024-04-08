using ENTIDADES.comercial;
using Erp.SeedWork;
using Microsoft.Data.SqlClient;

using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Comercial.DAO
{
    public class ListaPreciosDAO
    {
        private readonly string cadena;
        SqlConnection cnn;   
        SqlCommand cmm;
        SqlDataReader leer;
        private static DataTable dt;

        public ListaPreciosDAO(string cadena)
        {
            this.cadena = cadena;
        }
        public DataTable BuscarProductosLista(int top, int lista, string producto, string laboratorio,string tipo)
        {
            try
            {
                producto = producto ?? "";
                laboratorio = laboratorio ?? "";
                tipo = tipo ?? "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.SP_LISTAR_PRDUCTOS_X_LISTA_PRECIOS", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@TOP", top);
                cmm.Parameters.AddWithValue("@LISTA", lista);
                cmm.Parameters.AddWithValue("@PRODUCTO", producto);
                cmm.Parameters.AddWithValue("@LABORATORIO", laboratorio);
                cmm.Parameters.AddWithValue("@tipo", tipo);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "LISTAPRECIOS";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public string DuplicarPreciosLista(int lista1, int lista2, string usuarioedita)
        {
            try
            {
                if (usuarioedita is null) usuarioedita = "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.SP_COPIAR_LISTA1_A_LISTA2", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@LISTA1", lista1);
                cmm.Parameters.AddWithValue("@LISTA2", lista2);
                cmm.Parameters.AddWithValue("@USUARIOEDITA", usuarioedita);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "DUPLICAR";
                cnn.Close();
                var res = tabla.Rows[0]["RESPUESTA"].ToString();
                return res;
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
        public mensajeJson RegistrarPrecio( List<PreciosProducto> precios, string usuario,bool codadesy)
        {
            try
            {
                if (usuario is null) usuario = "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                List<PreciosProducto> respuesta = new List<PreciosProducto>();
                foreach (var item in precios)
                {
                    if (item.codigoproducto is null) item.codigoproducto = "";                   
                    if (item.precio is null) item.precio = 0;
                    if (item.precioxfraccion is null) item.precioxfraccion = 0;
                    if(item.idlistaprecio  !=0 && item.codigoproducto!="")
                    {
                        cnn = new SqlConnection();
                        cnn.ConnectionString = cadena;
                        cnn.Open();
                        cmm = new SqlCommand("Comercial.sp_registrar_precio", cnn);
                        cmm.CommandType = CommandType.StoredProcedure;
                        cmm.Parameters.AddWithValue("@codigoproducto", item.codigoproducto);
                        cmm.Parameters.AddWithValue("@idlista", item.idlistaprecio);
                        cmm.Parameters.AddWithValue("@precio", item.precio);
                        cmm.Parameters.AddWithValue("@precioxfraccion", item.precioxfraccion);
                        cmm.Parameters.AddWithValue("@usuario", usuario);
                        cmm.Parameters.AddWithValue("@codadesy", codadesy);
                        leer = cmm.ExecuteReader();

                        if (leer.Read())
                            if (leer.GetString(0) != "ok")
                                 respuesta.Add(item);
                        leer.Close();
                        cnn.Close();
                    }
                    
                }
                return new mensajeJson("ok",respuesta);          
             
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message,null);
            }
        }
        public async Task<mensajeJson> GenerarExcelListaAsync(int top, int lista, string producto, string laboratorio,string tipo, string path)
        {
            try
            {
                var data = await Task.Run( () =>
                {
                    tipo = tipo ?? "excel";

                    var DATA =  BuscarProductosLista(top,lista,producto,laboratorio, tipo);
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "lista" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/comercial/";
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
        public DataTable ListarPreciosCliente(string codigo) {
            dt = new DataTable();
            cnn = new SqlConnection();
            cnn.ConnectionString = cadena;
            cnn.Open();

            cmm = new SqlCommand("Comercial.SP_LISTA_PRECIOSXCLIENTE", cnn);
            cmm.CommandType = CommandType.StoredProcedure;
            cmm.Parameters.AddWithValue("@idcliente", codigo);
            SqlDataAdapter da = new SqlDataAdapter(cmm);
            da.Fill(dt);
            dt.TableName = "REPORTE PRECIOS";
            cnn.Close();
            return dt;
        }
        public string ActualizarPrecios(List<string []> arreglo) {
            try {
                for (int i = 0; i < arreglo.Count; i++) {
                    cnn = new SqlConnection();
                    cnn.ConnectionString = cadena;
                    cnn.Open();
                    cmm = new SqlCommand("COMERCIAL.SP_ACTUALIZA_PRECIOS_FACTURA", cnn);
                    cmm.CommandType = CommandType.StoredProcedure;

                    CultureInfo culture = new CultureInfo("en-US");
                    cmm.Parameters.AddWithValue("@codigoproducto", arreglo[i][0]);
                    cmm.Parameters.AddWithValue("@idlistaprecio", Convert.ToInt32(arreglo[i][1]));
                    cmm.Parameters.AddWithValue("@precio", Convert.ToDecimal(arreglo[i][4], culture));
                    cmm.Parameters.AddWithValue("@precioxfraccion", Convert.ToDecimal(arreglo[i][5], culture));
                    cmm.Parameters.AddWithValue("@precioxblister", Convert.ToDecimal(arreglo[i][6], culture));
                    cmm.Parameters.AddWithValue("@porcentajeganancia", Convert.ToDecimal(arreglo[i][3], culture));
                    cmm.ExecuteNonQuery();
                    cnn.Close();
                }
                return "ok";
            } catch (Exception vEx) {
                return vEx.Message;
            }
            
        }

    }

}
