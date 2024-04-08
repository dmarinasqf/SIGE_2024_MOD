using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Erp.Persistencia.Migrations
{
    public partial class pedidos : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_PEDIDO",
                table: "PEDIDO");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DEVOLUCIONES",
                table: "DEVOLUCIONES");

            migrationBuilder.DropPrimaryKey(
                name: "PK_IMAGEN_PEDIDO",
                table: "IMAGEN_PEDIDO");

            migrationBuilder.DropColumn(
                name: "adelanto",
                table: "PEDIDO");

            migrationBuilder.DropColumn(
                name: "emp_codigo",
                table: "PEDIDO");

            migrationBuilder.DropColumn(
                name: "estadoED",
                table: "PEDIDO");

            migrationBuilder.DropColumn(
                name: "med_colegiatura",
                table: "PEDIDO");

            migrationBuilder.DropColumn(
                name: "modificado",
                table: "PEDIDO");

            migrationBuilder.DropColumn(
                name: "numBoleta",
                table: "PEDIDO");

            migrationBuilder.DropColumn(
                name: "saldo",
                table: "PEDIDO");

            migrationBuilder.DropColumn(
                name: "total",
                table: "PEDIDO");

            migrationBuilder.DropColumn(
                name: "usuarioFormulador",
                table: "PEDIDO");

            migrationBuilder.DropColumn(
                name: "usuarioeliminado",
                table: "PEDIDO");

            migrationBuilder.DropColumn(
                name: "usuariolaboratorio",
                table: "PEDIDO");

            migrationBuilder.DropColumn(
                name: "catalago_codigo",
                table: "DETALLE_PEDIDO");

            migrationBuilder.DropColumn(
                name: "eliminado",
                table: "DETALLE_PEDIDO");

            migrationBuilder.EnsureSchema(
                name: "Pedidos");

            migrationBuilder.EnsureSchema(
                name: "Delivery");

            migrationBuilder.EnsureSchema(
                name: "Produccion");

            migrationBuilder.RenameTable(
                name: "PEDIDO",
                newName: "Pedido");

            migrationBuilder.RenameTable(
                name: "DEVOLUCIONES",
                newName: "Devoluciones");

            migrationBuilder.RenameTable(
                name: "IMAGEN_PEDIDO",
                newName: "Imagen_Pedido",
                newSchema: "Pedidos");

            migrationBuilder.RenameColumn(
                name: "ordenProduccion",
                table: "Pedido",
                newName: "ordenproduccion");

            migrationBuilder.RenameColumn(
                name: "usuariomodificado",
                table: "Pedido",
                newName: "sucursalfactura");

            migrationBuilder.RenameColumn(
                name: "idtipopago",
                table: "Pedido",
                newName: "usuariomodifica");

            migrationBuilder.RenameColumn(
                name: "idDificultad",
                table: "DETALLE_PEDIDO",
                newName: "iddificultad");

            migrationBuilder.AlterColumn<string>(
                name: "usuariotransfiere",
                table: "Pedido",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "usuarioentrega",
                table: "Pedido",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ordenproduccion",
                table: "Pedido",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "nroPedidoLocal",
                table: "Pedido",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "laboratorio",
                table: "Pedido",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(80)",
                oldMaxLength: 80,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "estadoPedido",
                table: "Pedido",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "canalventa",
                table: "Pedido",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "estado",
                table: "Pedido",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "fechacreacion",
                table: "Pedido",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "fechaedicion",
                table: "Pedido",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "idtipoformulacion",
                table: "Pedido",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "usuariocrea",
                table: "Pedido",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "usuariodevuelve",
                table: "Devoluciones",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "quimicoacepta",
                table: "Devoluciones",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "pedido_codigo",
                table: "Devoluciones",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "motivodevolucion",
                table: "Devoluciones",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500,
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "sucursalenvia",
                table: "Devoluciones",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "sucursalrecibe",
                table: "Devoluciones",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "subtotal",
                table: "DETALLE_PEDIDO",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "float",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "precio",
                table: "DETALLE_PEDIDO",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(double),
                oldType: "float",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "fechacreacion",
                table: "DETALLE_PEDIDO",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "fechaedicion",
                table: "DETALLE_PEDIDO",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "isfraccion",
                table: "DETALLE_PEDIDO",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "usuariocrea",
                table: "DETALLE_PEDIDO",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "usuariomodifica",
                table: "DETALLE_PEDIDO",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "pedido_codigo",
                schema: "Pedidos",
                table: "Imagen_Pedido",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Pedido",
                table: "Pedido",
                column: "pedido_codigo");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Devoluciones",
                table: "Devoluciones",
                column: "dev_codigo");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Imagen_Pedido",
                schema: "Pedidos",
                table: "Imagen_Pedido",
                column: "imagen_codigo");

            migrationBuilder.CreateTable(
                name: "CanalVenta",
                schema: "Ventas",
                columns: table => new
                {
                    idcanalventa = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    estado = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CanalVenta", x => x.idcanalventa);
                });

            migrationBuilder.CreateTable(
                name: "DIAGNOSTICO",
                columns: table => new
                {
                    diagnostico_codigo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    codigo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    estado = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DIAGNOSTICO", x => x.diagnostico_codigo);
                });

            migrationBuilder.CreateTable(
                name: "EstadoPedido",
                schema: "Pedidos",
                columns: table => new
                {
                    idestado = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    estado = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    tipo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EstadoPedido", x => x.idestado);
                });

            migrationBuilder.CreateTable(
                name: "OrigenReceta",
                columns: table => new
                {
                    origenreceta_codigo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    direccion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    estado = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    dep_codigo = table.Column<int>(type: "int", nullable: true),
                    pro_codigo = table.Column<int>(type: "int", nullable: true),
                    dis_codigo = table.Column<int>(type: "int", nullable: true),
                    tipoorigen_codigo = table.Column<int>(type: "int", nullable: true),
                    descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    usuariocrea = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    usuariomodifica = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    fechacreacion = table.Column<DateTime>(type: "datetime2", nullable: true),
                    fechaedicion = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrigenReceta", x => x.origenreceta_codigo);
                });

            migrationBuilder.CreateTable(
                name: "TipoEntrega",
                schema: "Delivery",
                columns: table => new
                {
                    idtipoentrega = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    estado = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoEntrega", x => x.idtipoentrega);
                });

            migrationBuilder.CreateTable(
                name: "TipoFormulacion",
                schema: "Produccion",
                columns: table => new
                {
                    idtipoformulacion = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    estado = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoFormulacion", x => x.idtipoformulacion);
                });

            migrationBuilder.CreateTable(
                name: "TIPOPACIENTE",
                columns: table => new
                {
                    tipopaciente_codigo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    estado = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TIPOPACIENTE", x => x.tipopaciente_codigo);
                });

            migrationBuilder.CreateTable(
                name: "TipoPedido",
                columns: table => new
                {
                    tipopedido_codigo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    estado = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TipoPedido", x => x.tipopedido_codigo);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Pedido_canalventa",
                table: "Pedido",
                column: "canalventa");

            migrationBuilder.CreateIndex(
                name: "IX_Pedido_cli_codigo",
                table: "Pedido",
                column: "cli_codigo");

            migrationBuilder.CreateIndex(
                name: "IX_Pedido_cliTercero_codigo",
                table: "Pedido",
                column: "cliTercero_codigo");

            migrationBuilder.CreateIndex(
                name: "IX_Pedido_diagnostico_codigo",
                table: "Pedido",
                column: "diagnostico_codigo");

            migrationBuilder.CreateIndex(
                name: "IX_Pedido_estadoPedido",
                table: "Pedido",
                column: "estadoPedido");

            migrationBuilder.CreateIndex(
                name: "IX_Pedido_idtipoformulacion",
                table: "Pedido",
                column: "idtipoformulacion");

            migrationBuilder.CreateIndex(
                name: "IX_Pedido_med_codigo",
                table: "Pedido",
                column: "med_codigo");

            migrationBuilder.CreateIndex(
                name: "IX_Pedido_origenreceta_codigo",
                table: "Pedido",
                column: "origenreceta_codigo");

            migrationBuilder.CreateIndex(
                name: "IX_Pedido_suc_codigo",
                table: "Pedido",
                column: "suc_codigo");

            migrationBuilder.CreateIndex(
                name: "IX_Pedido_tipopaciente_codigo",
                table: "Pedido",
                column: "tipopaciente_codigo");

            migrationBuilder.CreateIndex(
                name: "IX_Pedido_tipopedido_codigo",
                table: "Pedido",
                column: "tipopedido_codigo");

            migrationBuilder.CreateIndex(
                name: "IX_Devoluciones_pedido_codigo",
                table: "Devoluciones",
                column: "pedido_codigo");

            migrationBuilder.CreateIndex(
                name: "IX_Imagen_Pedido_pedido_codigo",
                schema: "Pedidos",
                table: "Imagen_Pedido",
                column: "pedido_codigo");

            migrationBuilder.AddForeignKey(
                name: "FK_Devoluciones_Pedido_pedido_codigo",
                table: "Devoluciones",
                column: "pedido_codigo",
                principalTable: "Pedido",
                principalColumn: "pedido_codigo",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Imagen_Pedido_Pedido_pedido_codigo",
                schema: "Pedidos",
                table: "Imagen_Pedido",
                column: "pedido_codigo",
                principalTable: "Pedido",
                principalColumn: "pedido_codigo",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedido_CanalVenta_canalventa",
                table: "Pedido",
                column: "canalventa",
                principalSchema: "Ventas",
                principalTable: "CanalVenta",
                principalColumn: "idcanalventa",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedido_CLIENTE_TERCERO_cliTercero_codigo",
                table: "Pedido",
                column: "cliTercero_codigo",
                principalTable: "CLIENTE_TERCERO",
                principalColumn: "cliTercero_codigo",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedido_DIAGNOSTICO_diagnostico_codigo",
                table: "Pedido",
                column: "diagnostico_codigo",
                principalTable: "DIAGNOSTICO",
                principalColumn: "diagnostico_codigo",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedido_EstadoPedido_estadoPedido",
                table: "Pedido",
                column: "estadoPedido",
                principalSchema: "Pedidos",
                principalTable: "EstadoPedido",
                principalColumn: "idestado",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedido_MEDICO_med_codigo",
                table: "Pedido",
                column: "med_codigo",
                principalTable: "MEDICO",
                principalColumn: "med_codigo",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedido_OrigenReceta_origenreceta_codigo",
                table: "Pedido",
                column: "origenreceta_codigo",
                principalTable: "OrigenReceta",
                principalColumn: "origenreceta_codigo",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedido_PACIENTE_cli_codigo",
                table: "Pedido",
                column: "cli_codigo",
                principalTable: "PACIENTE",
                principalColumn: "cli_codigo",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedido_SUCURSAL_suc_codigo",
                table: "Pedido",
                column: "suc_codigo",
                principalTable: "SUCURSAL",
                principalColumn: "suc_codigo",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedido_TipoEntrega_tipopedido_codigo",
                table: "Pedido",
                column: "tipopedido_codigo",
                principalSchema: "Delivery",
                principalTable: "TipoEntrega",
                principalColumn: "idtipoentrega",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedido_TipoFormulacion_idtipoformulacion",
                table: "Pedido",
                column: "idtipoformulacion",
                principalSchema: "Produccion",
                principalTable: "TipoFormulacion",
                principalColumn: "idtipoformulacion",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedido_TIPOPACIENTE_tipopaciente_codigo",
                table: "Pedido",
                column: "tipopaciente_codigo",
                principalTable: "TIPOPACIENTE",
                principalColumn: "tipopaciente_codigo",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedido_TipoPedido_tipopedido_codigo",
                table: "Pedido",
                column: "tipopedido_codigo",
                principalTable: "TipoPedido",
                principalColumn: "tipopedido_codigo",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Devoluciones_Pedido_pedido_codigo",
                table: "Devoluciones");

            migrationBuilder.DropForeignKey(
                name: "FK_Imagen_Pedido_Pedido_pedido_codigo",
                schema: "Pedidos",
                table: "Imagen_Pedido");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedido_CanalVenta_canalventa",
                table: "Pedido");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedido_CLIENTE_TERCERO_cliTercero_codigo",
                table: "Pedido");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedido_DIAGNOSTICO_diagnostico_codigo",
                table: "Pedido");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedido_EstadoPedido_estadoPedido",
                table: "Pedido");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedido_MEDICO_med_codigo",
                table: "Pedido");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedido_OrigenReceta_origenreceta_codigo",
                table: "Pedido");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedido_PACIENTE_cli_codigo",
                table: "Pedido");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedido_SUCURSAL_suc_codigo",
                table: "Pedido");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedido_TipoEntrega_tipopedido_codigo",
                table: "Pedido");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedido_TipoFormulacion_idtipoformulacion",
                table: "Pedido");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedido_TIPOPACIENTE_tipopaciente_codigo",
                table: "Pedido");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedido_TipoPedido_tipopedido_codigo",
                table: "Pedido");

            migrationBuilder.DropTable(
                name: "CanalVenta",
                schema: "Ventas");

            migrationBuilder.DropTable(
                name: "DIAGNOSTICO");

            migrationBuilder.DropTable(
                name: "EstadoPedido",
                schema: "Pedidos");

            migrationBuilder.DropTable(
                name: "OrigenReceta");

            migrationBuilder.DropTable(
                name: "TipoEntrega",
                schema: "Delivery");

            migrationBuilder.DropTable(
                name: "TipoFormulacion",
                schema: "Produccion");

            migrationBuilder.DropTable(
                name: "TIPOPACIENTE");

            migrationBuilder.DropTable(
                name: "TipoPedido");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Pedido",
                table: "Pedido");

            migrationBuilder.DropIndex(
                name: "IX_Pedido_canalventa",
                table: "Pedido");

            migrationBuilder.DropIndex(
                name: "IX_Pedido_cli_codigo",
                table: "Pedido");

            migrationBuilder.DropIndex(
                name: "IX_Pedido_cliTercero_codigo",
                table: "Pedido");

            migrationBuilder.DropIndex(
                name: "IX_Pedido_diagnostico_codigo",
                table: "Pedido");

            migrationBuilder.DropIndex(
                name: "IX_Pedido_estadoPedido",
                table: "Pedido");

            migrationBuilder.DropIndex(
                name: "IX_Pedido_idtipoformulacion",
                table: "Pedido");

            migrationBuilder.DropIndex(
                name: "IX_Pedido_med_codigo",
                table: "Pedido");

            migrationBuilder.DropIndex(
                name: "IX_Pedido_origenreceta_codigo",
                table: "Pedido");

            migrationBuilder.DropIndex(
                name: "IX_Pedido_suc_codigo",
                table: "Pedido");

            migrationBuilder.DropIndex(
                name: "IX_Pedido_tipopaciente_codigo",
                table: "Pedido");

            migrationBuilder.DropIndex(
                name: "IX_Pedido_tipopedido_codigo",
                table: "Pedido");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Devoluciones",
                table: "Devoluciones");

            migrationBuilder.DropIndex(
                name: "IX_Devoluciones_pedido_codigo",
                table: "Devoluciones");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Imagen_Pedido",
                schema: "Pedidos",
                table: "Imagen_Pedido");

            migrationBuilder.DropIndex(
                name: "IX_Imagen_Pedido_pedido_codigo",
                schema: "Pedidos",
                table: "Imagen_Pedido");

            migrationBuilder.DropColumn(
                name: "canalventa",
                table: "Pedido");

            migrationBuilder.DropColumn(
                name: "estado",
                table: "Pedido");

            migrationBuilder.DropColumn(
                name: "fechacreacion",
                table: "Pedido");

            migrationBuilder.DropColumn(
                name: "fechaedicion",
                table: "Pedido");

            migrationBuilder.DropColumn(
                name: "idtipoformulacion",
                table: "Pedido");

            migrationBuilder.DropColumn(
                name: "usuariocrea",
                table: "Pedido");

            migrationBuilder.DropColumn(
                name: "sucursalenvia",
                table: "Devoluciones");

            migrationBuilder.DropColumn(
                name: "sucursalrecibe",
                table: "Devoluciones");

            migrationBuilder.DropColumn(
                name: "fechacreacion",
                table: "DETALLE_PEDIDO");

            migrationBuilder.DropColumn(
                name: "fechaedicion",
                table: "DETALLE_PEDIDO");

            migrationBuilder.DropColumn(
                name: "isfraccion",
                table: "DETALLE_PEDIDO");

            migrationBuilder.DropColumn(
                name: "usuariocrea",
                table: "DETALLE_PEDIDO");

            migrationBuilder.DropColumn(
                name: "usuariomodifica",
                table: "DETALLE_PEDIDO");

            migrationBuilder.RenameTable(
                name: "Pedido",
                newName: "PEDIDO");

            migrationBuilder.RenameTable(
                name: "Devoluciones",
                newName: "DEVOLUCIONES");

            migrationBuilder.RenameTable(
                name: "Imagen_Pedido",
                schema: "Pedidos",
                newName: "IMAGEN_PEDIDO");

            migrationBuilder.RenameColumn(
                name: "ordenproduccion",
                table: "PEDIDO",
                newName: "ordenProduccion");

            migrationBuilder.RenameColumn(
                name: "usuariomodifica",
                table: "PEDIDO",
                newName: "idtipopago");

            migrationBuilder.RenameColumn(
                name: "sucursalfactura",
                table: "PEDIDO",
                newName: "usuariomodificado");

            migrationBuilder.RenameColumn(
                name: "iddificultad",
                table: "DETALLE_PEDIDO",
                newName: "idDificultad");

            migrationBuilder.AlterColumn<int>(
                name: "usuariotransfiere",
                table: "PEDIDO",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "usuarioentrega",
                table: "PEDIDO",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ordenProduccion",
                table: "PEDIDO",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "nroPedidoLocal",
                table: "PEDIDO",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "laboratorio",
                table: "PEDIDO",
                type: "nvarchar(80)",
                maxLength: 80,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "estadoPedido",
                table: "PEDIDO",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddColumn<double>(
                name: "adelanto",
                table: "PEDIDO",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "emp_codigo",
                table: "PEDIDO",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "estadoED",
                table: "PEDIDO",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "med_colegiatura",
                table: "PEDIDO",
                type: "nvarchar(12)",
                maxLength: 12,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "modificado",
                table: "PEDIDO",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "numBoleta",
                table: "PEDIDO",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "saldo",
                table: "PEDIDO",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "total",
                table: "PEDIDO",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "usuarioFormulador",
                table: "PEDIDO",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "usuarioeliminado",
                table: "PEDIDO",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "usuariolaboratorio",
                table: "PEDIDO",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "usuariodevuelve",
                table: "DEVOLUCIONES",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "quimicoacepta",
                table: "DEVOLUCIONES",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "pedido_codigo",
                table: "DEVOLUCIONES",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "motivodevolucion",
                table: "DEVOLUCIONES",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<double>(
                name: "subtotal",
                table: "DETALLE_PEDIDO",
                type: "float",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<double>(
                name: "precio",
                table: "DETALLE_PEDIDO",
                type: "float",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "catalago_codigo",
                table: "DETALLE_PEDIDO",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "eliminado",
                table: "DETALLE_PEDIDO",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<int>(
                name: "pedido_codigo",
                table: "IMAGEN_PEDIDO",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PEDIDO",
                table: "PEDIDO",
                column: "pedido_codigo");

            migrationBuilder.AddPrimaryKey(
                name: "PK_DEVOLUCIONES",
                table: "DEVOLUCIONES",
                column: "dev_codigo");

            migrationBuilder.AddPrimaryKey(
                name: "PK_IMAGEN_PEDIDO",
                table: "IMAGEN_PEDIDO",
                column: "imagen_codigo");
        }
    }
}
