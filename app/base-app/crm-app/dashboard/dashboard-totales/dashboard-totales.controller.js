(function () {
    'use strict';
    angular.module('mytodoApp').controller('DashboardTotalesCtrl', DashboardTotalesCtrl);
    DashboardTotalesCtrl.$inject = ['dashboardTotalesService', 'utilServices', 'appConstant', '$scope', '$interval', 'appGenericConstant', 'appConstantValueList'];
    function DashboardTotalesCtrl(dashboardTotalesService, utilServices, appConstant, $scope, $interval, appGenericConstant, appConstantValueList) {
        var dashboardTotalesControl = this;
        dashboardTotalesControl.dashboardTotales = dashboardTotalesService.dashboardTotales;
        dashboardTotalesControl.dashboardTotalesAuxiliar = dashboardTotalesService.dashboardTotalesAuxiliar;
        dashboardTotalesControl.listaPeriodoAcademicos;
        dashboardTotalesControl.listaSemestreAcademico;
        dashboardTotalesControl.listaTop;
        dashboardTotalesControl.listaOrden;
        dashboardTotalesControl.counter = 0;

        function onCargarListas() {
            dashboardTotalesControl.listaTop = [{id: 20, nombreTop: '20'}, {id: 40, nombreTop: '40'}, {id: 60, nombreTop: '60'}, {id: 80, nombreTop: '80'}];
            dashboardTotalesControl.listaOrden = [{id: 'ASC', nombreOrden: 'Ascendente'}, {id: 'DESC', nombreOrden: 'Descendente'}];
            dashboardTotalesControl.dashboardTotales.top = dashboardTotalesControl.listaTop[0].id;
            dashboardTotalesControl.dashboardTotales.orden = dashboardTotalesControl.listaOrden[0].id;
//            consultarGraficaTotalMatriculadosColegios(dashboardTotalesControl.dashboardTotales.periodoAcademico2,
//                                                      dashboardTotalesControl.dashboardTotales.top,
//                                                      dashboardTotalesControl.dashboardTotales.orden);
        }

        function consultarGraficaMatriculadosPeriodo() {
            dashboardTotalesControl.dataMatriculadosPeriodo = [];
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            dashboardTotalesService.consultarGraficaMatriculadosPeriodo().then(function (data) {
                angular.forEach(data.responseList, function (value, key) {

                    if (value[0] === null || value[0] === undefined || value[0] === "") {

                    } else {
                        var graph = {
                            nombrePrograma: value[0],
                            periodo: value[2],
                            cantidad: value[3],
                            nivelFormacion: value[4]
                        };
                        dashboardTotalesControl.dataMatriculadosPeriodo.push(graph);
                    }
                });
                appConstant.CERRAR_SWAL();
            });
        }

        function consultarGraficaTotalModadalidadesPeriodo() {
            dashboardTotalesControl.dataTotalModalidadesPeriodo = [];
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            dashboardTotalesService.consultarGraficaTotalesModalidadesPeriodos().then(function (data) {
                angular.forEach(data.responseList, function (value, key) {
                    var graph = {
                        nombreModalidad: value[0],
                        periodo: value[1],
                        cantidad: value[2]
                    };
                    dashboardTotalesControl.dataTotalModalidadesPeriodo.push(graph);
                });
                appConstant.CERRAR_SWAL();
            });
        }

        function consultarGraficaTotalModadalidadesBarrios(idPeriodoAcademico) {
            dashboardTotalesControl.dataTotalModalidadesBarrios = [];
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            dashboardTotalesService.consultarGraficaTotalesModalidadesBarrios(idPeriodoAcademico).then(function (data) {
                angular.forEach(data.responseList, function (value, key) {
                    var graph = {
                        barrio: value[0],
                        estado: value[1],
                        cantidad: value[2]
                    };
                    dashboardTotalesControl.dataTotalModalidadesBarrios.push(graph);
                });
                appConstant.CERRAR_SWAL();
            });
        }

        function consultarGraficaTotalMatriculadosSemestre() {
            dashboardTotalesControl.dataTotalMatriculadosSemestre = [];
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            dashboardTotalesService.consultarGraficaTotalMatriculadosSemestre().then(function (data) {
                angular.forEach(data.responseList, function (value, key) {
                    var graph = {
                        periodo: value[0],
                        semestre: value[1],
                        cantidad: value[2],
                        total: value[3]
                    };
                    dashboardTotalesControl.dataTotalMatriculadosSemestre.push(graph);
                });
                appConstant.CERRAR_SWAL();
            });
        }

        function consultarGraficaTotalMatriculadosSemestrePrograma() {
            dashboardTotalesControl.dataTotalMatriculadosSemestrePrograma = [];
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            dashboardTotalesService.consultarGraficaTotalMatriculadosSemestrePrograma().then(function (data) {
                angular.forEach(data.responseList, function (value, key) {
                    var graph = {
                        periodo: value[0],
                        programa: value[1],
                        cantidad: value[2],
                        total: value[3]
                    };
                    dashboardTotalesControl.dataTotalMatriculadosSemestrePrograma.push(graph);
                });
                appConstant.CERRAR_SWAL();
            });
        }

        function consultarGraficaTotalModalidadesHorariosPeriodos() {
            dashboardTotalesControl.dataTotalModalidadesHorariosPeriodos = [];
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            dashboardTotalesService.consultarGraficaTotalModalidadesHorariosPeriodos().then(function (data) {
                angular.forEach(data.responseList, function (value, key) {

//                    dashboardTotalesControl.dataTotalModalidadesHorariosPeriodos.push(graph);
                });
                appConstant.CERRAR_SWAL();
            });
        }

        function consultarGraficaTotalBarriosSemestre(semestre) {
            dashboardTotalesControl.dataTotalMatriculadosBarriosSemestre = [];
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            dashboardTotalesService.consultarGraficaTotalMatriculadosSemestreBarrios(semestre).then(function (data) {
                angular.forEach(data.responseList, function (value, key) {
                    var graph = {
                        barrio: value[1],
                        periodo: value[0],
                        cantidad: value[2],
                        total: value[3]
                    };
                    dashboardTotalesControl.dataTotalMatriculadosBarriosSemestre.push(graph);
                });
                appConstant.CERRAR_SWAL();
            });
        }

        function consultarGraficaTotalMatriculadosColegios(idPeriodoAcademico, top, orden) {
            dashboardTotalesControl.dataTotalMatriculadosColegios = [];
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            dashboardTotalesService.consultarGraficaTotalMatriculadosColegios(idPeriodoAcademico, top, orden).then(function (data) {
                angular.forEach(data.responseList, function (value, key) {
                    if (value[1] !== null) {
                        var graph = {
                            periodo: value[0],
                            colegio: value[1],
                            cantidad: value[2]
                        };
                        dashboardTotalesControl.dataTotalMatriculadosColegios.push(graph);
                    }
                });
                appConstant.CERRAR_SWAL();
            });
        }

        dashboardTotalesControl.getTotalMatriculadosPeriodo = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].cantidad);
            }
            return Math.round(totalNumber);
        };
        dashboardTotalesControl.getTotalMatriculadosPeriodoModalidad = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].cantidad);
            }
            return Math.round(totalNumber);
        };
        dashboardTotalesControl.getTotalMatriculadosBarrioEstado = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].cantidad);
            }
            return Math.round(totalNumber);
        };
        dashboardTotalesControl.getTotalCantidadMatriculadoSemestre = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].cantidad);
            }
            return Math.round(totalNumber);
        };
        dashboardTotalesControl.getTotalDineroMatriculadoSemestre = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].total);
            }
            return Math.round(totalNumber);
        };
        dashboardTotalesControl.getTotalCantidadMatriculadoSemestrePrograma = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].cantidad);
            }
            return Math.round(totalNumber);
        };
        dashboardTotalesControl.getTotalDineroMatriculadoSemestrePrograma = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].total);
            }
            return Math.round(totalNumber);
        };
        dashboardTotalesControl.getTotalCantidadMatriculadoSemestreBarrio = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].cantidad);
            }
            return Math.round(totalNumber);
        };
        dashboardTotalesControl.getTotalCantidadMatriculadoColegioPeriodo = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].cantidad);
            }
            return Math.round(totalNumber);
        };
        dashboardTotalesControl.getTotalDineroMatriculadoSemestreBarrio = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].total);
            }
            return Math.round(totalNumber);
        };

        //Cambio de periodo academico, que afecta la grafica totales de barrios por modalidades por periodo academico
        dashboardTotalesControl.onCambiarSelectPeriodoAcademico = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            dashboardTotalesService.listaPeriodosAcademicos().then(function (data) {
                dashboardTotalesControl.listaPeriodoAcademicos = data;
                if (data[0]) {
                    consultarGraficaTotalModadalidadesBarrios(dashboardTotalesControl.dashboardTotales.periodoAcademico);
                    consultarGraficaTotalMatriculadosColegios(dashboardTotalesControl.dashboardTotales.periodoAcademico2,
                            dashboardTotalesControl.dashboardTotales.top,
                            dashboardTotalesControl.dashboardTotales.orden);
                }
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                swal(appGenericConstant.HUBO_PROBLEMA, appGenericConstant.ERROR_INTERNO_SISTEMA, appGenericConstant.WARNING);
                return;
            });
        };

        dashboardTotalesControl.onCambiarSelectSemestre = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            dashboardTotalesService.listaSemestres().then(function (data) {
                dashboardTotalesControl.listaSemestreAcademico = data;
                if (data[0]) {
                    consultarGraficaTotalBarriosSemestre(dashboardTotalesControl.dashboardTotales.semestre);
                }
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                swal(appGenericConstant.HUBO_PROBLEMA, appGenericConstant.ERROR_INTERNO_SISTEMA, appGenericConstant.WARNING);
                return;
            });
        };

