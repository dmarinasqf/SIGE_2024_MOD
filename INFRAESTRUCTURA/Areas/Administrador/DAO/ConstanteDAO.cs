using ENTIDADES.Almacen;
using ENTIDADES.compras;
using ENTIDADES.Finanzas;
using ENTIDADES.Generales;
using ENTIDADES.preingreso;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

// subir archivo al drive yex
using Google.Apis.Drive.v3;
using Google.Apis.Auth.OAuth2;
using System.IO;
using System.Threading;
using Google.Apis.Util.Store;
using Google.Apis.Services;
using System.Net.Http;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace INFRAESTRUCTURA.Areas.Administrador.DAO
{
    public class ConstanteDAO
    {        
        private readonly string cadena;
        SqlConnection cnn;
       
        SqlCommand cmm;
        SqlCommand cmd;
        public ConstanteDAO(string cadena)
        {            
            this.cadena = cadena;
        }
        
        public DataTable getListaConstante()
        {      
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_Listarconstantes", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "constante";

                cnn.Close();
                return tabla;
            }
            catch (Exception )
            {
                return new DataTable();
            }
        }
        
    }
}
