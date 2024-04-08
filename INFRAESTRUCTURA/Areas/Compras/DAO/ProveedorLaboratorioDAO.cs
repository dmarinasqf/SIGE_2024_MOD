using ENTIDADES.Almacen;
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
    public class ProveedorLaboratorioDAO
    {     
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;

        public ProveedorLaboratorioDAO( string cadena)
        {            
            this.cadena = cadena;         
        }
        public async Task<mensajeJson> getLaboratoriosXProveedorAsync(string idproveedor, string laboratorio)
        {
            try
            {
                var tarea = await Task.Run(() =>
                {
                    return (getTableLaboratoriosXProveedor(idproveedor, laboratorio));
                });
                return tarea;
            }
            catch (Exception)
            {
                return (new mensajeJson("Error en el servidor", null));
            }


        }
        public mensajeJson getTableLaboratoriosXProveedor(string idproveedor, string laboratorio)
        {
            if (idproveedor == null)
                idproveedor = "";
            if (laboratorio == null)
                laboratorio = "";
            try
            {               
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_GETLABORATORIOXPROVEEDOR", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@IDPROVEEDOR", idproveedor);
                cmm.Parameters.AddWithValue("@LABORATORIO", laboratorio);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "LISTA ALMACENES X PROVEEDOR";
                cnn.Close();
                return (new mensajeJson("ok",tabla));
            }
            catch (Exception e)
            {
                return (new mensajeJson(e.Message, new DataTable()));
            }

        }       
        public List<CProveedorLaboratorio> getLaboratorios(string idproveedor)
        {
            if (idproveedor == null)           
                idproveedor = "";            

            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_getLabNoAsignados", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@idproveedor", idproveedor);
                leer = cmm.ExecuteReader();
                CProveedorLaboratorio respuesta = new CProveedorLaboratorio();
                List<CProveedorLaboratorio> lista = new List<CProveedorLaboratorio>();
                while (leer.Read())
                {

                    respuesta = new CProveedorLaboratorio();
                    respuesta.idproveedorlab = (leer.GetInt32(0));
                    respuesta.idlaboratorio = (leer.GetInt32(1));
                    respuesta.laboratorio = leer.GetString(2);

                    lista.Add(respuesta);
                }
                cnn.Close();
                leer.Close();
                return lista;
            }
            catch (Exception )
            {
                return new List<CProveedorLaboratorio>();
            }
        }
        //obtiene un listado de los laboratorios con los que trabajan los proveedores
        public List<CProveedorLaboratorio> getLaboratoriosxProveedor(string idproveedor)
        {//PEDIDOS DEL DIA
            if (idproveedor == null)
            {
                idproveedor = "";
            }

            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_getLabAsignados", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@idproveedor", idproveedor);
                leer = cmm.ExecuteReader();
                CProveedorLaboratorio respuesta = new CProveedorLaboratorio();
                List<CProveedorLaboratorio> lista = new List<CProveedorLaboratorio>();
                while (leer.Read())
                {

                    respuesta = new CProveedorLaboratorio();
                    respuesta.idproveedorlab = (leer.GetInt32(0));
                    respuesta.idproveedor = (leer.GetInt32(1));
                    respuesta.proveedor = leer.GetString(2);
                    respuesta.idlaboratorio = (leer.GetInt32(3));
                    respuesta.laboratorio = leer.GetString(4);

                    lista.Add(respuesta);
                }
                cnn.Close();
                leer.Close();
                return lista;
            }
            catch (Exception )
            {
                return new List<CProveedorLaboratorio>();
            }
        }
        /*by stalin*/
        //public List<ALaboratorio> getlaboratoriosproveedorparamodal(string idproveedor)
        //{
        //    try
        //    {
        //        var query = (from e in db.CPROVEEDORLABORATORIO
        //                     join s in db.ALABORATORIO on e.idlaboratorio equals s.idlaboratorio
        //                     where e.estado != "ELIMINADO"
        //                     && e.idproveedor == int.Parse(idproveedor)
        //                     orderby s.descripcion
        //                     select new ALaboratorio
        //                     {
        //                         descripcion = s.descripcion,
        //                         estado = e.estado,
        //                         idlaboratorio = s.idlaboratorio,

        //                     }).ToList();
        //        return query;
        //    }
        //    catch (Exception )
        //    {

        //        return new List<ALaboratorio>();
        //    }
        //}
    }
}
