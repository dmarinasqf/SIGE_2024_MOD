using ENTIDADES.Generales;
using Erp.Persistencia.Servicios.Users;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.DAO
{
    public class SucursalDAO
    {
        SqlConnection cnn;
        SqlCommand cmm;
        private readonly string cadena;
        private readonly IUser user;
        public SucursalDAO(string _cadena, IUser _user)
        {
            cadena = _cadena;
            //se agrega IUser
            user = _user;
        }
        public async Task<List<SUCURSAL>> listarSucursalesAsync(string estado)
        {
            try
            {
                var data = await Task.Run(() => {                    
                    return getSucursales(estado);
                });
                return data;
            }
            catch (Exception)
            {

                return new List<SUCURSAL>();
            }

        }
        private List<SUCURSAL> getSucursales(string estado)
        {
            try
            {
                if (estado is null)
                    estado = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                int idempresa =(user.getIdEmpresaCookie());
                cmm = new SqlCommand("SP_LISTAR_SUCURSALES", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ESTADO", estado);
                //parametro empresa
                cmm.Parameters.AddWithValue("@empresa", idempresa);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "SUCURSALES";

                SUCURSAL sucursal = new SUCURSAL();
                List<SUCURSAL> sucursales = new List<SUCURSAL>();
                foreach (DataRow row in tabla.Rows)
                {
                    sucursal = new SUCURSAL();
                    sucursal.suc_codigo = int.Parse(row["ID"].ToString());
                    sucursal.descripcion = (row["DESCRIPCION"].ToString());
                    sucursal.direccion = (row["DIRECCION"].ToString());
                    sucursal.tipoSucursal = (row["TIPO SUCURSAL"].ToString());
                    sucursal.serie = (row["SERIE"].ToString());
                    sucursal.estado = (row["ESTADO"].ToString());
                    sucursal.empresa = (row["EMPRESA"].ToString());
                    sucursal.nombreLaboratorio = (row["LABORATORIO"].ToString());
                    sucursal.codigoestablecimiento = (row["CODIGOESTABLECIMIENTO"].ToString());
                    sucursal.ciudad = (row["CIUDAD"].ToString());
                    sucursales.Add(sucursal);
                }
                cnn.Close();
                return sucursales;
            }
            catch (Exception ex)
            {
                return new List<SUCURSAL>();
            }

        }
        public DataTable getCorrelativo(string idsucursal) {
            try {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.listar_Correlativo", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idsucursal", Int32.Parse(idsucursal));
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "DATOS";
                cnn.Close();
                return tabla;
            }
            catch (Exception e) {
                return new DataTable();
            }

        }


        // MODALES
        public DataTable listarmodalesactivos(string fecha, string ruta,string idsucursal )
        {
            int idSucursalInt = int.Parse(idsucursal);
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.listadodemodalessige", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@fechainicio", fecha);
                cmm.Parameters.AddWithValue("@ruta", ruta);
                cmm.Parameters.AddWithValue("@idsucursal", idSucursalInt);
                
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "MODAL";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }


        public DataTable listarUsuarioActivadoModal(int idmodalpersonalizado, string idempleado)
        {
            int idempleadoInt = int.Parse(idempleado);
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.ObtenerModalActivadoUsuario", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idusuario", idempleadoInt);
                cmm.Parameters.AddWithValue("@idmodalpersonalizado", idmodalpersonalizado);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "MODAL";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }

        public string guardarEditarUsuarioActivadoModal(int idModalActivadoPorUsuario, int idmodalpersonalizado, string idempleado, string fechaactualpara, int tipo)
        {

            int idempleadoInt = int.Parse(idempleado);
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.GuardarEditarModalActivadoUsuario", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idModalActivadoPorUsuario", idModalActivadoPorUsuario);
                cmm.Parameters.AddWithValue("@idmodalpersonalizado", idmodalpersonalizado);
                cmm.Parameters.AddWithValue("@ProximaFechaActivacion", fechaactualpara);
                cmm.Parameters.AddWithValue("@usuarioActivado", idempleadoInt);
                cmm.Parameters.AddWithValue("@tipo", tipo);
                string result = Convert.ToString(cmm.ExecuteScalar());
                cnn.Close();

                return result;
            }
            catch (Exception e)
            {
                return "error";
            }



      

        }
        
    }
}
