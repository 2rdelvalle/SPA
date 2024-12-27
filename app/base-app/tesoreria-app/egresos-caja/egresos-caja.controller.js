(function () {
    'use strict';
    angular.module('mytodoApp').controller('egresosCtrl', egresosCtrl);

    egresosCtrl.$inject = ['$scope', 'egresosServices', '$filter', 'ValidationService', 'localStorageService', 'utilServices', '$http', '$window', 'appConstant', 'appGenericConstant', '$interval'];
    function egresosCtrl($scope, egresosServices, $filter, ValidationService, localStorageService, utilServices, $http, $window, appConstant, appGenericConstant, $interval) {
        var gestionEgresos = this;
        gestionEgresos.egresosEntity = egresosServices.egresosEntity;
        gestionEgresos.egresosAuxiliar = egresosServices.egresosAuxiliar;
        gestionEgresos.egresosEntity.fechaActual = onFormattedDate(new Date()) + ' ' + onFormattedHour(new Date());
        gestionEgresos.format = 'dd/MM/yyyy h:mm:ss a';
        gestionEgresos.listaTiposMoneda = [];
        gestionEgresos.listaConceptoDescuento = [];
        gestionEgresos.sumaImporteTransacciones = 0;
        gestionEgresos.egresosEntity.saldoRestante;
        gestionEgresos.egresosAuxiliar.cajaSinAbrir = false;
        gestionEgresos.egresosAuxiliar.cajaEnCero = false;
        gestionEgresos.egresosAuxiliar.onDisabled = false;
        gestionEgresos.counter = 0;

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
                gestionEgresos.listaTiposMoneda = data;
                gestionEgresos.egresosEntity.tipoMoneda = gestionEgresos.listaTiposMoneda[0].codigo;
            });
        }

        function onObtenerConceptosDescuentos() {
            egresosServices.buscarConceptosDescuentos().then(function (data) {
                gestionEgresos.listaConceptoDescuento = data;
            });
        }

        function onComprobarUsuario() {
            appConstant.MSG_CONFIRMACION();
            appConstant.CARGANDO();
            gestionEgresos.counter = 0;
            egresosServices.getUsuario(localStorageService.get('autorizacion').objectResponse.userDto.id).then(function (data) {
                gestionEgresos.egresosEntity.nombreCaja = data.objectResponse.codigo + ' - ' + data.objectResponse.nombre;
                appConstant.CERRAR_SWAL();
                gestionEgresos.egresosEntity.idCaja = data.objectResponse.id;
                gestionEgresos.egresosEntity.totalCaja = data.objectResponse.flujoCajaActual.actual;
                if (gestionEgresos.egresosEntity.totalCaja === 0) {
                    gestionEgresos.egresosAuxiliar.cajaEnCero = true;
                    gestionEgresos.egresosAuxiliar.onDisabled = true;
                    return;
                }
                gestionEgresos.egresosAuxiliar.cajaSinAbrir = false;
                gestionEgresos.egresosAuxiliar.onDisabled = false;
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                gestionEgresos.egresosAuxiliar.cajaSinAbrir = true;
                gestionEgresos.egresosAuxiliar.onDisabled = true;
                return;
            });
        }

        var refreshTabla = function counter() {
            gestionEgresos.counter = gestionEgresos.counter + 1;
            if (gestionEgresos.counter === 8) {
                egresosServices.getUsuario(localStorageService.get('autorizacion').objectResponse.userDto.id).then(function (data) {
                    if (data.objectResponse.flujoCajaActual.actual === 0) {
                        gestionEgresos.egresosAuxiliar.cajaEnCero = true;
                        gestionEgresos.egresosAuxiliar.onDisabled = true;
                        return;
                    }
                    gestionEgresos.egresosAuxiliar.cajaSinAbrir = false;
                    gestionEgresos.egresosAuxiliar.onDisabled = false;
                    gestionEgresos.counter = 0;
                });
            }
        };

        gestionEgresos.cancelarInterval = function () {
            //
        };

        gestionEgresos.onGuardarEgreso = function () {
            if (new ValidationService().checkFormValidity($scope.formAgregarEgresos)) {
                appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
                appConstant.CARGANDO();
                if (gestionEgresos.egresosEntity.monto === 0) {
                    appConstant.CERRAR_SWAL();
                    gestionEgresos.egresosAuxiliar.cajaEnCero = true;
                } else if (gestionEgresos.egresosEntity.monto > gestionEgresos.egresosEntity.totalCaja) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.MONTO_MAYOR_A_CAJA);
                } else {
                    var egreso = {
                        idMoneda: gestionEgresos.egresosEntity.tipoMoneda,
                        monto: gestionEgresos.egresosEntity.monto,
                        beneficiario: appConstant.VALIDAR_STRING(gestionEgresos.egresosEntity.beneficiario),
                        descripcion: gestionEgresos.egresosEntity.descripcion,
                        idConcepto: gestionEgresos.egresosEntity.conceptoDescuento,
                        idCaja: gestionEgresos.egresosEntity.idCaja,
                        idCajero: localStorageService.get('autorizacion').objectResponse.userDto.id
                    };
                    egresosServices.agregarEgreso(egreso).then(function (data) {
                        onComprobarUsuario();
                        gestionEgresos.egresosEntity.tipoMoneda = gestionEgresos.listaTiposMoneda[0].codigo;
                        gestionEgresos.egresosEntity.monto = null;
                        gestionEgresos.egresosEntity.conceptoDescuento = null;
                        gestionEgresos.egresosEntity.descripcion = null;
                        gestionEgresos.egresosEntity.beneficiario = null;
                        new ValidationService().resetForm($scope.formAgregarEgresos);
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_OK(data.message);
                        //gestionEgresos.onGenerarReporte(data.object);
                        var objReportRecibo = {
                            EgresoCaja: data.object
                        };
                        onGenerarReporteDirecto(objReportRecibo, 6)
                        if (gestionEgresos.egresosEntity.totalCaja === 0) {
                            gestionEgresos.egresosAuxiliar.cajaEnCero = true;
                            gestionEgresos.egresosAuxiliar.onDisabled = true;
                        } else {
                            gestionEgresos.egresosAuxiliar.cajaEnCero = false;
                        }
                    });

                }
            }
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

        gestionEgresos.download = function (itemArc) {
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

        onObtenerTiposMoneda();
        onComprobarUsuario();
        onObtenerConceptosDescuentos();
    }

})();