//
//        dashboardTotalesControl.onCambiarSelectTop = function () {
//            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
//            appConstant.CARGANDO();
//            if (dashboardTotalesControl.listaTop) {
//                consultarGraficaTotalMatriculadosColegios(dashboardTotalesControl.dashboardTotales.periodoAcademico2,
//                        dashboardTotalesControl.dashboardTotales.top,
//                        dashboardTotalesControl.dashboardTotales.orden);
//            }
//            appConstant.CERRAR_SWAL();
//        };
//
//        dashboardTotalesControl.onCambiarSelectOrden = function () {
//            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
//            appConstant.CARGANDO();
//            if (dashboardTotalesControl.listaOrden) {
//                consultarGraficaTotalMatriculadosColegios(dashboardTotalesControl.dashboardTotales.periodoAcademico2,
//                        dashboardTotalesControl.dashboardTotales.top,
//                        dashboardTotalesControl.dashboardTotales.orden);
//            }
//            appConstant.CERRAR_SWAL();
//        };
//        //Cambio de semestre, que afecta la grafica totales matriculados por barrios por semestre

//        //Cambio de semestre, que afecta la grafica totales matriculados por modalidades por horarios por semestre
//        dashboardTotalesControl.onCambiarSelectSemestreMatriculadosHorarios = function () {
//            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
//            appConstant.CARGANDO();
//            dashboardTotalesService.listaSemestres().then(function (data) {
//                dashboardTotalesControl.listaSemestreAcademico = data;
//                if (data[0]) {
//                    consultarGraficaTotalModalidadesHorariosPeriodosSemestre(dashboardTotalesControl.dashboardTotales.semestreMatriculadosHorarios);
//                }
//                appConstant.CERRAR_SWAL();
//            }).catch(function (e) {
//                swal(appGenericConstant.HUBO_PROBLEMA, appGenericConstant.ERROR_INTERNO_SISTEMA, appGenericConstant.WARNING);
//                return;
//            });
//        };
//
//        //Grafica de matriculados por periodos academicos por programas totalizados
//
//        //Consulta listado de periodos academicos
        function consultarListaPeridosAcademicos() {
            dashboardTotalesControl.dashboardTotales = {};
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            dashboardTotalesService.listaPeriodosAcademicos().then(function (data) {
                dashboardTotalesControl.listaPeriodoAcademicos = data;
                if (data[0]) {
                    dashboardTotalesControl.dashboardTotales.periodoAcademico = dashboardTotalesControl.listaPeriodoAcademicos[0].id;
                    dashboardTotalesControl.dashboardTotales.periodoAcademico2 = dashboardTotalesControl.listaPeriodoAcademicos[0].id;
                    consultarGraficaTotalModadalidadesBarrios(dashboardTotalesControl.dashboardTotales.periodoAcademico);
                    consultarGraficaTotalMatriculadosColegios(dashboardTotalesControl.dashboardTotales.periodoAcademico2,
                            dashboardTotalesControl.dashboardTotales.top,
                            dashboardTotalesControl.dashboardTotales.orden);
                }
            }).catch(function (e) {
                swal(appGenericConstant.HUBO_PROBLEMA, appGenericConstant.ERROR_INTERNO_SISTEMA, appGenericConstant.WARNING);
                return;
            });
        }
