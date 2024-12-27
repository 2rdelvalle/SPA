(function () {
    'use strict';
    angular.module('mytodoApp').controller('aperturaCierreCajaCtrl', aperturaCierreCajaCtrl);
    aperturaCierreCajaCtrl.$inject = ['$scope', '$http', 'aperturaCierreCajaServices', 'loginService', 'appConstant', 'appGenericConstant', '$location', 'ValidationService', 'localStorageService', 'utilServices', '$window', '$interval', 'validar'];
    function aperturaCierreCajaCtrl($scope, $http, aperturaCierreCajaServices, loginService, appConstant, appGenericConstant, $location, ValidationService, localStorageService, utilServices, $window, $interval, validar) {
        var gestionAperturaCaja = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        gestionAperturaCaja.format = 'dd/MM/yyyy h:mm:ss a';
        gestionAperturaCaja.aperturaCierreCaja = aperturaCierreCajaServices.entidad;
        gestionAperturaCaja.aperturaCierreCajaAuxiliar = aperturaCierreCajaServices.entidadAuxiliar;
        gestionAperturaCaja.config = {globalTimeToLive: 3000, disableCountDown: true};
        gestionAperturaCaja.options = appConstant.FILTRO_TABLAS;
        gestionAperturaCaja.counter = 0;
        gestionAperturaCaja.report = {selected: null};
        gestionAperturaCaja.selectedOption = gestionAperturaCaja.options[appGenericConstant.CERO];
        if (localStorageService.get('aperturaCaja') !== null) {
            gestionAperturaCaja.aperturaCierreCaja = localStorageService.get('aperturaCaja');
        }
        if (localStorageService.get('aperturaCajaAuxiliar') !== null) {
            gestionAperturaCaja.aperturaCierreCajaAuxiliar = localStorageService.get('aperturaCajaAuxiliar');
        }
        function onBuscar() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            gestionAperturaCaja.counter = 0;
            aperturaCierreCajaServices.buscarCaja(localStorageService.get('autorizacion').objectResponse.userDto.id).then(function (data) {
                gestionAperturaCaja.cajas = data;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
        }

        var refreshTabla = function counter() {
            gestionAperturaCaja.counter = gestionAperturaCaja.counter + 1;
            if (gestionAperturaCaja.counter === 10) {
                aperturaCierreCajaServices.buscarCaja(localStorageService.get('autorizacion').objectResponse.userDto.id).then(function (data) {
                    gestionAperturaCaja.cajas = data;
                });
                gestionAperturaCaja.counter = 0;
            }
        };

        //

        gestionAperturaCaja.cancelarInterval = function () {
            //
        };

        gestionAperturaCaja.aperturaCaja = function (item) {
            var usuarioApertura = {
                idCaja: item.id,
                idUsuario: localStorageService.get('autorizacion').objectResponse.userDto.id
            };
            aperturaCierreCajaServices.confiCaja(usuarioApertura.idCaja, usuarioApertura.idUsuario).then(function (data) {
                switch (data.tipo) {
                    case 200:
                        gestionAperturaCaja.aperturaCierreCajaAuxiliar.titulo = appGenericConstant.APERTURA_CAJA;
                        gestionAperturaCaja.aperturaCierreCaja.idCaja = data.objectResponse.cajaDTO.id;
                        gestionAperturaCaja.aperturaCierreCaja.codigo = data.objectResponse.cajaDTO.codigo;
                        gestionAperturaCaja.aperturaCierreCaja.nombre = data.objectResponse.cajaDTO.nombre;
                        gestionAperturaCaja.aperturaCierreCaja.ubicacion = data.objectResponse.cajaDTO.ubicacion;
                        gestionAperturaCaja.aperturaCierreCaja.estadoMovimiento = data.objectResponse.cajaDTO.estadoMovimiento;
                        gestionAperturaCaja.aperturaCierreCaja.cajero = localStorageService.get('autorizacion').objectResponse.userDto.nombres + ' ' + localStorageService.get('autorizacion').objectResponse.userDto.apellidos;
                        gestionAperturaCaja.aperturaCierreCaja.denominaciones = data.objectResponse.cajaDenominacionList;
                        localStorageService.set('aperturaCaja', gestionAperturaCaja.aperturaCierreCaja);
                        localStorageService.set('aperturaCajaAuxiliar', gestionAperturaCaja.aperturaCierreCajaAuxiliar);
                        $location.path('/apertura-caja');
                        break;
                    case 409:
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        break;
                }
            });
        };

        gestionAperturaCaja.onSubmitForm = function () {
            gestionAperturaCaja.ModalUsuario();
            new ValidationService().resetForm($scope.formAperturaCaja);
        };

        gestionAperturaCaja.ModalUsuario = function () {
            $('#myModal').modal({backdrop: 'static', keyboard: false});
            $("#myModal").modal("show");
            $("#usuario").val("");
            $("#password").val("");
            new ValidationService().resetForm($scope.formConfirmarClave);
            gestionAperturaCaja.user = {
                usuario: "",
                password: ""
            };
            gestionAperturaCaja.aperturaCierreCaja.usuario = "";
            gestionAperturaCaja.aperturaCierreCaja.password = "";
        };

        gestionAperturaCaja.confir = function () {
            if (new ValidationService().checkFormValidity($scope.formConfirmarClave)) {
                var dato = localStorageService.get("autorizacion").objectResponse;
                dato.userDto.username = gestionAperturaCaja.aperturaCierreCaja.usuario;
                dato.userDto.passwordsupervisor = btoa(validar.validarPassw(gestionAperturaCaja.aperturaCierreCaja.password));
                var acceso = {
                    token: localStorageService.get("autorizacion").token,
                    usuarioDto: dato,
                    modulo: null
                };
                appConstant.MSG_LOADING(appGenericConstant.CONFIRMANDO_DATOS);
                appConstant.CARGANDO();
                loginService.accesoAutorzacionCaja(acceso).then(function (data) {
                    var usuarioSupervisor = data.objectResponse;
                    if (data.tipo !== 200) {
                        swal({
                            title: appGenericConstant.USUARIO_CONTRASENA_INVALIDA,
                            type: appGenericConstant.WARNING,
                            confirmButtonText: appGenericConstant.ACEPTAR
                        });
                        return;
                    }
                    var user = {
                        usuario: gestionAperturaCaja.aperturaCierreCaja.usuario,
                        pin: gestionAperturaCaja.aperturaCierreCaja.password,
                        idSupervisorApertura: usuarioSupervisor.idUsuario
                    };
                    var aperturaCaja = {
                        idCaja: gestionAperturaCaja.aperturaCierreCaja.idCaja,
                        codigo: gestionAperturaCaja.aperturaCierreCaja.codigo,
                        nombre: gestionAperturaCaja.aperturaCierreCaja.nombre,
                        ubicacion: gestionAperturaCaja.aperturaCierreCaja.ubicacion,
                        estadoMovimiento: "ABIERTA",
                        idUsuario: localStorageService.get('autorizacion').objectResponse.userDto.id,
                        cajaDenominacionList: gestionAperturaCaja.aperturaCierreCaja.denominaciones,
                        totalApertura: gestionAperturaCaja.totalApertura,
                        usuarioAutoriza: user,
                        idSupervisorApertura: usuarioSupervisor.idUsuario
                    };
                    aperturaCierreCajaServices.confirmarUser(aperturaCaja).then(function (data) {
                        if (data.tipo === 200) {
                            $("#myModal").modal("hide");
                            swal({
                                title: appGenericConstant.ESTADO_CAJA_ABIERTA,
                                type: appGenericConstant.SUCCESS,
                                showCancelButton: true,
                                confirmButtonText: appGenericConstant.ACEPTAR,
                                cancelButtonText: appGenericConstant.IMPRIMIR,
                                allowOutsideClick: false,
                                allowEscapeKey: false
                            }).then(function () {
                                $location.path('/apertura-cierre-caja');
                            }, function (dismiss) {
                                if (dismiss === appGenericConstant.CANCEL) {
                                    $location.path('/apertura-cierre-caja');
                                    var objReportApertura = {
                                        AperturaCaja: data.objectResponse
                                    };
                                    //gestionAperturaCaja.onGenerarReporte(data.objectResponse);
                                    onGenerarReporteDirecto(objReportApertura, 4);
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

        gestionAperturaCaja.onCloseModal = function () {
            $("#myModal").modal("hide");
        };

        gestionAperturaCaja.mostrarCampo = function (item) {
            $("#inputHid" + item.idDenominacion).prop("disabled", false);
            $('#inputHid' + item.idDenominacion).focus();
            $("#btnComd" + item.idDenominacion).hide();
            $("#btnCheck" + item.idDenominacion).show();
            item.cantidad = $("#inputHid" + item.idDenominacion).val();
            item.cantidad = item.cantidad === "0" ? "" : item.cantidad;
            $("#inputHid" + item.idDenominacion).val(item.cantidad);
        };

        gestionAperturaCaja.ocultarCampo = function (item) {
            $("#inputHid" + item).prop("disabled", true);
            $("#btnComd" + item).show();
            $("#btnCheck" + item).hide();
        };

        gestionAperturaCaja.focusCampo = function (item) {
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

        gestionAperturaCaja.changeSubtotal = function (item) {
            item.valor = item.nombreDenominacion * $("#inputHid" + item.idDenominacion).val();
            gestionAperturaCaja.calcularTotal();
        };

        gestionAperturaCaja.calcularTotal = function () {
            var i;
            gestionAperturaCaja.totalApertura = 0;
            for (i = 0; i < gestionAperturaCaja.aperturaCierreCaja.denominaciones.length; i++) {
                gestionAperturaCaja.totalApertura = parseInt(gestionAperturaCaja.totalApertura) + parseInt(gestionAperturaCaja.aperturaCierreCaja.denominaciones[i].valor);
            }
        };

        $(document).ready(function () {
            gestionAperturaCaja.disabledInput = false;
            gestionAperturaCaja.totalApertura = 0;
        });

        gestionAperturaCaja.cierreCaja = function (item) {
            localStorageService.remove('ciereCaja');
            gestionAperturaCaja.aperturaCierreCaja.codigo = item.codigo;
            gestionAperturaCaja.aperturaCierreCaja.nombre = item.nombre;
            gestionAperturaCaja.aperturaCierreCaja.ubicacion = item.ubicacion;
            gestionAperturaCaja.aperturaCierreCaja.estado = item.estado;
            gestionAperturaCaja.aperturaCierreCaja.cajero = item.cajero;
            gestionAperturaCaja.aperturaCierreCaja.id = item.id;
            localStorageService.set('ciereCaja', gestionAperturaCaja.aperturaCierreCaja);
            $location.path('/cierre-caja');
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

        gestionAperturaCaja.onGenerarReporte = function (recibo) {
            appConstant.MSG_REPORTE();
            appConstant.CARGANDO();
            gestionAperturaCaja.item = [];
            var headers = {
                Authorization: localStorageService.get('autorizacion').token,
                Campus: localStorageService.get('autorizacion').objectResponse.idUniversidad
            };
            var objReportApertura = {
                AperturaCaja: recibo
            };
            var jsonString = JSON.stringify(objReportApertura);
            jsonString = "4" + jsonString;
            var urlRequest = '/api/financiero/report/crearReport/';
            $http.post(urlRequest, jsonString, headers).then(function (data) {
                appConstant.CERRAR_SWAL();
                if (data.status === 200) {
                    gestionAperturaCaja.item.push(data.data.message);
                    gestionAperturaCaja.download(gestionAperturaCaja.item[0]);
                    $location.path('/apertura-cierre-caja');
                } else {
                    appConstant.MSG_REPORTE_ERROR();
                    $location.path('/apertura-cierre-caja');
                }
            }).catch(function (e) {
                appConstant.MSG_REPORTE_ERROR();
                appConstant.CERRAR_SWAL();
                $location.path('/apertura-cierre-caja');
                throw e;
            });
        };

        gestionAperturaCaja.download = function (itemArc) {
            var file = utilServices.downloadArchivo(itemArc, appGenericConstant.MICRO_SERVICIO_FINANCIERO);
            if (file !== null && itemArc !== null && itemArc !== undefined) {
                utilServices.downloadReporte(file, itemArc);
                appConstant.CERRAR_SWAL();
            } else {
                appConstant.MSG_REPORTE_ERROR();
                appConstant.CERRAR_SWAL();
            }
        };
        onBuscar();
    }
})();




