(function () {
    'use strict';
    angular.module('mytodoApp').controller('CierreCajaCtrl', CierreCajaCtrl);
    CierreCajaCtrl.$inject = ['$scope', '$http', 'cierreCajaService', '$location', 'ValidationService', 'localStorageService', 'utilServices', '$window', 'loginService', 'appConstant', 'appGenericConstant', 'validar',];
    function CierreCajaCtrl($scope, $http, cierreCajaService, $location, ValidationService, localStorageService, utilServices, $window, loginService, appConstant, appGenericConstant, validar) {

        var gestionCaja = this;
        gestionCaja.format = 'dd/MM/yyyy h:mm:ss a';
        gestionCaja.cajas = [];
        gestionCaja.cajeros = [];
        gestionCaja.cajerosSelect = [];
        gestionCaja.conceptoEgresoList = [];
        gestionCaja.ClassTab;
        gestionCaja.numeroClass = 0;
        gestionCaja.cajaEntity = cierreCajaService.entidad;
        gestionCaja.cajaEntityAuxiliar = cierreCajaService.entidadAuxiliar;
        gestionCaja.config = {globalTimeToLive: 3000, disableCountDown: true};
        gestionCaja.cola = [];
        gestionCaja.options = appConstant.FILTRO_TABLAS;
        gestionCaja.checkChequesPrueba = function (item) {
            alert(item.seleccionado);
        };
        gestionCaja.listaOtros = [
            {
                id: 1,
                nombre: "Forma 1",
                valor: 1000,
                seleccionado: false
            },
            {
                id: 2,
                nombre: "Forma 2",
                valor: 2000,
                seleccionado: false
            },
            {
                id: 3,
                nombre: "Forma 3",
                valor: 3000,
                seleccionado: false
            }

        ];
        gestionCaja.listaTarjetaCreditos = [];
        gestionCaja.listaTarjetaDebito = [];
        gestionCaja.listaSupergiros= [];
        gestionCaja.formasPago = [];
        gestionCaja.listaCheques = [];
        gestionCaja.denominaciones = [];
        gestionCaja.cargarDenominaciones = function (item) {
            cierreCajaService.configuracionCaja(item).then(function (data) {
                gestionCaja.denominaciones = data.cajaDenominacionList;
            });
        };


        if (localStorageService.get('ciereCaja') !== null) {
            gestionCaja.cargarDenominaciones(localStorageService.get('ciereCaja').id);
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            cierreCajaService.consultarInfoCaja(localStorageService.get('ciereCaja').id).then(function (data) {

                gestionCaja.conceptoEgresoList = [];
                gestionCaja.CierreCaja = data;
                gestionCaja.CierreCaja.id = data.cajaDTO.id;
                gestionCaja.CierreCaja.nombre = data.cajaDTO.nombre;
                gestionCaja.CierreCaja.codigo = data.cajaDTO.codigo;
                gestionCaja.CierreCaja.ubicacion = data.cajaDTO.ubicacion;
                gestionCaja.CierreCaja.estado = data.cajaDTO.estado;
                gestionCaja.CierreCaja.fechaApertura = data.fechaApertura;

                for (i = 0; i < data.egresoCajaDTOList.length; i++) {
                    gestionCaja.egreso = {};
                    gestionCaja.egreso.nombreConcepto = data.egresoCajaDTOList[i].nombreConcepto,
                            gestionCaja.egreso.monto = data.egresoCajaDTOList[i].monto,
                            gestionCaja.egreso.fechaEgreso = onFormattedDate(data.egresoCajaDTOList[i].fechaEgreso),
                            gestionCaja.egreso.descripcion = data.egresoCajaDTOList[i].descripcion;
                    gestionCaja.conceptoEgresoList.push(gestionCaja.egreso);
                }


                for (i = 0; i < data.formaPagoList.length; i++) {
                    gestionCaja.aux = {};
                    gestionCaja.aux.idFormaPago = data.formaPagoList[i].idFormaPago;
                    gestionCaja.aux.nombre = data.formaPagoList[i].nombreFormaPago;
                    gestionCaja.aux.nombreFormaPago = data.formaPagoList[i].nombreFormaPago;
                    gestionCaja.aux.totalValorSistema = gestionCaja.aux.idFormaPago === 115 ? (gestionCaja.conceptoEgresoList.length !== 0 ? data.flujoActual.actual : data.formaPagoList[i].valorPagado) : data.formaPagoList[i].valorPagado;
                    gestionCaja.aux.totalValorReal = data.formaPagoList[i].totalValorReal;
                    gestionCaja.aux.diferencia = data.formaPagoList[i].diferencia;
                    gestionCaja.formasPago.push(gestionCaja.aux);
                }

                var i;
                for (i = 0; i < gestionCaja.formasPago.length; i++) {
                    gestionCaja.totalFormasPago = gestionCaja.totalFormasPago + gestionCaja.formasPago[i].totalValorSistema;
                }

                for (i = 0; i < data.debitoList.length; i++) {
                    gestionCaja.auxDebito = {};
                    gestionCaja.auxDebito.id = data.debitoList[i].id;
                    gestionCaja.auxDebito.voucher = data.debitoList[i].voucher;
                    gestionCaja.auxDebito.valorPagado = data.debitoList[i].valorPagado;
                    gestionCaja.auxDebito.seleccionado = data.debitoList[i].seleccionado;
                    gestionCaja.listaTarjetaDebito.push(gestionCaja.auxDebito);
                }

                for (i = 0; i < data.creditoList.length; i++) {
                    gestionCaja.auxCredito = {};
                    gestionCaja.auxCredito.id = data.creditoList[i].id;
                    gestionCaja.auxCredito.voucher = data.creditoList[i].voucher;
                    gestionCaja.auxCredito.valorPagado = data.creditoList[i].valorPagado;
                    gestionCaja.auxCredito.seleccionado = data.creditoList[i].seleccionado;
                    gestionCaja.listaTarjetaCreditos.push(gestionCaja.auxCredito);
                }

                for (i = 0; i < data.chequeList.length; i++) {
                    gestionCaja.auxCheque = {};
                    gestionCaja.auxCheque.id = data.chequeList[i].id;
                    gestionCaja.auxCheque.banco = data.chequeList[i].banco;
                    gestionCaja.auxCheque.voucher = data.chequeList[i].voucher;
                    gestionCaja.auxCheque.valorPagado = data.chequeList[i].valorPagado;
                    gestionCaja.auxCheque.seleccionado = data.chequeList[i].seleccionado;
                    gestionCaja.listaCheques.push(gestionCaja.auxCheque);
                }
                for (i = 0; i < data.supergirosList.length; i++) {
                    gestionCaja.auxSupergiros = {};
                    gestionCaja.auxSupergiros.id = data.supergirosList[i].id;
                    gestionCaja.auxSupergiros.voucher=data.supergirosList[i].voucher
                    gestionCaja.auxSupergiros.valorPagado = data.supergirosList[i].valorPagado;
                    gestionCaja.auxSupergiros.seleccionado = data.supergirosList[i].seleccionado;
                    gestionCaja.listaSupergiros.push(gestionCaja.auxSupergiros);
                }


                gestionCaja.calcularTotalDiferencia();
                gestionCaja.calcularTotalEfectivo();
                gestionCaja.calcularTotalCheques();
                gestionCaja.calcularTotalSuperGiros();
                gestionCaja.calcularTotalTarjetas();
                gestionCaja.calcularTotalTarjetasDebito();
                gestionCaja.onObtenerFormaPago();
                appConstant.CERRAR_SWAL();

            });
        }

        function onFormattedDate(date) {
            var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [day, month, year].join('/');
        }

        gestionCaja.onObtenerFormaPago = function () {
            var categoria = 'FORMA_PAGO';
            utilServices.buscarListaValorByCategoria(categoria, 'financiero').then(function (data) {
                var i;
                for (i = 0; i < data.length; i++) {
                    if (data[i].valor === "EFECTIVO" && data[i].estado === "ACTIVO") {
                        gestionCaja.btnEfectivo = true;
                        gestionCaja.numeroClass = gestionCaja.numeroClass + 1;
                    }

                    if (data[i].valor === "TARJETA DEBITO" && data[i].estado === "ACTIVO") {
                        gestionCaja.btnTarjeta = true;
                        gestionCaja.numeroClass = gestionCaja.numeroClass + 1;

                    }
                    if (data[i].valor === "TARJETA CREDITO" && data[i].estado === "ACTIVO") {
                        gestionCaja.btnTarjeta = true;
                        gestionCaja.numeroClass = gestionCaja.numeroClass + 1;

                    }
                    if (data[i].valor === "CHEQUE" && data[i].estado === "ACTIVO") {
                        gestionCaja.btnCheque = true;
                        gestionCaja.numeroClass = gestionCaja.numeroClass + 1;
                    }
                    if (data[i].valor === "SUPER GIROS" && data[i].estado === "ACTIVO") {
                        gestionCaja.btnSupergiros = true;
                        gestionCaja.numeroClass = gestionCaja.numeroClass + 1;
                    }
                }

                if (gestionCaja.numeroClass === 1) {
                    gestionCaja.ClassTab = "col-sm-12";
                } else if (gestionCaja.numeroClass === 2) {
                    gestionCaja.ClassTab = "col-sm-6";
                } else if (gestionCaja.numeroClass === 3) {
                    gestionCaja.ClassTab = "col-sm-4";
                } else {
                    gestionCaja.ClassTab = "col-sm-3";
                }

            });
        };

        $(document).ready(function () {
            $("#errorArqueo").css("display", 'none');
            $("#tab-example-1").css("display", 'none');
            $("#tab-example-2").css("display", 'none');
            $("#tab-example-3").css("display", 'none');
            $("#tab-example-4").css("display", 'none');
            $("#tab-example-5").css("display", 'none');
            $("#tab-example-6").css("display", 'none');
            gestionCaja.disabledInput = false;
            gestionCaja.disabledInputTable = true;
            gestionCaja.totalArqueoEfectivo = 0;
            gestionCaja.totalArqueoSuperGiros= 0;
            gestionCaja.totalArqueoCheque = 0;
            gestionCaja.totalFormasPago = 0;
            gestionCaja.totalFormasPagoValorReal = 0;
            gestionCaja.totalFormasPagoDiferencia = 0;
            gestionCaja.totalArqueoTarjetaCredito = 0;
            gestionCaja.totalArqueoTarjetaDebito = 0;
            gestionCaja.totalArqueoOtro = 0;
            gestionCaja.totalFormasPagoDiferencia = 0;
            $("#inputTotalFormasPago,#inputTotalFormasPagoValorReal,#inputTotalFormasPagoDiferencia").prop("disabled", true);
            gestionCaja.onObtenerFormaPago();

        });
        gestionCaja.mostrarCampo = function (item) {

            $("#inputHid" + item.idDenominacion).prop("disabled", false);
            $('#inputHid' + item.idDenominacion).focus();
            $("#btnComd" + item.idDenominacion).hide();
            $("#btnCheck" + item.idDenominacion).show();
            item.cantidad = $("#inputHid" + item.idDenominacion).val();
            item.cantidad = item.cantidad === "0" ? "" : item.cantidad;
            $("#inputHid" + item.idDenominacion).val(item.cantidad);
        };
        gestionCaja.ocultarCampo = function (item) {
            $("#inputHid" + item).prop("disabled", true);
            $("#btnComd" + item).show();
            $("#btnCheck" + item).hide();
        };
        gestionCaja.focusCampo = function (item) {

            $("#inputHid" + item.idDenominacion).on("input", function () {
                var regexp = /[^0-9]/g;
                if ($(this).val().match(regexp)) {
                    $(this).val($(this).val().replace(regexp, ''));
                    return;
                }
            });
            $('#inputHid' + item.idDenominacion).focus(function () {
            });
            $('#inputHid' + item.idDenominacion).blur(function () {
                $("#inputHid" + item.idDenominacion).prop("disabled", true);
                $("#btnComd" + item.idDenominacion).show();
                $("#btnCheck" + item.idDenominacion).hide();
                if (item.cantidad === "") {
                    $("#inputHid" + item.idDenominacion).val(0);
                }

            });
        };
        gestionCaja.checkAllCheques = function (idCheckAll, classCheckHijos) {
            if ($("#" + idCheckAll).is(':checked')) {
                gestionCaja.totalArqueoCheque = 0;
                $("." + classCheckHijos).prop('checked', true);
                var i;
                for (i = 0; i < gestionCaja.listaCheques.length; i++) {
                    gestionCaja.totalArqueoCheque = gestionCaja.totalArqueoCheque + gestionCaja.listaCheques[i].valorPagado;
                    gestionCaja.listaCheques[i].seleccionado = true;
                }

            } else {
                $("." + classCheckHijos).prop('checked', false);
                gestionCaja.totalArqueoCheque = 0;
                for (i = 0; i < gestionCaja.listaCheques.length; i++) {
                    gestionCaja.listaCheques[i].seleccionado = false;
                }
            }
            gestionCaja.calcularTotalCheques();
            gestionCaja.calcularTotalReal();
            gestionCaja.calcularTotalDiferencia();
        };
        gestionCaja.checkCheques = function (item, idCheckAll, classCheckHijos, idCheck) {
            $("." + classCheckHijos).change(function () {
                $("#" + idCheckAll).prop('checked', false);
            });
            if ($("#chekValor" + item.id).is(':checked')) {
                gestionCaja.totalArqueoCheque = gestionCaja.totalArqueoCheque + item.valorPagado;

            } else {
                gestionCaja.totalArqueoCheque = gestionCaja.totalArqueoCheque - item.valorPagado;

            }
            gestionCaja.calcularTotalCheques();
            gestionCaja.calcularTotalReal();
            gestionCaja.calcularTotalDiferencia();
        };
        gestionCaja.checkAllTarjetas = function (idCheckAll, classCheckHijos) {
            if ($("#" + idCheckAll).is(':checked')) {
                gestionCaja.totalArqueoTarjetaCredito = 0;
                $("." + classCheckHijos).prop('checked', true);
                var i;
                for (i = 0; i < gestionCaja.listaTarjetaCreditos.length; i++) {
                    gestionCaja.totalArqueoTarjetaCredito = gestionCaja.totalArqueoTarjetaCredito + gestionCaja.listaTarjetaCreditos[i].valorPagado;
                    gestionCaja.listaTarjetaCreditos[i].seleccionado = true;
                }

            } else {
                $("." + classCheckHijos).prop('checked', false);
                gestionCaja.totalArqueoTarjetaCredito = 0;
                for (i = 0; i < gestionCaja.listaTarjetaCreditos.length; i++) {
                    gestionCaja.listaTarjetaCreditos[i].seleccionado = false;
                }
            }
            gestionCaja.calcularTotalTarjetas();
            gestionCaja.calcularTotalReal();
            gestionCaja.calcularTotalDiferencia();
        };
        gestionCaja.checkTarjetas = function (item, idCheckAll, classCheckHijos, idCheck) {
            $("." + classCheckHijos).change(function () {
                $("#" + idCheckAll).prop('checked', false);
            });
            if ($("#chekValorTarjetaCredito" + item.id).is(':checked')) {
                gestionCaja.totalArqueoTarjetaCredito = gestionCaja.totalArqueoTarjetaCredito + item.valorPagado;
                item.seleccionado = true;
            } else {
                gestionCaja.totalArqueoTarjetaCredito = gestionCaja.totalArqueoTarjetaCredito - item.valorPagado;
                item.seleccionado = false;
            }
            gestionCaja.calcularTotalTarjetas();
            gestionCaja.calcularTotalReal();
            gestionCaja.calcularTotalDiferencia();
        };
        gestionCaja.checkAllTarjetasDebito = function (idCheckAll, classCheckHijos) {
            if ($("#" + idCheckAll).is(':checked')) {
                gestionCaja.totalArqueoTarjetaDebito = 0;
                $("." + classCheckHijos).prop('checked', true);
                var i;
                for (i = 0; i < gestionCaja.listaTarjetaDebito.length; i++) {
                    gestionCaja.totalArqueoTarjetaDebito = gestionCaja.totalArqueoTarjetaDebito + gestionCaja.listaTarjetaDebito[i].valorPagado;
                    gestionCaja.listaTarjetaDebito[i].seleccionado = true;
                }

            } else {
                $("." + classCheckHijos).prop('checked', false);
                gestionCaja.totalArqueoTarjetaDebito = 0;
                for (i = 0; i < gestionCaja.listaTarjetaDebito.length; i++) {
                    gestionCaja.listaTarjetaDebito[i].seleccionado = false;
                }
            }
            gestionCaja.calcularTotalTarjetasDebito();
            gestionCaja.calcularTotalReal();
            gestionCaja.calcularTotalDiferencia();
        };
        gestionCaja.checkTarjetasDebito = function (item, idCheckAll, classCheckHijos, idCheck) {
            $("." + classCheckHijos).change(function () {
                $("#" + idCheckAll).prop('checked', false);
            });
            if ($("#chekValorTarjetaDebito" + item.id).is(':checked')) {
                gestionCaja.totalArqueoTarjetaDebito = gestionCaja.totalArqueoTarjetaDebito + item.valorPagado;
                item.seleccionado = true;
            } else {
                gestionCaja.totalArqueoTarjetaDebito = gestionCaja.totalArqueoTarjetaDebito - item.valorPagado;
                item.seleccionado = false;
            }
            gestionCaja.calcularTotalTarjetasDebito();
            gestionCaja.calcularTotalReal();
            gestionCaja.calcularTotalDiferencia();
        };
        gestionCaja.checkAllSupergiros = function (idCheckAll, classCheckHijos) {
            if ($("#" + idCheckAll).is(':checked')) {
                gestionCaja.totalArqueoSuperGiros = 0;
                $("." + classCheckHijos).prop('checked', true);
                var i;
                for (i = 0; i < gestionCaja.listaSupergiros.length; i++) {
                    gestionCaja.totalArqueoSuperGiros = gestionCaja.totalArqueoSuperGiros + gestionCaja.listaSupergiros[i].valorPagado;
                    gestionCaja.listaSupergiros[i].seleccionado = true;
                }
            } else {
                $("." + classCheckHijos).prop('checked', false);
                gestionCaja.totalArqueoSuperGiros = 0;
                for (i = 0; i < gestionCaja.listaSupergiros.length; i++) {
                    gestionCaja.listaSupergiros[i].seleccionado = false;
                }
            }
            gestionCaja.calcularTotalSuperGiros();
            gestionCaja.calcularTotalReal();
            gestionCaja.calcularTotalDiferencia();
        };
        gestionCaja.checkSupergiros = function (item, idCheckAll, classCheckHijos, idCheck) {
            $("." + classCheckHijos).change(function () {
                $("#" + idCheckAll).prop('checked', false);
            });
            if ($("#chekValorSuperGiros" + item.id).is(':checked')) {
                gestionCaja.totalArqueoSuperGiros = gestionCaja.totalArqueoSuperGiros + item.valorPagado;

            } else {
                gestionCaja.totalArqueoSuperGiros = gestionCaja.totalArqueoSuperGiros - item.valorPagado;

            }
            gestionCaja.calcularTotalSuperGiros();
            gestionCaja.calcularTotalReal();
            gestionCaja.calcularTotalDiferencia();
        };
        gestionCaja.checkAllOtros = function (idCheckAll, classCheckHijos) {
            if ($("#" + idCheckAll).is(':checked')) {
                gestionCaja.totalArqueoOtro = 0;
                $("." + classCheckHijos).prop('checked', true);
                var i;
                for (i = 0; i < gestionCaja.listaOtros.length; i++) {
                    gestionCaja.totalArqueoOtro = gestionCaja.totalArqueoOtro + gestionCaja.listaOtros[i].valor;
                    gestionCaja.listaOtros[i].seleccionado = true;
                }

            } else {
                $("." + classCheckHijos).prop('checked', false);
                gestionCaja.totalArqueoOtro = 0;
                for (i = 0; i < gestionCaja.listaOtros.length; i++) {
                    gestionCaja.listaOtros[i].seleccionado = false;
                }
            }
            gestionCaja.calcularTotalOtros();
            gestionCaja.calcularTotalReal();
            gestionCaja.calcularTotalDiferencia();
        };
        gestionCaja.checkOtros = function (item, idCheckAll, classCheckHijos, idCheck) {
            $("." + classCheckHijos).change(function () {
                $("#" + idCheckAll).prop('checked', false);
            });
            if ($("#chekValorOtro" + item.id).is(':checked')) {
                gestionCaja.totalArqueoOtro = gestionCaja.totalArqueoOtro + item.valor;
                item.seleccionado = true;
            } else {
                gestionCaja.totalArqueoOtro = gestionCaja.totalArqueoOtro - item.valor;
                item.seleccionado = false;
            }
            gestionCaja.calcularTotalOtros();
            gestionCaja.calcularTotalReal();
            gestionCaja.calcularTotalDiferencia();
        };
        gestionCaja.changeSubtotal = function (item) {
            item.valor = item.nombreDenominacion * $("#inputHid" + item.idDenominacion).val();
            gestionCaja.calcularTotalEfectivo();
            gestionCaja.calcularTotalReal();
            gestionCaja.calcularTotalDiferencia();
        };
        gestionCaja.stylesDiferencias = function (id, diferencia) {
            $("#inputValorTotalPorFormasPagoDiferencia" + id)
                    .css({
                        "border-color": diferencia < 0 ? 'red' : 'green',
                        "color": diferencia < 0 ? 'red' : 'green'
                    });
        };

        gestionCaja.calcularTotalEfectivo = function () {
            var i;
            gestionCaja.totalArqueoEfectivo = 0;
            for (i = 0; i < gestionCaja.denominaciones.length; i++) {
                gestionCaja.totalArqueoEfectivo = parseInt(gestionCaja.totalArqueoEfectivo) + parseInt(gestionCaja.denominaciones[i].valor);
            }

            for (i = 0; i < gestionCaja.formasPago.length; i++) {
                if (gestionCaja.formasPago[i].idFormaPago === 115) {
                    gestionCaja.totalEfectivo = gestionCaja.formasPago[i].totalValorSistema;
                    gestionCaja.formasPago[i].totalValorReal = gestionCaja.totalArqueoEfectivo;
                    gestionCaja.formasPago[i].diferencia = -gestionCaja.totalEfectivo + gestionCaja.formasPago[i].totalValorReal;
                    gestionCaja.stylesDiferencias(gestionCaja.formasPago[i].id, gestionCaja.formasPago[i].diferencia);
                }
            }
        };

        gestionCaja.calcularTotalCheques = function () {
            var i;
            for (i = 0; i < gestionCaja.formasPago.length; i++) {
                if (gestionCaja.formasPago[i].idFormaPago === 116) {
                    gestionCaja.totalCheque = gestionCaja.formasPago[i].totalValorSistema;
                    gestionCaja.formasPago[i].totalValorReal = gestionCaja.totalArqueoCheque;
                    gestionCaja.formasPago[i].diferencia = -gestionCaja.totalCheque + gestionCaja.formasPago[i].totalValorReal;
                    gestionCaja.stylesDiferencias(gestionCaja.formasPago[i].id, gestionCaja.formasPago[i].diferencia);
                }
            }

        };

        gestionCaja.calcularTotalTarjetas = function () {
            var i;
            for (i = 0; i < gestionCaja.formasPago.length; i++) {
                if (gestionCaja.formasPago[i].idFormaPago === 204) {
                    gestionCaja.totalTarjeta = gestionCaja.formasPago[i].totalValorSistema;
                    gestionCaja.formasPago[i].totalValorReal = gestionCaja.totalArqueoTarjetaCredito;
                    gestionCaja.formasPago[i].diferencia = -gestionCaja.totalTarjeta + gestionCaja.formasPago[i].totalValorReal;
                    gestionCaja.stylesDiferencias(gestionCaja.formasPago[i].id, gestionCaja.formasPago[i].diferencia);
                }
            }

        };
        gestionCaja.calcularTotalTarjetasDebito = function () {
            var i;
            for (i = 0; i < gestionCaja.formasPago.length; i++) {
                if (gestionCaja.formasPago[i].idFormaPago === 118) {
                    gestionCaja.totalTarjetaDebito = gestionCaja.formasPago[i].totalValorSistema;
                    gestionCaja.formasPago[i].totalValorReal = gestionCaja.totalArqueoTarjetaDebito;
                    gestionCaja.formasPago[i].diferencia = -gestionCaja.totalTarjetaDebito + gestionCaja.formasPago[i].totalValorReal;
                    gestionCaja.stylesDiferencias(gestionCaja.formasPago[i].id, gestionCaja.formasPago[i].diferencia);
                }
            }

        };
        gestionCaja.calcularTotalSuperGiros = function () {
            var i;
            for (i = 0; i < gestionCaja.formasPago.length; i++) {
                if (gestionCaja.formasPago[i].idFormaPago === 288) {
                    gestionCaja.totalSuperGiros = gestionCaja.formasPago[i].totalValorSistema;
                    gestionCaja.formasPago[i].totalValorReal = gestionCaja.totalArqueoSuperGiros;
                    gestionCaja.formasPago[i].diferencia = -gestionCaja.totalSuperGiros + gestionCaja.formasPago[i].totalValorReal;
                    gestionCaja.stylesDiferencias(gestionCaja.formasPago[i].id, gestionCaja.formasPago[i].diferencia);
                }
            }

        };


        gestionCaja.calcularTotalOtros = function () {
            var i;
            for (i = 0; i < gestionCaja.formasPago.length; i++) {
                if (gestionCaja.formasPago[i].nombre === "Otros") {
                    gestionCaja.totalOtros = gestionCaja.formasPago[i].totalValorSistema;
                    gestionCaja.formasPago[i].totalValorReal = gestionCaja.totalArqueoOtro;
                    gestionCaja.formasPago[i].diferencia = -gestionCaja.totalOtros + gestionCaja.formasPago[i].totalValorReal;
                    gestionCaja.stylesDiferencias(gestionCaja.formasPago[i].id, gestionCaja.formasPago[i].diferencia);
                    break;
                }
            }

        };

        gestionCaja.calcularTotalReal = function () {
            gestionCaja.totalFormasPagoValorReal = 0;
            var i;
            for (i = 0; i < gestionCaja.formasPago.length; i++) {
                gestionCaja.totalFormasPagoValorReal = gestionCaja.totalFormasPagoValorReal + gestionCaja.formasPago[i].totalValorReal;
            }
        };

        gestionCaja.calcularTotalDiferencia = function () {
            gestionCaja.totalFormasPagoDiferencia = 0;
            gestionCaja.totalFormasPagoDiferencia = -gestionCaja.totalFormasPago + gestionCaja.totalFormasPagoValorReal;
            $("#inputTotalFormasPagoDiferencia")
                    .css({
                        "border-color": gestionCaja.totalFormasPagoDiferencia < 0 ? 'red' : 'green',
                        "color": gestionCaja.totalFormasPagoDiferencia < 0 ? 'red' : 'green'
                    });
        };

        gestionCaja.onSubmitForm = function () {
            var i;
            for (i = 0; i < gestionCaja.formasPago.length; i++) {
                gestionCaja.ValidarDiferencia = gestionCaja.formasPago[i].diferencia < 0;
                if (gestionCaja.ValidarDiferencia) {
                    break;
                }
            }
            if (gestionCaja.totalFormasPagoDiferencia < 0 || gestionCaja.ValidarDiferencia) {
                swal({
                    title: appGenericConstant.CAJA_DESCUADRADA,
                    text: appGenericConstant.DESEA_CONTINUAR_PROCESO,
                    type: appGenericConstant.WARNING,
                    showCancelButton: true,
                    confirmButtonText: appGenericConstant.ACEPTAR,
                    cancelButtonText: appGenericConstant.CANCELAR,
                    closeOnConfirm: true,
                    closeOnCancel: true,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                }).then(function (isConfirm) {
                    if (isConfirm) {
                        $('#myModal').modal({backdrop: 'static', keyboard: false});
                        $("#myModal").modal("show");
                        gestionCaja.ModalUsuario();
                    } else {
                    }
                });
            } else {
                $('#myModal').modal({backdrop: 'static', keyboard: false});
                $("#myModal").modal("show");
                gestionCaja.ModalUsuario();
            }


        };
        gestionCaja.ModalUsuario = function () {
            $("#usuario").val("");
            $("#password").val("");
            new ValidationService().resetForm($scope.formConfirmarClave);
            gestionCaja.aperturaCierreCaja = {
                usuario: "",
                password: ""
            };
            gestionCaja.aperturaCierreCaja.usuario = "";
            gestionCaja.aperturaCierreCaja.password = "";
        };

        gestionCaja.confirmarSegundaClave = function () {
            if (new ValidationService().checkFormValidity($scope.formConfirmarClave)) {
                var dato = localStorageService.get("autorizacion").objectResponse;
                dato.userDto.username = gestionCaja.aperturaCierreCaja.usuario;
                dato.userDto.passwordsupervisor = btoa(validar.validarPassw(gestionCaja.aperturaCierreCaja.password));
                var acceso = {
                    token: localStorageService.get("autorizacion").token,
                    usuarioDto: dato,
                    modulo: null
                };
                appConstant.MSG_CONFIRMACION();
                appConstant.CARGANDO();
                loginService.accesoAutorzacionCaja(acceso).then(function (data) {
                    var usuarioSupervisor = data.objectResponse;
                    if (data.tipo !== 200) {
                        swal({
                            title: appGenericConstant.USUARIO_CLAVE_INVALIDA,
                            type: appGenericConstant.WARNING,
                            confirmButtonText: appGenericConstant.ACEPTAR,
                            closeOnConfirm: true
                        });
                        return;
                    }
                    var user = {
                        usuario: gestionCaja.aperturaCierreCaja.usuario,
                        pin: gestionCaja.aperturaCierreCaja.password,
                        idSupervisorCierre: usuarioSupervisor.idUsuario
                    };
                    gestionCaja.cierreCajaArqueo = {
                        idCaja: gestionCaja.CierreCaja.id,
                        idUsuario: gestionCaja.CierreCaja.idUsuario,
                        fechaCierre: toDate($('#fechaCierre').text()),
                        descripcion: gestionCaja.CierreCaja.descripcion,
                        resumenFormaPagoList: gestionCaja.formasPago,
                        supergirosList: gestionCaja.listaSupergiros,
                        chequeList: gestionCaja.listaCheques,
                        creditoList: gestionCaja.listaTarjetaCreditos,
                        debitoList: gestionCaja.listaTarjetaDebito,
                        cajaDenominacionList: gestionCaja.denominaciones,
                        totalValorRealCierre: gestionCaja.totalFormasPagoValorReal,
                        totalValorSistemaCierre: gestionCaja.totalFormasPago,
                        totalValorDiferenciaCierre: gestionCaja.totalFormasPagoDiferencia,
                        totalArqueoEfectivo: gestionCaja.totalArqueoEfectivo,
                        totalArqueoSuperGiros: gestionCaja.totalArqueoSuperGiros,
                        totalArqueoCheque: gestionCaja.totalArqueoCheque,
                        totalArqueoTarjetaCredito: gestionCaja.totalArqueoTarjetaCredito,
                        totalArqueoTarjetaDebito: gestionCaja.totalArqueoTarjetaDebito,
                        fechaApertura: gestionCaja.CierreCaja.fechaApertura,
                        usuarioAutoriza: user,
                        idSupervisorCierre: usuarioSupervisor.idUsuario,
                        idSupervisorApertura: gestionCaja.CierreCaja.idSupervisorApertura,
                        flujoActual: gestionCaja.CierreCaja.flujoActual
                    };
                    cierreCajaService.guardarCierre(gestionCaja.cierreCajaArqueo).then(function (data) {
                        if (data.tipo === 200) {
                            $("#myModal").hide();
                            swal({
                                title: appGenericConstant.ESTADO_CAJA_CERRADA,
                                type: appGenericConstant.SUCCESS,
                                showCancelButton: true,
                                confirmButtonText: appGenericConstant.ACEPTAR,
                                cancelButtonText: appGenericConstant.IMPRIMIR,
                                allowOutsideClick: false,
                                allowEscapeKey: false
                            }).then(function () {
                                $location.path('/apertura-cierre-caja');
                                $("#myModal").hide();
                            }, function (dismiss) {
                                if (dismiss === 'cancel') {
                                    $location.path('/apertura-cierre-caja');
                                    var objReportCierreCaja = {
                                        CierreCaja: data.objectResponse
                                    };
                                    //gestionCaja.onGenerarReporte(data.objectResponse);
                                    onGenerarReporteDirecto(objReportCierreCaja, 5)
                                }
                            });
                        } else if (data.tipo === 500) {
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ERROR();
                        } else if (data.tipo === 409) {
                            swal({
                                title: appGenericConstant.USUARIO_CLAVE_INVALIDA,
                                type: appGenericConstant.WARNING,
                                confirmButtonText: appGenericConstant.ACEPTAR
                            });
                        }
                    });
                }).catch(function (e) {
                    swal({
                        title: appGenericConstant.USUARIO_CONTRASENA_INVALIDA,
                        type: appGenericConstant.WARNING,
                        confirmButtonText: appGenericConstant.ACEPTAR
                    });
                    return;
                });
            }
        };
        gestionCaja.cierreCaja = function () {
            $("#myModal").modal("hide");
        };
        gestionCaja.onCloseModal = function () {
            $("#myModal").modal("hide");
        };
        window.onhashchange = function () {
            $("body").removeClass("modal-open");
            $("div").removeClass("modal-backdrop fade in");
            swal.close();
            $("#myModal").modal("hide");
            localStorageService.remove('ciereCaja');

        };
        gestionCaja.gestionCajaColocarStyles = function () {
            var i;
            for (i = 0; i < gestionCaja.formasPago.length; i++) {
                gestionCaja.stylesDiferencias(gestionCaja.formasPago[i].id, gestionCaja.formasPago[i].diferencia);
                $("#inputValorTotalPorFormasPago" + gestionCaja.formasPago[i].id
                        + ",#inputValorTotalPorFormasPagoValorReal" + gestionCaja.formasPago[i].id
                        + ",#inputValorTotalPorFormasPagoDiferencia" + gestionCaja.formasPago[i].id)
                        .prop("disabled", true);
            }
        };
        gestionCaja.ChangeTabs = function (idTab) {
            $("#tab-example-1").css("display", idTab === 1 ? 'initial' : 'none');
            $("#tab-example-2").css("display", idTab === 2 ? 'initial' : 'none');
            $("#tab-example-3").css("display", idTab === 3 ? 'initial' : 'none');
            $("#tab-example-4").css("display", idTab === 4 ? 'initial' : 'none');
            $("#tab-example-5").css("display", idTab === 5 ? 'initial' : 'none');
            $("#tab-example-6").css("display", idTab === 6 ? 'initial' : 'none');
        };
        $(window).bind("load", function () {
            $(function () {
                $('#btnVolver').click();
            });
            window.location = '#apertura-cierre-caja';
            localStorageService.remove('ciereCaja');

        });

        function toDate(dateStr) {
            var str = [];
            var fecha = dateStr.trim().toString();
            str = fecha.split(" ");
            var parts = [];
            if (str[0].match('/')) {
                parts = str[0].split('/');
            } else {
                parts = str[0].split('-');
            }
            var hora = [];
            if (str[1].match(':')) {
                hora = str[1].split(':');
            }
            return new Date(parts[2], parts[1] - 1, parts[0], hora[0], hora[1], hora[2]);
        };

        function onGenerarReporteDirecto(json, opcion) {
            appConstant.MSG_REPORTE();
            appConstant.CARGANDO();

            var jsonString = JSON.stringify(json);
            jsonString = opcion + "" + jsonString;
            var urlRequest = '/api/financiero/report/crearReportD/';

            $http.post(urlRequest, jsonString, {
                transformRequest: angular.identity,
                headers: {
                    Authorization: localStorageService.get('autorizacion').token,
                    Campus: localStorageService.get('autorizacion').objectResponse.idUniversidad
                },
                responseType: 'arraybuffer'
            }).success(function (data) {

                var file = new Blob([data], {
                    type: 'application/pdf'
                });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                appConstant.CERRAR_SWAL();

            }).error(function () {
                appConstant.MSG_GROWL_ERROR("Error de conexión: No fue posible conectarse con el servidor");
                appConstant.CERRAR_SWAL();
            });
        };

        gestionCaja.calcularTotalDiferencia();
        gestionCaja.calcularTotalSuperGiros();
        gestionCaja.calcularTotalCheques();
        gestionCaja.calcularTotalEfectivo();
        gestionCaja.calcularTotalOtros();
        gestionCaja.calcularTotalTarjetasDebito();
        gestionCaja.calcularTotalTarjetas();
    }
})();


