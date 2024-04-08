using Erp.SeedWork;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Almacen.DAO
{
    public class InventarioDAO
    {
        private readonly string cadena;
        SqlConnection cnn;
        SqlDataReader leer;
        SqlCommand cmm;
        public InventarioDAO(string cadena)
        {
            this.cadena = cadena;
        }
        public async Task<mensajeJson> getLotePorLaboratorioSucursal(string idlaboratorio, int idsucursal)
        {
            var tarea = await Task.Run(() => {
                try
                {
                    var obj = spLotePorLaboratorioSucursal(idlaboratorio, idsucursal);
                    if (obj is null)
                        return (new mensajeJson("notfound", JsonConvert.SerializeObject(new DataTable())));
                    else
                        return new mensajeJson("ok", JsonConvert.SerializeObject(obj));
                }
                catch (Exception e)
                {
                    return new mensajeJson(e.Message, JsonConvert.SerializeObject(new DataTable()));
                }
            });
            return tarea;
        }
        public async Task<mensajeJson> getValidarExistenciaInventario(string idalmacensucursal, string idlaboratorio)
        {
            var tarea = await Task.Run(() => {
                try
                {
                    var obj = spValidarExistenciaInventario(idalmacensucursal, idlaboratorio);
                    if (obj is null)
                        return (new mensajeJson("notfound", JsonConvert.SerializeObject(new DataTable())));
                    else
                        return new mensajeJson("ok", JsonConvert.SerializeObject(obj));
                }
                catch (Exception e)
                {
                    return new mensajeJson(e.Message, JsonConvert.SerializeObject(new DataTable()));
                }
            });
            return tarea;
        }

        public DataTable spLotePorLaboratorioSucursal(string idlaboratorio, int idalmacensucursal)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.sp_buscarLotePorProductoSucursal", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idlaboratorio", idlaboratorio);
                cmm.Parameters.AddWithValue("@idalmacensucursal", idalmacensucursal);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
                tabla.TableName = "TABLA LOTES";
                cnn.Close();
                return tabla;
            }
            catch (Exception e)
            {
                return new DataTable();
            }
        }
        public DataTable spValidarExistenciaInventario(string idalmacensucursal, string idlaboratorio)
        {
            try
            {
                cnn = new SqlConnection();
                cnn.ConnectionString = cadena;
                cnn.Open();
                cmm = new SqlCommand("Almacen.sp_ValidarExistenciaInventario", cnn);
                cmm.CommandType = CommandType.StoredProcedure;
                cmm.Parameters.AddWithValue("@idalmacensucursal", idalmacensucursal);
                cmm.Parameters.AddWithValue("@idlaboratorio", idlaboratorio);
                DataTable tabla = new DataTable();
                SqlDataAdapter da = new SqlDataAdapter(cmm);
                da.Fill(tabla);
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
