using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace INFRAESTRUCTURA.Areas.Administrador.DAO
{
    public class EmpleadoDAO
    {
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        private readonly string cadena;
        public EmpleadoDAO(string cadena_)
        {
            cadena = cadena_;
        }
        public DataTable ListarEmpleados()
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_LISTAR_EMPLEADOS", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "EMPLEADOS";
                cnn.Close();
                return tabla;
            }
            catch (Exception )
            {
                return new DataTable();
            }
        }
        public DataTable BuscarEmpleados(string filtro, int top, string sucursal)
        {
            try
            {
                if (top is 0) top = 20;
                filtro = filtro ?? "";
                sucursal = sucursal ?? "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("sp_buscar_empleados", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@top", top);
                cmm.Parameters.AddWithValue("@filtro", filtro);
                cmm.Parameters.AddWithValue("@sucursal", sucursal);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "EMPLEADOS";
                cnn.Close();
                return tabla;
            }
            catch (Exception )
            {
                return new DataTable();
            }
        }


        // CODIGO PARA ALMACENES
        public DataTable Listaralmacenempleado(int IDSUCURSAL, int idempleado)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.ListarAlmacenEmpleado", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDSUCURSAL", IDSUCURSAL);
                cmm.Parameters.AddWithValue("@idempleado", idempleado);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        public string guardaralmacenempelado(int idalmacensucursal, int idsucursal, int idempleado, int idempleadocreaedi,int estado)
        {        
            string mensaje = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();

                cmm = new SqlCommand("Almacen.SP_RegistarActualizarAlmacenEmpleado", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@emp_codigo", idempleado);
                cmm.Parameters.AddWithValue("@idalmacensucursal", idalmacensucursal);
                cmm.Parameters.AddWithValue("@idsucursal", idsucursal);
                cmm.Parameters.AddWithValue("@usu_crea", idempleadocreaedi);
                cmm.Parameters.AddWithValue("@usu_modifica", idempleadocreaedi);
                cmm.Parameters.AddWithValue("@estado", estado);

                // Ejecutar el procedimiento almacenado
                using (SqlDataReader reader = cmm.ExecuteReader())
                {
                    if (reader.HasRows)
                    {
                        // Leer el mensaje devuelto
                        reader.Read();
                        mensaje = reader["ErrorMessage"].ToString();


                    }
                }
                cnn.Close();
                return mensaje;
            }
            catch (Exception ex)
            {
                // Manejar la excepción
                return "Error: " + ex.Message;
            }

        }
    }
}
