DELETE FROM IMAGEN_PEDIDO
DELETE FROM PROFORMAIMAGEN
DELETE FROM PROFORMADETALLE
DELETE FROM PROFORMA
GO
DELETE FROM LIBRORECETASLABORATORIO
DELETE FROM LIBRORECETAS
DELETE FROM DETALLE_PEDIDO
GO
DELETE FROM PAGOSPEDIDO
DELETE FROM DEVOLUCIONES
GO
DELETE FROM DELIVERY.FotoPagos
DELETE FROM Delivery.FotoPotes
DELETE FROM DELIVERY.EntregaDelivery
DELETE FROM DELIVERY
GO
DELETE FROM Pedidos.PagosPedido
DELETE FROM PEDIDO
GO
DELETE FROM DETALLECAJACHICA
DELETE FROM CAJACHICA
GO
DELETE FROM CITANOVENTAIMAGEN
DELETE FROM CITANOVENTAIMAGEN
GO
DELETE FROM DEPOSITOS
DELETE FROM DETALLEPROCEDIMIENTOARTICULO
DELETE FROM DETALLE_PROCEDIMIENTO
delete from PROCEDIMIENTO
go
delete from INGRESOS
delete from EGRESOS
go
delete from HORARIO
delete from HORARIO_VISITA_MEDICOS
go
delete from OBJETIVOS_REPMED
delete from REPMEDICO_MED_ASIGNADOS
delete from CONSULTORIO
delete from Facturador.DetalleVenta
delete from Facturador.Venta
go
delete from Ventas.DetalleNotaCD
delete from Ventas.NotaCD
delete from Ventas.VentaDetalle
delete from Ventas.VentaPagos
delete from Ventas.Venta
go
delete from Almacen.Kardex
delete from Almacen.DetalleGuiaSalida
delete from Almacen.SalidaManualDetalle
delete from Almacen.DetalleIngresoManual
delete from Almacen.GuiaSalida
delete from Almacen.GuiaEntrada
go
delete from Almacen.IngresoTransferenciaDetalle
delete from Almacen.IngresoTransferencia
delete from PreIngreso.CaracteristicaDetalleAO
delete from PreIngreso.AnalisisOrgDetalle
delete from PreIngreso.AnalisisOrganoleptico
delete from PreIngreso.DetalleBonificacionFueraDocumento
delete from PreIngreso.GuiaDevolucionDetalle
delete from PreIngreso.GuiaDevolucion
delete from PreIngreso.Lote
go
delete from Compras.DetalleOrdenCompra
delete from Compras.OrdenCompra
delete from compras.BonificacionCotizacion
delete from Compras.CotizacionDetalle
delete from Compras.Cotizacion
go
delete from Telemedico.DetalleHistorialClinico
delete from Telemedico.FotoPaciente
delete from Telemedico.FotoPago
delete from Telemedico.FotoReceta
delete from Telemedico.HistorialClinico
go
delete from Telemedico.HorarioMedico
delete from visitadormedico.CuotaMedico
go
delete from Finanzas.LineaCreditoHistorial
delete from Finanzas.LineaCreditoCobroCliente
delete from Finanzas.LineaCredito
go
delete from SUCURSALES_REPMEDICO
delete from SUCURSALES_SUPERVISOR
delete from UsuarioSucursal
delete from Ventas.AperturarCaja
delete from Ventas.CerrarCaja
delete from CajaSucursal
go

delete from Ventas.incentivo
delete from Callcenter.LLAMADA
delete from Callcenter.RESULTADOLLAMADA
delete from asistencia.EmpleadosAutorizantes
delete from asistencia.RegistroES
go
delete from PreIngreso.CondicionEmbalaje
delete from PreIngreso.DetallePreingreso
delete from PreIngreso.FacturaPreingreso
delete from PreIngreso.PreIngreso
go
delete from EMPLEADO where emp_codigo!=0 and emp_codigo!=3
go
delete from LISTAPRECIOSUCURSAL
delete from Comercial.Incentivo
delete from SucursalLaboratorio
go
update CLIENTE_TERCERO set suc_codigo=null
delete from Almacen.SalidaManual
delete from Comercial.DescuentoCobrar
delete from Comercial.ListaDescuento
go
DELETE FROM ventas.ProformaDetalle
delete from Comercial.PreciosDetalle
delete from Comercial.PreciosProducto

delete from Comercial.ListaPreciosSucursal
delete from Comercial.PreciosProducto
delete from Comercial.ListaPrecios
go
DELETE FROM Finanzas.Pagos
go
update ClienteAsociado set idsucursal=null
go
delete from Comercial.DescuentoSucursal
delete from Almacen.SalidaTransferenciaDetalle
delete from Almacen.SalidaTransferencia
go
delete from Almacen.DetalleGuiaEntrada
delete from Almacen.StockLoteProducto
go
delete from Almacen.AlmacenSucursal
delete from Almacen.IngresoManual
delete from Ventas.Proforma
delete from TIPODEPROCEDIMIENTO
go
delete from SUCURSAL where suc_codigo!=100 --and suc_codigo!=162
go
delete from AspNetUserRoles where UserId!='0' and USERid!='3'
go
delete from AspNetUsers  where id!='0' and id!='3'
go
delete from MedicoListaPrecio
DELETE FROM Telemedico.CitaMedico
delete from CATALAGOPRECIOS

GO
UPDATE SUCURSAL SET idempresa=1000
DELETE FROM EMPRESA WHERE idempresa!=1000
GO
UPDATE Empresa SET descripcion='EMPRESA 1',
correlativo='TR', ruc='', direccion='',telefono='',celular='',logofacturacion=''

go
delete from CATEGORIAPRECIO
DELETE FROM EmpleadoCanalVenta
--DELETE FROM CargoEmpleado