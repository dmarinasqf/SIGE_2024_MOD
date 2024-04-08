namespace ENTIDADES.gdp
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;


    [Table("CONSULTAMEDICA")]
    public partial class CONSULTAMEDICA
    {
        public int? cli_codigo { get; set; }

        public int? med_codigo { get; set; }

        public int? suc_codigo { get; set; }

        [Key]
        public int cmed_codigo { get; set; }

        public int? tur_codigo { get; set; }

        public int? emp_codigo { get; set; }


    }
}