//
//        //Consulta listado de semestres
        function consultarListaSemestres() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            dashboardTotalesService.listaSemestres().then(function (data) {
                dashboardTotalesControl.listaSemestreAcademico = data;
                if (data[0]) {
                    dashboardTotalesControl.dashboardTotales.semestre = dashboardTotalesControl.listaSemestreAcademico[0].id;
                    dashboardTotalesControl.dashboardTotales.semestreMatriculadosHorarios = dashboardTotalesControl.listaSemestreAcademico[0].id;
                    consultarGraficaTotalBarriosSemestre(dashboardTotalesControl.dashboardTotales.semestre);
                }
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                swal(appGenericConstant.HUBO_PROBLEMA, appGenericConstant.ERROR_INTERNO_SISTEMA, appGenericConstant.WARNING);
                return;
            });
        }
//
////        function consultarGraficaTotalModadalidadesBarrios(idPeriodoAcademico) {
////            dashboardTotalesControl.dataTotalModalidadesBarrios = [];
////            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
////            appConstant.CARGANDO();
////            dashboardTotalesService.consultarGraficaTotalesModalidadesBarrios(idPeriodoAcademico).then(function (data) {
////                angular.forEach(data.responseList, function (value, key) {
////                    for (var i = 0; i < value.listaDatasObject.length; i++) {
////                        var graph = {
////                            key: value.listaDatasObject[i].name,
////                            values: value.listaDatasObject[i].listaEtapas
////                        };
////                        dashboardTotalesControl.dataTotalModalidadesBarrios.push(graph);
////                    }
////                });
////                appConstant.CERRAR_SWAL();
////            });
////        }
//

