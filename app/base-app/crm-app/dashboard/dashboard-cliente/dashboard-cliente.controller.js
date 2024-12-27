(function () {
    'use strict';
    angular.module('mytodoApp').controller('DashboardClienteCtrl', DashboardClienteCtrl);
    DashboardClienteCtrl.$inject = ['dashboardClienteService', 'utilServices', 'appConstant', '$scope', '$interval', 'appGenericConstant', 'appConstantValueList'];
    function DashboardClienteCtrl(dashboardClienteService, utilServices, appConstant, $scope, $interval, appGenericConstant, appConstantValueList) {
        var dashboardClienteControl = this;
        dashboardClienteControl.dashboardCliente = dashboardClienteService.dashboardCliente;
        dashboardClienteControl.dashboardClienteAuxiliar = dashboardClienteService.dashboardClienteAuxiliar;
        dashboardClienteControl.listaModalidadesCartera;
        dashboardClienteControl.listaPeriodoAcademicosCartera;
        dashboardClienteControl.listaProgramasAcademicos;
        dashboardClienteControl.counter = 0;

        dashboardClienteControl.onCambiarSelectPeriodoAcademico = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            dashboardClienteService.listaPeriodosAcademicosCartera().then(function (data) {
                dashboardClienteControl.listaPeriodoAcademicosCartera = data;
                if (data[0]) {
                    consultarGraficaPreinscritosMatriculados(dashboardClienteControl.dashboardCliente.modalidad1, dashboardClienteControl.dashboardCliente.periodoAcademico);
                    consultarGraficaIngresosDifusion(dashboardClienteControl.dashboardCliente.modalidad2, dashboardClienteControl.dashboardCliente.periodoAcademico);
                    consultarGraficaMatriculadosUbicacion(dashboardClienteControl.dashboardCliente.modalidad3, dashboardClienteControl.dashboardCliente.periodoAcademico);
                }
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                swal(appGenericConstant.HUBO_PROBLEMA,
                        appGenericConstant.ERROR_INTERNO_SISTEMA,
                        appGenericConstant.WARNING);
                return;
            });
        };

        function consultarListaModalidadesCartera() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_AREA_MODALIDAD, appGenericConstant.MICRO_SERVICIO_CRM).then(function (data) {
                dashboardClienteControl.listaModalidadesCartera = data;
                if (data[1]) {
                    dashboardClienteControl.dashboardCliente.modalidad1 = dashboardClienteControl.listaModalidadesCartera[1].codigo;
                    dashboardClienteControl.dashboardCliente.modalidad2 = dashboardClienteControl.listaModalidadesCartera[1].codigo;
                    dashboardClienteControl.dashboardCliente.modalidad3 = dashboardClienteControl.listaModalidadesCartera[1].codigo;
                    consultarListaPeridosAcademicosCartera();
                }
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                swal(appGenericConstant.HUBO_PROBLEMA,
                        appGenericConstant.ERROR_INTERNO_SISTEMA,
                        appGenericConstant.WARNING);
                return;
            });
        }

        function onConsultarProgramas() {
            dashboardClienteService.buscarProgramasAcademicos().then(function (data) {
                dashboardClienteControl.listaProgramasAcademicos = data;
            });
        }


        function consultarListaPeridosAcademicosCartera() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            dashboardClienteService.listaPeriodosAcademicosCartera().then(function (data) {
                dashboardClienteControl.listaPeriodoAcademicosCartera = data;
                if (data[0]) {
                    dashboardClienteControl.dashboardCliente.periodoAcademico = dashboardClienteControl.listaPeriodoAcademicosCartera[0].id;
                    consultarGraficaPreinscritosMatriculados(dashboardClienteControl.dashboardCliente.modalidad1, dashboardClienteControl.dashboardCliente.periodoAcademico);
                    consultarGraficaIngresosDifusion(dashboardClienteControl.dashboardCliente.modalidad2, dashboardClienteControl.dashboardCliente.periodoAcademico);
                    consultarGraficaMatriculadosUbicacion(dashboardClienteControl.dashboardCliente.modalidad3, dashboardClienteControl.dashboardCliente.periodoAcademico);
                }
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                swal(appGenericConstant.HUBO_PROBLEMA,
                        appGenericConstant.ERROR_INTERNO_SISTEMA,
                        appGenericConstant.WARNING);
                return;
            });
        }
        ;

        dashboardClienteControl.onCambiarSelectModalidadPreinscritosMatriculados = function () {
            dashboardClienteControl.counter = 0;
            consultarGraficaPreinscritosMatriculados(dashboardClienteControl.dashboardCliente.modalidad1, dashboardClienteControl.dashboardCliente.periodoAcademico);
            dashboardClienteControl.dashboardCliente.modalidad1;
            dashboardClienteControl.dashboardCliente.periodoAcademico;
        };

        dashboardClienteControl.onCambiarSelectModalidadIngresosDifusion = function () {
            dashboardClienteControl.counter = 0;
            consultarGraficaIngresosDifusion(dashboardClienteControl.dashboardCliente.modalidad2, dashboardClienteControl.dashboardCliente.periodoAcademico);
            dashboardClienteControl.dashboardCliente.modalidad2;
            dashboardClienteControl.dashboardCliente.periodoAcademico;
        };

        dashboardClienteControl.onCambiarSelectMatriculadosUbicacion = function () {
            dashboardClienteControl.counter = 0;
            consultarGraficaMatriculadosUbicacion(dashboardClienteControl.dashboardCliente.modalidad3, dashboardClienteControl.dashboardCliente.periodoAcademico);
            dashboardClienteControl.dashboardCliente.modalidad3;
            dashboardClienteControl.dashboardCliente.periodoAcademico;
        };

        dashboardClienteControl.onCambiarSelectMatriculadosUbicacionPorPrograma = function () {
            dashboardClienteControl.counter = 0;
            consultarGraficaMatriculadosUbicacionPorPrograma(dashboardClienteControl.dashboardCliente.modalidad3, dashboardClienteControl.dashboardCliente.periodoAcademico, dashboardClienteControl.dashboardCliente.programaAcademico);
            dashboardClienteControl.dashboardCliente.modalidad3;
            dashboardClienteControl.dashboardCliente.periodoAcademico;
            dashboardClienteControl.dashboardCliente.programaAcademico;
        };

        dashboardClienteControl.refrescarDatos = function () {
//            refreshGraficas;
        };

