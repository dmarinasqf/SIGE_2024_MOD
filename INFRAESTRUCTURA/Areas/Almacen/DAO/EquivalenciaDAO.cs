using ENTIDADES.Almacen;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace INFRAESTRUCTURA.Areas.Almacen.DAO
{
  public  class EquivalenciaDAO
    {      
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;

        public EquivalenciaDAO(string cadena)
        {            
            this.cadena = cadena;
        }

        public List<AEquivalencia> getEquivalencias(string uma, string umc)
        {
            if (uma == null)
            {
                uma = "";
            }
            if (umc == null)
            {
                umc = "";
            }
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.sp_getEquivalencia", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@unidadmedidaalmacen", uma);
                cmm.Parameters.AddWithValue("@unidadmedidacliente", umc);
                leer = cmm.ExecuteReader();
                AEquivalencia respuesta = new AEquivalencia();
                List<AEquivalencia> lista = new List<AEquivalencia>();
                while (leer.Read())
                {

                    respuesta = new AEquivalencia();
                    respuesta.idequivalencia = (leer.GetInt32(0));
                    respuesta.unidadmedidainicial = (leer.GetInt32(1));
                    respuesta.unidadmedidai = leer.GetString(2);
                    respuesta.unidadmedidafinal = (leer.GetInt32(3));
                    respuesta.unidadmedidaf = leer.GetString(4);
                    respuesta.equivalencia = leer.GetDecimal(5);

                    lista.Add(respuesta);
                }
                cnn.Close();
                leer.Close();
                return lista;
            }
            catch (Exception)
            {
                return new List<AEquivalencia>();
            }
        }
    }
}
