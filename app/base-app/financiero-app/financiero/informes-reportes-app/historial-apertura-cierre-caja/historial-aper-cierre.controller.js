(function () {
    'use strict';
    angular.module('mytodoApp').controller('HistorialApeCierreCajaCtrl', HistorialApeCierreCajaCtrl);
    HistorialApeCierreCajaCtrl.$inject = ['$scope', 'historialApeCierreCajaService', 'ValidationService',  'localStorageService', '$filter', '$http',  'utilServices', 'appConstant', 'appGenericConstant'];
    function HistorialApeCierreCajaCtrl($scope, historialApeCierreCajaService, ValidationService,  localStorageService, $filter, $http,  utilServices, appConstant, appGenericConstant) {

        var gestionHistorial = this;
        gestionHistorial.listadoCajaMovimientos = [];
        gestionHistorial.historial = historialApeCierreCajaService.historial;
        gestionHistorial.historialAuxiliar = historialApeCierreCajaService.historialAuxiliar;
        gestionHistorial.historialAuxiliar.mostrarTabla = false;
        gestionHistorial.options = appConstant.FILTRO_TABLAS;
        gestionHistorial.report = {
            selected: null
        };
        gestionHistorial.selectedOption = gestionHistorial.options[0];
        gestionHistorial.selectTodos = false;
        gestionHistorial.disabledCampos = false;
        gestionHistorial.filtrados = [];
        function onValidarFechasNulas() {
            var rpt = true;
            var rptInicio = false;
            var rptFin = false;
            if (gestionHistorial.fechaApertura === null || gestionHistorial.fechaApertura === undefined || gestionHistorial.fechaApertura === '') {
                rptInicio = true;
            }
            if (gestionHistorial.fechaCierre === null || gestionHistorial.fechaCierre === undefined || gestionHistorial.fechaCierre === '') {
                rptFin = true;
            }
            if (rptInicio && rptFin) {
                return rpt = false;
            }
            if (!rptInicio && !rptFin) {
                return rpt = false;
            }
            return rpt;
        }

        gestionHistorial.onConsultarListado = function () {
            if (new ValidationService().checkFormValidity($scope.formConsulta)) {
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
                if (onValidarFechasNulas()) {
                    gestionHistorial.historialAuxiliar.mostrarTabla = false;
                    gestionHistorial.listadoCajaMovimientos = [];
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.SELECCIONAR_RANGO);
                    return;
                }

                historialApeCierreCajaService.consultarBetweenFechas(toDate(gestionHistorial.fechaApertura), toDate(gestionHistorial.fechaCierre)).then(function (data) {
                    if (data.length === 0 || data === undefined || data === null) {
                        gestionHistorial.historialAuxiliar.mostrarTabla = false;
                        gestionHistorial.listadoCajaMovimientos = [];
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NO_ENCONTRARON_COINCIDENCIAS);
                        return;
                    }
                    gestionHistorial.listadoCajaMovimientos = [];
                    angular.forEach(data, function (value) {
                        gestionHistorial.historialEntidad = {
                            descripcion: value.descripcion,
                            estadoArqueo: value.estadoArqueo,
                            fechaApertura: $filter('date')(value.fechaApertura, "dd/MM/yyyy HH:mm:ss"),
                            fechaCierre: $filter('date')(value.fechaCierre, "dd/MM/yyyy HH:mm:ss"),
                            fechaAperturaSt: value.fechaAperturaSt,
                            fechaCierreSt: value.fechaCierreSt,
                            id: value.id,
                            idCaja: value.idCaja,
                            idCajero: value.idCajero,
                            idSupervisorApertura: value.idSupervisorApertura,
                            idSupervisorCierre: value.idSupervisorCierre,
                            nombreCaja: value.nombreCaja,
                            nombreCajero: value.nombreCajero,
                            nombreSupervisorApertura: value.nombreSupervisorApertura,
                            nombreSupervisorCierre: value.nombreSupervisorCierre,
                            ubicacion: value.ubicacion,
                            totalApertura: value.totalApertura,
                            totalDirerenciaCierre: value.totalDirerenciaCierre,
                            totalRealCierre: value.totalRealCierre,
                            totalSistemaCierre: value.totalSistemaCierre,
                            totalArqueoCheque: value.totalArqueoCheque,
                            totalArqueoTarjetaDebito: value.totalArqueoTarjetaDebito,
                            totalArqueoTarjetaCredito: value.totalArqueoTarjetaCredito,
                            totalArqueoSuperGiros: value.totalArqueoSuperGiros,
                            totalArqueoEfectivo: value.totalArqueoEfectivo
                        };
                        gestionHistorial.listadoCajaMovimientos.push(gestionHistorial.historialEntidad);
                        gestionHistorial.historialAuxiliar.mostrarTabla = true;
                    });
                    appConstant.CERRAR_SWAL();
                }).catch(function (e) {
                    appConstant.MSG_GROWL_ERROR();
                    appConstant.CERRAR_SWAL();
                    return;
                });
            }
        };

        gestionHistorial.onVerDetalle = function (item) {
            if (item.totalDirerenciaCierre >= 0) {
                gestionHistorial.clase = "text-success";
            } else {
                gestionHistorial.clase = "text-danger";
            }
            gestionHistorial.totalApertura = item.totalApertura;
            gestionHistorial.totalDirerenciaCierre = item.totalDirerenciaCierre;
            gestionHistorial.totalRealCierre = item.totalRealCierre;
            gestionHistorial.totalSistemaCierre = item.totalSistemaCierre;
            gestionHistorial.historial.descripcion = item.descripcion;
            gestionHistorial.historial.estadoArqueo = item.estadoArqueo;
            gestionHistorial.historial.fechaApertura = item.fechaApertura;
            gestionHistorial.historial.fechaCierre = item.fechaCierre;
            gestionHistorial.historial.fechaAperturaSt = item.fechaAperturaSt;
            gestionHistorial.historial.fechaCierreSt = item.fechaCierreSt;
            gestionHistorial.historial.id = item.id;
            gestionHistorial.historial.idCaja = item.idCaja;
            gestionHistorial.historial.idCajero = item.idCajero;
            gestionHistorial.historial.idSupervisorApertura = item.idSupervisorApertura;
            gestionHistorial.historial.idSupervisorCierre = item.idSupervisorCierre;
            gestionHistorial.historial.nombreCaja = item.nombreCaja;
            gestionHistorial.historial.nombreCajero = item.nombreCajero;
            gestionHistorial.historial.nombreSupervisorApertura = item.nombreSupervisorApertura;
            gestionHistorial.historial.nombreSupervisorCierre = item.nombreSupervisorCierre;
            gestionHistorial.historial.ubicacion = item.ubicacion;
            gestionHistorial.historial.totalApertura = $filter('currency')(item.totalApertura);
            gestionHistorial.historial.totalDirerenciaCierre = $filter('currency')(item.totalDirerenciaCierre);
            gestionHistorial.historial.totalRealCierre = $filter('currency')(item.totalRealCierre);
            gestionHistorial.historial.totalSistemaCierre = $filter('currency')(item.totalSistemaCierre);
            gestionHistorial.historial.totalArqueoCheque = item.totalArqueoCheque;
            gestionHistorial.historial.totalArqueoTarjetaDebito = item.totalArqueoTarjetaDebito;
            gestionHistorial.historial.totalArqueoSuperGiros= item.totalArqueoSuperGiros;
            gestionHistorial.historial.totalArqueoTarjetaCredito = item.totalArqueoTarjetaCredito;
            gestionHistorial.historial.totalArqueoEfectivo = item.totalArqueoEfectivo;
            mostrarModal();
        };


        function toDate(dateStr) {
            var dateStrLong;
            if (typeof dateStr === 'undefined' || typeof dateStr === null) {
                dateStr = null;
                return dateStr;
            } else {
                var parts = [];
                if (dateStr.match('/')) {
                    parts = dateStr.split('/');
                } else {
                    parts = dateStr.split('-');
                }
                dateStr = new Date(parts[2], parts[1] - 1, parts[0]);
                dateStrLong = Date.parse(dateStr);
                return dateStrLong;
            }
        }

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

        function mostrarModal() {
            $("#myModal").modal("show");
            $('#myModal').modal({backdrop: 'static', keyboard: false});
        }


        gestionHistorial.onReporteCierreCaja = function () {
            appConstant.MSG_REPORTE();
            appConstant.CARGANDO();
            historialApeCierreCajaService.reporteCierreCaja(gestionHistorial.historial.idCaja, gestionHistorial.historial.id).then(function (data) {
                if (data !== null) {
                    var egresos = [];
                    angular.forEach(data.egresoCajaDTOList, function (value) {
                        var egreso = {
                            nombreConcepto: value.nombreConcepto,
                            monto: value.monto,
                            fechaEgreso: $filter('date')(value.fechaEgreso, appGenericConstant.FECHA_DDMMYYYY),
                            descripcion: value.descripcion
                        }
                        egresos.push(egreso);
                    });

                    
                    var reporteCierre = {
                        idUniversidad: data.idUniversidad,
                        direccionUniversidad: data.direccionUniversidad,
                        telefonoUniversidad: data.telefonoUniversidad,
                        ciudad: data.ciudad,
                        nombreCaja: gestionHistorial.historial.nombreCaja,
                        nombreCajero: gestionHistorial.historial.nombreCajero,
                        nombreSupervisor: gestionHistorial.historial.nombreSupervisorCierre,
                        fechaCierreSt: gestionHistorial.historial.fechaCierreSt,
                        totalValorSistemaCierre: gestionHistorial.totalSistemaCierre,
                        totalValorRealCierre: gestionHistorial.totalRealCierre,
                        totalValorDiferenciaCierre: gestionHistorial.totalDirerenciaCierre,
                        totalEgreso: data.flujoActual.egreso,
                        totalApertura: gestionHistorial.totalApertura,
                        totalArqueoCheque: gestionHistorial.historial.totalArqueoCheque,
                        totalArqueoTarjetaDebito: gestionHistorial.historial.totalArqueoTarjetaDebito,
                        totalArqueoTarjetaCredito: gestionHistorial.historial.totalArqueoTarjetaCredito,
                        totalArqueoSuperGiros: gestionHistorial.historial.totalArqueoSuperGiros,
                        totalArqueoEfectivo: gestionHistorial.historial.totalArqueoEfectivo,
                        resumenFormaPagoList: data.resumenFormaPagoList,
                        chequeList: data.chequeList,
                        cajaDenominacionList: data.cajaDenominacionList,
                        debitoList: data.debitoList,
                        creditoList: data.creditoList,
                        supergirosList: data.supergirosList,
                        mostrarChequeList: data.chequeList.length > 0,
                        mostrarDebitoList: data.debitoList.length > 0,
                        mostrarCreditoList: data.creditoList.length > 0,
                        mostrarSupergirosList: data.supergirosList.length > 0,
                        conceptoEgresoList: egresos,
                        mostrarEgresoList: data.egresoCajaDTOList.length > 0
                    };

                    var objReportCierreCaja = {
                        CierreCaja: reporteCierre
                    };

                    onGenerarReporteDirecto(objReportCierreCaja, 5);
                }
            }).catch(function (e) {
                appConstant.MSG_REPORTE_ERROR();
                appConstant.CERRAR_SWAL();
                throw e;
            });
        };


        gestionHistorial.onReporteAperturaCaja = function () {
            appConstant.MSG_REPORTE();
            appConstant.CARGANDO();
            historialApeCierreCajaService.reporteAperturaCaja(gestionHistorial.historial.id).then(function (data) {
                var recibo = {
                    caja: gestionHistorial.historial.nombreCaja,
                    cajero: gestionHistorial.historial.nombreCajero,
                    supervisor: gestionHistorial.historial.nombreSupervisorCierre,
                    fechaAperturaSt: gestionHistorial.historial.fechaAperturaSt,
                    totalApertura: gestionHistorial.totalApertura,
                    cajaDenominacionList: data.cajaDenominacionList
                };
                var objReportCierreCaja = {
                    AperturaCaja: recibo
                };
                onGenerarReporteDirecto(objReportCierreCaja, 4);
            }).catch(function (e) {
                appConstant.MSG_REPORTE_ERROR();
                appConstant.CERRAR_SWAL();
                throw e;
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

    }
})();


