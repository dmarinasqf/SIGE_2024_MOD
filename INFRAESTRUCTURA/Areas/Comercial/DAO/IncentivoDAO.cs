using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using ENTIDADES.comercial;
using Erp.SeedWork;
using System.IO;
using Newtonsoft.Json;

namespace INFRAESTRUCTURA.Areas.Comercial.DAO
{
    public class IncentivoDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlCommand cmm;
        SqlDataReader leer;


        public IncentivoDAO(string cadena)
        {
            this.cadena = cadena;
        }

        public mensajeJson RegistrarIncentivos(List<Incentivo> incentivos, string usuario)
        {
            try
            {
                if (usuario is null) usuario = "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                List<PreciosProducto> respuesta = new List<PreciosProducto>();
                foreach (var item in incentivos)
                {
                    if (item.codigoproducto is not null && item.idsucursal is not 0)
                    {
                        cnn = new SqlConnection();
                        cnn.ConnectionString = cadena;
                        cnn.Open();
                        cmm = new SqlCommand("Comercial.sp_registrar_incentivos", cnn);
                        cmm.CommandType = CommandType.StoredProcedure;
                        cmm.Parameters.AddWithValue("@codigoproducto", item.codigoproducto);
                        cmm.Parameters.AddWithValue("@idsucursal", item.idsucursal);
                        cmm.Parameters.AddWithValue("@incentivo", item.incentivo ?? 0);
                        cmm.Parameters.AddWithValue("@incentivoreceta", item.incentivo ?? 0);
                        cmm.Parameters.AddWithValue("@incentivofraccion", item.incentivoxfraccion ?? 0);
                        cmm.Parameters.AddWithValue("@fechainicio", item.fechainicio.ToString() ?? "");
                        cmm.Parameters.AddWithValue("@fechafin", item.fechafin.ToString() ?? "");
                        cmm.Parameters.AddWithValue("@usuario", usuario);
                        leer = cmm.ExecuteReader();
                        leer.Close();
                        cnn.Close();
                    }

                }

                return new mensajeJson("ok", null);

            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }
        public mensajeJson RegistrarIncentivosBloque(string data, string sucursales, string usuario)
        {
            List<Incentivo> incentivos = new List<Incentivo>();
            try
            {
                incentivos = JsonConvert.DeserializeObject<List<Incentivo>>(data);
            }
            catch (Exception e)
            {
                return new mensajeJson("Error en la data -> " + e.Message, null);
            }
            try
            {

                if (usuario is null) usuario = "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                List<PreciosProducto> respuesta = new List<PreciosProducto>();
                foreach (var item in incentivos)
                {
                    if (item.codigoproducto is not null)
                    {
                        cnn = new SqlConnection();
                        cnn.ConnectionString = cadena;
                        cnn.Open();
                        cmm = new SqlCommand("Comercial.sp_registrarincentivo_bloque", cnn);
                        cmm.CommandType = CommandType.StoredProcedure;
                        cmm.Parameters.AddWithValue("@codigoproducto", item.codigoproducto);
                        cmm.Parameters.AddWithValue("@sucursales", sucursales);
                        cmm.Parameters.AddWithValue("@incentivo", item.incentivo ?? 0);
                        cmm.Parameters.AddWithValue("@incentivoreceta", item.incentivoreceta ?? 0);
                        cmm.Parameters.AddWithValue("@incentivofraccion", item.incentivoxfraccion ?? 0);
                        cmm.Parameters.AddWithValue("@fechainicio", item.fechainicio );
                        cmm.Parameters.AddWithValue("@fechafin", item.fechafin );
                        cmm.Parameters.AddWithValue("@usuario", usuario);
                        leer = cmm.ExecuteReader();
                        leer.Close();
                        cnn.Close();
                    }

                }

                return new mensajeJson("ok", null);

            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }
        public DataTable ListarIncentivos(int idsucursal)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_listarincentivosucursal", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idsucursal", idsucursal);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = $"incentivos{idsucursal.ToString()}";
                cnn.Close();
                return tabla;



            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public async Task<mensajeJson> GenerarExcelIncentivos(int idsucursal, string path)
        {
            try
            {
                var data = await Task.Run(() =>
               {
                   var DATA = ListarIncentivos(idsucursal);
                   GuardarElementos save = new GuardarElementos();
                   var nombre = $"incentivos{idsucursal.ToString()}_" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

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
    }
}