//
//        function consultarGraficaTotalModadalidadesBarrios(idPeriodoAcademico) {
//            dashboardTotalesControl.dataTotalModalidadesBarrios = [];
//            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
//            appConstant.CARGANDO();
//            dashboardTotalesService.consultarGraficaTotalesModalidadesBarrios(idPeriodoAcademico).then(function (data) {
//                angular.forEach(data.responseList, function (value, key) {
//                    for (var i = 0; i < value.listaDatasObject.length; i++) {
//                        var graph = {
//                            key: value.listaDatasObject[i].name,
//                            values: value.listaDatasObject[i].listaEtapas
//                        };
//                        dashboardTotalesControl.dataTotalModalidadesBarrios.push(graph);
//                    }
//                });
//                appConstant.CERRAR_SWAL();
//            });
//        }
//

//
//        function consultarGraficaTotalModadalidadesPeriodo() {
//            dashboardTotalesControl.dataTotalModalidadesPeriodo = [];
//            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
//            appConstant.CARGANDO();
//            dashboardTotalesService.consultarGraficaTotalesModalidadesPeriodos().then(function (data) {
//                angular.forEach(data.responseList, function (value, key) {
//                    for (var i = 0; i < value.listaDatasObject.length; i++) {
//                        var graph = {
//                            key: value.listaDatasObject[i].name,
//                            values: value.listaDatasObject[i].listaEtapas
//                        };
//                        dashboardTotalesControl.dataTotalModalidadesPeriodo.push(graph);
//                    }
//                });
//                appConstant.CERRAR_SWAL();
//            });
//        }
//

//

//

