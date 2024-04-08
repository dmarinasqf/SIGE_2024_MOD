using ENTIDADES.ventas;
using Erp.SeedWork;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace INFRAESTRUCTURA.Areas.Ventas.INTERFAZ
{
    public interface ICajaVentaEF
    {
        public object ListarCajaSucursal(int idsucursal);
        public mensajeJson AperturarCaja(int idcajasucursal, decimal? montoinicial);
        public mensajeJson VerificarAperturaCaja(string idempleado);
        public mensajeJson VerificarSiHayCajaAbiertaParaCierre(string idempleado);
        public Task< mensajeJson> CerrarCajaAsync(int idapertura, List<CerrarCaja> cierre,string observaciones);
        public Task< mensajeJson> RegistrarDepositoCaja(string jsondeposito);
        public int ObtenerCajaAbierta(string idempleado);
        public mensajeJson GetDatosCierreCajaPDF(int idaperturacaja);
        public object ListarCajaAbiertas();
        public object GetCajaAperturada(int idaperturacaja);
        public object ListarCajasPorfechaYUsuario(DateTime fecha, int usuario);
    }
}
