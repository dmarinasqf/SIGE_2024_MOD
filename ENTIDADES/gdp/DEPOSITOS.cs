using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ENTIDADES.gdp
{
    [Table("DEPOSITOS")]
    public class DEPOSITOS
    {
        [Key]
        public int deposito_codigo { get; set; }
        public DateTime fecha { get; set; }

        [MaxLength(40)]
        public string numdeposito { get; set; }
        public double? ventaefectivo { get; set; }
        public double? deposito1 { get; set; }
        public double? deposito3 { get; set; }
        public double? deposito2 { get; set; }
        [MaxLength(40)]
        public string numdeposito1 { get; set; }
        [MaxLength(40)]
        public string numdeposito2 { get; set; }
        [MaxLength(40)]
        public string numdeposito3 { get; set; }

        public DateTime? fechadeposito1 { get; set; }
        public DateTime? fechasistema { get; set; }
        public DateTime? fechadeposito2 { get; set; }
        public DateTime? fechadeposito3 { get; set; }


        public int? emp_codigo { get; set; }
        public int? suc_codigo { get; set; }

        [MaxLength(18)]
        public string estado { get; set; }
        public int? usuarioedita { get; set; }

        public DateTime? fechaedicion { get; set; }

        [NotMapped]
        public string nombresucursal { get; set; }
        [NotMapped]
        public string nombreusuario { get; set; }



    }
}