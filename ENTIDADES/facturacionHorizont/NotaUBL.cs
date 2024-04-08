using System;
using System.Collections.Generic;
using System.Text;

namespace ENTIDADES.facturacionHorizont
{
    public class NotaUBL
    {
        public DatosComprobante DatosComprobante { get; set; }
        public DatosEmisor DatosEmisor { get; set; }
        public LugarEngrega_VentaItinerante LugarEngrega_VentaItinerante { get; set; }
        public DatosAdquiriente DatosAdquiriente { get; set; }
        public DatosComprador DatosComprador { get; set; }
        public TotalImpuestos TotalImpuestos { get; set; }
        public Total Total { get; set; }
        public InformacionAdicional InformacionAdicional { get; set; }
        public TipoCambio TipoCambio { get; set; }
        public Detracciones Detracciones { get; set; }
        public MigracionDocumentosAutorizados MigracionDocumentosAutorizados { get; set; }
        public DatosDocumentoModifica DatosDocumentoModifica { get; set; }
        public IncoteRMS IncoteRMS { get; set; }
        public ImpuestoICBPER ImpuestoICBPER { get; set; }
        public List<DetalleFactura> DetalleFactura { get; set; }
        public Leyenda leyenda { get; set; }
        public string GenerarNombreTxt(string ruc, string codigodocumento, string serie, string numdoc, string extension)
        {
            if (codigodocumento is null || codigodocumento is "")
                return "x";
            string nombre = ruc + "-" + codigodocumento;
            if (numdoc.Length == 0 || serie.Length == 0 || ruc.Length == 0)
                return "x";
            return nombre += "-" + serie + "-" + numdoc + "." + extension;
        }
    }
}
