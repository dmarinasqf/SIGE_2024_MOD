using ENTIDADES.Almacen;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Almacen.DAO
{
    public class ProductoParecidoDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;

        public ProductoParecidoDAO(string cadena)
        {
            this.cadena = cadena;
        }

        public DataTable ListarProductosAgrupados(string codigoproducto, string nombreproducto)
        {
            try
            {
                if (codigoproducto is null) codigoproducto = "";
                if (nombreproducto is null) nombreproducto = "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.sp_ListarProductosAgrupados", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@codigoproducto", codigoproducto);
                cmm.Parameters.AddWithValue("@nombreproducto", nombreproducto);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS AGRUPADOS";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public DataTable ListarProductosParecidos(int idproducto)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.sp_ListarProductosParecidos", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idproducto", idproducto);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS PARECIDOS";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public int RegistrarEditarProductoParecido(AProductoParecido oProductoparecido, string idproductosparecidos)
        {
            try
            {
                int i = 0;
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.sp_RegistrarEditarProductoParecido", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idproducto", oProductoparecido.idproducto);
                cmm.Parameters.AddWithValue("@idproductosparecidos", idproductosparecidos);
                cmm.Parameters.AddWithValue("@estado", "");
                cmm.Parameters.AddWithValue("@usuariocrea", oProductoparecido.usuariocrea);
                cmm.Parameters.AddWithValue("@fechacreacion", oProductoparecido.fechacreacion);
                cmm.Parameters.AddWithValue("@usuariomodifica", oProductoparecido.usuariomodifica);
                cmm.Parameters.AddWithValue("@fechaedicion", oProductoparecido.fechaedicion);
                i = cmm.ExecuteNonQuery();
                cnn.Close();
                return i;
            }
            catch (Exception e)
            {
                return 0;
            }
        }
    }
}
