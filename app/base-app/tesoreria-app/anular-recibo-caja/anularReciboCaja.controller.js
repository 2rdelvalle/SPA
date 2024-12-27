(function () {
    'use strict';
    angular.module('mytodoApp').controller('anularReciboCajaCtrl', anularReciboCajaCtrl);
    anularReciboCajaCtrl.$inject = ['$scope', 'anularReciboCajaService', 'loginService', 'utilServices', 'appConstant', 'ValidationService', 'localStorageService', 'validar', '$filter', 'appGenericConstant', 'appConstantValueList'];
    function anularReciboCajaCtrl($scope, anularReciboCajaService, loginService, utilServices, appConstant, ValidationService, localStorageService, validar, $filter, appGenericConstant, appConstantValueList) {

        var gestionCaja = this;
        gestionCaja.totalValorConceptos;
        gestionCaja.format = 'dd/MM/yyyy h:mm:ss a';
        gestionCaja.movCajaEntityBus = {};
        gestionCaja.listaConceptos = [];
        gestionCaja.listaFormasPago = [];
        gestionCaja.listaCausales = [];
        gestionCaja.listaRecibosCaja = [];
        gestionCaja.listaRecibosAnulados = [];
        gestionCaja.config = { globalTimeToLive: 3000, disableCountDown: true };
        gestionCaja.reciboCaja = anularReciboCajaService.entidad;
        gestionCaja.reciboCajaAuxiliar = anularReciboCajaService.entidadAuxiliar;
        gestionCaja.anularRecibo = anularReciboCajaService.entidadAnular;
        gestionCaja.options = appConstant.FILTRO_TABLAS;

        gestionCaja.movCajaEntityBus.fechaBusqueda = $filter('date')(new Date().getTime(), 'dd/MM/yyyy');
        gestionCaja.movCajaEntityBus.fechaBusqueda2 = $filter('date')(new Date().getTime(), 'dd/MM/yyyy');

        $('#fechaCampanha.input-daterange').datepicker({
            format: "dd/mm/yyyy",
            language: "es",
            autoclose: true,
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

        function listaMotivosAnulacion() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_CAUSAL_ANULACION, 'financiero').then(function (data) {
                gestionCaja.listaCausales = data;
            });
        }

        function consultarListaRecibos() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            anularReciboCajaService.buscarRecibosCaja(
                appConstant.TO_DATE_LONG(gestionCaja.movCajaEntityBus.fechaBusqueda),
                appConstant.TO_DATE_LONG(gestionCaja.movCajaEntityBus.fechaBusqueda2)
            ).then(function (data) {
                gestionCaja.listaRecibosCaja = [];
                angular.forEach(data, function (value, key) {
                    if (value.codigoConcepto !== 'CFI11') {
                        var recibo = {
                            id: value.id,
                            nRecibo: value.numeroRecibo,
                            fecha: value.fechaExpedicion,
                            estudiante: value.codigo,
                            nombreEstudiante: value.nombre,
                            codigoConcepto: value.codigoConcepto,
                            concepto: value.concepto,
                            caja: value.caja,
                            cajero: value.cajero,
                            valor: value.valorConcepto,
                            detallePago: value.detallePago,
                            detalleFormaPago: value.detalleFormaPago
                        };
                        gestionCaja.listaRecibosCaja.push(recibo);
                    }

                });
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                swal(appGenericConstant.HUBO_PROBLEMA,
                    appGenericConstant.ERROR_INTERNO_SISTEMA,
                    'error');
                return;
            });
        }

        gestionCaja.consultarListaRecibosAnulados = function () {
            gestionCaja.listaRecibosAnulados = [];
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            anularReciboCajaService.buscarRecibosCajaAnulados(
                appConstant.TO_DATE_LONG(gestionCaja.movCajaEntityBus.fechaBusqueda),
                appConstant.TO_DATE_LONG(gestionCaja.movCajaEntityBus.fechaBusqueda2)
            ).then(function (data) {
                angular.forEach(data, function (value, key) {
                    var recibo = {
                        nRecibo: value.numeroRecibo,
                        fecha: value.fechaExpedicion,
                        estudiante: value.codigo,
                        nombreEstudiante: value.nombre,
                        concepto: value.concepto,
                        caja: value.caja,
                        cajero: value.cajero,
                        valor: value.valorConcepto,
                        detallePago: value.detallePago,
                        detalleFormaPago: value.detalleFormaPago,
                        idMotivoAnulacion: value.idMotivoAnulacion,
                        idResponsableAnulacion: value.cajero,
                        observacionAnulacion: value.observacionAnulacion,
                        fechaAnulacion: value.fechaAunalacion
                    };
                    gestionCaja.listaRecibosAnulados.push(recibo);

                });
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                swal(appGenericConstant.HUBO_PROBLEMA,
                    appGenericConstant.ERROR_INTERNO_SISTEMA,
                    'error');
                return;
            });
        };
        
        gestionCaja.report = {
            selected: null
        };
        gestionCaja.selectedOption = gestionCaja.options[0];

        gestionCaja.onVerdetalle = function (item, reciboCaja) {
            $('#myModal').modal({ backdrop: 'static', keyboard: false });
            $("#myModal").modal("show");
            new ValidationService().resetForm($scope.formAnular);
            gestionCaja.reciboCaja.id = item.id;
            gestionCaja.reciboCaja.nRecibo = item.nRecibo;
            gestionCaja.reciboCaja.fecha = item.fecha;
            gestionCaja.reciboCaja.caja = item.caja;
            gestionCaja.reciboCaja.cajero = item.cajero;
            gestionCaja.reciboCaja.estudiante = item.estudiante;
            gestionCaja.reciboCaja.nombreEstudiante = item.nombreEstudiante;
            gestionCaja.reciboCaja.concepto = item.concepto;
            gestionCaja.reciboCaja.valor = item.valor;
            gestionCaja.listaConceptos = item.detallePago;
            gestionCaja.listaFormasPago = item.detalleFormaPago;
            gestionCaja.reciboCajaAuxiliar.btn = false;

            if (reciboCaja === 0) {
                gestionCaja.reciboCajaAuxiliar.hide = false;
                gestionCaja.reciboCajaAuxiliar.hideFecha = false;

            } else {
                gestionCaja.reciboCajaAuxiliar.hide = true;
                gestionCaja.reciboCajaAuxiliar.hideFecha = true;
                gestionCaja.reciboCajaAuxiliar.hideConsecutivo = true;
                gestionCaja.anularRecibo.consecutivo = item.consecutivo;
                gestionCaja.anularRecibo.responsable = item.idResponsableAnulacion;
                gestionCaja.anularRecibo.causalAnulacion = item.idMotivoAnulacion;
                gestionCaja.anularRecibo.observacion = item.observacionAnulacion;
                gestionCaja.anularRecibo.fechaAnulacionDetalle = item.fechaAnulacion;
            }
            gestionCaja.reciboCajaAuxiliar.tittle = appGenericConstant.DETALLE_RECIBO_CAJA;

        };


        gestionCaja.mostrarModalAnular = function (item) {
            $('#myModal').modal({ backdrop: 'static', keyboard: false });
            $("#myModal").modal("show");
            new ValidationService().resetForm($scope.formAnular);
            gestionCaja.reciboCaja.id = item.id;
            gestionCaja.reciboCaja.nRecibo = item.nRecibo;
            gestionCaja.reciboCaja.fecha = item.fecha;
            gestionCaja.reciboCaja.caja = item.caja;
            gestionCaja.reciboCaja.cajero = item.cajero;
            gestionCaja.reciboCaja.estudiante = item.estudiante;
            gestionCaja.reciboCaja.nombreEstudiante = item.nombreEstudiante;
            gestionCaja.reciboCaja.concepto = item.concepto;
            gestionCaja.reciboCaja.valor = item.valor;
            gestionCaja.listaConceptos = item.detallePago;
            gestionCaja.listaFormasPago = item.detalleFormaPago;
            gestionCaja.reciboCajaAuxiliar.hide = true;
            gestionCaja.reciboCajaAuxiliar.hideConsecutivo = false;
            gestionCaja.reciboCajaAuxiliar.tittle = appGenericConstant.ANULAR_RECIBO_CAJA;
            gestionCaja.reciboCajaAuxiliar.hideFecha = false;
            gestionCaja.reciboCajaAuxiliar.btn = true;

            gestionCaja.anularRecibo = {};
        };

        gestionCaja.onConfirmModal = function () {
            if (new ValidationService().checkFormValidity($scope.formAnular)) {
                $("#myModal").modal("hide");

                gestionCaja.anularRecibo.fechaAnulacion = toDate($('#fechaAnulacion').text());
                swal({
                    title: appGenericConstant.ANULARA_RECIBO_CAJA,
                    text: appGenericConstant.DESEA_CONTINUAR,
                    type: appGenericConstant.WARNING,
                    showCancelButton: true,
                    confirmButtonText: appGenericConstant.ACEPTAR,
                    cancelButtonText: appGenericConstant.REGRESAR
                }).then(function () {
                    $('#myModal2').modal({ backdrop: 'static', keyboard: false });
                    $("#myModal2").modal("show");

                    $("#usuario").val("");
                    $("#password").val("");

                    new ValidationService().resetForm($scope.formConfirmarClave);
                    gestionCaja.anularReciboSegundaClave = {
                        usuario: "",
                        password: ""
                    };
                    gestionCaja.anularReciboSegundaClave.usuario = "";
                    gestionCaja.anularReciboSegundaClave.password = "";

                }, function (dismiss) {
                    if (dismiss === appGenericConstant.CANCEL) {
                        $("#myModal").modal("show");
                    }
                });

            }
        };

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
        }
        ;

        gestionCaja.onCloseModal = function () {
            $("#myModal").modal("hide");
        };

        gestionCaja.onConfirmModalSegundaClave = function () {
            if (new ValidationService().checkFormValidity($scope.formConfirmarClave)) {
                gestionCaja.AnularReciboPago();
            }

        };
        gestionCaja.onCloseModalSegundaClave = function () {
            $("#myModal2").modal("hide");
        };

        gestionCaja.AnularReciboPago = function () {
            var dato = localStorageService.get("autorizacion").objectResponse;
            dato.userDto.username = gestionCaja.anularReciboSegundaClave.usuario;
            dato.userDto.passwordsupervisor = btoa(validar.validarPassw(gestionCaja.anularReciboSegundaClave.password));
            var acceso = {
                token: localStorageService.get("autorizacion").token,
                usuarioDto: dato,
                modulo: null
            };
            appConstant.MSG_LOADING(appGenericConstant.CONFIRMANDO_DATOS);
            appConstant.CARGANDO();
            loginService.accesoAutorzacionCaja(acceso).then(function (data) {
                if (data.tipo !== 200) {
                    swal({
                        title: appGenericConstant.USUARIO_CONTRASENA_INVALIDA,
                        type: appGenericConstant.WARNING,
                        confirmButtonText: appGenericConstant.ACEPTAR
                    });
                    return;
                }
                var object = {
                    id: gestionCaja.reciboCaja.id,
                    idMotivoAnulacion: gestionCaja.anularRecibo.causalAnulacion,
                    observacionAnulacion: gestionCaja.anularRecibo.observacion,
                    idResponsableAnulacion: localStorageService.get("autorizacion").objectResponse.userDto.id
                };
                anularReciboCajaService.anularReciboCaja(object).then(function (data) {
                    if (data.tipo === 200) {
                        $("#myModal2").modal("hide");
                        swal({
                            title: appGenericConstant.RECIBO_PAGO_ANULADO,
                            text: appGenericConstant.RECIBO_PAGO_ANULADO_SATIS,
                            type: appGenericConstant.SUCCESS,
                            showCancelButton: true,
                            confirmButtonText: appGenericConstant.ACEPTAR,
                            cancelButtonText: appGenericConstant.IMPRIMIR,
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        }).then(function () {
                            appConstant.CERRAR_SWAL();
                            consultarListaRecibos();
                        }, function (dismiss) {
                            if (dismiss === appGenericConstant.CANCEL) {
                                appConstant.CERRAR_SWAL();
                            }
                        });
                    } else if (data.tipo === 500) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                    } else if (data.tipo === 409) {
                        swal({
                            title: appGenericConstant.USUARIO_CONTRASENA_INVALIDA,
                            type: appGenericConstant.WARNING,
                            confirmButtonText: appGenericConstant.ACEPTAR
                        });
                    }
                }).catch(function (e) {
                    swal(appGenericConstant.HUBO_PROBLEMA,
                        appGenericConstant.ERROR_INTERNO_SISTEMA,
                        'error');
                    return;
                });
            }).catch(function (e) {
                if (e.status === 405) {
                    swal(appGenericConstant.HUBO_PROBLEMA,
                        appGenericConstant.ERROR_INTERNO_SISTEMA,
                        'error');
                    return;
                }
                swal({
                    title: appGenericConstant.USUARIO_CONTRASENA_INVALIDA,
                    type: appGenericConstant.WARNING,
                    confirmButtonText: appGenericConstant.ACEPTAR
                });
                return;
            });

        };

        window.onhashchange = function () {
            $("body").removeClass("modal-open");
            $("div").removeClass("modal-backdrop fade in");
            swal.close();
            $("#myModal").modal("hide");
            $("#myModal2").modal("hide");
        };


        gestionCaja.onConsultarMovimientos = function () {
            consultarListaRecibos();
            gestionCaja.consultarListaRecibosAnulados();
        };

        listaMotivosAnulacion();
    }
})();


