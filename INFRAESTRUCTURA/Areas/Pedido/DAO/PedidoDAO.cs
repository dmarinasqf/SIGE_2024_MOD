using ENTIDADES.pedidos;
using Erp.Entidades.pedidos;
using Erp.Persistencia.Servicios.Users;
using Erp.SeedWork;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Infraestructura.Areas.Pedido.DAO
{
    public class PedidoDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        private static DataTable dtrecepcionvalidacion;

        public PedidoDAO(string cadena)
        {
            this.cadena = cadena;
        }

        public DataTable listarxproductocliente(string idcliente, int idproducto)
        {
            try
            {
                if (idcliente is null) idcliente = "";

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("comercial.SP_BUSCAR_CLIENTE_PRODUCTO", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idcliente", idcliente);
                cmm.Parameters.AddWithValue("@idproducto", idproducto);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PRODUCTOS X CLIENTE";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }
        public void registro_adelanto(string usu, int idtipopago, double total, double pagado, string numtarjeta, int idtipotarjeta, int idpedido)
        {
            try
            {
                if (numtarjeta is null) numtarjeta = "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.sp_insert_adelantos_pedidos", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@usu", usu);
                cmm.Parameters.AddWithValue("@idtipopago", idtipopago);
                cmm.Parameters.AddWithValue("@total", total);
                cmm.Parameters.AddWithValue("@pagado", pagado);
                cmm.Parameters.AddWithValue("@numtarjeta", numtarjeta);
                cmm.Parameters.AddWithValue("@idtipotarjeta", idtipotarjeta);
                cmm.Parameters.AddWithValue("@idpedido", idpedido);
                cmm.ExecuteNonQuery();
            }
            catch (Exception vex)
            {

            }
        }

        public List<LineaAtencion> LineaAtencionListar()
        {
            List<LineaAtencion> lista = new List<LineaAtencion>();
            cnn = new SqlConnection();
            cnn.ConnectionString = cadena;
            cnn.Open();

            cmm = new SqlCommand("SP_LINEA_ATENCION_LISTAR", cnn);
            cmm.CommandType = CommandType.StoredProcedure;

            using (SqlDataReader dr = cmm.ExecuteReader())
            {
                while (dr.Read())
                {
                    lista.Add(new LineaAtencion()
                    {
                        IdLineaAtencion = dr.GetInt32(0),
                        Nombre = dr.GetString(1)
                    });
                }
            }
            cnn.Close();
            return lista;
        }
        public DataTable ReporteRecepcion_Validacion(string fecha, int sucursal)
        {
            try
            {
                string ffin = "", fini = "";
                if (fecha is null)
                {
                    fecha = "";
                }
                else
                {
                    string[] fechas = fecha.Split('-');
                    ffin = fechas[1].Trim(); fini = fechas[0].Trim();
                }



                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("analisis_preinscripcion_pedidos", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@fechainicio", fini);
                cmm.Parameters.AddWithValue("@fechafin", ffin);
                cmm.Parameters.AddWithValue("@idsucursal", sucursal);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "RECEPCION Y VALIDACION";
                dtrecepcionvalidacion = tabla;
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }

        }
        public async Task<mensajeJson> GenerarExcelReportevalidacion(string path)
        {
            try
            {
                var data = await Task.Run(() =>
                {
                    var DATA = dtrecepcionvalidacion;
                    GuardarElementos save = new GuardarElementos();
                    var nombre = "Reporte_recepcionyvalidacion" + DateTime.Now.ToString("yyyyMMddHHmm") + ".xlsx";

                    string direccion = "/archivos/reportes/pedidos/";
                    string ruta = Path.Combine(path + direccion, "");
                    string res = save.GenerateExcel(ruta, nombre, DATA);
                    if (res == "ok")
                        return new mensajeJson("ok", direccion + nombre);
                    else
                        return new mensajeJson(res, direccion + nombre);
                });
                return data;
            }
            catch (Exception e)
            {

                return new mensajeJson(e.Message, null);
            }
        }
        public DataTable ImprimirConsulta(int idsucursal)
        {
            if (dtrecepcionvalidacion is null)
            {
                ReporteRecepcion_Validacion("", idsucursal);
            }
            return dtrecepcionvalidacion;
        }

        //public DataTable BuscarNumeroPedidosPendientes(int suc_codigo)
        //{
        //    try
        //    {
        //        cnn = new SqlConnection();
        //        cnn.ConnectionString = cadena;
        //        cnn.Open();
        //        cmm = new SqlCommand("sp_numpedidos_alerta_pedidos", cnn);
        //        cmm.CommandType = System.Data.CommandType.StoredProcedure;
        //        cmm.Parameters.AddWithValue("@suc_codigo", suc_codigo);
        //        DataTable tabla = new DataTable();
        //        SqlDataAdapter da = new SqlDataAdapter(cmm);
        //        da.Fill(tabla);
        //        tabla.TableName = "NUMERO DE PEDIDOS PENDIENTES";
        //        cnn.Close();
        //        return tabla;
        //    }
        //    catch (Exception e)
        //    {
        //        return new DataTable();
        //    }
        //}

        public async Task<mensajeJson> IngresarOrdenProduccion(int idpedido, string orden, int usuariolaboratorio)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.sp_IngresarOrdenProduccion", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idpedido", idpedido);
                cmm.Parameters.AddWithValue("@orden", orden);
                cmm.Parameters.AddWithValue("@usuariolaboratorio", usuariolaboratorio);
                cmm.Parameters.Add("@mensaje", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                await cmm.ExecuteNonQueryAsync();
                string mensaje = cmm.Parameters["@mensaje"].Value.ToString();
                cnn.Close();
                return new mensajeJson(mensaje, null);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }

        public async Task<mensajeJson> IngresarNumDocumento(int idpedido, string numdocumento)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.sp_IngresarNumDocumento", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idpedido", idpedido);
                cmm.Parameters.AddWithValue("@numdocumento", numdocumento);
                cmm.Parameters.Add("@mensaje", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                await cmm.ExecuteNonQueryAsync();
                string mensaje = cmm.Parameters["@mensaje"].Value.ToString();
                cnn.Close();
                return new mensajeJson(mensaje, null);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }

        }

        public async Task<mensajeJson> CambiarDificultadItem(int iddetalle, int iddificultad, string idusuario)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.CambiarDificultadItem", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@iddetalle", iddetalle);
                cmm.Parameters.AddWithValue("@iddificultad", iddificultad);
                cmm.Parameters.AddWithValue("@usuariomodifica", idusuario);
                cmm.Parameters.AddWithValue("@fechaedicion", DateTime.Now);
                cmm.Parameters.Add("@mensaje", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                await cmm.ExecuteNonQueryAsync();
                string mensaje = cmm.Parameters["@mensaje"].Value.ToString();
                cnn.Close();
                return new mensajeJson(mensaje, null);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }

        }

        public async Task<mensajeJson> TerminarPedido(int idpedido, int idformulador, string usuarioactual, int usuario)
        {
            try
            {
                if (usuarioactual is null) usuarioactual = "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.TerminarPedido", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idpedido", idpedido);
                cmm.Parameters.AddWithValue("@idformulador", idformulador);
                cmm.Parameters.AddWithValue("@usuarioactual", usuarioactual);
                cmm.Parameters.AddWithValue("@usuario", usuario);
                cmm.Parameters.Add("@mensaje", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                await cmm.ExecuteNonQueryAsync();
                string mensaje = cmm.Parameters["@mensaje"].Value.ToString();
                cnn.Close();
                return new mensajeJson(mensaje, null);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }

        }

        public async Task<mensajeJson> TransferirPedido(int idpedido, int idempleado, string laboratorio)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.TransferirPedido", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idpedido", idpedido);
                cmm.Parameters.AddWithValue("@idempleado", idempleado);
                cmm.Parameters.AddWithValue("@laboratorio", laboratorio);
                cmm.Parameters.Add("@mensaje", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                await cmm.ExecuteNonQueryAsync();
                string mensaje = cmm.Parameters["@mensaje"].Value.ToString();
                cnn.Close();
                return new mensajeJson(mensaje, null);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }

        public List<EstadoPedido> ListarEstado(string tipo)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.ListarEstado", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@tipo", tipo);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "LISTAR ESTADO";
                cnn.Close();

                List<EstadoPedido> lEstadoPedido = new List<EstadoPedido>();
                for (int i = 0; i < tabla.Rows.Count; i++)
                {
                    EstadoPedido oEstadoPedido = new EstadoPedido();
                    oEstadoPedido.idestado = tabla.Rows[i]["idestado"].ToString();
                    oEstadoPedido.estado = tabla.Rows[i]["estado"].ToString();
                    oEstadoPedido.tipo = tabla.Rows[i]["tipo"].ToString();
                    oEstadoPedido.descripcion = tabla.Rows[i]["descripcion"].ToString();
                    lEstadoPedido.Add(oEstadoPedido);
                }
                return lEstadoPedido;
            }
            catch (Exception e)
            {
                return new List<EstadoPedido>();
            }
        }

        public DataTable ListarDificultad(string estado)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.ListarDificultad", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@estado", estado);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "LISTAR DIFICULTAD";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }

        public mensajeJson BuscarPedidosDevueltos(string idlaboratorio)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.BuscarPedidosDevueltos", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idlaboratorio", idlaboratorio);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "BUSCAR PEDIDOS DEVUELTOS";
                cnn.Close();
                return new mensajeJson("ok", JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {
                return new mensajeJson("", null);
            }
        }

        public async Task<mensajeJson> DescargarPedidoDevuelto(int idpedido, int idquimico)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.DescargarPedidoDevuelto", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idpedido", idpedido);
                cmm.Parameters.AddWithValue("@idquimico", idquimico);
                cmm.Parameters.Add("@mensaje", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                await cmm.ExecuteNonQueryAsync();
                string mensaje = cmm.Parameters["@mensaje"].Value.ToString();
                cnn.Close();
                return new mensajeJson(mensaje, null);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }

        public async Task<mensajeJson> CambiarFormulador(int iddetalle, int idformulador)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.CambiarFormulador", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@iddetalle", iddetalle);
                cmm.Parameters.AddWithValue("@idformulador", idformulador);
                cmm.Parameters.Add("@mensaje", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                await cmm.ExecuteNonQueryAsync();
                string mensaje = cmm.Parameters["@mensaje"].Value.ToString();
                cnn.Close();
                return new mensajeJson(mensaje, null);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }

        public async Task<mensajeJson> CambiarEstadoProcesoDetalle(int iddetalle, int usuario)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.CambiarEstadoProcesoDetalle", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@iddetalle", iddetalle);
                cmm.Parameters.AddWithValue("@usuario", usuario);
                cmm.Parameters.Add("@mensaje", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                cmm.Parameters.Add("@estadoprocesoout", SqlDbType.VarChar, 1000).Direction = ParameterDirection.Output;
                await cmm.ExecuteNonQueryAsync();
                string mensaje = cmm.Parameters["@mensaje"].Value.ToString();
                string estadoproceso = cmm.Parameters["@estadoprocesoout"].Value.ToString();
                cnn.Close();
                return new mensajeJson(mensaje, estadoproceso);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }

        public async Task<mensajeJson> CambiarEstadoDetalleTerminado(int iddetalle, int estadoTerminado, int usuario)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.CambiarEstadoDetalleTerminado", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@iddetalle", iddetalle);
                cmm.Parameters.AddWithValue("@estadoTerminado", estadoTerminado);
                cmm.Parameters.AddWithValue("@usuario", usuario);
                cmm.Parameters.Add("@mensaje", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                await cmm.ExecuteNonQueryAsync();
                string mensaje = cmm.Parameters["@mensaje"].Value.ToString();
                cnn.Close();
                return new mensajeJson(mensaje, null);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }

        public async Task<mensajeJson> CambiarLaboratorioAsignado(int iddetalle, int idlaboratorio, int usuario)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.CambiarLaboratorioAsignado", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@iddetalle", iddetalle);
                cmm.Parameters.AddWithValue("@idlaboratorio", idlaboratorio);
                cmm.Parameters.AddWithValue("@usuario", usuario);
                cmm.Parameters.Add("@mensaje", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                await cmm.ExecuteNonQueryAsync();
                string mensaje = cmm.Parameters["@mensaje"].Value.ToString();
                cnn.Close();
                return new mensajeJson(mensaje, null);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }

        public mensajeJson BuscarArticulo(string id)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.BuscarArticulo", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@id", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "BUSCAR ARTICULO";
                cnn.Close();
                return new mensajeJson("ok", JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {
                return new mensajeJson("", null);
            }
        }
        public mensajeJson DatosAdicionalesDetallePrecio(string tipo, int iddetalle)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.DatosAdicionalesDetallePrecio", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@tipo", tipo);
                cmm.Parameters.AddWithValue("@iddetalle", iddetalle);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "BUSCAR ARTICULO";
                cnn.Close();
                return new mensajeJson("ok", JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {
                return new mensajeJson("", null);
            }
        }
        public mensajeJson BuscarPedidoParaFacturar(int idpedido, int idsucursal)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.BuscarPedidoParaFacturar", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idpedido", idpedido);
                cmm.Parameters.AddWithValue("@idsucursal", idsucursal);
                cmm.Parameters.Add("@mensaje", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                string mensaje = cmm.Parameters["@mensaje"].Value.ToString();
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "BUSCAR PEDIDO";
                cnn.Close();
                return new mensajeJson(mensaje, JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {
                return new mensajeJson("", null);
            }
        }
        public async Task<mensajeJson> AdelantoPedido(int idpedido, double monto, int idtipopago, DateTime fechafacturacion, int usuario)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.AdelantoPedido", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idpedido", idpedido);
                cmm.Parameters.AddWithValue("@monto", monto);
                cmm.Parameters.AddWithValue("@idtipopago", idtipopago);
                cmm.Parameters.AddWithValue("@fechafacturacion", fechafacturacion);
                cmm.Parameters.AddWithValue("@usuario", usuario);
                cmm.Parameters.Add("@mensaje", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                await cmm.ExecuteNonQueryAsync();
                string mensaje = cmm.Parameters["@mensaje"].Value.ToString();
                cnn.Close();
                return new mensajeJson(mensaje, null);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }
        public mensajeJson BuscarPagosPedido(int idpedido)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.BuscarPagosPedido", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idpedido", idpedido);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "BUSCAR PAGOS PEDIDO";
                cnn.Close();
                return new mensajeJson("ok", JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {
                return new mensajeJson("", null);
            }
        }
        public mensajeJson BuscarPedidoParaEntregar(int id)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.BuscarPedidoParaEntregar", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@id", id);
                cmm.Parameters.Add("@mensaje", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                string mensaje = cmm.Parameters["@mensaje"].Value.ToString();
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "BUSCAR PEDIDO PARA ENTREGAR";
                cnn.Close();
                return new mensajeJson(mensaje, JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {
                return new mensajeJson("", null);
            }
        }
        public async Task<mensajeJson> EntregarPedido(int idpedido, double monto, int idtipopago, DateTime fechafacturacion, int usuario)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.EntregarPedido", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idpedido", idpedido);
                cmm.Parameters.AddWithValue("@monto", monto);
                cmm.Parameters.AddWithValue("@idtipopago", idtipopago);
                cmm.Parameters.AddWithValue("@fechafacturacion", fechafacturacion);
                cmm.Parameters.AddWithValue("@usuario", usuario);
                cmm.Parameters.Add("@mensaje", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                await cmm.ExecuteNonQueryAsync();
                string mensaje = cmm.Parameters["@mensaje"].Value.ToString();
                cnn.Close();
                return new mensajeJson(mensaje, null);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }
        public async Task<mensajeJson> DevolverPedido(int idpedido, int idempleado, string motivo)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.DevolverPedido", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idpedido", idpedido);
                cmm.Parameters.AddWithValue("@idempleado", idempleado);
                cmm.Parameters.AddWithValue("@motivo", motivo);
                cmm.Parameters.Add("@mensaje", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                await cmm.ExecuteNonQueryAsync();
                string mensaje = cmm.Parameters["@mensaje"].Value.ToString();
                cnn.Close();
                return new mensajeJson(mensaje, null);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }
        public async Task<mensajeJson> EliminarPedido(int id)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.EliminarPedido", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idpedido", id);
                cmm.Parameters.Add("@mensaje", SqlDbType.VarChar, -1).Direction = ParameterDirection.Output;
                await cmm.ExecuteNonQueryAsync();
                string mensaje = cmm.Parameters["@mensaje"].Value.ToString();
                cnn.Close();
                return new mensajeJson(mensaje, null);
            }
            catch (Exception e)
            {
                return new mensajeJson(e.Message, null);
            }
        }
        public mensajeJson ListarArchivosPedido(int idpedido)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Pedidos.ListarArchivosPedido", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idpedido", idpedido);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "LISTAR ARCHIVOS PEDIDOS";
                cnn.Close();
                return new mensajeJson("ok", JsonConvert.SerializeObject(tabla));
            }
            catch (Exception e)
            {
                return new mensajeJson("", null);
            }
        }

        //------------CODIGO REPORTE GENERAL YEX----
        public async Task<object[][]> listartablaArrayAsync(ReporteGeneralExportar parametrosVista)
        {
            var resultList = new List<object[]>();

            try
            {
                using (SqlConnection cnn = new SqlConnection(cadena))
                using (SqlCommand cmm = new SqlCommand("SP_REPORTEGENERAL_LISTA_TABLA", cnn))
                {
                    cmm.CommandType = CommandType.StoredProcedure;

                    var parameters = new Dictionary<string, object>
                    {
                { "@fechainicio", parametrosVista.fechainicio },
                { "@fechafin", parametrosVista.fechafin },
                { "@horainicio", parametrosVista.horainicio },
                { "@horafin", parametrosVista.horafin },
                { "@sucursal", parametrosVista.sucursal },
                { "@laboratorio", parametrosVista.laboratorio ?? "" },
                { "@tipopedido", parametrosVista.tipopedido },
                { "@perfil", parametrosVista.perfil ?? "" },
                { "@vendedor", parametrosVista.vendedor ?? "" },
                { "@medico", parametrosVista.medico ?? "" },
                { "@paciente", parametrosVista.paciente ?? "" },
                { "@cliente", parametrosVista.cliente ?? "" },
                { "@origenreceta", parametrosVista.origenreceta ?? "" },
                { "@estado", parametrosVista.estado ?? "" },
                { "@empconsulta", parametrosVista.empconsulta ?? "" },
                { "@tipoempresa", parametrosVista.tipoempresa ?? "" },
                { "@consulta", parametrosVista.consulta ?? "" },
                { "@fechafacturacion", parametrosVista.fechafacturacion },
                { "@tipoproducto", parametrosVista.tipoproducto ?? "" },
                { "@tipoformulacion", parametrosVista.tipoformulacion ?? "" }
                    };

                    foreach (var param in parameters)
                    {
                        cmm.Parameters.AddWithValue(param.Key, param.Value);
                    }

                    await cnn.OpenAsync();
                    cmm.CommandTimeout = 0;
                    using (SqlDataReader reader = await cmm.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var rowData = new object[reader.FieldCount];
                            reader.GetValues(rowData);
                            resultList.Add(rowData);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al ejecutar el procedimiento almacenado:");
                Console.WriteLine(e.ToString());
                throw;
            }

            return resultList.ToArray();
        }


        public object[,] exportarexcelEpplus(ReporteGeneralExportar parametrosVista)
        {
            object[,] resultArray = null;
            //string[] headers = new string[]
            //{
            //    "ID", "N PEDIDO", "SUCURSAL", "LABORATORIO", "TIPO REGISTRO", "TIPOFORMULACION", "TIPO DE ENTREGA", "FECHA",
            //    "FECHA FACTURACION","ID_VENDEDOR", "VENDEDOR", "ID_PACIENTE","CELULAR CLIENTE", "DOC CLIENTE", "CLIENTE", "CELULAR PACIENTE",
            //    "DNI PACIENTE", "PACIENTE", "TIPO PRODUCTO", "NOMLABO", "CODIGO", "FORMULA MAGISTRAL", "TIPO DE PAGO",
            //    "COSTO", "CANTIDAD", "TOTAL", "TOTAL SINIGV", "ESTADO", "N DOC", "ORDEN P", "MEDICO", "CMP", "ORIGEN RECETA",
            //    "TIPO PEDIDO","ID_STOCK", "TIPO EMPRESA", "REPRESENTANTE MEDICO", "ESPECIALIDAD", "PAGOMEDICO", "CONVENIO",
            //    "REPRESENTANTE CLIENTE", "ESTADO VENTA"

            // };

            try
            {
                using (SqlConnection cnn = new SqlConnection(cadena))
                {
                    cnn.Open();
                    using (SqlCommand cmm = new SqlCommand("SP_REPORTEGENERAL_EXPORTAR_EXCEL", cnn))
                    {
                        cmm.CommandType = CommandType.StoredProcedure;
                        // Adding parameters
                        cmm.Parameters.AddWithValue("@fechafin", parametrosVista.fechafin);
                        cmm.Parameters.AddWithValue("@fechainicio", parametrosVista.fechainicio);
                        cmm.Parameters.AddWithValue("@cliente", parametrosVista.cliente ?? "");
                        cmm.Parameters.AddWithValue("@consulta", parametrosVista.consulta ?? "");
                        cmm.Parameters.AddWithValue("@empconsulta", parametrosVista.empconsulta ?? "");
                        cmm.Parameters.AddWithValue("@estado", parametrosVista.estado ?? "");
                        cmm.Parameters.AddWithValue("@fechafacturacion", parametrosVista.fechafacturacion);
                        cmm.Parameters.AddWithValue("@horafin", parametrosVista.horafin);
                        cmm.Parameters.AddWithValue("@horainicio", parametrosVista.horainicio);
                        cmm.Parameters.AddWithValue("@laboratorio", parametrosVista.laboratorio ?? "");
                        cmm.Parameters.AddWithValue("@medico", parametrosVista.medico ?? "");
                        cmm.Parameters.AddWithValue("@origenreceta", parametrosVista.origenreceta ?? "");
                        cmm.Parameters.AddWithValue("@paciente", parametrosVista.paciente ?? "");
                        cmm.Parameters.AddWithValue("@perfil", parametrosVista.perfil ?? "");
                        cmm.Parameters.AddWithValue("@sucursal", parametrosVista.sucursal);
                        cmm.Parameters.AddWithValue("@tipoempresa", parametrosVista.tipoempresa ?? "");
                        cmm.Parameters.AddWithValue("@tipoformulacion", parametrosVista.tipoformulacion ?? "");
                        cmm.Parameters.AddWithValue("@tipopedido", parametrosVista.tipopedido);
                        cmm.Parameters.AddWithValue("@tipoproducto", parametrosVista.tipoproducto ?? "");
                        cmm.Parameters.AddWithValue("@vendedor", parametrosVista.vendedor ?? "");

                        using (SqlDataReader reader = cmm.ExecuteReader())
                        {
                            var tempData = new List<object[]>();
                            var columnCount = reader.FieldCount;
                            string[] headers = new string[columnCount];
                            for (int i = 0; i < columnCount; i++)
                            {
                                headers[i] = reader.GetName(i);
                            }
                            while (reader.Read())
                            {
                                object[] values = new object[columnCount];
                                reader.GetValues(values);
                                tempData.Add(values);
                            }

                            // Considerar espacio para la cabecera al inicializar resultArray
                            resultArray = new object[tempData.Count + 1, columnCount];

                            // Agregar la cabecera
                            for (int j = 0; j < headers.Length; j++)
                            {
                                resultArray[0, j] = headers[j];
                            }

                            // Llenar el resto del arreglo con los datos
                            for (int i = 0; i < tempData.Count; i++)
                            {
                                for (int j = 0; j < columnCount; j++)
                                {
                                    resultArray[i + 1, j] = tempData[i][j];
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.ToString());
                throw;
            }

            return resultArray;
        }


        //------------FIN CODIGO REPORTE GENERAL YEX----



        // CODIGO GUARDAR IMAGEN EN BIT YEXSON
        public bool guardarimagenpedidobit(int pedido_codigo, string imagen, string tipo, byte[] imagenbit)
        {
            try
            {
                using (SqlConnection cnn = new SqlConnection(cadena))
                {
                    cnn.Open();
                    using (SqlCommand cmm = new SqlCommand("sp_GuardarImagenPedido", cnn))
                    {
                        cmm.CommandType = System.Data.CommandType.StoredProcedure;

                        // Agregar los parámetros al SqlCommand
                        cmm.Parameters.AddWithValue("@pedido_codigo", pedido_codigo);
                        cmm.Parameters.AddWithValue("@imagen", imagen);
                        cmm.Parameters.AddWithValue("@tipo", tipo);
                        cmm.Parameters.Add("@imagenbit", SqlDbType.VarBinary, -1).Value = imagenbit;

                        cmm.ExecuteNonQuery();  // Ejecutar el procedimiento almacenado
                    }
                }
                return true;  // Retorna true si todo salió bien
            }
            catch (Exception e)
            {
                // Aquí podrías, por ejemplo, registrar el error en algún log si lo necesitas.
                return false;  // Retorna false en caso de error
            }
        }


        public DataTable listartablaimagenpedidobit(int pedido_codigo)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("sp_ListarTablaImagenPedido", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@pedido_codigo", pedido_codigo);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "LISTAR IMAGEN BIT";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }

        public bool editarImagenPedidobit( int imagen, int pedido_codigo)
        {
            try
            {
                using (SqlConnection cnn = new SqlConnection(cadena))
                {
                    cnn.Open();
                    using (SqlCommand cmm = new SqlCommand("sp_CambiarEstadoImagenBit", cnn))
                    {
                        cmm.CommandType = System.Data.CommandType.StoredProcedure;

                        // Agregar los parámetros al SqlCommand
                        cmm.Parameters.AddWithValue("@id_imagen", imagen);
                        cmm.Parameters.AddWithValue("@id_pedido", pedido_codigo);
                     

                        cmm.ExecuteNonQuery();  // Ejecutar el procedimiento almacenado
                    }
                }
                return true;  // Retorna true si todo salió bien
            }
            catch (Exception e)
            {
                // Aquí podrías, por ejemplo, registrar el error en algún log si lo necesitas.
                return false;  // Retorna false en caso de error
            }
        }


        public DataTable listartablaimagenpedidobitaimagen(int pedido_codigo)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("sp_ListarTablaImagenPedido", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@pedido_codigo", pedido_codigo);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "LISTAR IMAGEN BIT";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }


        public DataTable listartablaimagenpedidobitapdf(int pedido_codigo)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("sp_ListarTablaImagenPedidoapdf", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@imagen_codigo", pedido_codigo);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "LISTAR IMAGEN BIT";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }

        //FIN PEDIDO



        //listar pedido yex
        public async Task<object[][]> listarpedidoArrayAsync(string fechafin, string fechainicio, string horafin, string horainicio, string sucursal, string estadopedido, string cliente, string paciente, string empconsulta, string laboratorio, bool porusuario, int tipo, string vista)
        {









            var resultList = new List<object[]>();
            try
            {
                // Convertir el string 'año/mes/dia' a DateTime
                DateTime fechaInicioDT = DateTime.ParseExact(fechainicio, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                DateTime fechaFinDT = DateTime.ParseExact(fechafin, "yyyy-MM-dd", CultureInfo.InvariantCulture);


                // Convertir el DateTime a string 'dia/mes/año'
                fechainicio = fechaInicioDT.ToString("dd/MM/yyyy");
                fechafin = fechaFinDT.ToString("dd/MM/yyyy");


                using (SqlConnection cnn = new SqlConnection(cadena))
                {
                    using (SqlCommand cmm = new SqlCommand("Pedidos.sp_consultar_pedidos_vista_venta_v4", cnn))
                    {

                        cmm.CommandType = CommandType.StoredProcedure;
                        cmm.Parameters.AddWithValue("@fechafin", fechafin);
                        cmm.Parameters.AddWithValue("@fechainicio", fechainicio);
                        cmm.Parameters.AddWithValue("@cliente", cliente ?? "");
                        cmm.Parameters.AddWithValue("@empconsulta", empconsulta ?? "");
                        cmm.Parameters.AddWithValue("@estadopedido", estadopedido ?? "");
                        cmm.Parameters.AddWithValue("@HORAFIN", horafin ?? "");
                        cmm.Parameters.AddWithValue("@HORAINICIO", horainicio ?? "");
                        cmm.Parameters.AddWithValue("@paciente", paciente ?? "");
                        cmm.Parameters.AddWithValue("@porusuario", porusuario != null ? porusuario : false); // Para el tipo booleano

                        cmm.Parameters.AddWithValue("@sucursal", "133");
                        cmm.Parameters.AddWithValue("@laboratorio", laboratorio ?? "");
                        cmm.Parameters.AddWithValue("@tipo", tipo != null ? tipo : 0);
                        cmm.Parameters.AddWithValue("@vista", vista ?? "");

                        cmm.CommandTimeout = 0;

                        await cnn.OpenAsync();

                        using (SqlDataReader reader = await cmm.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var rowData = new object[reader.FieldCount];
                                reader.GetValues(rowData);
                                resultList.Add(rowData);
                            }
                        }
                    }
                }
            }
            catch (Exception vex)
            {
                // Considera registrar el error vex para diagnóstico.
                throw vex;
            }

            return resultList.ToArray();
        }


        public async Task<object[][]> HistorialVentasArrayAsync(string numdocumento, string cliente, string fechainicio, string fechafin, string sucursal)
        {
            var resultList = new List<object[]>();

            try
            {
                using (SqlConnection cnn = new SqlConnection(cadena))
                using (SqlCommand cmm = new SqlCommand("SP_REPORTEGENERAL_EXPORTAR_EXCEL", cnn))
                {
                    cmm.CommandType = CommandType.StoredProcedure;

                    var parameters = new Dictionary<string, object>
                    {
                { "@fechainicio","01/01/2023"  },
                { "@fechafin","03/01/2023"  },
                { "@horainicio", "06:00"  },
                { "@horafin",  "23:00" },
                { "@sucursal", ""  },
                { "@laboratorio",  "" },
                { "@tipopedido", "" },
                { "@perfil",  "" },
                { "@vendedor",  "" },
                { "@medico",  "" },
                { "@paciente",  "" },
                { "@cliente",  "" },
                { "@origenreceta", "" },
                { "@estado",  "" },
                { "@empconsulta",  "" },
                { "@tipoempresa","" },
                { "@consulta",  "CONSULTA" },
                { "@fechafacturacion",  false},
                { "@tipoproducto", "" },
                { "@tipoformulacion","" }
                    };

                    foreach (var param in parameters)
                    {
                        cmm.Parameters.AddWithValue(param.Key, param.Value);
                    }

                    await cnn.OpenAsync();
                    cmm.CommandTimeout = 0;
                    using (SqlDataReader reader = await cmm.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var rowData = new object[reader.FieldCount];
                            reader.GetValues(rowData);
                            resultList.Add(rowData);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al ejecutar el procedimiento almacenado:");
                Console.WriteLine(e.ToString());
                throw;
            }

            return resultList.ToArray();

        }



        //LISTAR TIPO PEDIDO
        public DataTable listartipopedido()
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("pedidos.SP_LISTAR_TIPO_PEDIDO", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "LISTARPEDIDO";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public DataTable verificionDescuentoGlobal( int idcliente)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Ventas.VerificarDescuentoGlobal", cnn);
                cmm.CommandType = System.Data.CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idcliente", idcliente);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "DescuentoGlobal";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        

    }
}



