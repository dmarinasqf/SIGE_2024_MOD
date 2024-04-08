using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Compras.DAO
{
    public class ReporteCompraDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        private static DataTable dtdevolucion;
        public static DataTable dtcompras;
        private static DataTable dtproductosxvencer;
        private static DataTable dtnegociocompras;
        private static DataTable dtocemitidas;
        private static DataTable dtentregaxproveedor;
        private static DataTable dtcomprasdetallada;
        private static DataTable dtreportedistribucion;
        private static DataTable dtrddetallado;

        public ReporteCompraDAO(string cadena)
        {
            this.cadena = cadena;
        }

        public DataTable ReporteDevolucion(string idproveedor, string fecha)
        {
            try
            {
                if (idproveedor is null) idproveedor = "";
                if (fecha is null) fecha = "";
                string[] fechas = fecha.Split('-');

                string ffin = fechas[1], fini=fechas[0];

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_REPORTE_DEVOLUCION", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idproveedor", idproveedor);
                cmm.Parameters.AddWithValue("@fechai", ffin);
                cmm.Parameters.AddWithValue("@fechaf", fini);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "STOCK PRODUCTOS";
                dtdevolucion = tabla;
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }

        public async Task<mensajeJson> GenerarExcelDevolucionProveedor(int proveedor, string path)
        {
            try
            {
                var data = await Task.Run(() =>
                {
                    var DATA = dtdevolucion;
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "Reporte_devolucion_proveedor" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/almacen/";
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

        public DataTable ReporteCompras(string fechai, string fechaf) {

            try {
                dtcompras = new DataTable();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_COMPRAS_RANGO_FECHAS_CP_V1", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@FECHAINIC", fechai);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechaf);
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(dtcompras);
                dtcompras.TableName = "TABLA COMPRAS";
                cnn.Close();
                return dtcompras;
            }
            catch (Exception vex) {
                return new DataTable();
            }
        }
        public async Task<mensajeJson> GenerarExcelComprasAsync(string fechainicio, string fechafin, string path) {
            try {
                var data = await Task.Run(async () => {
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reportecompras" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/compras/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = "";
                    if (dtcompras is null) {
                        var DATA = ReporteCompras(fechainicio, fechafin);
                        res = save.GenerateExcel(ruta, nombre, DATA);
                    }
                    else {
                        res = save.GenerateExcel(ruta, nombre, dtcompras);
                    }

                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return data;
            }
            catch (Exception e) {

                return new mensajeJson(e.Message, null);
            }

        }

        public DataTable ReporteProductosxVencer(int num_dias, string suc_codigo) {
            try {
                if (suc_codigo is null) suc_codigo = "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("compras.SP_STOCK_PRODUCTOS_POR_VENCER_V1", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@suc_codigo", suc_codigo);
                cmm.Parameters.AddWithValue("@num_dias", num_dias);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS X VENCER";
                dtproductosxvencer = tabla;
                cnn.Close();
                return tabla;
            }
            catch (Exception e) {
                return new DataTable();
            }

        }

        public async Task<mensajeJson> GenerarExcelProductosxVencer(string suc_codigo, string path) {
            try {
                var data = await Task.Run(() => {
                    var DATA = dtproductosxvencer;
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "Productos_vencer" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/compras/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = save.GenerateExcel(ruta, nombre, DATA);
                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return data;
            }
            catch (Exception e) {

                return new mensajeJson(e.Message, null);
            }
        }
        public DataTable ReporteNegociacionCompras(string fechainicio, string fechafin ) {
            try {
                dtnegociocompras = new DataTable();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_NEGOCIACION_COMPRAS_RANGO_FECHAS_V1", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@FECHAINIC", fechainicio);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(dtnegociocompras);
                dtnegociocompras.TableName = "TABLA NEGOCIOS";
                cnn.Close();
                return dtnegociocompras;
            }
            catch (Exception vex) {
                return new DataTable();
            }

        }

        public async Task<mensajeJson> GenerarExcelReporteNegociacionCompras(string fechainicio, string fechafin, string path) {
            try {
                var data = await Task.Run(() => {
                    var DATA = dtnegociocompras;
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "Negociaciones" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/compras/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = save.GenerateExcel(ruta, nombre, DATA);
                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return data;
            }
            catch (Exception e) {

                return new mensajeJson(e.Message, null);
            }
        }
        public DataTable ReporteOCEmitidas(string fechainicio, string fechafin) {
            try {
                dtocemitidas = new DataTable();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_NROOC_EMITIDAS_TOTALES_V1", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@FECHAINIC", fechainicio);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(dtocemitidas);
                dtocemitidas.TableName = "TABLA ORDEN";
                cnn.Close();
                return dtocemitidas;
            }
            catch (Exception vex) {
                return new DataTable();
            }

        }

        public async Task<mensajeJson> GenerarExcelReporteOCEmitidas(string fechainicio, string fechafin, string path) {
            try {
                var data = await Task.Run(() => {
                    var DATA = dtocemitidas;
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "ReporteOCEmitidas" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/compras/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = save.GenerateExcel(ruta, nombre, DATA);
                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return data;
            }
            catch (Exception e) {

                return new mensajeJson(e.Message, null);
            }
        }
        public DataTable ReporteEntregaxProveedor(string fechainicio, string fechafin) {
            try {
                dtentregaxproveedor = new DataTable();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_COMPRAS_PLAZO_ENTREGA_V1", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@FECHAINIC", fechainicio);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(dtentregaxproveedor);
                dtentregaxproveedor.TableName = "TABLA ORDEN";
                cnn.Close();
                return dtentregaxproveedor;
            }
            catch (Exception vex) {
                return new DataTable();
            }

        }
        public async Task<mensajeJson> GenerarExcelReporteEntregaxProveedor(string fechainicio, string fechafin, string path) {
            try {
                var data = await Task.Run(() => {
                    var DATA = dtentregaxproveedor;
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "ReporteEntregaxProveedor" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/compras/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = save.GenerateExcel(ruta, nombre, DATA);
                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return data;
            }
            catch (Exception e) {

                return new mensajeJson(e.Message, null);
            }
        }
        public DataTable ReporteComprasDetallada(string fechai, string fechaf) {

            try {
                dtcomprasdetallada = new DataTable();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_COMPRAS_DETALLADO_V1", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@FECHAINIC", fechai);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechaf);
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(dtcomprasdetallada);
                dtcomprasdetallada.TableName = "TABLA COMPRAS";
                cnn.Close();
                return dtcomprasdetallada;
            }
            catch (Exception vex) {
                return new DataTable();
            }
        }
        public async Task<mensajeJson> GenerarExcelComprasDetalladaAsync(string fechainicio, string fechafin, string path) {
            try {
                var data = await Task.Run(async () => {
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reportecomprasdetallada" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/compras/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = "";
                    if (dtcomprasdetallada is null) {
                        var DATA = ReporteComprasDetallada(fechainicio, fechafin);

                        res = save.GenerateExcel(ruta, nombre, DATA);
                    }
                    else {
                        res = save.GenerateExcel(ruta, nombre, dtcomprasdetallada);
                    }

                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return data;
            }
            catch (Exception e) {

                return new mensajeJson(e.Message, null);
            }

        }
        public DataTable ReporteDistribucion(string fechai, string fechaf) {

            try {
                dtreportedistribucion = new DataTable();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_REPORTE_DISTRIBUCION_V1", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@FECHAINIC", fechai);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechaf);
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(dtreportedistribucion);
                dtreportedistribucion.TableName = "TABLA COMPRAS";
                cnn.Close();
                return dtreportedistribucion;
            }
            catch (Exception vex) {
                return new DataTable();
            }
        }
        public async Task<mensajeJson> GenerarExcelReporteDistribucionAsync(string fechainicio, string fechafin, string path) {
            try {
                var data = await Task.Run(async () => {
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reportedistribucion" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/compras/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = "";
                    if (dtreportedistribucion is null) {
                        var DATA = ReporteDistribucion(fechainicio, fechafin);

                        res = save.GenerateExcel(ruta, nombre, DATA);
                    }
                    else {
                        res = save.GenerateExcel(ruta, nombre, dtreportedistribucion);
                    }

                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return data;
            }
            catch (Exception e) {

                return new mensajeJson(e.Message, null);
            }

        }
        public DataTable ReporteDistribucionDetallado(string fechai, string fechaf) {

            try {
                dtrddetallado = new DataTable();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_REPORTE_DISTRIBUCION_DETALLE_V1", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@FECHAINIC", fechai);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechaf);
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(dtrddetallado);
                dtrddetallado.TableName = "TABLA COMPRAS";
                cnn.Close();
                return dtrddetallado;
            }
            catch (Exception vex) {
                return new DataTable();
            }
        }
        public async Task<mensajeJson> GenerarExcelReporteDistribucionDetalladoAsync(string fechainicio, string fechafin, string path) {
            try {
                var data = await Task.Run(async () => {
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "reportedistribucion" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/compras/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = "";
                    if (dtrddetallado is null) {
                        var DATA = ReporteDistribucionDetallado(fechainicio, fechafin);

                        res = save.GenerateExcel(ruta, nombre, DATA);
                    }
                    else {
                        res = save.GenerateExcel(ruta, nombre, dtrddetallado);
                    }

                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return data;
            }
            catch (Exception e) {

                return new mensajeJson(e.Message, null);
            }

        }

    }
}
