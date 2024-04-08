using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ENTIDADES.Almacen
{
    [Table("StockLoteProducto", Schema = "Almacen")]
    public class AStockLoteProducto:AuditoriaColumna
    {
        [Key]
        public long idstock { get; set; }
        public int? idproducto { get; set; }
        public int? idalmacensucursal { get; set; }
        public DateTime? fechavencimiento { get; set; }
        public string lote { get; set; }
        public string regsanitario { get; set; }
        public string estado { get; set; }
        public int? candisponible { get; set; }
        public int? caningreso { get; set; }
        public int? multiplo  { get; set; }
        public int? multiploblister  { get; set; }
        public string tabla { get; set; }
        public string idtabla { get; set; }             
        public string edicion { get; set; }
        public string numfactura { get; set; }
        //public string observacion { get; set; }
        [ForeignKey("idproducto")]
        public AProducto producto { get; set; }
        [ForeignKey("idalmacensucursal")]
        public AAlmacenSucursal almacensucursal { get; set; }
        [NotMapped]
        public decimal _cantidadedita { get; set; }
        [NotMapped]
        public string _idtablaedicion { get; set; }
        [NotMapped]
        public decimal _cantidadlote { get; set; }

        public string setedicion(string tipo,string tabla,string idtabla,string cantidad)
        {
            if (tipo is null) tipo = "";
            if (tabla is null) tabla = "";
            if (idtabla is null) idtabla = "";
            if (cantidad is null) cantidad = "";
            return $"{tipo}|{tabla}|{idtabla}|{cantidad}";
        }
    }
}
