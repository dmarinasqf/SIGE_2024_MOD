using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.Contabilidad
{
    public class RendicionCajaChica
    {
        public int idCajaChica {get ; set;}
        public string idSucursalResp { get; set; }
        public decimal montoCajaChica { get; set; }
        public decimal saldoUltimaRep { get; set; }
        public decimal montoUltimaRep { get; set; }
        public string fechaUltimaRep { get; set; }
        public decimal montoDisponible { get; set; }
        public decimal saldoCaja { get; set; }
        public decimal montoReponer { get; set; }
        public decimal totalGastos { get; set; }
        public string estado { get; set; }
        public string validacionSAV { get; set; }
        public string validacionCont { get; set; }
        public string responsable { get; set; }
        public List<RendicionCajaChicaDetalle> detalleCaja { get; set; }
    }

    public class RendicionCajaChicaDetalle
    {
        public int idCajaChicaDet { get; set; }
        public int idCajaChica { get; set; }
        public int numItem { get; set; }
        public string idValidacion { get; set; }
        public string fecha { get; set; }
        public string numRuc { get; set; }
        public string tipoDoc { get; set; }
        public string numSerie { get; set; }
        public string numDoc { get; set; }
        public string tipoGastos { get; set; }
        public decimal total { get; set; }
        public decimal saldo { get; set; }
        public string comentarios { get; set; }
        public byte[] recursoImg { get; set; }
        public string recursoImgb64 { get; set; }
        public string estado_op { get; set; }
        public string tipo_op { get; set; }
        public string centro_costos_dos { get; set; }
        public decimal tp_igv { get; set; }
    }
}
