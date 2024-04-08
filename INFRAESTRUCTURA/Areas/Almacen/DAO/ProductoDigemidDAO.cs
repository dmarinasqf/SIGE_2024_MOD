using ENTIDADES.Almacen;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace INFRAESTRUCTURA.Areas.Almacen.DAO
{
   public class ProductoDigemidDAO
    {
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        private readonly string cadena;
        public ProductoDigemidDAO(string _cadena)
        {
            cadena = _cadena;
        }
        public string GuardarPreciosDigemid(List<AProductoDigemid>productos)
        {            
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                foreach (var item in productos)
                {
                    try
                    {
                        item.codigodigemid = item.codigodigemid ?? "";
                        item.concentracion = item.concentracion ?? "";
                        item.estado = item.estado ?? "";
                        item.fechavenregsanitario = item.fechavenregsanitario ?? "";
                        item.forma = item.forma ?? "";
                        item.formasimplificada = item.formasimplificada ?? "";
                        item.fraccion = item.fraccion ?? "";
                        item.laboratorio = item.laboratorio ?? "";
                        item.nombre = item.nombre ?? "";
                        item.regsanitario = item.regsanitario ?? "";
                        item.presentacion = item.presentacion ?? "";
                        item.situacion = item.situacion ?? "";
                        cmm = new SqlCommand("Almacen.SP_REGISTRAR_LISTA_DIGEMID", cnn);
                        cmm.CommandType = CommandType.StoredProcedure;
                        cmm.Parameters.AddWithValue("@codigodigemid", item.codigodigemid);
                        cmm.Parameters.AddWithValue("@concentracion", item.concentracion);
                        cmm.Parameters.AddWithValue("@estado", item.estado);
                        cmm.Parameters.AddWithValue("@fechavenregsanitario", item.fechavenregsanitario);
                        cmm.Parameters.AddWithValue("@forma", item.forma);
                        cmm.Parameters.AddWithValue("@formasimplificada", item.formasimplificada);
                        cmm.Parameters.AddWithValue("@fraccion", item.fraccion);
                        cmm.Parameters.AddWithValue("@laboratorio", item.laboratorio);
                        cmm.Parameters.AddWithValue("@nombre", item.nombre);
                        cmm.Parameters.AddWithValue("@regsanitario", item.regsanitario);
                        cmm.Parameters.AddWithValue("@presentacion", item.presentacion);
                        cmm.Parameters.AddWithValue("@situacion", item.situacion);
                        leer = cmm.ExecuteReader();
                        leer.Close();
                    }
                    catch (Exception e)
                    {
                        return e.Message;
                    }
                   
                }                
                cnn.Close();               
                return "ok";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }
    }
}