//        var refreshGraficas = function counter() {
//            dashboardClienteControl.counter = dashboardClienteControl.counter + 1;
//            if (dashboardClienteControl.counter === 10) {
//                dashboardClienteControl.onCambiarSelectModalidadPreinscritosMatriculados();
//                dashboardClienteControl.onCambiarSelectModalidadIngresosDifusion();
//                if (dashboardClienteControl.dashboardCliente.programaAcademico === null || dashboardClienteControl.dashboardCliente.programaAcademico === undefined || dashboardClienteControl.dashboardCliente.programaAcademico === '') {
//                    dashboardClienteControl.onCambiarSelectMatriculadosUbicacion();
//                }
//                else {
//                    dashboardClienteControl.onCambiarSelectMatriculadosUbicacionPorPrograma();
//                }
//                dashboardClienteControl.counter = 0;
//            }
//        };

//        var promise = $interval(refreshGraficas, 1000);

        function consultarGraficaPreinscritosMatriculados(modalidad, periodoAcademico) {
            dashboardClienteControl.dataPreinscritosMatriculados = [];
            dashboardClienteService.consultarGraficaPreinscritosMastriculados(modalidad, periodoAcademico).then(function (data) {
                for (var j = 0; j < data.responseList.length; j++) {
                    for (var i = 0; i < data.responseList[j].listaDatasObject.length; i++) {
                        var graph = {
                            key: data.responseList[j].listaDatasObject[i].name,
                            values: data.responseList[j].listaDatasObject[i].listaEtapas
                        };
                        dashboardClienteControl.dataPreinscritosMatriculados.push(graph);
                    }
                }
            });
        }


        function consultarGraficaIngresosDifusion(modalidad, periodoAcademico) {
            dashboardClienteControl.dataIngresosDifusion = [];
            dashboardClienteService.consultarGraficaIngresosDifusion(modalidad, periodoAcademico).then(function (data) {
                for (var j = 0; j < data.responseList.length; j++) {
                    for (var i = 0; i < data.responseList[j].listaDatasObject.length; i++) {
                        var graph = {
                            key: data.responseList[j].listaDatasObject[i].name,
                            values: data.responseList[j].listaDatasObject[i].listaEtapas
                        };
                        dashboardClienteControl.dataIngresosDifusion.push(graph);
                    }
                }
            });
        }

        function consultarGraficaMatriculadosUbicacion(modalidad, periodoAcademico) {
            dashboardClienteControl.dataMatriculadosUbicacion = [];
            dashboardClienteService.consultarGraficaMatriculadosUbicacion(modalidad, periodoAcademico).then(function (data) {
                for (var j = 0; j < data.responseList.length; j++) {
                    for (var i = 0; i < data.responseList[j].listaDatasObject.length; i++) {
                        var graph = {
                            key: data.responseList[j].listaDatasObject[i].name,
                            values: data.responseList[j].listaDatasObject[i].listaEtapas
                        };
                        dashboardClienteControl.dataMatriculadosUbicacion.push(graph);
                    }
                }
            });
        }

        function consultarGraficaMatriculadosUbicacionPorPrograma(modalidad, periodoAcademico, idPrograma) {
            if (idPrograma !== null) {
                dashboardClienteControl.dataMatriculadosUbicacion = [];
                dashboardClienteService.consultarGraficaMatriculadosUbicacionPorPrograma(modalidad, periodoAcademico, idPrograma).then(function (data) {
                    for (var j = 0; j < data.responseList.length; j++) {
                        for (var i = 0; i < data.responseList[j].listaDatasObject.length; i++) {
                            var graph = {
                                key: data.responseList[j].listaDatasObject[i].name,
                                values: data.responseList[j].listaDatasObject[i].listaEtapas
                            };
                            dashboardClienteControl.dataMatriculadosUbicacion.push(graph);
                        }
                    }
                });
            } else {
                consultarGraficaMatriculadosUbicacion(modalidad, periodoAcademico);
            }
        }

        dashboardClienteControl.opcionesBarHorizontal = {
            chart: {
                type: 'multiBarChart',
                height: 500,
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value;
                },
                showControls: false,
                showValues: true,
                duration: 500,
                margin: {
                    top: 40,
                    right: 20,
                    bottom: 150,
                    left: 40
                },
                yAxis: {
                    tickFormat: function (d) {
                        return d3.format(',.02f')(d);
                    }
                },
                noData: 'No hay datos.',
                xAxis: {
                    rotateLabels: 45
                }
            }
        };

        dashboardClienteControl.opcionesBarVertical = {
            chart: {
                type: 'multiBarHorizontalChart',
                height: 500,
                x: function (d) {
                    return d.label;
                },
                y: function (d) {
                    return d.value;
                },
                showControls: false,
                showValues: true,
                duration: 500,
                margin: {
                    top: 40,
                    right: 10,
                    bottom: 80,
                    left: 80
                },
                noData: 'No hay datos.',
                wrapLabels: true
            }
        };

        $scope.config = {
            visible: true, // default: true
            extended: false, // default: false
            disabled: false, // default: false
            refreshDataOnly: true, // default: true
            deepWatchOptions: false, // default: true
            deepWatchData: true, // default: true
            deepWatchDataDepth: 1, // default: 2
            debounce: 0 // default: 10
        };

        dashboardClienteControl.getTotalBarriosPrograma = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].value);
            }
            return Math.round(totalNumber);
        };
        
        dashboardClienteControl.getTotalBarrios = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].value);
            }
            return Math.round(totalNumber);
        };


        consultarListaModalidadesCartera();
//        consultarListaPeridosAcademicosCartera();
        onConsultarProgramas();

    }
})();

