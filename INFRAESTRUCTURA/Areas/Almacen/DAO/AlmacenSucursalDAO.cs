using ENTIDADES.Almacen;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace INFRAESTRUCTURA.Areas.Almacen.DAO
{
    public class AlmacenSucursalDAO
    {     
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        private readonly string cadena;
        public AlmacenSucursalDAO(string _cadena)
        {           
            cadena = _cadena;
        }

        public List<AAlmacenSucursal> BuscarAlmacenxSucursal(string idSucursal)
        {//PEDIDOS DEL DIA
            if (idSucursal == null) idSucursal = "";            
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.SP_getAlmacenxSucursal", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@idsucursal", idSucursal);
                leer = cmm.ExecuteReader();
                AAlmacenSucursal respuesta = new AAlmacenSucursal();
                List<AAlmacenSucursal> lista = new List<AAlmacenSucursal>();
                while (leer.Read())
                {

                    respuesta = new AAlmacenSucursal();
                    respuesta.idalmacensucursal = (leer.GetInt32(0));
                    respuesta.idalmacen = (leer.GetInt32(1));
                    respuesta.almacen = leer.GetString(2);
                    respuesta.idareaalmacen = (leer.GetInt32(3));
                    respuesta.areaalmacen = leer.GetString(4);
                    respuesta.estado = leer.GetString(5);
                    lista.Add(respuesta);
                }
                cnn.Close();
                leer.Close();
                return lista;
            }
            catch (Exception)
            {
                return null;
            }
        }


        public DataTable Listarempleados(int idsucursal)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_LISTAR_EMPLEADOS_HABILITADOS", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@SUCURSAL", idsucursal);
           
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

        public DataTable Listaralmacenempleado(int IDSUCURSAL, int NOMBRES,int idalmacenempleado)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_ListarAlmacenEmpleado", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDSUCURSAL", IDSUCURSAL);
                cmm.Parameters.AddWithValue("@NOMBRES", NOMBRES);
                cmm.Parameters.AddWithValue("@IDALMACENEMPLEADO", idalmacenempleado);
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

        public string guardaralmacenempelado(AEmpleadoAlmacen obj)
        {
            DateTime fechaActual = DateTime.Now;
            string mensaje = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();

                cmm = new SqlCommand("SP_InsertarAlmacenEmpleado", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@EmpCodigo", obj.emp_codigo);
                cmm.Parameters.AddWithValue("@IdAlmacen", obj.idalmacen);
                cmm.Parameters.AddWithValue("@IdAreaAlmacen", obj.idareaalmacen);
                cmm.Parameters.AddWithValue("@FechaCreacion", fechaActual);
                cmm.Parameters.AddWithValue("@FechaEdicion", fechaActual);
                cmm.Parameters.AddWithValue("@Estado", "HABILITADO");

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

        public string editarralmacenempelado(AEmpleadoAlmacen obj)
        {
            DateTime fechaActual = DateTime.Now;
            string mensaje = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();

                cmm = new SqlCommand("SP_ActualizarAlmacenEmpleado", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IdAlmacenEmpleado", obj.idalmacenempleado);
                cmm.Parameters.AddWithValue("@EmpCodigo", obj.emp_codigo);
                cmm.Parameters.AddWithValue("@IdAlmacen", obj.idalmacen);
                cmm.Parameters.AddWithValue("@IdAreaAlmacen", obj.idareaalmacen);
                //cmm.Parameters.AddWithValue("@FechaCreacion", fechaActual);
                cmm.Parameters.AddWithValue("@FechaEdicion", fechaActual);
                cmm.Parameters.AddWithValue("@Estado", "HABILITADO");

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

        public string activardesactivaralmacenempelado(int idalmacenempleado, string estado)
        {
            DateTime fechaActual = DateTime.Now;
            string mensaje = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_ActivarDesactivarAlmacenEmpleado", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IdAlmacenEmpleado", idalmacenempleado);
                cmm.Parameters.AddWithValue("@Estado", estado);
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


        // CREACION DEL LISTADO DE ALAMCEN FILTRADO POR EMPLEADO Y SUCURSAL


        public DataTable BuscarAlmacenxSucursalempleado(int idSucursal, int idempleado)
        {//PEDIDOS DEL DIA     


            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.ListarAlmacenxSucursalEmpleado", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@Idsucursal", idSucursal);
                cmm.Parameters.AddWithValue("@idempleado", idempleado);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "";
                cnn.Close();
                return tabla;
            }
            catch (Exception ex)
            {
                return new DataTable();
            }
           
        }

    }
}
