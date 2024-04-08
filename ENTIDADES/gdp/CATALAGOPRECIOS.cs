namespace ENTIDADES.gdp
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    [Table("CATALAGOPRECIOS")]
    public partial class CATALAGOPRECIOS
    {

        [Key]
        public int catalago_codigo { get; set; }

        [StringLength(25)]
        public string codigoPrecio { get; set; }

        [StringLength(100)]
        public string articulo { get; set; }

        public decimal? precio { get; set; }

        [StringLength(10)]
        public string estado { get; set; }

        public int? idcliente { get; set; }
        public string formulacion { get; set; }
        public string presentacion { get; set; }
        public string etiqueta { get; set; }
        public string observacion { get; set; }
        public string codigocliente { get; set; }
        public string laboratorio { get; set; }
        public string marca { get; set; }
        public string clase { get; set; }

        [StringLength(50)]
        public string categoriaPrecio_codigo { get; set; }

        public DateTime? fechaCreacion { get; set; }
        public DateTime? fechaModificacion { get; set; }



    }
}
