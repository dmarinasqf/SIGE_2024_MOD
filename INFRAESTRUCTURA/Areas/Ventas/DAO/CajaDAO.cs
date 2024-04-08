using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Ventas.DAO
{
    public class CajaDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
       
        SqlCommand cmm;
        public CajaDAO(string cadena)
        {
            this.cadena = cadena;
        }
        public DataTable GetDatosCierre(int idaperturacaja)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                //cmm = new SqlCommand("Ventas.SP_GET_DATOS_CIERRE_CAJA", cnn);
                cmm = new SqlCommand("Ventas.SP_GET_DATOS_CIERRE_CAJA_V2", cnn);//EARTCOD1011
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDAPERTURACAJA", idaperturacaja);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "CIERRECAJAA";
                cnn.Close();

                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public DataTable GetCajasCerradas(string fecha, string fechafin)
        {
            try
            {
                if (fecha is null) fecha = "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Ventas.SP_LISTAR_CAJAS_CERRADAS", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@FECHAINICIO", fecha);
                cmm.Parameters.AddWithValue("@FECHAFIN", fechafin);
                cmm.Parameters.AddWithValue("@top", 1000);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "CAJAS CERRADAS";
                cnn.Close();

                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public DataTable ListarCuadreCajeLocales(int idsucursal, string fechainicio, string fechafin)
        {
            try
            {
                if (fechainicio is null) fechainicio = "01/02/2023";
                if (fechafin is null) fechafin = "01/03/2023";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Ventas.sp_cuadre_caja_locales1", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idsucursal", idsucursal);
                cmm.Parameters.AddWithValue("@fechainicio", fechainicio);
                cmm.Parameters.AddWithValue("@fechafin", fechafin);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "CAJAS CERRADAS";
                cnn.Close();

                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }





       




        public DataTable ListarCajaMontosXFechaXSucursal(int idempleado, int idsucursal, string fechainicio, string fechafin)
        {
            try
            {
                if (fechainicio is null) fechainicio = "01/02/2023";
                if (fechafin is null) fechafin = "01/03/2023";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Ventas.sp_cajaxfechaxsucursalxempleado", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idempleado", idempleado);
                cmm.Parameters.AddWithValue("@idsucursal", idsucursal);
                cmm.Parameters.AddWithValue("@fechainicio", fechainicio);
                cmm.Parameters.AddWithValue("@fechafin", fechafin);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "CAJA";
                cnn.Close();

                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }


        //---CODIGO PARA EL DESCARGAR EL EXCEL CON FORMATOS ESPECIFICOS PARA CAJA --YEX---



        public async Task<object[][]> ListarcajaArrayAsync(string idsucursal, string fechainicio, string fechafin)
        {
            var resultList = new List<object[]>();
            try
            {
                // Convertir el string 'año/mes/dia' a DateTime
                DateTime fechaInicioDT = DateTime.ParseExact(fechainicio, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                DateTime fechaFinDT = DateTime.ParseExact(fechafin, "yyyy-MM-dd", CultureInfo.InvariantCulture);


                // Convertir el DateTime a string 'dia/mes/año'
                fechainicio = fechaInicioDT.ToString("dd/MM/yyyy");
                fechafin = fechaFinDT.ToString("dd/MM/yyyy");


                using (SqlConnection cnn = new SqlConnection(cadena))
                {
                    using (SqlCommand cmm = new SqlCommand("Ventas.sp_cuadre_caja_locales1", cnn))
                    {
                        cmm.CommandType = CommandType.StoredProcedure;
                        cmm.Parameters.AddWithValue("@idsucursal", int.Parse(idsucursal));
                        cmm.Parameters.AddWithValue("@fechainicio", fechainicio);
                        cmm.Parameters.AddWithValue("@fechafin", fechafin);
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

        //EXPORTAR EXCEL
        public object[,] exportarexcelCajaEpplus(string idsucursal, string fechainicio, string fechafin)
        {
            object[,] resultArray = null;      
            try
            {
                using (SqlConnection cnn = new SqlConnection(cadena))
                {
                    cnn.Open();
                    using (SqlCommand cmm = new SqlCommand("Ventas.sp_cuadre_caja_locales1", cnn))
                    {
                        cmm.CommandType = CommandType.StoredProcedure;
                        // Adding parameters
                        cmm.Parameters.AddWithValue("@idsucursal", int.Parse(idsucursal));
                        cmm.Parameters.AddWithValue("@fechainicio", fechainicio);
                        cmm.Parameters.AddWithValue("@fechafin", fechafin);
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


        //-----------FIN CODIGO YEX---------------------------
    }
}
