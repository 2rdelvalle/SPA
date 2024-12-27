(function () {
    'use strict';
    angular.module('mytodoApp').controller('registrarPagoCtrl', registrarPagoCtrl);

    registrarPagoCtrl.$inject = ['$scope', 'historialLiquidacionServices', 'registrarPagoServices', 'growl', 'ValidationService', 'localStorageService', 'utilServices', '$timeout', '$http', '$window', 'appConstant', 'appGenericConstant'];
    function registrarPagoCtrl($scope, historialLiquidacionServices, registrarPagoServices, growl, ValidationService, localStorageService, utilServices, $timeout, $http, $window, appConstant, appGenericConstant) {
        var gestionRegistroPago = this;
        gestionRegistroPago.registrarPago = registrarPagoServices.registroPago;
        gestionRegistroPago.registrarPagoAuxiliar = registrarPagoServices.registroPagoAuxiliar;
        gestionRegistroPago.totalConceptos = 0;
        gestionRegistroPago.registrarPago.fechaActual = onFormattedDate(new Date()) + ' ' + onFormattedHour(new Date());
        gestionRegistroPago.registrarPago.refer = '';
        gestionRegistroPago.format = 'dd/MM/yyyy h:mm:ss a';
        gestionRegistroPago.registrarPagoAuxiliar.detalles = false;
        gestionRegistroPago.registrarPagoAuxiliar.mensajeError = false;
        gestionRegistroPago.registrarPagoAuxiliar.showError = false;
        gestionRegistroPago.registrarPagoAuxiliar.disableButtons = false;
        gestionRegistroPago.registrarPagoAuxiliar.destruirForm = false;
        gestionRegistroPago.registrarPagoAuxiliar.overflow = true;
        gestionRegistroPago.registrarPagoAuxiliar.esCero = true;
        gestionRegistroPago.registrarPagoAuxiliar.cajaSinAbrir = false;
        gestionRegistroPago.registrarPagoAuxiliar.errorConexion = false;
        gestionRegistroPago.btnEfectivo = true;
        gestionRegistroPago.btnTarjetaCredito = true;
        gestionRegistroPago.btnTarjetaDebito = true;
        gestionRegistroPago.btnCheque = true;
        gestionRegistroPago.requerido = "required";
        gestionRegistroPago.estudiante = [];

        gestionRegistroPago.listaConceptos = [];
        gestionRegistroPago.listaTiposMoneda = [];
        gestionRegistroPago.listaTiposTarjeta = [];
        gestionRegistroPago.listaTransacciones = [];
        gestionRegistroPago.listaRecibo = [];
        gestionRegistroPago.listaTallaCamisa = [];
        gestionRegistroPago.listaTallaPantalon = [];
        gestionRegistroPago.item = [];
        gestionRegistroPago.nombreCaja = '';
        gestionRegistroPago.isCajaActiva = true;

        gestionRegistroPago.sumaImporteTransacciones = 0;
        var idLiquidacion;
        gestionRegistroPago.registrarPago.saldoRestante;
        gestionRegistroPago.onCerrarAlerta = function () {
            gestionRegistroPago.registrarPagoAuxiliar.overflow = true;
            gestionRegistroPago.registrarPagoAuxiliar.esCero = true;
        };

        function init() {
            gestionRegistroPago.registrarPago.numeroRef = null;
        }

        gestionRegistroPago.onEjecutarScript = function () {
            $('#fechaCheque').datepicker({
                format: "dd/mm/yyyy",
                language: "es",
                autoclose: true,
                // startDate: new Date(),
                clearBtn: true,
                beforeShowYear: function (date) {
                    if (date.getFullYear() < 1900) {
                        return false;
                    }
                },
                beforeShowMonth: function (date) {
                    if (date.getFullYear() < 1900) {
                        return false;
                    }
                },
                beforeShowDay: function (date) {
                    if (date.getFullYear() < 1900) {
                        return false;
                    }
                }
            });
        };

        function formaterFecha(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 2),
                day = '' + d.getDate(),
                year = d.getFullYear();
            var ultimoDia = new Date(d.getFullYear(), d.getMonth() + 2, 0);
            return ultimoDia;
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

        function onFormattedHour(date) {
            var d = new Date(date),
                hora = '' + (d.getHours()),
                minutos = '' + d.getMinutes(),
                segundos = d.getSeconds();
            return [hora, minutos, segundos].join(':');
        }

        function onObtenerTiposMoneda() {
            var categoria = 'TIPO_MONEDA';
            utilServices.buscarListaValorByCategoria(categoria, 'financiero').then(function (data) {
                gestionRegistroPago.listaTiposMoneda = data;
            });
        }

        function onObtenerTiposTarjeta() {
            var categoria = 'TIPO_TARJETA';
            utilServices.buscarListaValorByCategoria(categoria, 'financiero').then(function (data) {
                gestionRegistroPago.listaTiposTarjeta = data;
            });
        }

        function onObtenerTallasCamisa() {
            var categoria = 'TALLA_CAMISA';
            utilServices.buscarListaValorByCategoria(categoria, 'financiero').then(function (data) {
                gestionRegistroPago.listaTallaCamisa = data;
                angular.forEach(data, function (value, key) {
                    if (value.valor === "NO APLICA") {
                        gestionRegistroPago.registrarPago.descripcionCamisa = value;
                    }
                });
            });
        }

        function onObtenerTallasPantalon() {
            var categoria = 'TALLA_PANTALON';
            utilServices.buscarListaValorByCategoria(categoria, 'financiero').then(function (data) {
                gestionRegistroPago.listaTallaPantalon = data;
                angular.forEach(data, function (value, key) {
                    if (value.valor === "NO APLICA") {
                        gestionRegistroPago.registrarPago.descripcionPantalon = value;
                    }
                });
            });
        }

        function onObtenerFormaPago() {
            var categoria = 'FORMA_PAGO';
            utilServices.buscarListaValorByCategoria(categoria, 'financiero').then(function (data) {
                angular.forEach(data, function (value, key) {
                    if (value.referencia === "0" && value.estado === "ACTIVO") {
                        gestionRegistroPago.btnEfectivo = false;
                        gestionRegistroPago.referenciaEfectivo = value.codigo;
                    }
                    if (value.referencia === "3" && value.estado === "ACTIVO") {
                        gestionRegistroPago.btnTarjetaDebito = false;
                        gestionRegistroPago.referenciaTarjetaDebito = value.codigo;
                    }
                    if (value.referencia === "4" && value.estado === "ACTIVO") {
                        gestionRegistroPago.btnTarjetaCredito = false;
                        gestionRegistroPago.referenciaTarjetaCredito = value.codigo;
                    }
                    if (value.referencia === "1" && value.estado === "ACTIVO") {
                        gestionRegistroPago.btnCheque = false;
                        gestionRegistroPago.referenciaCheque = value.codigo;
                    }
                    if (value.referencia === "5" && value.estado === "ACTIVO") {
                        gestionRegistroPago.btnSuperGiros = false;
                        gestionRegistroPago.referenciaSuperGiros = value.codigo;
                    }
                });

            });
        }

        gestionRegistroPago.onCampoVacio = function () {
            gestionRegistroPago.registrarPagoAuxiliar.detalles = false;
            gestionRegistroPago.registrarPagoAuxiliar.mensajeError = false;
            gestionRegistroPago.registrarPagoAuxiliar.showError = false;
            gestionRegistroPago.registrarPagoAuxiliar.disableButtons = false;
            gestionRegistroPago.registrarPagoAuxiliar.destruirForm = false;
            gestionRegistroPago.registrarPagoAuxiliar.overflow = true;
            gestionRegistroPago.registrarPagoAuxiliar.esCero = true;
            gestionRegistroPago.registrarPagoAuxiliar.cajaSinAbrir = false;
            gestionRegistroPago.registrarPagoAuxiliar.errorConexion = false;
            gestionRegistroPago.registrarPago.fechaLimitePago = null;
            gestionRegistroPago.registrarPago.nombre = null;
            gestionRegistroPago.registrarPago.numeroDocumento = null;
            gestionRegistroPago.registrarPago.codigoEstudiante = null;
            gestionRegistroPago.registrarPago.programa = null;
            gestionRegistroPago.registrarPago.periodoAcademico = null;
            gestionRegistroPago.registrarPago.semestre = null;

            gestionRegistroPago.totalConceptos = 0;
            gestionRegistroPago.registrarPago.saldoRestante = 0;

            gestionRegistroPago.listaTransacciones = [];
            gestionRegistroPago.listaRecibo = [];
            gestionRegistroPago.item = [];
        };

        gestionRegistroPago.onLimpiar = function () {
            gestionRegistroPago.registrarPagoAuxiliar.detalles = false;
            gestionRegistroPago.registrarPagoAuxiliar.mensajeError = false;
            gestionRegistroPago.registrarPagoAuxiliar.showError = false;
            gestionRegistroPago.registrarPagoAuxiliar.disableButtons = false;
            gestionRegistroPago.registrarPagoAuxiliar.destruirForm = false;
            gestionRegistroPago.registrarPagoAuxiliar.overflow = true;
            gestionRegistroPago.registrarPagoAuxiliar.esCero = true;
            gestionRegistroPago.registrarPagoAuxiliar.cajaSinAbrir = false;
            gestionRegistroPago.registrarPagoAuxiliar.errorConexion = false;

            gestionRegistroPago.listaConceptos = [];
            gestionRegistroPago.listaTiposMoneda = [];
            gestionRegistroPago.listaTiposTarjeta = [];
            gestionRegistroPago.listaTransacciones = [];
            gestionRegistroPago.listaRecibo = [];
            gestionRegistroPago.item = [];

            gestionRegistroPago.registrarPago.fechaLimitePago = null;
            gestionRegistroPago.registrarPago.nombre = null;
            gestionRegistroPago.registrarPago.numeroDocumento = null;
            gestionRegistroPago.registrarPago.codigoEstudiante = null;
            gestionRegistroPago.registrarPago.programa = null;
            gestionRegistroPago.registrarPago.periodoAcademico = null;
            gestionRegistroPago.registrarPago.semestre = null;
            gestionRegistroPago.nombreCaja = null;

            gestionRegistroPago.totalConceptos = 0;
            gestionRegistroPago.registrarPago.saldoRestante = 0;
        };

        function onComprobarUsuario() {
            appConstant.MSG_CONFIRMACION();
            appConstant.CARGANDO();
            registrarPagoServices.getUsuario(localStorageService.get('autorizacion').objectResponse.userDto.id).then(function (data) {

                appConstant.CERRAR_SWAL();
                if (data.objectResponse === null || data.objectResponse === undefined) {
                  appConstant.MSG_GROWL_ERROR(data.message);
                    gestionRegistroPago.registrarPagoAuxiliar.cajaSinAbrir = true;
                } else {
                  gestionRegistroPago.nombreCaja = data.objectResponse.nombre;
                    gestionRegistroPago.registrarPago.idCaja = data.objectResponse.id;
                    gestionRegistroPago.registrarPagoAuxiliar.cajaSinAbrir = false;

                  gestionRegistroPago.isCajaActiva = data.objectResponse.estadoMovimiento !== 'ABIERTA';
                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();

                gestionRegistroPago.registrarPagoAuxiliar.errorConexion = true;
                return;
            });
        }

        gestionRegistroPago.onPresionarEnter = function (tecla, referencia) {
            if (tecla.keyCode === 13) {
                if (referencia === null || referencia === '' || referencia === undefined) {
                    gestionRegistroPago.requerido = "required";
                    if (new ValidationService().checkFormValidity($scope.formBusqueda)) {
                    }
                    gestionRegistroPago.registrarPagoAuxiliar.detalles = false;
                    return;
                }
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
                var res = referencia.split(".");
                var refer = res[res.length - 1];
                if (refer === null || refer === undefined || refer === '') {
                    appConstant.CERRAR_SWAL();
                    gestionRegistroPago.registrarPago.numeroRef = '';
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.INGRESE_NUEVAMENTE_REFERENCIA);
                    return;
                }
                referencia = refer.replace("'", "-");
                gestionRegistroPago.registrarPago.numeroRef = referencia;
                gestionRegistroPago.onConsultarRef(referencia);
            }
        };

        gestionRegistroPago.onConsultarRef = function (referencia, saldo) {
            if (referencia === null || referencia === '' || referencia === undefined) {
                gestionRegistroPago.requerido = "required";
                if (new ValidationService().checkFormValidity($scope.formBusqueda)) {
                }
                gestionRegistroPago.registrarPagoAuxiliar.detalles = false;
                return;
            }
            if (new ValidationService().checkFormValidity($scope.formBusqueda)) {
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
                gestionRegistroPago.listaTransacciones = [];
                registrarPagoServices.buscarComprobantes(referencia).then(function (data) {
                    if (data.tipo === 409) {
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        gestionRegistroPago.registrarPagoAuxiliar.detalles = false;
                        appConstant.CERRAR_SWAL();
                    } else {
                        appConstant.CERRAR_SWAL();
                        gestionRegistroPago.requerido = "";
                        gestionRegistroPago.registrarPago.refer = referencia;
                        gestionRegistroPago.registrarPago.fechaLimitePago = data.objectResponse.fechaLimitePago;
                        gestionRegistroPago.registrarPagoAuxiliar.disableButtons = false;
                        gestionRegistroPago.registrarPagoAuxiliar.detalles = true;
                        gestionRegistroPago.registrarPago.nombre = data.objectResponse.estudiante.nombreEstudiante + ' ' + data.objectResponse.estudiante.apellidoEstudiante;
                        gestionRegistroPago.registrarPago.numeroDocumento = data.objectResponse.estudiante.identificacionEstudiante.identificacion;
                        gestionRegistroPago.registrarPago.codigoEstudiante = data.objectResponse.estudiante.codigo;
                        gestionRegistroPago.registrarPago.programa = data.objectResponse.estudiante.nombrePrograma;
                        gestionRegistroPago.registrarPago.periodoAcademico = data.objectResponse.estudiante.nombrePeriodoAcademico;
                        gestionRegistroPago.registrarPago.semestre = data.objectResponse.estudiante.semestre;
                        gestionRegistroPago.listaConceptos = data.objectResponse.liquidacionConceptoDetalleDTO;
                        gestionRegistroPago.onGetDetalleLiquidacion(gestionRegistroPago.listaConceptos);
                        gestionRegistroPago.registrarPago.celular = data.objectResponse.estudiante.celular;
                        gestionRegistroPago.registrarPago.email  = data.objectResponse.estudiante.email;
                        gestionRegistroPago.totalConceptos = saldo;
                        gestionRegistroPago.registrarPago.saldoRestante = gestionRegistroPago.totalConceptos;
                        gestionRegistroPago.saldoPagar = saldo;
                        idLiquidacion = data.objectResponse.idLiquidacion;
                    }
                    gestionRegistroPago.registrarPago.numeroRef = '';
                    new ValidationService().resetForm($scope.formBusqueda);
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    gestionRegistroPago.registrarPagoAuxiliar.detalles = false;
                    appConstant.MSG_GROWL_ERROR();
                    return;
                });
            }
        };

        gestionRegistroPago.onGetDetalleLiquidacion = function (listaConceptos) {
            gestionRegistroPago.listaRecibo = [];
            angular.forEach(listaConceptos, function (value, key) {
                var recibo = {
                    idDetalleLiquidacion: listaConceptos[key].id,
                    nombreConcepto: listaConceptos[key].nombreConcepto,
                    cantidad: listaConceptos[key].cantidad,
                    valor: listaConceptos[key].valor
                };
                gestionRegistroPago.listaRecibo.push(recibo);
            });
        };

        gestionRegistroPago.onSubmitForms = function (value) {
            switch (value) {
                case 0:
                    if (new ValidationService().checkFormValidity($scope.formPagoE)) {
                        gestionRegistroPago.registrarPago.saldoRestante = gestionRegistroPago.registrarPago.saldoRestante - gestionRegistroPago.registrarPago.ingresosEfectivo;
                        if (gestionRegistroPago.registrarPago.saldoRestante < 0) {
                            gestionRegistroPago.registrarPagoAuxiliar.overflow = false;
                            gestionRegistroPago.registrarPago.saldoRestante = gestionRegistroPago.registrarPago.saldoRestante + gestionRegistroPago.registrarPago.ingresosEfectivo;
                            $timeout(function () {
                                gestionRegistroPago.registrarPagoAuxiliar.overflow = true;
                            }, 4000);
                        } else {
                            var efectivo = {
                                idFormaPago: gestionRegistroPago.referenciaEfectivo,
                                nombreFormaPago: "Efectivo",
                                fechaSolicitud: $('#fechaPago').text(),
                                valorPagado: gestionRegistroPago.registrarPago.ingresosEfectivo,
                                saldo: gestionRegistroPago.registrarPago.saldoRestante
                            };
                            gestionRegistroPago.listaTransacciones.push(efectivo);
                            gestionRegistroPago.onCloseModalEfectivo();
                        }

                        if (gestionRegistroPago.listaTransacciones.length > 0) {
                            gestionRegistroPago.registrarPagoAuxiliar.disableButtons = true;
                        }
                    }
                    break;
                case 1:
                    if (new ValidationService().checkFormValidity($scope.formPagoTC)) {
                        gestionRegistroPago.registrarPago.saldoRestante = gestionRegistroPago.registrarPago.saldoRestante - gestionRegistroPago.registrarPago.importeTarjetaCredito;
                        if (gestionRegistroPago.registrarPago.saldoRestante < 0) {
                            gestionRegistroPago.registrarPagoAuxiliar.overflow = false;
                            gestionRegistroPago.registrarPago.saldoRestante = gestionRegistroPago.registrarPago.saldoRestante + gestionRegistroPago.registrarPago.importeTarjetaCredito;
                            $timeout(function () {
                                gestionRegistroPago.registrarPagoAuxiliar.overflow = true;
                            }, 4000);
                        } else {
                            var tarjeta = {
                                idFormaPago: gestionRegistroPago.referenciaTarjetaCredito,
                                nombreFormaPago: "Tarjeta de Crédito",
                                fechaSolicitud: $('#fechaPago').text(),
                                numeroTarjeta: gestionRegistroPago.registrarPago.numeroTarjetaCredito,
                                franquicia: gestionRegistroPago.registrarPago.franquicia,
                                valorPagado: gestionRegistroPago.registrarPago.importeTarjetaCredito,
                                voucher: gestionRegistroPago.registrarPago.numeroVoucher,
                                saldo: gestionRegistroPago.registrarPago.saldoRestante
                            };
                            gestionRegistroPago.listaTransacciones.push(tarjeta);
                            gestionRegistroPago.onCloseModalTarjetaCredito();
                        }
                        if (gestionRegistroPago.listaTransacciones.length > 0) {
                            gestionRegistroPago.registrarPagoAuxiliar.disableButtons = true;
                        }
                    }
                    break;
                case 2:
                    if (new ValidationService().checkFormValidity($scope.formPagoTD)) {
                        gestionRegistroPago.registrarPago.saldoRestante = gestionRegistroPago.registrarPago.saldoRestante - gestionRegistroPago.registrarPago.importeTarjetaDebito;
                        if (gestionRegistroPago.registrarPago.saldoRestante < 0) {
                            gestionRegistroPago.registrarPagoAuxiliar.overflow = false;
                            gestionRegistroPago.registrarPago.saldoRestante = gestionRegistroPago.registrarPago.saldoRestante + gestionRegistroPago.registrarPago.importeTarjetaDebito;
                            $timeout(function () {
                                gestionRegistroPago.registrarPagoAuxiliar.overflow = true;
                            }, 4000);
                        } else {
                            var tarjeta = {
                                idFormaPago: gestionRegistroPago.referenciaTarjetaDebito,
                                nombreFormaPago: "Tarjeta de Débito",
                                fechaSolicitud: $('#fechaPago').text(),
                                valorPagado: gestionRegistroPago.registrarPago.importeTarjetaDebito,
                                voucher: gestionRegistroPago.registrarPago.numeroVoucherDebito,
                                saldo: gestionRegistroPago.registrarPago.saldoRestante
                            };
                            gestionRegistroPago.listaTransacciones.push(tarjeta);
                            gestionRegistroPago.onCloseModalTarjetaDebito();
                        }
                        if (gestionRegistroPago.listaTransacciones.length > 0) {
                            gestionRegistroPago.registrarPagoAuxiliar.disableButtons = true;
                        }
                    }
                    break;
                case 3:
                    gestionRegistroPago.registrarPagoAuxiliar.onError = null;
                    if (new ValidationService().checkFormValidity($scope.formPagoC)) {
                        gestionRegistroPago.registrarPago.saldoRestante = gestionRegistroPago.registrarPago.saldoRestante - gestionRegistroPago.registrarPago.importeCheques;
                        if (gestionRegistroPago.registrarPago.saldoRestante < 0) {
                            gestionRegistroPago.registrarPagoAuxiliar.overflow = false;
                            gestionRegistroPago.registrarPago.saldoRestante = gestionRegistroPago.registrarPago.saldoRestante + gestionRegistroPago.registrarPago.importeCheques;
                            $timeout(function () {
                                gestionRegistroPago.registrarPagoAuxiliar.overflow = true;
                            }, 4000);
                        } else {
                            var cheque = {
                                idFormaPago: gestionRegistroPago.referenciaCheque,
                                nombreFormaPago: "Cheque",
                                fechaSolicitud: $('#fechaPago').text(),
                                voucher: gestionRegistroPago.registrarPago.numeroCheque,
                                fechaCheque: gestionRegistroPago.registrarPago.fechaCheque,
                                banco: gestionRegistroPago.registrarPago.banco,
                                valorPagado: gestionRegistroPago.registrarPago.importeCheques,
                                saldo: gestionRegistroPago.registrarPago.saldoRestante
                            };
                            gestionRegistroPago.listaTransacciones.push(cheque);
                            gestionRegistroPago.onCloseModalCheque();
                        }
                        if (gestionRegistroPago.listaTransacciones.length > 0) {
                            gestionRegistroPago.registrarPagoAuxiliar.disableButtons = true;
                        }
                    }
                    break;
                case 4:
                    gestionRegistroPago.registrarPagoAuxiliar.onError = null;
                    if (new ValidationService().checkFormValidity($scope.formPagoSG)) {
                        gestionRegistroPago.registrarPago.saldoRestante = gestionRegistroPago.registrarPago.saldoRestante - gestionRegistroPago.registrarPago.importeCheques;
                        if (gestionRegistroPago.registrarPago.saldoRestante < 0) {
                            gestionRegistroPago.registrarPagoAuxiliar.overflow = false;
                            gestionRegistroPago.registrarPago.saldoRestante = gestionRegistroPago.registrarPago.saldoRestante + gestionRegistroPago.registrarPago.importeCheques;
                            $timeout(function () {
                                gestionRegistroPago.registrarPagoAuxiliar.overflow = true;
                            }, 4000);
                        } else {
                            var reciboSuperGiro = {
                                idFormaPago: gestionRegistroPago.referenciaSuperGiros,
                                nombreFormaPago: "SuperGiros",
                                fechaSolicitud: $('#fechaPago').text(),
                                voucher: gestionRegistroPago.registrarPago.numeroReferencia,
                                fechaCheque: gestionRegistroPago.registrarPago.fechaReferencia,
                                valorPagado: gestionRegistroPago.registrarPago.importeSuperGiros,
                                saldo: gestionRegistroPago.registrarPago.saldoRestante
                            };
                            gestionRegistroPago.listaTransacciones.push(reciboSuperGiro);
                            gestionRegistroPago.onCloseModalSuperGiros();
                        }
                        if (gestionRegistroPago.listaTransacciones.length > 0) {
                            gestionRegistroPago.registrarPagoAuxiliar.disableButtons = true;
                        }
                    }
                    break;

            }
        };

        gestionRegistroPago.cancelarTransaccion = function (item) {
            var index = gestionRegistroPago.listaTransacciones.indexOf(item);
            gestionRegistroPago.listaTransacciones.splice(index, 1);
            gestionRegistroPago.registrarPago.saldoRestante += item.valorPagado;
            gestionRegistroPago.registrarPagoAuxiliar.disableButtons = false;
        };

        gestionRegistroPago.onConfirmarTransacciones = function () {
            var valorPagadoReal = 0;
            angular.forEach(gestionRegistroPago.listaTransacciones, function (value, key) {
                valorPagadoReal = valorPagadoReal + value.valorPagado;
            });

            var listaDescripcionCamisaPantalon = [];
            listaDescripcionCamisaPantalon.push(gestionRegistroPago.registrarPago.descripcionCamisa);
            listaDescripcionCamisaPantalon.push(gestionRegistroPago.registrarPago.descripcionPantalon);

            var reciboPago = {
                idCaja: gestionRegistroPago.registrarPago.idCaja,
                nombreCaja: gestionRegistroPago.nombreCaja,
                idCajero: localStorageService.get('autorizacion').objectResponse.userDto.id,
                nombreCajero: localStorageService.get('autorizacion').objectResponse.userDto.nombres + " " + localStorageService.get('autorizacion').objectResponse.userDto.apellidos,
                fechaPago: gestionRegistroPago.registrarPago.fechaLimitePago,
                valorPagado: valorPagadoReal,
                idLiquidacion: idLiquidacion,
                reciboDetalle: gestionRegistroPago.listaRecibo,
                reciboFormaPago: gestionRegistroPago.listaTransacciones,
                observacion: gestionRegistroPago.registrarPago.observacion,
                celular: gestionRegistroPago.registrarPago.celular,
                email: gestionRegistroPago.registrarPago.email,
                descripcionRecibo: listaDescripcionCamisaPantalon
            };

            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();

            registrarPagoServices.agregarPagos(reciboPago).then(function (data) {
                switch (data.tipo) {
                    case 200:
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_OK(data.message);
                        gestionRegistroPago.registrarPago.numeroRef = null;
                        new ValidationService().resetForm($scope.formBusqueda);
                        gestionRegistroPago.onConsultarHistorialEstudiante(gestionRegistroPago.identificacionConsultar);
                        gestionRegistroPago.registrarPagoAuxiliar.detalles = false;
                        gestionRegistroPago.registrarPagoAuxiliar.disableButtons = false;
                        gestionRegistroPago.registrarPago.celular = "";
                        gestionRegistroPago.registrarPago.email = "";
                        gestionRegistroPago.registrarPago.descripcionCamisa = "";
                        gestionRegistroPago.registrarPago.descripcionPantalon = "";

                        var objReportRecibo = {
                            ReciboCaja: data.objectResponse
                        };
                        onGenerarReporteDirecto(objReportRecibo, 1)
                        break;
                    case 409:
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        break;
                }
            });
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

        gestionRegistroPago.download = function (itemArc) {
            var file = utilServices.downloadArchivo(itemArc, appGenericConstant.MICRO_SERVICIO_FINANCIERO);
            if (file !== null && itemArc !== null && itemArc !== undefined) {
                utilServices.downloadReporte(file, itemArc);
                appConstant.CERRAR_SWAL();
            } else {
                swal(appGenericConstant.NO_GENERAR_REPORTE,
                    appGenericConstant.CERCIORATE_CONEXION_INTERNET,
                    appGenericConstant.WARNING);
            }
        };

        gestionRegistroPago.onOpenModalEfectivo = function () {
            gestionRegistroPago.registrarPago.tipoMoneda = gestionRegistroPago.listaTiposMoneda[0];
            gestionRegistroPago.registrarPago.ingresosEfectivo = gestionRegistroPago.registrarPago.saldoRestante;
            $('#modalEfectivo').modal({ backdrop: 'static', keyboard: false });
            $("#modalEfectivo").modal("show");
        };

        gestionRegistroPago.onCloseModalEfectivo = function () {
            gestionRegistroPago.registrarPago.tipoMoneda = gestionRegistroPago.listaTiposMoneda[0];
            gestionRegistroPago.registrarPago.ingresosEfectivo = null;
            new ValidationService().resetForm($scope.formPagoE);
            $("#modalEfectivo").modal("hide");
        };

        gestionRegistroPago.onOpenModalTarjetaCredito = function () {
            gestionRegistroPago.registrarPago.importeTarjetaCredito = gestionRegistroPago.registrarPago.saldoRestante;
            $('#modalTarjetaCredito').modal({ backdrop: 'static', keyboard: false });
            $("#modalTarjetaCredito").modal("show");
        };

        gestionRegistroPago.onCloseModalTarjetaCredito = function () {
            gestionRegistroPago.registrarPago.importeTarjetaCredito = null;
            gestionRegistroPago.registrarPago.numeroTarjetaCredito = null;
            gestionRegistroPago.registrarPago.franquicia = null;
            gestionRegistroPago.registrarPago.numeroVoucher = null;
            new ValidationService().resetForm($scope.formPagoTC);
            $("#modalTarjetaCredito").modal("hide");
        };

        gestionRegistroPago.onOpenModalTarjetaDebito = function () {
            gestionRegistroPago.registrarPago.importeTarjetaDebito = gestionRegistroPago.registrarPago.saldoRestante;
            $('#modalTarjetaDebito').modal({ backdrop: 'static', keyboard: false });
            $("#modalTarjetaDebito").modal("show");
        };

        gestionRegistroPago.onCloseModalTarjetaDebito = function () {
            gestionRegistroPago.registrarPago.importeTarjetaDebito = null;
            gestionRegistroPago.registrarPago.numeroVoucherDebito = null;
            new ValidationService().resetForm($scope.formPagoTD);
            $("#modalTarjetaDebito").modal("hide");
        };

        gestionRegistroPago.onOpenModalCheque = function () {
            gestionRegistroPago.onEjecutarScript();
            new ValidationService().resetForm($scope.formPagoC);
            gestionRegistroPago.registrarPago.importeCheques = gestionRegistroPago.registrarPago.saldoRestante;
            $('#modalCheque').modal({ backdrop: 'static', keyboard: false });
            $("#modalCheque").modal("show");
        };

        gestionRegistroPago.onCloseModalCheque = function () {
            gestionRegistroPago.registrarPago.numeroCheque = null;
            gestionRegistroPago.registrarPago.fechaCheque = null;
            gestionRegistroPago.registrarPago.banco = null;
            gestionRegistroPago.registrarPago.importeCheques = null;
            new ValidationService().resetForm($scope.formPagoC);
            $("#modalCheque").modal("hide");
        };

        gestionRegistroPago.onOpenModalSuperGiros = function () {
            gestionRegistroPago.onEjecutarScript();
            new ValidationService().resetForm($scope.formPagoSG);
            gestionRegistroPago.registrarPago.importeSuperGiros = gestionRegistroPago.registrarPago.saldoRestante;
            $('#modalSuperGiros').modal({ backdrop: 'static', keyboard: false });
            $("#modalSuperGiros").modal("show");
        };

        gestionRegistroPago.onCloseModalSuperGiros = function () {
            gestionRegistroPago.registrarPago.numeroReferencia = null;
            gestionRegistroPago.registrarPago.fechaReferencia = null;
            gestionRegistroPago.registrarPago.importeSuperGiros = null;
            new ValidationService().resetForm($scope.formPagoSG);
            $("#modalSuperGiros").modal("hide");
        };

        gestionRegistroPago.onClickReferencia = function (item, itemSaldo) {
            gestionRegistroPago.onConsultarRef(item, itemSaldo);
        };

        window.onhashchange = function () {
            $("body").removeClass("modal-open");
            $("div").removeClass("modal-backdrop fade in");
            appConstant.CERRAR_SWAL();
            $("#modalEfectivo").modal("hide");
            $("#modalTarjeta").modal("hide");
            $("#modalCheque").modal("hide");
        };

        //método para consultar el historial de liquidaciones por estudiante
        gestionRegistroPago.onConsultarHistorialEstudiante = function (identificacion) {
            if (new ValidationService().checkFormValidity($scope.formBusqueda)) {
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
                historialLiquidacionServices.buscarHIstorialEstudianteByCodigo(identificacion).then(function (data) {
                    if (data.objectResponse === null || data.objectResponse === undefined || data.objectResponse.length === 0) {
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        //$('#divNombre,#divIdentificacion,#divPAcademico,#divProgramaAcademico,#divSemestre,#btnConsultarHistoral').hide();
                        gestionRegistroPago.liquidacionEstudiante = [];
                        gestionRegistroPago.liquidacionEstudianteAnuladas = [];
                        gestionRegistroPago.liquidacionEstudianteAuxiliar = [];
                        appConstant.CERRAR_SWAL();
                        return;
                    } else {
                        gestionRegistroPago.liquidacionEstudiante = [];
                        gestionRegistroPago.liquidacionEstudianteAnuladas = [];
                        gestionRegistroPago.liquidacionEstudianteAuxiliar = [];
                        gestionRegistroPago.estudiante.identificacion = data.objectResponse[0].liquidacionReporteDTO.tipoDocumento + " " + data.objectResponse[0].liquidacionReporteDTO.estudianteIdentificacion;
                        gestionRegistroPago.estudiante.nombre = data.objectResponse[0].nombreEstudiante;
                        angular.forEach(data.objectResponse, function (value, key) {

                            var liquidacion = {
                                id: value.id,
                                idPeriodo: value.idPeriodo,
                                idEstudiante: value.idEstudiante,
                                referencia: value.referencia,
                                fechaLiquidacion: value.fechaLiquidacion,
                                fechaLimitePago: value.fechaLimitePago,
                                valorLiquidado: value.valorLiquidado,
                                estadoLiquidacion: value.estadoLiquidacion,
                                estadoAbono: value.estadoAbono,
                                idPlantilla: value.idPlantilla,
                                tipoPlantilla: value.tipoPlantilla,
                                numeracion: value.numeracion,
                                idCredito: value.idCredito,
                                liquidacionConceptoDetalleDTO: value.liquidacionConceptoDetalleDTO,
                                nombrePrograma: value.nombrePrograma,
                                nombreConcepto: value.nombreConcepto + " " + (value.liquidacionConceptoDetalleDTO[0].modulo === null ? "" : value.liquidacionConceptoDetalleDTO[0].modulo),
                                nombrePeriodo: value.nombrePeriodo,
                                liquidacionReporteDTO: value.liquidacionReporteDTO,
                                reciboPagoLiquidacionDTO: value.reciboPagoLiquidacionDTO,
                                reimprimir: value.reciboPagoLiquidacionDTO === null,
                                reimrpimirEstado: value.estadoLiquidacion === 'PAGADA',
                                motivoAnulacion: value.motivoAnulacion,
                                usuarioAnulacion: value.userNameAnulacion,
                                fechaAnulacion: value.fechaAnulacion,
                                saldoPendiente: value.saldoPendiente,
                                saldoAbonado: value.saldoAbonado,
                                numeroCuotaConcepto: value.numeroCuotaConcepto
                            };

                            liquidacion.nombreConcepto = liquidacion.nombreConcepto === "SOLICITUD_CREDITO" ? value.numeroCuotaConcepto : liquidacion.nombreConcepto;

                            liquidacion.referenciaNumero = parseInt(liquidacion.referencia.replace("MAT-", "").replace("MTS-", ""));
                            gestionRegistroPago.liquidacionEstudianteAuxiliar.push(liquidacion);
                        });
                        angular.forEach(gestionRegistroPago.liquidacionEstudianteAuxiliar, function (liquidacion, key) {
                            if (liquidacion.estadoLiquidacion === 'ABIERTA') {
                                gestionRegistroPago.liquidacionEstudiante.push(liquidacion);
                            }
                        });
                        appConstant.CERRAR_SWAL();
                        if (gestionRegistroPago.liquidacionEstudiante.length === 0) {
                            appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.ESTUDIANTE_NO_SOLICITUDES);
                            return;
                        }
                        $('#btnConsultarHistoral').show();
                        $(function () {
                            $('#divNombre,#divIdentificacion').show();
                        });
                    }
                }).catch(function (e) {
                    appConstant.MSG_GROWL_ERROR();
                    return;
                });
            }
        };

        onObtenerTiposMoneda();
        onObtenerTiposTarjeta();
        onObtenerFormaPago();
        onComprobarUsuario();
        onObtenerTallasCamisa();
        onObtenerTallasPantalon();
        init();
    }

})();
