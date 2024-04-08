using Erp.Entidades.comercial;
using Erp.SeedWork;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace INFRAESTRUCTURA.Areas.Comercial.DAO
{
    public class DescuentoDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlCommand cmm;

        public DescuentoDAO(string cadena)
        {
            this.cadena = cadena;
        }
        public DataTable ListarDescuentos(string descripcion, string fechainicio)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_listar_descuentos", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@descripcion", descripcion ?? "");
                cmm.Parameters.AddWithValue("@fechainicio", fechainicio ?? "");
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = $"incentivos";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public DataTable GetDescuentoCompleto(int iddescuento)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_get_descuento_completo", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@iddescuento", iddescuento);

                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "descuentocompleto";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public DataTable ListarDescuentosxProducto(int idprecio, int idproducto, int idsucursal)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_get_descuentos_producto", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idprecioproducto", idprecio);
                cmm.Parameters.AddWithValue("@idproducto", idproducto);
                cmm.Parameters.AddWithValue("@idsucursal", idsucursal);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "descuentos";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
        public DataTable ReporteDescuentosCobrar(string fechainicio, string fechafin, string estado, string tipo, string idlabpro)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_reporte_descuentos_cobrar", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@fechainicio", fechainicio ?? "");
                cmm.Parameters.AddWithValue("@fechafin", fechafin ?? "");
                cmm.Parameters.AddWithValue("@estado", estado ?? "");
                cmm.Parameters.AddWithValue("@tipo", tipo ?? "");
                cmm.Parameters.AddWithValue("@idprolab", idlabpro ?? "");
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "descuentos";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }


        //EARTCOD1008
        //public string AgregarDescuentoCliente(DescuentoCliente descuentoCliente)
        //{
        //    string respuesta = "";
        //    try
        //    {
        //        cnn = new SqlConnection();
        //        cnn.ConnectionString = cadena;
        //        cnn.Open();
        //        cmm = new SqlCommand("Comercial.sp_descuento_cliente_agregar", cnn);
        //        cmm.CommandType = CommandType.StoredProcedure;
        //        cmm.Parameters.AddWithValue("@idcliente", descuentoCliente.idcliente);
        //        cmm.Parameters.AddWithValue("@descuentocanal", descuentoCliente.descuentocanal);
        //        cmm.Parameters.AddWithValue("@fechainicio", descuentoCliente.fechainicio);
        //        cmm.Parameters.AddWithValue("@fechatermino", descuentoCliente.fechatermino);
        //        cmm.Parameters.AddWithValue("@usuariocrea", descuentoCliente.usuariocrea);
        //        cmm.Parameters.Add("@respuesta", SqlDbType.VarChar, 25).Direction = ParameterDirection.Output;


        //        cmm.ExecuteNonQuery();
        //        respuesta = cmm.Parameters["@respuesta"].Value.ToString();
        //        cnn.Close();
        //        return respuesta;
        //    }
        //    catch (Exception e)
        //    {
        //        respuesta = "error";
        //        return respuesta;
        //    }
        //}

        //EARTCOD1008.1
        public mensajeJson AgregarDescuentoCliente(DescuentoCliente oDescuentoCliente)
        {
            string respuesta = "";
            int iddescuentocliente = 0;
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_descuento_cliente_agregar_v2", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@nombredescuento", oDescuentoCliente.nombredescuento);
                cmm.Parameters.AddWithValue("@descuentocanal", oDescuentoCliente.descuentocanal);
                cmm.Parameters.AddWithValue("@fechainicio", oDescuentoCliente.fechainicio);
                cmm.Parameters.AddWithValue("@fechatermino", oDescuentoCliente.fechatermino);
                cmm.Parameters.AddWithValue("@productostipo", oDescuentoCliente.productostipo);
                cmm.Parameters.AddWithValue("@canalesventa", oDescuentoCliente.canalesventa);
                cmm.Parameters.AddWithValue("@sucursales", oDescuentoCliente.sucursales);
                cmm.Parameters.AddWithValue("@todos", oDescuentoCliente.todos);
                cmm.Parameters.AddWithValue("@estado", oDescuentoCliente.estado);
                cmm.Parameters.AddWithValue("@usuariocrea", oDescuentoCliente.usuariocrea);
                cmm.Parameters.AddWithValue("@fechacreacion", oDescuentoCliente.fechacreacion);
                cmm.Parameters.AddWithValue("@usuariomodifica", oDescuentoCliente.usuariomodifica);
                cmm.Parameters.AddWithValue("@fechaedicion", oDescuentoCliente.fechaedicion);
                cmm.Parameters.AddWithValue("@jsondetalle", oDescuentoCliente.jsondetalle);
                cmm.Parameters.AddWithValue("@clientes", oDescuentoCliente.clientes);
                cmm.Parameters.Add("@respuesta", SqlDbType.VarChar, 25).Direction = ParameterDirection.Output;
                cmm.Parameters.Add("@iddescuentocliente", SqlDbType.Int).Direction = ParameterDirection.Output;
                cmm.ExecuteNonQuery();
                respuesta = cmm.Parameters["@respuesta"].Value.ToString();
                iddescuentocliente = Convert.ToInt32(cmm.Parameters["@iddescuentocliente"].Value);
                cnn.Close();
                return new mensajeJson(respuesta, iddescuentocliente); ;
            }
            catch (Exception e)
            {
                respuesta = "error";
                return new mensajeJson(respuesta, null); ;
            }
        }

        //EARTCOD1008
        public DataTable ListarDescuentoCliente(string nombredescuento)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_descuento_cliente_listar", cnn);
                cmm.Parameters.AddWithValue("@nombredescuento", nombredescuento);//EARTCOD1008.1
                cmm.CommandType = CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "descuentoscliente";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        //EARTCOD1008
        public DataTable BuscarDescuentoCliente(int iddescuentocliente)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_descuento_cliente_buscar", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@iddescuentocliente", iddescuentocliente);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "descuentocliente";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        //EARTCOD1008
        //public string EditarDescuentoCliente(DescuentoCliente descuentoCliente)
        //{
        //    string respuesta = "";
        //    try
        //    {
        //        cnn = new SqlConnection();
        //        cnn.ConnectionString = cadena;
        //        cnn.Open();
        //        cmm = new SqlCommand("Comercial.sp_descuento_cliente_editar", cnn);
        //        cmm.CommandType = CommandType.StoredProcedure;
        //        cmm.Parameters.AddWithValue("@iddescuentocliente", descuentoCliente.iddescuentocliente);
        //        cmm.Parameters.AddWithValue("@descuentocanal", descuentoCliente.descuentocanal);
        //        cmm.Parameters.AddWithValue("@fechainicio", descuentoCliente.fechainicio);
        //        cmm.Parameters.AddWithValue("@fechatermino", descuentoCliente.fechatermino);

        //        int fila = cmm.ExecuteNonQuery();
        //        if (fila > 0)
        //        {
        //            respuesta = "success";
        //        }
        //        cnn.Close();
        //        return respuesta;
        //    }
        //    catch (Exception)
        //    {
        //        respuesta = "error";
        //        return respuesta;
        //    }
        //}
        //EARTCOD1008.1
        public mensajeJson EditarDescuentoCliente(DescuentoCliente oDescuentoCliente)
        {
            string respuesta = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_descuento_cliente_editar", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@iddescuentocliente", oDescuentoCliente.iddescuentocliente);
                cmm.Parameters.AddWithValue("@nombredescuento", oDescuentoCliente.nombredescuento);
                cmm.Parameters.AddWithValue("@descuentocanal", oDescuentoCliente.descuentocanal);
                cmm.Parameters.AddWithValue("@fechainicio", oDescuentoCliente.fechainicio);
                cmm.Parameters.AddWithValue("@fechatermino", oDescuentoCliente.fechatermino);
                cmm.Parameters.AddWithValue("@productostipo", oDescuentoCliente.productostipo);
                cmm.Parameters.AddWithValue("@canalesventa", oDescuentoCliente.canalesventa);
                cmm.Parameters.AddWithValue("@sucursales", oDescuentoCliente.sucursales);
                cmm.Parameters.AddWithValue("@todos", oDescuentoCliente.todos);
                cmm.Parameters.AddWithValue("@estado", oDescuentoCliente.estado);
                cmm.Parameters.AddWithValue("@usuariomodifica", oDescuentoCliente.usuariomodifica);
                cmm.Parameters.AddWithValue("@fechaedicion", oDescuentoCliente.fechaedicion);
                cmm.Parameters.AddWithValue("@jsondetalle", oDescuentoCliente.jsondetalle);
                cmm.Parameters.AddWithValue("@clientes", oDescuentoCliente.clientes);
                cmm.Parameters.Add("@respuesta", SqlDbType.VarChar, 25).Direction = ParameterDirection.Output;
                cmm.ExecuteNonQuery();
                respuesta = cmm.Parameters["@respuesta"].Value.ToString();
                cnn.Close();
                return new mensajeJson(respuesta, oDescuentoCliente.iddescuentocliente);
            }
            catch (Exception e)
            {
                respuesta = "error";
                return new mensajeJson("error", null);
            }
        }


        //EARTCOD1009
        //EARTCOD1009
        public DataTable PromocionesPackBuscarProducto(string codigoproducto)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_promocionpack_buscar_producto", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@codigoproducto", codigoproducto);
                //cmm.Parameters.AddWithValue("@suc_codigo", suc_codigo);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "promocionproductos";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        //EARTCOD1009
        public string PromocionesPackAgregar(PromocionPack promocionPack)
        {
            string respuesta = "";
            int idpromocionpack = 0;

            using (TransactionScope transactionScope = new TransactionScope())
            {
                try
                {
                    cnn = new SqlConnection();
                    cnn.ConnectionString = cadena;
                    cnn.Open();
                    cmm = new SqlCommand("Comercial.sp_promocionpack_agregar", cnn);
                    cmm.CommandType = CommandType.StoredProcedure;
                    cmm.Parameters.AddWithValue("@nombre", promocionPack.nombrepromocion);
                    cmm.Parameters.AddWithValue("@nombreabreviado", promocionPack.descripcion);
                    cmm.Parameters.AddWithValue("@usuariocrea", promocionPack.usuariocrea);
                    cmm.Parameters.Add("@idpromopack", SqlDbType.Int).Direction = ParameterDirection.Output;

                    cmm.ExecuteNonQuery();
                    idpromocionpack = Convert.ToInt32(cmm.Parameters["@idpromopack"].Value.ToString());
                    if (idpromocionpack > 0)
                    {
                        using (SqlCommand cmm1 = new SqlCommand("Comercial.sp_PromocionPackPrecioProAgregar", cnn))
                        {
                            cmm1.CommandType = CommandType.StoredProcedure;
                            cmm1.Parameters.AddWithValue("@idproducto", idpromocionpack);
                            cmm1.Parameters.AddWithValue("@idlistaprecio", promocionPack.idlistaprecio);
                            cmm1.Parameters.AddWithValue("@precio", promocionPack.precio);
                            cmm1.Parameters.AddWithValue("@usuariocrea", promocionPack.usuariocrea);
                            cmm1.Parameters.AddWithValue("@usuariomodifica", promocionPack.usuariocrea);
                            cmm1.Parameters.AddWithValue("@precioSindescuento", promocionPack.precioSindescuento);
                            cmm1.Parameters.AddWithValue("@CantidadDescuento", promocionPack.cantidadDescuento);
                            cmm1.Parameters.AddWithValue("@porcentajedescuento", promocionPack.porcentajedescuento);
                            cmm1.ExecuteNonQuery();
                        }

                        foreach (var item in promocionPack.detalle)
                        {
                            using (SqlCommand cmm2 = new SqlCommand("Comercial.sp_promociondetalle_agregar", cnn))
                            {
                                cmm2.CommandType = CommandType.StoredProcedure;
                                cmm2.Parameters.AddWithValue("@idpromopack", idpromocionpack);
                                cmm2.Parameters.AddWithValue("@idstock", item.idstock);
                                cmm2.Parameters.AddWithValue("@idproducto", item.idproducto);
                                cmm2.Parameters.AddWithValue("@cantidad", item.cantidad);
                                cmm2.Parameters.AddWithValue("@xfraccion", item.xfraccion);
                                cmm2.ExecuteNonQuery();
                            }
                        }

                        foreach (var item in promocionPack.canalventas)
                        {
                            using (SqlCommand cmm3 = new SqlCommand("Comercial.sp_PromocionPackCanalVentaAgregar", cnn))
                            {
                                cmm3.CommandType = CommandType.StoredProcedure;
                                cmm3.Parameters.AddWithValue("@idpromopack", idpromocionpack);
                                cmm3.Parameters.AddWithValue("@idcanalventa", item.idcanalventa);
                                cmm3.ExecuteNonQuery();
                            }
                        }

                        //PARA LA LISTA DE SUCURSALES ASIGNADAS

                        using (SqlCommand cmm4 = new SqlCommand("Comercial.sp_promo_pack_sucursal_eliminar", cnn))
                        {
                            cmm4.CommandType = CommandType.StoredProcedure;
                            cmm4.Parameters.AddWithValue("@idpromopack", idpromocionpack);
                            cmm4.ExecuteNonQuery();
                            foreach (var item in promocionPack.sucursales)
                            {
                                using (SqlCommand cmm5 = new SqlCommand("Comercial.sp_promo_pack_sucursal_agregar", cnn))
                                {
                                    cmm5.CommandType = CommandType.StoredProcedure;
                                    cmm5.Parameters.AddWithValue("@suc_codigo", item.suc_codigo);
                                    cmm5.Parameters.AddWithValue("@idpromopack", idpromocionpack);
                                    cmm5.Parameters.AddWithValue("@fechainicio", item.fechainicio);
                                    cmm5.Parameters.AddWithValue("@fechatermino", item.fechatermino);
                                       
                                    cmm5.Parameters.AddWithValue("@incentivo", promocionPack.incentivo);
                                    cmm5.Parameters.AddWithValue("@usuario", promocionPack.idempleado);
                                    cmm5.ExecuteNonQuery();
                                }
                            }
                        }

                    }
                    cnn.Close();
                    transactionScope.Complete();
                    return respuesta = "success";
                }
                catch (Exception e)
                {
                    respuesta = e.Message;
                    return respuesta;
                }
            }
        }

        //EARTCOD1009
        public DataTable PromocionesPackListar(string nombrepack)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_promocionpack_listar", cnn);
                cmm.Parameters.AddWithValue("@nombrepack", nombrepack);
                cmm.CommandType = CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "promocionespack";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        //EARTCOD1009
        public DataTable PromocionesPackbuscar(int idpromopack)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_promocionpack_buscar", cnn);
                cmm.Parameters.AddWithValue("@idpromopack", idpromopack);
                cmm.CommandType = CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "promocionpack";
                if (tabla.Rows.Count > 0)
                {
                    using (SqlCommand cmm2 = new SqlCommand("Comercial.sp_promocionpack_buscardetalle", cnn))
                    {
                        cmm2.Parameters.AddWithValue("@idpromopack", idpromopack);
                        cmm2.CommandType = CommandType.StoredProcedure;
                        DataTable tabla_detalle = new DataTable();
                        SqlDataAdapter da_detalle = new SqlDataAdapter(cmm2);
                        da_detalle.Fill(tabla_detalle);
                        tabla_detalle.TableName = "promocionpackdetalle";

                        tabla.Columns.Add("detalle", typeof(DataTable));
                        tabla.Rows[0]["detalle"] = tabla_detalle;
                    }

                    using (SqlCommand cmm3 = new SqlCommand("Comercial.sp_PromocionPackCanalVentaLista", cnn))
                    {
                        cmm3.Parameters.AddWithValue("@idpromopack", idpromopack);
                        cmm3.CommandType = CommandType.StoredProcedure;
                        DataTable tabla_canalventas = new DataTable();
                        SqlDataAdapter da_canalventas = new SqlDataAdapter(cmm3);
                        da_canalventas.Fill(tabla_canalventas);
                        tabla_canalventas.TableName = "PromocionPackCanalVentaLista";

                        tabla.Columns.Add("canalventas", typeof(DataTable));
                        tabla.Rows[0]["canalventas"] = tabla_canalventas;
                    }
                    //para la lista de sucursales
                    using (SqlCommand cmm4 = new SqlCommand("Comercial.sp_promo_pack_sucursal_lista", cnn))
                    {
                        cmm4.Parameters.AddWithValue("@idpromopack", idpromopack);
                        cmm4.CommandType = CommandType.StoredProcedure;
                        DataTable tabla_sucursales = new DataTable();
                        SqlDataAdapter da_sucursales = new SqlDataAdapter(cmm4);
                        da_sucursales.Fill(tabla_sucursales);
                        tabla_sucursales.TableName = "PromocionesPackSucursalLista";

                        tabla.Columns.Add("sucursales", typeof(DataTable));
                        tabla.Rows[0]["sucursales"] = tabla_sucursales;
                    }
                }
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        //EARTCOD1009
        public string PromocionesPackEditar(PromocionPack promocionPack)
        {
            string respuesta = "";

            using (TransactionScope transactionScope = new TransactionScope())
            {
                try
                {
                    cnn = new SqlConnection();
                    cnn.ConnectionString = cadena;
                    cnn.Open();
                    cmm = new SqlCommand("Comercial.sp_promocionpack_editar", cnn);
                    cmm.CommandType = CommandType.StoredProcedure;
                    cmm.Parameters.AddWithValue("@idpromopack", promocionPack.idpromopack);
                    cmm.Parameters.AddWithValue("@nombrepromocion", promocionPack.nombrepromocion);
                    cmm.Parameters.AddWithValue("@descripcion", promocionPack.descripcion);
                    cmm.Parameters.AddWithValue("@usuariomodifica", promocionPack.usuariomodifica);

                    if (cmm.ExecuteNonQuery() > 0)
                    {

                        using (SqlCommand cmm1 = new SqlCommand("Comercial.sp_PromocionPackPrecioProEditar", cnn))
                        {
                            cmm1.CommandType = CommandType.StoredProcedure;
                            cmm1.Parameters.AddWithValue("@idpromopack", promocionPack.idpromopack);
                            cmm1.Parameters.AddWithValue("@idlistaprecio", promocionPack.idlistaprecio);
                            cmm1.Parameters.AddWithValue("@precio", promocionPack.precio);
                            cmm1.Parameters.AddWithValue("@usuariomodifica", promocionPack.usuariomodifica);
                            cmm1.Parameters.AddWithValue("@precioSindescuento", promocionPack.precioSindescuento);
                            cmm1.Parameters.AddWithValue("@CantidadDescuento", promocionPack.cantidadDescuento);
                            cmm1.Parameters.AddWithValue("@porcentajedescuento", promocionPack.porcentajedescuento);
                            cmm1.ExecuteNonQuery();
                        }

                        using (SqlCommand cmm2 = new SqlCommand("Comercial.sp_promociondetalle_eliminar", cnn))
                        {
                            cmm2.CommandType = CommandType.StoredProcedure;
                            cmm2.Parameters.AddWithValue("@idpromopack", promocionPack.idpromopack);
                            if (cmm2.ExecuteNonQuery() > 0)
                            {
                                foreach (var item in promocionPack.detalle)
                                {
                                    using (SqlCommand cmm3 = new SqlCommand("Comercial.sp_promociondetalle_agregar", cnn))
                                    {
                                        cmm3.CommandType = CommandType.StoredProcedure;
                                        cmm3.Parameters.AddWithValue("@idpromopack", promocionPack.idpromopack);
                                        cmm3.Parameters.AddWithValue("@idstock", item.idstock);
                                        cmm3.Parameters.AddWithValue("@idproducto", item.idproducto);
                                        cmm3.Parameters.AddWithValue("@cantidad", item.cantidad);
                                        cmm3.Parameters.AddWithValue("@xfraccion", item.xfraccion);
                                        cmm3.ExecuteNonQuery();
                                    }
                                }
                            }
                        }

                        using (SqlCommand cmm4 = new SqlCommand("Comercial.sp_PromocionPackCanalVentaEliminar", cnn))
                        {
                            cmm4.CommandType = CommandType.StoredProcedure;
                            cmm4.Parameters.AddWithValue("@idpromopack", promocionPack.idpromopack);
                            if (cmm4.ExecuteNonQuery() >= 0)
                            {
                                foreach (var item in promocionPack.canalventas)
                                {
                                    using (SqlCommand cmm3 = new SqlCommand("Comercial.sp_PromocionPackCanalVentaAgregar", cnn))
                                    {
                                        cmm3.CommandType = CommandType.StoredProcedure;
                                        cmm3.Parameters.AddWithValue("@idpromopack", promocionPack.idpromopack);
                                        cmm3.Parameters.AddWithValue("@idcanalventa", item.idcanalventa);
                                        cmm3.ExecuteNonQuery();
                                    }
                                }
                            }
                        }

                        //PARA LA LISTA DE SUCURSALES ASIGNADAS
                        using (SqlCommand cmm4 = new SqlCommand("Comercial.sp_promo_pack_sucursal_eliminar", cnn))
                        {
                            cmm4.CommandType = CommandType.StoredProcedure;
                            cmm4.Parameters.AddWithValue("@idpromopack", promocionPack.idpromopack);
                            cmm4.ExecuteNonQuery();
                            foreach (var item in promocionPack.sucursales)
                            {
                                using (SqlCommand cmm5 = new SqlCommand("Comercial.sp_promo_pack_sucursal_agregar", cnn))
                                {
                                    cmm5.CommandType = CommandType.StoredProcedure;
                                    cmm5.Parameters.AddWithValue("@suc_codigo", item.suc_codigo);
                                    cmm5.Parameters.AddWithValue("@idpromopack", promocionPack.idpromopack);
                                    cmm5.Parameters.AddWithValue("@fechainicio", item.fechainicio);
                                    cmm5.Parameters.AddWithValue("@fechatermino", item.fechatermino);

                                    cmm5.Parameters.AddWithValue("@incentivo", promocionPack.incentivo);
                                    cmm5.Parameters.AddWithValue("@usuario", promocionPack.idempleado);
                                    cmm5.ExecuteNonQuery();
                                }
                            }
                        }

                        cnn.Close();
                        transactionScope.Complete();
                    }
                    return respuesta = "success";
                }
                catch (Exception e)
                {
                    respuesta = "error: " + e.Message;
                    return respuesta;
                }
            }
        }

        //EARTCOD1009
        public DataTable PromocionBuscarProductoStockVenta(int idsucursal, int idlistaprecio, int idpromopack)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_promocionpack_buscar", cnn);
                cmm.Parameters.AddWithValue("@idpromopack", idpromopack);
                cmm.CommandType = CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "promocionpack";
                if (tabla.Rows.Count > 0)
                {
                    using (SqlCommand cmm2 = new SqlCommand("Comercial.sp_promocion_buscar_producto_stock_venta", cnn))
                    {
                        cmm2.Parameters.AddWithValue("@idsucursal", idsucursal);
                        cmm2.Parameters.AddWithValue("@idlistaprecio", idlistaprecio);
                        cmm2.Parameters.AddWithValue("@idpromopack", idpromopack);
                        cmm2.CommandType = CommandType.StoredProcedure;
                        DataTable tabla_detalle = new DataTable();
                        SqlDataAdapter da_detalle = new SqlDataAdapter(cmm2);
                        da_detalle.Fill(tabla_detalle);
                        tabla_detalle.TableName = "promocionbuscarstockventa";

                        tabla.Columns.Add("detalle", typeof(DataTable));
                        tabla.Rows[0]["detalle"] = tabla_detalle;
                    }
                }
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        //EARTCOD1009
        public string PromocionPackPedidoDetalleAgregar(List<PromocionPackPedidoDetalle> packPedidoDetalle)
        {
            string respuesta = "";

            using (TransactionScope transactionScope = new TransactionScope())
            {
                try
                {
                    cnn = new SqlConnection();
                    cnn.ConnectionString = cadena;
                    cnn.Open();
                    foreach (var item in packPedidoDetalle)
                    {
                        using (SqlCommand cmm = new SqlCommand("Comercial.sp_promocion_pack_pedido_detalle_agregar", cnn))
                        {
                            cmm.CommandType = CommandType.StoredProcedure;
                            cmm.Parameters.AddWithValue("@idpedido", item.idpedido);
                            cmm.Parameters.AddWithValue("@idpromopack", item.idpromopack);
                            cmm.Parameters.AddWithValue("@idstock", item.idstock);
                            cmm.Parameters.AddWithValue("@cantidad", item.cantidad);
                            cmm.Parameters.AddWithValue("@xfraccion", item.xfraccion);
                            cmm.Parameters.AddWithValue("@idprecioproducto", item.idprecioproducto);
                            cmm.ExecuteNonQuery();
                        }
                    }
                    transactionScope.Complete();
                    return respuesta = "success";
                }
                catch (Exception e)
                {
                    respuesta = "error" + e.Message;
                    return respuesta;
                }
            }
        }

        //EARTCOD1009 -- FUNCIONES PARA ASIGNAR SUCURSALES A PACK
        public DataTable PromocionPackSucursales(int idempresa)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_promo_pack_sucursales", cnn);
                cmm.Parameters.AddWithValue("@idempresa", idempresa);
                cmm.CommandType = CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "promocionespacksucursales";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        //EARTCOD1009
        //public string PromocionPackSucursalAgregar(List<PromocionPackSucursal> packSucursales)
        //{
        //    string respuesta = "";

        //    using (TransactionScope transactionScope = new TransactionScope())
        //    {
        //        try
        //        {
        //            cnn = new SqlConnection();
        //            cnn.ConnectionString = cadena;
        //            cnn.Open();
        //            using (SqlCommand cmm = new SqlCommand("Comercial.sp_promo_pack_sucursal_eliminar", cnn))
        //            {
        //                cmm.CommandType = CommandType.StoredProcedure;
        //                cmm.Parameters.AddWithValue("@idpromopack", packSucursales[0].idpromopack);
        //                cmm.ExecuteNonQuery();
        //                foreach (var item in packSucursales)
        //                {
        //                    using (SqlCommand cmm2 = new SqlCommand("Comercial.sp_promo_pack_sucursal_agregar", cnn))
        //                    {
        //                        cmm2.CommandType = CommandType.StoredProcedure;
        //                        cmm2.Parameters.AddWithValue("@suc_codigo", item.suc_codigo);
        //                        cmm2.Parameters.AddWithValue("@idpromopack", item.idpromopack);
        //                        cmm2.Parameters.AddWithValue("@fechainicio", item.fechainicio);
        //                        cmm2.Parameters.AddWithValue("@fechatermino", item.fechatermino);
        //                        cmm2.ExecuteNonQuery();
        //                    }
        //                }
        //            }
        //            transactionScope.Complete();
        //            return respuesta = "success";
        //        }
        //        catch (Exception e)
        //        {
        //            respuesta = e.Message;
        //            return respuesta;
        //        }
        //    }
        //}

        public string PromocionPackSucursalAgregar(List<PromocionPackSucursal> packSucursales, decimal incentivo, int usuario)
        {
            string respuesta = "";

            using (TransactionScope transactionScope = new TransactionScope())
            {
                try
                {
                    cnn = new SqlConnection();
                    cnn.ConnectionString = cadena;
                    cnn.Open();
                    using (SqlCommand cmm = new SqlCommand("Comercial.sp_promo_pack_sucursal_eliminar", cnn))
                    {
                        cmm.CommandType = CommandType.StoredProcedure;
                        var idpromopack = packSucursales[0].idpromopack;
                        cmm.Parameters.AddWithValue("@idpromopack", idpromopack);
                        cmm.ExecuteNonQuery();
                        foreach (var item in packSucursales)
                        {
                            using (SqlCommand cmm2 = new SqlCommand("Comercial.sp_promo_pack_sucursal_agregar", cnn))
                            {
                                cmm2.CommandType = CommandType.StoredProcedure;
                                cmm2.Parameters.AddWithValue("@suc_codigo", item.suc_codigo);
                                cmm2.Parameters.AddWithValue("@idpromopack", idpromopack);
                                cmm2.Parameters.AddWithValue("@fechainicio", item.fechainicio);
                                cmm2.Parameters.AddWithValue("@fechatermino", item.fechatermino);

                                cmm2.Parameters.AddWithValue("@incentivo", incentivo);
                                cmm2.Parameters.AddWithValue("@usuario", usuario);
                                cmm2.ExecuteNonQuery();
                            }
                        }
                    }
                    transactionScope.Complete();
                    return respuesta = "success";
                }
                catch (Exception e)
                {
                    respuesta = e.Message;
                    return respuesta;
                }
            }
        }

        //EARTCOD1009
        public DataTable PromocionPackSucursalLista(int idpromopack)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_promo_pack_sucursal_lista", cnn);
                cmm.Parameters.AddWithValue("@idpromopack", idpromopack);
                cmm.CommandType = CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "promocionespacksucursallista";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }


        //EARTCOD1008.1 -06-06-2023
        //DESCUENTO PERSONAL CON OPCION DE CANALES Y TIPOS DE PRODUCTOS
        public DataTable ProductosTiposListar()
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_productos_tipos_listar", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "productostipos";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }


        //--EARTCOD1021 -12-06-2023- NUEVA OPCION PARA OBSEQUIAR UN PRODUCTO EN BASE A UNA SUMA
        public DataTable ProveedoresListar(string descripcion)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_proveedores_listar", cnn);
                cmm.Parameters.AddWithValue("@descripcion", descripcion);
                cmm.CommandType = CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "promoproveedores";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }


        public DataTable LaboratoriosListar(int idproveedor, string descripcion)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_laboratorios_listar", cnn);
                cmm.Parameters.AddWithValue("@idproveedor", idproveedor);
                cmm.Parameters.AddWithValue("@descripcion", descripcion);
                cmm.CommandType = CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "promolaboratorio";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        public DataTable LaboratoriosProductosListar(int idlaboratorio, string nombre)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_laboratoriosproductos_listar", cnn);
                cmm.Parameters.AddWithValue("@idlaboratorio", idlaboratorio);
                cmm.Parameters.AddWithValue("@nombre", nombre);
                cmm.CommandType = CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "promolaboratorioproductos";
                cnn.Close();
                return tabla;
            }
            catch (Exception vex)
            {
                return new DataTable();
            }
        }

        public string PromoProductoObsequioAgregar(PromoProductoObsequio promoProductoObsequio)
        {
            string respuesta = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_promoproductoobsequio_agregar", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idproveedor", promoProductoObsequio.idproveedor);
                cmm.Parameters.AddWithValue("@idlaboratorio", promoProductoObsequio.idlaboratorio);
                cmm.Parameters.AddWithValue("@montooferta", promoProductoObsequio.montooferta);
                cmm.Parameters.AddWithValue("@nombrepromo", promoProductoObsequio.nombrepromo);
                cmm.Parameters.AddWithValue("@productoscompra", promoProductoObsequio.productoscompra);
                cmm.Parameters.AddWithValue("@productosobsequio", promoProductoObsequio.productosobsequio);
                cmm.Parameters.AddWithValue("@fechainicio", promoProductoObsequio.fechainicio);
                cmm.Parameters.AddWithValue("@fechatermino", promoProductoObsequio.fechatermino);
                cmm.Parameters.AddWithValue("@canalesventa", promoProductoObsequio.canalesventa);
                cmm.Parameters.AddWithValue("@sucursales", promoProductoObsequio.sucursales);
                cmm.Parameters.AddWithValue("@usuariocrea", promoProductoObsequio.usuariocrea);
                cmm.Parameters.AddWithValue("@estado", promoProductoObsequio.estado);

                respuesta =cmm.ExecuteNonQuery()>0?"success":"warning";
                cnn.Close();
                return respuesta;
            }
            catch (Exception e)
            {
                respuesta = "error: "+e.Message;
                return respuesta;
            }
        }

        public DataTable PromoProductoObsequioListar(string nombrepromo)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_promoproductoobsequio_listar", cnn);
                cmm.Parameters.AddWithValue("@nombrepromo", nombrepromo);
                cmm.CommandType = CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "promoproductoobsequio";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        public string PromoProductoObsequioEditar(PromoProductoObsequio promoProductoObsequio)
        {
            string respuesta = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_promoproductoobsequio_editar", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idpromoobsequio", promoProductoObsequio.idpromoobsequio);
                cmm.Parameters.AddWithValue("@idproveedor", promoProductoObsequio.idproveedor);
                cmm.Parameters.AddWithValue("@idlaboratorio", promoProductoObsequio.idlaboratorio);
                cmm.Parameters.AddWithValue("@montooferta", promoProductoObsequio.montooferta);
                cmm.Parameters.AddWithValue("@nombrepromo", promoProductoObsequio.nombrepromo);
                cmm.Parameters.AddWithValue("@productoscompra", promoProductoObsequio.productoscompra);
                cmm.Parameters.AddWithValue("@productosobsequio", promoProductoObsequio.productosobsequio);
                cmm.Parameters.AddWithValue("@fechainicio", promoProductoObsequio.fechainicio);
                cmm.Parameters.AddWithValue("@fechatermino", promoProductoObsequio.fechatermino);
                cmm.Parameters.AddWithValue("@canalesventa", promoProductoObsequio.canalesventa);
                cmm.Parameters.AddWithValue("@sucursales", promoProductoObsequio.sucursales);
                cmm.Parameters.AddWithValue("@usuarioedita", promoProductoObsequio.usuariocrea);
                cmm.Parameters.AddWithValue("@estado", promoProductoObsequio.estado);

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

        //public DataTable PromoProductoBuscarObsequio(int idproducto, decimal monto, string idsucursal, string idcanalventa)
        //{
        //    try
        //    {
        //        cnn = new SqlConnection();
        //        cnn.ConnectionString = cadena;
        //        cnn.Open();
        //        cmm = new SqlCommand("Comercial.sp_promoproducto_buscarobsequio", cnn);
        //        cmm.Parameters.AddWithValue("@idproducto", idproducto);
        //        cmm.Parameters.AddWithValue("@monto", monto);
        //        cmm.Parameters.AddWithValue("@idsucursal", idsucursal);
        //        cmm.Parameters.AddWithValue("@idcanalventa", idcanalventa);
        //        cmm.CommandType = CommandType.StoredProcedure;
        //        DataTable tabla = new DataTable();
        //        SqlDataAdapter da = new SqlDataAdapter(cmm);
        //        da.Fill(tabla);
        //        tabla.TableName = "promoproductoobsequio";
        //        cnn.Close();
        //        return tabla;
        //    }
        //    catch (Exception)
        //    {
        //        return new DataTable();
        //    }
        //}

        public DataTable PromoProductoBuscarObsequio(string productos, string idsucursal, string idcanalventa)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_promoproducto_buscarobsequio", cnn);
                cmm.Parameters.AddWithValue("@productos", productos);
                cmm.Parameters.AddWithValue("@idsucursal", idsucursal);
                cmm.Parameters.AddWithValue("@idcanalventa", idcanalventa);
                cmm.CommandType = CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "promoproductoobsequio";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        public DataTable PromocionBuscarProductoObsequioStockVenta(int idsucursal, int idlistaprecio, int idpromoobsequio)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.sp_promocion_buscar_productoobsequio_stock_venta", cnn);
                cmm.Parameters.AddWithValue("@idsucursal", idsucursal);
                cmm.Parameters.AddWithValue("@idlistaprecio", idlistaprecio);
                cmm.Parameters.AddWithValue("@idpromoobsequio", idpromoobsequio);
                cmm.CommandType = CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "promoproductoobsequiostockventa";
                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }

        public DataTable BuscarDescuentoPorCliente(int idcliente)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Comercial.SP_BuscarDescuentoPorCliente", cnn);
                cmm.Parameters.AddWithValue("@idcliente", idcliente);
                cmm.CommandType = CommandType.StoredProcedure;
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "Descuento Cliente";
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
