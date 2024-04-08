
using ENTIDADES.Almacen;
using ENTIDADES.compras;
using ENTIDADES.Finanzas;
using ENTIDADES.Generales;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace INFRAESTRUCTURA.Areas.Compras.DAO
{
   public class CotizacionDAO
    {      
        private readonly string cadena;
        SqlConnection cnn;

        SqlCommand cmm;
        SqlDataAdapter adap;
        public CotizacionDAO( string _cadena)
        {           
            cadena = _cadena;
        }
        public DataTable getCotizacion(string estado, string codigo, string proveedor, string empresa,int top)
        {
            try
            {
                if (estado is null)
                    estado = "";
                if (codigo is null)
                    codigo = "";
                if (proveedor is null)
                    proveedor = "";
                if (empresa is null)
                    empresa = "";
                if (top is 0) top = 20;                    
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_LISTAR_COTIZACIONES", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@CODIGO", codigo);
                cmm.Parameters.AddWithValue("@ESTADO", estado);
                cmm.Parameters.AddWithValue("@PROVEEDOR", proveedor);
                cmm.Parameters.AddWithValue("@EMPRESA", empresa);
                cmm.Parameters.AddWithValue("@TOP", top);
                DataTable tabla = new DataTable();
                adap = new SqlDataAdapter(cmm);
                adap.Fill(tabla);
               
                cnn.Close();              
                return tabla;               
            }
            catch (Exception)
            {

                return new DataTable();
            }

        }
        public DataTable getCotizacionCompleta(int idcotizacion)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_BUSCAR_PROFORMA_COMPLETA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", idcotizacion);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PROFORMA";
                cnn.Close();
                
                return tabla;
            }
            catch (Exception)
            {
                return new DataTable();
            }

        }
        public void updateDescuentos(int codigoproducto,decimal? des2, decimal? des3)
        {
            try
            {
                if (des2 is null) des2 = 0;
                if (des3 is null) des3 = 0;
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.updatedescuentosxproducto", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@codigo", codigoproducto);
                cmm.Parameters.AddWithValue("@des2", des2);
                cmm.Parameters.AddWithValue("@des3", des3);
                cmm.ExecuteReader();
                cnn.Close();
            }
            catch (Exception vex)
            {           
            }
        }
        public List<string> getCotizacionCompletaImprimir(int id)
        {
            var data = getCotizacionCompleta(id);
            List<string> lista = new List<string>();
            foreach (DataRow item in data.Rows)
            {
                lista.Add(item["CABECERA"].ToString());
                lista.Add(item["DETALLE"].ToString());
            }
            return lista;
        }

        public DataTable BuscarUltimaCompraxProducto(int idproducto)
        {
            DataTable dtTabla = new DataTable();
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_Buscar_Ultima_Compra_Producto", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idproducto", idproducto);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "ULTIMACOMPRA";
                cnn.Close();

                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }

        public CCotizacion getCabecera(int id)
        {
            try
            {

                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_BUSCAR_CABECERA_PROFORMA", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@ID", id);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "CABECERA PROFORMA";

                CCotizacion cotizacion = new CCotizacion();
                foreach (DataRow row in tabla.Rows)
                {
                    cotizacion = new CCotizacion();
                    cotizacion.idcotizacion = int.Parse(row["ID"].ToString());
                    cotizacion.codigocotizacion = (row["CODIGO"].ToString());
                    cotizacion.idcondicionpago = int.Parse(row["ID CONDICION PAGO"].ToString());
                    cotizacion.idcontacto = int.Parse(row["ID CONTACTO"].ToString());
                    cotizacion.idmoneda = int.Parse(row["ID MONEDA"].ToString());
                    cotizacion.idproveedor = int.Parse(row["ID PROVEEDOR"].ToString());
                    cotizacion.idrepresentante = int.Parse(row["ID REPRESENTANTE"].ToString());
                    cotizacion.idtipocotizacion = int.Parse(row["ID TIPO COTIZACION"].ToString());
                    cotizacion.idtipopago = int.Parse(row["ID TIPO PAGO"].ToString());
                    cotizacion.emp_codigo = int.Parse(row["ID EMPLEADO"].ToString());
                    cotizacion.codigoempresa =int.Parse (row["ID EMPRESA"].ToString());
                    cotizacion.estado = (row["ESTADO"].ToString());
                    cotizacion.fechavencimiento = DateTime.Parse(row["FECHA VENCIMIENTO"].ToString());
                    cotizacion.fechasistema = DateTime.Parse(row["FECHA"].ToString());
                    cotizacion.cambiomoneda = decimal.Parse((row["MONEDA CAMBIO"].ToString()));
                    cotizacion.proveedor = new CProveedor
                    {
                        razonsocial = (row["PROV. RAZONSOCIAL"].ToString()),
                        ruc = (row["PROV. RUC"].ToString()),
                        telefonod = (row["prov. telefono"].ToString()),
                        idproveedor = int.Parse(row["ID PROVEEDOR"].ToString()),
                        des1 = decimal.Parse(row["PROVEEDOR DES"].ToString()),
                    };
                    cotizacion.contacto = new CContactosProveedor
                    {
                        nombres = (row["CONTACTO NOMBRES"].ToString()),
                        telefono = (row["CONTACTO TELE"].ToString()),
                        celular = (row["CONTACTO CELULAR"].ToString()),
                        correo = (row["CONTACTO EMAIL"].ToString()),
                        idcontacto = int.Parse(row["ID CONTACTO"].ToString())
                    };
                    cotizacion.representante = new CRepresentanteLaboratorio
                    {
                        nombres = (row["REPRE NOMBRES"].ToString()),
                        telefono = (row["REPRE TELE"].ToString()),
                        celular = (row["REPRE CELULAR"].ToString()),
                        correo = (row["REPRE EMAIL"].ToString()),
                        idrepresentante = int.Parse(row["ID REPRESENTANTE"].ToString()),
                        idlaboratorio = int.Parse(row["REPRE ID LAB"].ToString()),

                    };
                    cotizacion.moneda = new FMoneda
                    {
                        nombre = (row["MONEDA"].ToString()),
                        tipodecambio = decimal.Parse((row["MONEDA CAMBIO"].ToString())),
                        idmoneda = int.Parse(row["ID MONEDA"].ToString()),

                    };
                    cotizacion.tipopago = new FTipoPago
                    {
                        idtipopago = int.Parse(row["ID TIPO PAGO"].ToString()),
                        descripcion = (row["TIPO PAGO"].ToString()),
                    };
                    cotizacion.condicionpago = new FCondicionPago
                    {
                        idcondicionpago = int.Parse(row["ID CONDICION PAGO"].ToString()),
                        descripcion = (row["CONDICION PAGO"].ToString()),
                    };
                    cotizacion.empleado = new EMPLEADO
                    {
                        emp_codigo = int.Parse(row["ID EMPLEADO"].ToString()),
                        nombres = (row["EMPLEADO NOMBRES"].ToString()),
                        email = (row["EMPLEADO EMAIL"].ToString()),
                    };
                }
                cnn.Close();
                return cotizacion;
            }
            catch (Exception)
            {
                return null;
            }

        }

        public DataTable BuscarDatosProveedor(int idproveedor)
        {
            DataTable dtTabla = new DataTable();
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Compras.SP_Buscar_Datos_Proveedor", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idproveedor", idproveedor);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "PROVEEDOR";
                cnn.Close();

                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }

        //FSILVA - INICIO 19/12/2023
        public DataTable GetUnidadMedida()
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.ListarUnidadMedida", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                //cmm.Parameters.AddWithValue("@PI_IDUNIDADMEDIDA", codUnidadMedida);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "UNIDADMEDIDA";
                cnn.Close();

                return tabla;
            }
            catch (Exception)
            {
                throw;
            }
        }
        //FSILVA - FINAL 19/12/2023
    }
}
