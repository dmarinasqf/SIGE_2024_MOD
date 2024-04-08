using ENTIDADES.finanzas;
using ENTIDADES.Finanzas;
using ENTIDADES.Generales;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.ventas
{
    [Table("NotaCD", Schema = "Ventas")]

    public class NotaCD :AuditoriaColumna
    {
        [Key]
        public int idnota { get; set; }
        public int iddocumento { get; set; }
        public int idtipodocumento { get; set; }
        public int? idsucursal { get; set; }
        public int? idempresa { get; set; }
        public int? idaperturacaja { get; set; }
        public long idventa { get; set; }
        public string estado { get; set; }
        public string serie { get; set; }
        public string numdocumento { get; set; }
        public string motivodevolucion { get; set; }
        public bool? txtgenerado { get; set; }
        public decimal? pkdescuento { get; set; }//EARTCOD1009

        [NotMapped]
        public string jsondetalle { get; set; }
        public DateTime? fecha { get; set; }
        [ForeignKey("iddocumento")]
        public FDocumentoTributario documentotributario { get; set; }
        [ForeignKey("idtipodocumento")]
        public FTipoDocumentoTributario tipodocumento { get; set; }
        [ForeignKey("idsucursal")]
        public SUCURSAL sucursal { get; set; }
        [ForeignKey("idempresa")]
        public Empresa  empresa { get; set; }
        [ForeignKey("idaperturacaja")]
        public AperturarCaja caja { get; set; }
   
        
    }
}
