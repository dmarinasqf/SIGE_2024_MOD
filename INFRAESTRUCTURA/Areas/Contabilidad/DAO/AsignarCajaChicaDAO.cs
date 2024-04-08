using Erp.Entidades.Contabilidad;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Contabilidad.DAO
{
    public class AsignarCajaChicaDAO
    {

        private readonly string cadena;
        SqlConnection cnn;
        SqlCommand cmm;

        public AsignarCajaChicaDAO(string cadena)
        {
            this.cadena = cadena;
        }

        public string CajaAsignacionAgregar(ResponsableSede responsableSede)
        {
            string respuesta = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_CAJA_ASIGNACION_AGREGAR", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@montoCaja", responsableSede.montoCaja);
                //cmm.Parameters.AddWithValue("@responsableCaja", responsableSede.responsableCaja);
                cmm.Parameters.AddWithValue("@numeroCuenta", responsableSede.numeroCuenta);
                cmm.Parameters.AddWithValue("@entidadBancaria", responsableSede.entidadBancaria);
                cmm.Parameters.AddWithValue("@periodo", responsableSede.periodo);
                cmm.Parameters.AddWithValue("@idEmpresa", responsableSede.idEmpresa);
                cmm.Parameters.AddWithValue("@idSucursal", responsableSede.idSucursal);
                cmm.Parameters.AddWithValue("@emp_codigo", responsableSede.emp_codigo);
                cmm.Parameters.AddWithValue("@areaTrabajo", responsableSede.areaTrabajo);
                cmm.Parameters.AddWithValue("@usuario_op", responsableSede.usuario_op);
                respuesta = cmm.ExecuteNonQuery() > 0 ? "success" : "error";
                return respuesta;
            }
            catch (Exception e)
            {
                return "fail" + e.Message;
            }
        }

        public List<ResponsableSede> cajaAsignacionListar(string fechaInicial, string fechaFinal)
        {
            try
            {
                List<ResponsableSede> cajaChicas = new List<ResponsableSede>();
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_CAJA_ASIGNACION_LISTAR", cnn);
                cmm.Parameters.AddWithValue("@fechaInicial", fechaInicial);
                cmm.Parameters.AddWithValue("@fechaFinal", fechaFinal);
                cmm.CommandType = CommandType.StoredProcedure;
                using (SqlDataReader dr = cmm.ExecuteReader())
                {
                    while (dr.Read())
                    {
                        cajaChicas.Add(new ResponsableSede()
                        {
                            idSucursalResp = dr.GetString(0),
                            areaTrabajo = dr.GetString(1),
                            montoCaja = dr.GetDecimal(2),
                            saldoCaja = dr.GetDecimal(3),
                            montoReponer = dr.GetDecimal(4),
                            responsableCaja = dr.GetString(5),
                            nombreSucursal = dr.GetString(6),
                            fecha_modificacion = dr.GetDateTime(7).ToString()
                        });
                    }
                }
                cnn.Close();
                return cajaChicas;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public ResponsableSede cajaAsignacionBuscar(string idSucursalResp)
        {
            ResponsableSede responsableSede = new ResponsableSede();
            cnn = new SqlConnection();
            cnn.ConnectionString = cadena;
            cnn.Open();
            cmm = new SqlCommand("SP_CAJA_ASIGNACION_BUSCAR", cnn);
            cmm.Parameters.AddWithValue("@idSucursalResp", idSucursalResp);
            cmm.CommandType = CommandType.StoredProcedure;
            try
            {
                using (SqlDataReader dr = cmm.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        responsableSede.idSucursalResp = dr.GetString(0);
                        responsableSede.montoCaja = dr.GetDecimal(1);
                        responsableSede.montoReponer = dr.GetDecimal(2);
                        responsableSede.responsableCaja = dr.GetString(3);
                        responsableSede.numeroCuenta = dr.GetString(4);
                        responsableSede.entidadBancaria = dr.GetString(5);
                        responsableSede.periodo = dr.GetString(6);
                        responsableSede.idEmpresa = dr.GetInt32(7);
                        responsableSede.emp_descripcion = dr.GetString(8);
                        responsableSede.idSucursal = dr.GetInt32(9);
                        responsableSede.nombreSucursal = dr.GetString(10);
                        responsableSede.areaTrabajo = dr.GetString(11);
                        responsableSede.usuario = dr.GetInt32(12);
                        responsableSede.usuario_op = dr.GetInt32(13);
                    }
                }
                cnn.Close();
            }
            catch (Exception e)
            {
                responsableSede.emp_descripcion = e.Message;
            }
            return responsableSede;
        }

        public string CajaAsignacionReponer(ResponsableSede responsableSede)
        {
            string respuesta = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_CAJA_ASIGNACION_REPONER", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idSucursalResp", responsableSede.idSucursalResp);
                cmm.Parameters.AddWithValue("@montoUltRep", responsableSede.montoCaja);
                cmm.Parameters.AddWithValue("@usuario_op", responsableSede.usuario_op);
                cmm.Parameters.AddWithValue("@usuario_resp", responsableSede.usuario);
                cmm.Parameters.AddWithValue("@numeroCuenta", responsableSede.numeroCuenta);
                cmm.Parameters.AddWithValue("@entidadBancaria", responsableSede.entidadBancaria);
                cmm.Parameters.AddWithValue("@recursoImg", responsableSede.recursoImg);
                respuesta = cmm.ExecuteNonQuery() > 0 ? "success" : "error";
                return respuesta;
            }
            catch (Exception e)
            {
                return "fail" + e.Message;
            }
        }

        public string CajaAsignacionReasignarResp(ResponsableSede responsableSede)
        {
            string respuesta = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_CAJA_ASIG_REASIGNAR_RESP", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idSucursalResp", responsableSede.idSucursalResp);
                cmm.Parameters.AddWithValue("@usuario_op", responsableSede.usuario_op);
                cmm.Parameters.AddWithValue("@usuario_resp", responsableSede.usuario);
                cmm.Parameters.AddWithValue("@numeroCuenta", responsableSede.numeroCuenta);
                cmm.Parameters.AddWithValue("@entidadBancaria", responsableSede.entidadBancaria);
                respuesta = cmm.ExecuteNonQuery() > 0 ? "success" : "error";
                return respuesta;
            }
            catch (Exception e)
            {
                return "fail" + e.Message;
            }
        }

        public List<Empresa> empresasListar()
        {
            List<Empresa> cajaChicas = new List<Empresa>();
            cnn = new SqlConnection();
            cnn.ConnectionString = cadena;
            cnn.Open();
            cmm = new SqlCommand("SP_CAJA_CHICA_EMPRESAS", cnn);
            cmm.CommandType = CommandType.StoredProcedure;
            using (SqlDataReader dr = cmm.ExecuteReader())
            {
                while (dr.Read())
                {
                    cajaChicas.Add(new Empresa()
                    {
                        idempresa = dr.GetInt32(0),
                        descripcion = dr.GetString(1),
                        ruc = dr.GetString(2)
                    });
                }
            }
            cnn.Close();
            return cajaChicas;
        }

        public List<Empleado> empleadoListar(string nombres)
        {
            List<Empleado> empleados = new List<Empleado>();
            cnn = new SqlConnection();
            cnn.ConnectionString = cadena;
            cnn.Open();
            cmm = new SqlCommand("SP_CAJA_CHICA_EMPLEADOS", cnn);
            cmm.Parameters.AddWithValue("@nombreCompleto", nombres);
            cmm.CommandType = CommandType.StoredProcedure;
            using (SqlDataReader dr = cmm.ExecuteReader())
            {
                while (dr.Read())
                {
                    empleados.Add(new Empleado()
                    {
                        emp_codigo = dr.GetInt32(0),
                        label = dr.GetString(1),
                        suc_codigo = dr.GetInt32(2),
                        suc_descripcion = dr.GetString(3),
                        idempresa = dr.GetInt32(4),
                        emp_descripcion = dr.GetString(5),
                    });
                }
            }
            cnn.Close();
            return empleados;
        }

        //--EARTCOD1024---FUNCION VALIDAR RENDICION----------------------------------
        public DataTable CajaChicaValidarRendicionListar(string fechaInicial, string fechaFinal, string responsablecaja)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_CAJA_CHICA_VALIDAR_RENDICION_LISTAR", cnn);
                cmm.Parameters.AddWithValue("@fechaInicial", fechaInicial);
                cmm.Parameters.AddWithValue("@fechaFinal", fechaFinal);
                cmm.Parameters.AddWithValue("@responsablecaja", responsablecaja);
                cmm.CommandType = CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "cajachicavalidarrendicionlistar";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        public string CajaChicaValidarEstado(int idCajaChicaDet, string estado_op)
        {
            string respuesta = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("SP_CAJA_CHICA_VALIDAR_ESTADO", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idCajaChicaDet", idCajaChicaDet);
                cmm.Parameters.AddWithValue("@estado_op", estado_op);

                respuesta = cmm.ExecuteNonQuery() > 0 ? "success" : "warning";
                cnn.Close();
                return respuesta;
            }
            catch (Exception e)
            {
                respuesta = "error: " + e.Message;
                return respuesta;
            }
        }
    }
}
