using ENTIDADES.Almacen;
using ENTIDADES.compras;
using INFRAESTRUCTURA.Areas.Compras.ViewModels;
using Erp.SeedWork;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Compras.INTERFAZ
{
   public interface IProveedorEF
    {
        public object ListarProveedor();
        public  Task<ProveedorModel> ListarModelAsync();
        public  Task<mensajeJson> RegistrarEditarAsync(CProveedor obj);
        public  Task<mensajeJson> EliminarAsync(int? id);
        public  Task<mensajeJson> BuscarAsync(int? id);
        public  Task<List<CProveedor>> listarproveedoresHabilitadosAsync();
        public mensajeJson RegistrarCuenta(CuentaProveedor cuenta);
        public mensajeJson EliminarCuenta(int idcuenta);
        public object ListarCuentas(int idproveedor);
        public mensajeJson BuscarCuenta(int id);
        public object BuscarProveedores(string filtro);
        //CONTACTO DE PROVEEDOR         
        public  Task<mensajeJson> RegistrarEditarContactoAsync(CContactosProveedor obj);
        public  Task<mensajeJson> BuscarContactoAsync(int? id);
        public  Task<mensajeJson> EliminarContactoAsync(int? id);
        public  Task<List<ALaboratorio>> listarLaboratorioProveedorAsync(string proveedor,string laboratorio);
        public  Task<List<CContactosProveedor>> listarContactosProveedorAsync(int proveedor);

        //ARCHIVOS
        public mensajeJson RegistrarDatosArchivo(ArchivoProveedor obj, IFormFile file, string path);
        public mensajeJson EliminarArchivo(int id);
        public List<ArchivoProveedor> ListarArchivos(int idproveedor);

    }
}
