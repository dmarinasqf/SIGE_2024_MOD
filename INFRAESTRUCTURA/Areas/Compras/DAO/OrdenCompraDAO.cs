using ENTIDADES.Almacen;
using ENTIDADES.compras;
using ENTIDADES.Finanzas;
using ENTIDADES.Generales;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Compras.DAO
{
    public class OrdenCompraDAO
    {
        private readonly string cadena;
        SqlConnection cnn;

        SqlCommand cmm;
        public OrdenCompraDAO(string cadena)
        {
            this.cadena = cadena;
        }
        public List<COrdenDetalle> getDetalle(int id)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_GET_DETALLE_ORDEN", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "DETALLE ORDEN";

                CCotizacionDetalle proforma = new CCotizacionDetalle();
                COrdenDetalle orden = new COrdenDetalle();
                List<COrdenDetalle> lista = new List<COrdenDetalle>();
                foreach (DataRow row in tabla.Rows)
                {
                    orden = new COrdenDetalle();
                    proforma = new CCotizacionDetalle();
                    orden.idordencompra = int.Parse(row["IDORDEN"].ToString());
                    orden.idordendetalle = int.Parse(row["IDOREDENDETALLE"].ToString());

                    proforma.iddetallecotizacion = int.Parse(row["IDDETALLECOTIZACION"].ToString());
                    proforma.cantidad = int.Parse(row["CANTIDAD"].ToString());
                    proforma.pvf = decimal.Parse(row["PVF"].ToString());
                    proforma.vvf = decimal.Parse(row["VVF"].ToString());
                    proforma.des1 = decimal.Parse(row["DES1"].ToString());
                    proforma.des2 = decimal.Parse(row["DES2"].ToString());
                    proforma.des3 = decimal.Parse(row["DES3"].ToString());
                    proforma.des4 = decimal.Parse(row["DES4"].ToString());
                    proforma.des5 = decimal.Parse(row["DES5"].ToString());
                    proforma.bonificacion = decimal.Parse(row["BONI"].ToString());
                    proforma.costo = decimal.Parse(row["COSTO"].ToString());
                    proforma.montofacturar = decimal.Parse(row["COSTOFACTURAR"].ToString());
                    proforma.total = decimal.Parse(row["TOTAL"].ToString());
                    proforma.subtotal = decimal.Parse(row["SUBTOTAL"].ToString());
                    proforma.equivalencia = decimal.Parse(row["EQUIVA"].ToString());

                    proforma.idproductoproveedor = int.Parse(row["ID PRODU PROV"].ToString());
                    proforma.productoproveedor = new CProductoProveedor
                    {
                        idproductoproveedor = int.Parse(row["ID PRODU PROV"].ToString()),
                        codproductoproveedor = row["COD PRO. PROVEEDOR"].ToString(),
                        descripcion = row["DESCRIPCION PRO. PROVEEDOR"].ToString()

                    };
                    proforma.idproducto = int.Parse(row["ID PRO"].ToString());
                    proforma.producto = new AProducto
                    {
                        idproducto = int.Parse(row["ID PRO"].ToString()),
                        codigoproducto = row["COD. PROD. QF"].ToString(),
                        nombre = row["DESCRIPCION PROD. QF"].ToString(),
                        idtipoproducto = row["TIPO PRODUCTO"].ToString()

                    };

                    proforma.uma = row["UMA-DES"].ToString();
                    proforma.ump = row["UMP-DES"].ToString();

                    proforma.laboratorio = row["LABORATORIO"].ToString();
                    orden.detallecotizacion = proforma;
                    lista.Add(orden);
                }
                cnn.Close();
                return lista;
            }
            catch (Exception)
            {
                return new List<COrdenDetalle>();
            }

        }
        public async Task<DataTable> getOrdenesAsync(string orden, string idempresa, string proveedor, string estado, string sucursal, int top, DateTime? fechainicio, DateTime? fechafin)
        {
            var tarea = await Task.Run(() =>
            {

                if (orden is null) orden = "";
                if (proveedor is null) proveedor = "";
                if (estado is null) estado = "";
                if (sucursal is null) sucursal = "";
                if (top is 0) top = 100;
                try
                {
                    cnn = new SqlConnection();
                    cnn.ConnectionString = cadena;
                    cnn.Open();
                    cmm = new SqlCommand("Compras.SP_LISTAR_COMPRAS", cnn);
                    cmm.CommandType = CommandType.StoredProcedure;

                    cmm.Parameters.AddWithValue("@CODIGO", orden);
                    cmm.Parameters.AddWithValue("@EMPRESA", idempresa);
                    cmm.Parameters.AddWithValue("@PROVEEDOR", proveedor);
                    cmm.Parameters.AddWithValue("@ESTADO", estado);
                    cmm.Parameters.AddWithValue("@SUCURSAL", sucursal);
                    cmm.Parameters.AddWithValue("@TOP", top);
                    cmm.Parameters.AddWithValue("@FECHAINICIO", fechainicio.HasValue ? fechainicio.Value.ToString("yyyy/dd/MM HH:mm") : "");
                    cmm.Parameters.AddWithValue("@FECHAFIN", fechafin.HasValue ? fechafin.Value.ToString("yyyy/dd/MM HH:mm") : "");

                    DataTable tabla = new DataTable();
                    SqlDataAdapter da = new SqlDataAdapter(cmm);
                    da.Fill(tabla);
                    tabla.TableName = "ORDENES";

                    cnn.Close();
                    return tabla;
                }
                catch (Exception vex)
                {
                    return new DataTable();
                }
            });
            return tarea;

        }
        public DataTable getDetalleOrdenCompra_mas_Bonificaciones(int id, string tipo)
        {
            try
            {
                if (tipo is null)
                    tipo = "";
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                //cmm = new SqlCommand("compras.SP_BUSCAR_ORDENCOMPRA_BONIFICACIONES", cnn);
                //CAMBIOS SEMANA1
                cmm = new SqlCommand("compras.SP_BUSCAR_ORDENCOMPRA_BONIFICACIONES_v2", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                cmm.Parameters.AddWithValue("@TIPO", tipo);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "OC Y BONIFICACIONES";


                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }

        }
        public List<Centroscosto> getlistaCCosto(int idempresa) {
          
            try {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("listar_ccosto", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idempresa", idempresa);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "LCCOSTO";
                Centroscosto cc;
                cnn.Close();
                List<Centroscosto> lista = new List<Centroscosto>();
                foreach (DataRow item in tabla.Rows) {
                    cc = new Centroscosto();
                    cc.idcodicentcost = item[1].ToString();
                    cc.nombrecentcost = item[2].ToString();
                    lista.Add(cc);

                }
                return lista;
            }
            catch (Exception) {
                return null;
            }
        }
        public List<string> getOrdenCompra_mas_boni_CompletaImprimir(int id, string tipo)
        {
            var data = getDetalleOrdenCompra_mas_Bonificaciones(id, tipo);
            List<string> lista = new List<string>();
            foreach (DataRow item in data.Rows)
            {
                lista.Add(item["CABECERA"].ToString());
                lista.Add(item["DETALLE"].ToString());
              
            }
            return lista;
        }
        public DataTable get10ultimasOrdenes(string proveedor, int producto, string empresa)
        {
            if (proveedor is null)
                proveedor = "";
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                //cmm = new SqlCommand("Compras.SP_ULTIMAS_10_COMPRAS_APROBADAS", cnn);
                //CAMBIOS SEMANA3
                cmm = new SqlCommand("Compras.SP_ULTIMAS_10_COMPRAS_APROBADAS_v2", cnn);
                cmm.CommandType = CommandType.StoredProcedure;

                cmm.Parameters.AddWithValue("@PROVEEDOR", proveedor);
                cmm.Parameters.AddWithValue("@EMPRESA", empresa);
                cmm.Parameters.AddWithValue("@PRODUCTO", producto);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "10 ULTIMAS ORDENES";

                cnn.Close();
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }
        }
















        public COrdenCompra getCabecera(int id)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_BUSCAR_CABECERA_ORDEN_COMPRA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "CABECERA ORDEN";

                COrdenCompra orden = new COrdenCompra();
                foreach (DataRow row in tabla.Rows)
                {
                    orden = new COrdenCompra();
                    orden.idordencompra = int.Parse(row["ID"].ToString());
                    orden.codigoorden = (row["CODIGO"].ToString());
                    orden.idcondicionpago = int.Parse(row["ID CONDICION PAGO"].ToString());
                    orden.idcontacto = int.Parse(row["ID CONTACTO"].ToString());
                    orden.idmoneda = int.Parse(row["ID MONEDA"].ToString());
                    orden.idproveedor = int.Parse(row["ID PROVEEDOR"].ToString());
                    orden.idrepresentante = int.Parse(row["ID REPRESENTANTE"].ToString());
                    orden.idtipopago = int.Parse(row["ID TIPO PAGO"].ToString());
                    orden.emp_codigo = int.Parse(row["ID EMPLEADO"].ToString());
                    orden.idempresa = int.Parse(row["ID EMPRESA"].ToString());
                    orden.estado = (row["ESTADO"].ToString());
                    orden.fechavencimiento = DateTime.Parse(row["FECHA VENCIMIENTO"].ToString());
                    orden.fecha = DateTime.Parse(row["FECHA"].ToString());
                    orden.cambiomoneda = decimal.Parse((row["MONEDA CAMBIO"].ToString()));
                    orden.idsucursal = int.Parse((row["IDSUCURSAL"].ToString()));
                    orden.idsucursaldestino = int.Parse((row["IDSUCURSAL DESTINO"].ToString()));
                    orden.idicoterms = ((row["IDICOTERMS"].ToString()));
                    orden.proveedor = new CProveedor
                    {
                        ubicacion = (row["PRO_UBICACION"].ToString()),
                        razonsocial = (row["PROV. RAZONSOCIAL"].ToString()),
                        ruc = (row["PROV. RUC"].ToString()),
                        telefonod = (row["prov. telefono"].ToString()),
                        idproveedor = int.Parse(row["ID PROVEEDOR"].ToString()),
                        //des1 = decimal.Parse(row["PROVEEDOR DES"].ToString()),
                    };
                    orden.contacto = new CContactosProveedor
                    {
                        nombres = (row["CONTACTO NOMBRES"].ToString()),
                        telefono = (row["CONTACTO TELE"].ToString()),
                        celular = (row["CONTACTO CELULAR"].ToString()),
                        correo = (row["CONTACTO EMAIL"].ToString()),
                        idcontacto = int.Parse(row["ID CONTACTO"].ToString())
                    };
                    orden.representante = new CRepresentanteLaboratorio
                    {
                        nombres = (row["REPRE NOMBRES"].ToString()),
                        telefono = (row["REPRE TELE"].ToString()),
                        celular = (row["REPRE CELULAR"].ToString()),
                        correo = (row["REPRE EMAIL"].ToString()),
                        idrepresentante = int.Parse(row["ID REPRESENTANTE"].ToString()),
                        idlaboratorio = int.Parse(row["REPRE ID LAB"].ToString()),

                    };
                    orden.moneda = new FMoneda
                    {
                        nombre = (row["MONEDA"].ToString()),
                        tipodecambio = decimal.Parse((row["MONEDA CAMBIO"].ToString())),
                        idmoneda = int.Parse(row["ID MONEDA"].ToString()),

                    };
                    orden.tipopago = new FTipoPago
                    {
                        idtipopago = int.Parse(row["ID TIPO PAGO"].ToString()),
                        descripcion = (row["TIPO PAGO"].ToString()),
                    };
                    orden.condicionpago = new FCondicionPago
                    {
                        idcondicionpago = int.Parse(row["ID CONDICION PAGO"].ToString()),
                        descripcion = (row["CONDICION PAGO"].ToString()),
                    };
                    orden.empleado = new EMPLEADO
                    {
                        emp_codigo = int.Parse(row["ID EMPLEADO"].ToString()),
                        nombres = (row["EMPLEADO NOMBRES"].ToString()),
                        email = (row["EMPLEADO EMAIL"].ToString()),
                    };
                }
                cnn.Close();
                return orden;
            }
            catch (Exception)
            {
                return new COrdenCompra();
            }
        }

        // envio de correo fin preingreso
        public DataTable getenviocorreopreingresotem(int idpreingreso)
        {

            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("PreIngreso.SP_LitadoDatCorreoPreingreso", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idpreingreso", idpreingreso);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla); 
                tabla.TableName = "datoscorreo";

                cnn.Close();
                return tabla;
              
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