//
//        function consultarGraficaTotalModalidadesHorariosPeriodosSemestre(semestre) {
//            dashboardTotalesControl.dataTotalModalidadesHorariosPeriodosSemestre = [];
//            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
//            appConstant.CARGANDO();
//            dashboardTotalesService.consultarGraficaTotalModalidadesHorariosPeriodosSemestre(semestre).then(function (data) {
//                angular.forEach(data.responseList, function (value, key) {
//                    for (var i = 0; i < value.listaDatasObject.length; i++) {
//                        var graph = {
//                            key: value.listaDatasObject[i].name,
//                            values: value.listaDatasObject[i].listaEtapas
//                        };
//                        dashboardTotalesControl.dataTotalModalidadesHorariosPeriodosSemestre.push(graph);
//                    }
//                });
//                appConstant.CERRAR_SWAL();
//            });
//        }
//
//        dashboardTotalesControl.opcionesBarHorizontal = {
//            chart: {
//                type: 'multiBarChart',
//                height: 500,
//                x: function (d) {
//                    return d.label;
//                },
//                y: function (d) {
//                    return d.value;
//                },
//                showControls: false,
//                showValues: true,
//                duration: 500,
//                margin: {
//                    top: 40,
//                    right: 20,
//                    bottom: 150,
//                    left: 60
//                },
//                yAxis: {
//                    tickFormat: function (d) {
//                        return d3.format(',.0f')(d);
//                    }
//                },
//                noData: 'No hay datos.',
//                xAxis: {
//                    rotateLabels: 80
//                }
//            }
//        };
//
//        dashboardTotalesControl.opcionesBarHorizontalTotales = {
//            chart: {
//                type: 'multiBarChart',
//                height: 450,
//                x: function (d) {
//                    return d.label;
//                },
//                y: function (d) {
//                    return d.value;
//                },
//                clipEdge: true,
//                duration: 500,
//                stacked: true,
//                xAxis: {
//                    axisLabel: 'Semestre / Periodo Academico',
//                    showMaxMin: false,
//                    rotateLabels: 80
//                },
//                yAxis: {
//                    axisLabel: 'Cant. Matriculados',
//                    axisLabelDistance: -20,
//                    tickFormat: function (d) {
//                        return d3.format(',.0f')(d);
//                    }
//                }
//
//            }
//        };
//
//        dashboardTotalesControl.opcionesBarHorizontalBarrios = {
//            chart: {
//                type: 'multiBarChart',
//                height: 800,
//                x: function (d) {
//                    return d.label;
//                },
//                y: function (d) {
//                    return d.value;
//                },
//                showControls: false,
//                showValues: true,
//                duration: 500,
//                margin: {
//                    top: 40,
//                    right: 20,
//                    bottom: 150,
//                    left: 60
//                },
//                yAxis: {
//                    tickFormat: function (d) {
//                        return d3.format(',.0f')(d);
//                    }
//                },
//                noData: 'No hay datos.',
//                xAxis: {
//                    rotateLabels: 50
//                }
//            }
//        };
//
//        dashboardTotalesControl.opcionesBarVertical = {
//            chart: {
//                type: 'multiBarHorizontalChart',
//                height: 4500,
//                x: function (d) {
//                    return d.label;
//                },
//                y: function (d) {
//                    return d.value;
//                },
//                showControls: false,
//                showValues: true,
//                duration: 500,
//                margin: {
//                    top: 40,
//                    right: 10,
//                    bottom: 80,
//                    left: 80
//                },
//                noData: 'No hay datos.',
//                wrapLabels: true
//            }
//        };
//
//        dashboardTotalesControl.opcionesStack = {
//            chart: {
//                type: 'stackedAreaChart',
//                height: 450,
//                margin: {
//                    top: 20,
//                    right: 20,
//                    bottom: 30,
//                    left: 60
//                },
//                x: function (d) {
//                    return d[0];
//                },
//                y: function (d) {
//                    return d[1];
//                },
//                showControls: false,
//                showValues: true,
//                useVoronoi: false,
//                clipEdge: true,
//                duration: 100,
//                useInteractiveGuideline: true,
//                xAxis: {
//                    showMaxMin: true,
//                    tickFormat: function (d) {
//                        return d3.time.format('%x')(new Date(d))
//                    }
//                },
//                yAxis: {
//                    tickFormat: function (d) {
//                        return d3.format(',.0f')(d);
//                    }
//                },
//                zoom: {
//                    enabled: false,
//                    scaleExtent: [1, 10],
//                    useFixedDomain: false,
//                    useNiceScale: false,
//                    horizontalOff: false,
//                    verticalOff: true,
//                    unzoomEventType: 'dblclick.zoom'
//                },
//                noData: "No hay datos."
//            }
//        };
//
//        $scope.config = {
//            visible: true, // default: true
//            extended: false, // default: false
//            disabled: false, // default: false
//            refreshDataOnly: true, // default: true
//            deepWatchOptions: false, // default: true
//            deepWatchData: true, // default: true
//            deepWatchDataDepth: 1, // default: 2
//            debounce: 0 // default: 10
//        };

        consultarListaPeridosAcademicos();
        consultarGraficaMatriculadosPeriodo();
        consultarGraficaTotalModadalidadesPeriodo();
        consultarGraficaTotalMatriculadosSemestre();
        consultarGraficaTotalMatriculadosSemestrePrograma();
        consultarGraficaTotalModalidadesHorariosPeriodos();
        consultarListaSemestres();
        onCargarListas();
    }
})();