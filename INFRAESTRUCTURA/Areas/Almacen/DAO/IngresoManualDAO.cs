using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.DAO
{
   public class IngresoManualDAO
    {

        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        private readonly string cadena;
        public IngresoManualDAO(string _cadena)
        {
            cadena = _cadena;
        }
        public DataTable getHistorialIngresos(string sucursal, string fechainicio, string fechafin, int top)
        {
            try
            {
                if (sucursal is null) sucursal = "";
                if (top is 0) top = 10;
                if (fechainicio is null) fechainicio = "";
                if (fechafin is null) fechafin = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GET_HISTORIAL_INGRESOS_MANUAL", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@SUCURSAL", sucursal);
                cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                cmm.Parameters.AddWithValue("@TOP", top);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "HISTORIAL INGRESOS";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }
        public DataTable getHistorialSalidas(string sucursal, string fechainicio, string fechafin, int top)
        {
            try
            {
                if (sucursal is null) sucursal = "";
                if (top is 0) top = 10;
                if (fechainicio is null) fechainicio = "";
                if (fechafin is null) fechafin = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_GET_HISTORIAL_SALIDA_MANUAL", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@SUCURSAL", sucursal);
                cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                cmm.Parameters.AddWithValue("@TOP", top);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "HISTORIAL SALIDAS";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }
        public DataTable getTablaSalidaManual(int id) {
            try {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.getsalidamanual", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA SALIDA";
                cnn.Close();
                return tabla;
            }
            catch (Exception) {
                return new DataTable();
            }
        }


        //yex Reporte Manual
        public DataTable listarmanualxstock(int id)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_getAlmacenxSucursal", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idsucursal", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA SALIDA";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }


        public async Task<object[][]> reporteStockManual(string sucursal,string fechainicio, string fechafin)
        {
            var resultList = new List<object[]>();
            try
            {
                // Convertir el string 'año/mes/dia' a DateTime

            

                using (SqlConnection cnn = new SqlConnection(cadena))
                {
                    using (SqlCommand cmm = new SqlCommand("almacen.sp_ProcesarDetalleIngresoManual", cnn))
                    {
                        cmm.CommandType = CommandType.StoredProcedure;
                        cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio);
                        cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                        cmm.Parameters.AddWithValue("@sucursal", sucursal);
                        //cmm.Parameters.AddWithValue("@LABORATORIO", "");
                        cmm.CommandTimeout = 0;

                        await cnn.OpenAsync();

                        using (SqlDataReader reader = await cmm.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var rowData = new object[reader.FieldCount];
                                reader.GetValues(rowData);
                                resultList.Add(rowData);
                            }
                        }
                    }
                }
            }
            catch (Exception vex)
            {
                // Considera registrar el error vex para diagnóstico.
                throw vex;
            }

            return resultList.ToArray();
        }


        public object[,] exportarexcelReporteIngresoManualEpplus(string sucursal, string fechainicio, string fechafin)
        {
            object[,] resultArray = null;
            //string[] headers = new string[]
            //{
            //    "IDVENTA","SUCURSAL"," NUMDOCUMENTO","FECHA","DOCCLIENTE","CLIENTE",
            //    "COLEGIATURA","MEDICO","ESTADO","IMPORTE","USUARIO","EFECTIVO","TARJETA","EFECTIVOADE","TARJETAADE"

            // };

            try
            {
                using (SqlConnection cnn = new SqlConnection(cadena))
                {
                    cnn.Open();
                    using (SqlCommand cmm = new SqlCommand("almacen.sp_ProcesarDetalleIngresoManual", cnn))
                    {
                        cmm.CommandType = CommandType.StoredProcedure;
                        // Adding parameters

                        cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio);
                        cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                        cmm.Parameters.AddWithValue("@sucursal", sucursal);
                        //cmm.Parameters.AddWithValue("@LABORATORIO", "");

                        using (SqlDataReader reader = cmm.ExecuteReader())
                        {
                            var tempData = new List<object[]>();
                            var columnCount = reader.FieldCount;

                            string[] headers = new string[columnCount];
                            for (int i = 0; i < columnCount; i++)
                            {
                                headers[i] = reader.GetName(i);
                            }
                            while (reader.Read())
                            {
                                object[] values = new object[columnCount];
                                reader.GetValues(values);
                                tempData.Add(values);
                            }

                            // Considerar espacio para la cabecera al inicializar resultArray
                            resultArray = new object[tempData.Count + 1, columnCount];

                            // Agregar la cabecera
                            for (int j = 0; j < headers.Length; j++)
                            {
                                resultArray[0, j] = headers[j];
                            }

                            // Llenar el resto del arreglo con los datos
                            for (int i = 0; i < tempData.Count; i++)
                            {
                                for (int j = 0; j < columnCount; j++)
                                {
                                    resultArray[i + 1, j] = tempData[i][j];
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                throw;
            }

            return resultArray;
        }






    }
}
