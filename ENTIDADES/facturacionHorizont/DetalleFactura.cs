using System;
using System.Collections.Generic;
using System.Text;

namespace ENTIDADES.facturacionHorizont
{
   public class DetalleFactura
    {
        //tipo --> para saber si es bonificcaion o no
        public string tipo { get; set; }
        //producto
        public int numitem { get; set; }
        public string codigounidadmedida { get; set; }
        public int cantidad { get; set; }
        public string codigoproducto { get; set; }
        public string tipotributo { get; set; }
        public string codigoproductosunat { get; set; }
        public string codigoproductoGS1 { get; set; }
        public string tipoproductoGTIN { get; set; }
        public string numplacavehiculo { get; set; }
        public string descripcion_producto_servicio { get; set; }
        public decimal preciounitario { get; set; }
        public decimal precioventaunitarioigv { get; set; }
        public decimal valorreferencialunitario { get; set; }
        public decimal subtotal { get; set; }
        public decimal total { get; set; }


        //IGV IVAP
        public decimal montototal_impuestos_item { get; set; }
        public decimal montobase { get; set; }
        public decimal montoIGV_IVAP { get; set; }
        public string tasaIGV_IVAP { get; set; }
        public string codafectacionigv { get; set; }
        public decimal indicadorgratuito { get; set; }
        //ISC
        public decimal montobase_ISC { get; set; }
        public decimal monto_tributo_linea { get; set; }
        public decimal tasa_tributo { get; set; }
        public decimal tipo_sistema_ISV { get; set; }
        //OTROS TRIBUTOS
        public decimal montobase_otrostributos { get; set; }
        public decimal monto_tributo_linea_otrostributos { get; set; }
        public decimal tasa_tributo_otrotributo { get; set; }
        public string tipo_sistema_otrotributo { get; set; }
        //VALOR VENTA DEL ITEM
        public decimal valor_venta_item { get; set; }
        //CARGO
        public string codigo_cargo_item { get; set; }
        public string factor_cargo_item { get; set; }
        public string monto_cargo_item { get; set; }
        public string monto_base_cargo_item { get; set; }
        //DESCUENTO
        public string codigodescuento { get; set; }
        public string factor_descuento_item { get; set; }
        public string monto_descuento_item { get; set; }
        public string monto_base_descuento_item { get; set; }
        //ICBPER

        public string cantidad_bolas_plastico { get; set; }
        public string monto_unitario_ICBPER { get; set; }

        public string monto_tributo_linea_ICBPER { get; set; }


    }
}
