using Erp.SeedWork;
using System;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Pedido.DAO
{
    public class MotorizadoDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlCommand cmm;
        private static DataTable dtreporteGeneralExcel;

        public MotorizadoDAO(string cadena)
        {
            this.cadena = cadena;
        }

        public DataTable ReporteGeneral(string sucursal, string fecha)
        {
            try
            {
                if (sucursal is null) sucursal = "";
                string ffin = "", fini = "";
                if (fecha is null)
                {
                    fecha = "";
                }
                else
                {
                    string[] fechas = fecha.Split('-');
                    ffin = fechas[1].Trim();
                    fini = fechas[0].Trim();
                }

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Delivery.SP_REPORTE_GENERAL", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@sucursal", sucursal);
                cmm.Parameters.AddWithValue("@fechainicio", fini);
                cmm.Parameters.AddWithValue("@fechafin", ffin);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "REPORTE GENERAL";
                dtreporteGeneralExcel = tabla;
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }

        public async Task<mensajeJson> GenerarExcelStockAsync(string path)
        {
            try
            {
                var data = await Task.Run(() =>
                {
                    var DATA = dtreporteGeneralExcel;
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reportegeneral" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/pedidos/motorizado/";
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
