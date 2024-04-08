namespace ENTIDADES.gdp
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;


    [Table("MOVIMIENTO")]
    public class MOVIMIENTO
    {
        public int? suc_codigo { get; set; }

        [StringLength(7)]
        public string tipomovimiento { get; set; }

        [Key]
        public int mov_codigo { get; set; }

        public DateTime? fecha { get; set; }

        public decimal? monto { get; set; }

        public byte[] observacion { get; set; }

        [StringLength(10)]
        public string estado { get; set; }

        [StringLength(100)]
        public string motivoeliminacion { get; set; }

        [StringLength(100)]
        public string motivomodificado { get; set; }

        public int? usuariomodifica { get; set; }

        public int? dep_codigo { get; set; }

        public int? pro_codigo { get; set; }

        public int? dis_codigo { get; set; }

        public int? emp_codigo { get; set; }


    }
}
