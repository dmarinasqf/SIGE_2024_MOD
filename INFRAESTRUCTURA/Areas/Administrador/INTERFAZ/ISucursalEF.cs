using ENTIDADES.Generales;
using INFRAESTRUCTURA.Areas.Administrador.ViewModels;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Administrador.INTERFAZ
{
    public interface ISucursalEF
    {        
        public  Task<SucursalModel> ListarModelAsync();
        public mensajeJson Create(SUCURSAL sucursal);
        public SUCURSAL Buscar(int id);
        public mensajeJson Edit(SUCURSAL sucursal);
        public mensajeJson Delete(int id, string tipo);

        public mensajeJson AgregarEliminarLaboratorio(int idsucursal, int idlaboratorio);
        public object ListarLaboratorioSucursal(int sucursal);
        public object ListarSucursalxEmpresa(int idempresa, string tiposucursal);
        public object ListarSucursalxEmpresaQF(int idempresa, string tiposucursal);
        public List<SUCURSAL> cargarProducion();
        public mensajeJson AgregarEliminarCaja(int idsucursal, int idcaja);
        public object ListarSucursalesPrimarias(int idempresa);
        public mensajeJson AsignarListaPrecios(int idsucursal, int idlista);
        public object ListarSucursales(string tipo);
        public object ListarSucursales2(string tipo);
        public object ListarSucursalDelivery();
        public object ListarSucursalesByTipoLocal(string tipo);
        public object ListaLaboratorio();
        public object ListadoTipoProcedimiento(int suc_codigo);
    }
}
