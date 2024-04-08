using Erp.Entidades.facturacionHorizont.GuiaElectronica.GuiaRemitente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Erp.Entidades.facturacionHorizont
{
    public class GuiaRemitenteH
    {
        public DTransportista DatosTransportista { get; set; }
        public DDestinatario DatosDestinatario { get; set; }
        public DGuiaRemision DatosGuiaRemision { get; set; }
        public GuiaRemisionBaja GuiaRemisionBaja { get; set; }
        public DRelacionado DocumentoRelacionado { get; set; }
        public DProveedor DatosProveedor { get; set; }
        public DEnvio DatosEnvio { get; set; }
        public DRemitente DatosRemitente { get; set; }
        public string placa { get; set; }
        public string tipo_documento_conductor { get; set; }
        public string numero_documento_conductor { get; set; }
        public string ubigeo_llegada { get; set; }
        public string direccion_llegada { get; set; }
        public string contenedor { get; set; }
        public string ubigeo_partida { get; set; }
        public string direccion_partida { get; set; }
        public string puerto { get; set; }
        public string email { get; set; }
        public string hora { get; set; }
        public string documento_relacionado { get; set; }
        public string MTC { get; set; }
        public string tipo_documento_relacionado { get; set; }
        public string numero_documento_relacionado { get; set; }
        public DConductor DatosConductor { get; set; }
        public string Tarjeta_Circulacion { get; set; }
        public string ruc_asociado_partida { get; set; }
        public string codigo_establecimiento_partida { get; set; }
        public string ruc_asociado_llegada { get; set; }
        public string codigo_establecimiento_llegada { get; set; }
        public List<DetalleGuia> detalleGuia { get; set; }
    }
}
