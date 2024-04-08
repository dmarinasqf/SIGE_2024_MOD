using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace INFRAESTRUCTURA.Areas.General.DAO
{
    public class UsuarioDAO
    {
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        private readonly string cadena;
        public UsuarioDAO(string cadena)
        {
            this.cadena = cadena;
        }
        public DataTable getUsuario(string id)
        {//PEDIDOS DEL DIA
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("DATOS_INICIO_SESION_ERP", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@USUARIO", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "INICIO DE SESION";
                cnn.Close();
                return tabla;


            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
    }
}
