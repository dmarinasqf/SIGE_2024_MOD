using ENTIDADES.compras;
using Erp.SeedWork;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Compras.DAO
{
   public class ProveedorDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;

        public ProveedorDAO( string cadena)
        {            
            this.cadena = cadena;
        }

        //public CProveedor buscarProveedor(int proveedor)
        //{
        //    try
        //    {
        //        var query = (from e in db.CPROVEEDOR
        //                     join s in db.FMONEDA on e.idmoneda equals s.idmoneda
        //                     where e.idproveedor == proveedor
        //                     select new CProveedor
        //                     {
        //                         razonsocial = e.razonsocial,
        //                         ruc = e.ruc,
        //                         telefonod = e.telefonod,
        //                         idproveedor = e.idproveedor,
        //                         moneda = new FMoneda
        //                         {
        //                             idmoneda = s.idmoneda,
        //                             nombre = s.nombre,
        //                             tipodecambio = s.tipodecambio
        //                         }
        //                     }).FirstOrDefault();
        //        return query;
        //    }
        //    catch (Exception e)
        //    {

        //        return null;
        //    }

        //}
        public DataTable getProveedores(string ruc, string rz)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_LISTAR_PROVEEDORES", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@RUC", ruc);
                cmm.Parameters.AddWithValue("@RAZONSOCIAL", rz);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "LISTA DE PROVEEDORES";               
                cnn.Close();
                return tabla;
            }
            catch (Exception )
            {
                return new DataTable();
            }

        }
        public async Task<mensajeJson> ListarProveedoresxProducto(string idproducto)
        {
            try
            {
                var tarea = await Task.Run(() =>
                {
                    return (new mensajeJson("ok", getProveedoresxProducto(idproducto)));
                });
                return tarea;
            }
            catch (Exception)
            {
                return (new mensajeJson("Error en el servidor", null));
            }


        }
        private List<CProveedor> getProveedoresxProducto(string idproducto)
        {
            if (idproducto == null)
            {
                idproducto = "";
            }

            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.sp_getProveedorxProducto", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idproducto", idproducto);
                leer = cmm.ExecuteReader();
                CProveedor respuesta = new CProveedor();
                List<CProveedor> lista = new List<CProveedor>();
                while (leer.Read())
                {
                    respuesta = new CProveedor();
                    respuesta.idproveedor = (leer.GetInt32(0));
                    respuesta.ruc = (leer.GetString(1));
                    respuesta.razonsocial = (leer.GetString(2));
                    respuesta.des1 = leer.GetDecimal(3);
                    respuesta.producto = leer.GetString(4);
                    lista.Add(respuesta);
                }
                cnn.Close();
                leer.Close();
                return lista;
            }
            catch (Exception )
            {
                return new List<CProveedor>();
            }
        }
    }
}
