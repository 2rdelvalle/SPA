(function () {
    'use strict';
    angular.module('mytodoApp').controller('DashboardCarteraCtrl', DashboardCarteraCtrl);
    DashboardCarteraCtrl.$inject = ['$scope', 'dashboardCarteraService', 'utilServices', 'appGenericConstant', 'appConstantValueList', '$interval'];
    function DashboardCarteraCtrl($scope, dashboardCarteraService, utilServices, appGenericConstant, appConstantValueList, $interval) {
        var dashboardCarteraControl = this;
        dashboardCarteraControl.dashboardCartera = dashboardCarteraService.dashboardCartera;
        dashboardCarteraControl.dashboardCarteraAuxiliar = dashboardCarteraService.dashboardCarteraAuxiliar;
        dashboardCarteraControl.dashboardCartera.modalidad = { nombre: "MODALIDAD", valor: "PRESENCIAL" };
        dashboardCarteraControl.dashboardCartera.modalidadPagados = { nombre: "MODALIDAD", valor: "PRESENCIAL" };
        dashboardCarteraControl.dashboardCartera.modalidadLinea = { nombre: "MODALIDAD", valor: "PRESENCIAL" };
        dashboardCarteraControl.listaModalidadesCartera;
        dashboardCarteraControl.listaPeriodoAcademicosCartera;
        dashboardCarteraControl.dataDonuts = [];
        dashboardCarteraControl.seriesLinea = [];
        dashboardCarteraControl.dataBarHorizontalNoPagados = [];
        dashboardCarteraControl.dataBarraNoPagados = [];
        dashboardCarteraControl.seriesLineaPagados = [];
        dashboardCarteraControl.dataBarHorizontalPagados = [];
        dashboardCarteraControl.dataBarraPagados = [];
        dashboardCarteraControl.colorCircular = ['#2ecc71', '#e74c3c', '#00bca4'];
        dashboardCarteraControl.modalidades = ['Nocturna', 'Presencial', 'Semipresencial'];
        dashboardCarteraControl.colorBarra = [];
        dashboardCarteraControl.counter = 0;

        dashboardCarteraControl.listCuotasByEstado = [];
        dashboardCarteraControl.listCuotasEstadoPrograma = [];
        dashboardCarteraControl.listCreditosByEstado = [];
        dashboardCarteraControl.listCreditosByEstadoPrograma = [];
        dashboardCarteraControl.listCreditosGeneralEstado = [];
        dashboardCarteraControl.listCreditosGeneralEstadoPrograma = [];

        dashboardCarteraControl.init = function () {
            dashboardCarteraControl.consultarListaModalidadesCartera();
            dashboardCarteraControl.consultarListaPeridosAcademicosCartera();
        };

        dashboardCarteraControl.consultarDatosGraficaDonut = function (periodoAcademico) {
            dashboardCarteraControl.dataDonuts = [];
            dashboardCarteraService.graficaDonutDashCRM(periodoAcademico).then(function (data) {
                angular.forEach(data.responseList, function (value, key) {
                    for (var i = 0; i < value.data.length; i++) {
                        var creditosEstados = {
                            color: dashboardCarteraControl.colorCircular[i],
                            key: value.labels[i],
                            y: value.data[i]
                        };
                        dashboardCarteraControl.dataDonuts.push(creditosEstados);
                    }
                });
                cargarGraficasDonut(dashboardCarteraControl.dataDonuts);
            });
        };

        dashboardCarteraControl.consultarDatosGraficaLinea = function (modalidad, periodoAcademico) {
            dashboardCarteraControl.dataLinea = [];
            dashboardCarteraService.graficaLineaDashCRM(modalidad, periodoAcademico).then(function (data) {
                angular.forEach(data.responseList, function (value, key) {
                    for (var i = 0; i < value.data.length; i++) {
                        var color = '#' + Math.floor(Math.random() * 16777215).toString(16);
                        dashboardCarteraControl.colorBarra.push(color);
                        var pagadosLinea = {
                            x: value.labels[i],
                            y: value.data[i]
                        };
                        dashboardCarteraControl.dataLinea.push(pagadosLinea);
                    }
                });
                cargarGraficasLine(dashboardCarteraControl.dataLinea);
            });
        };

        dashboardCarteraControl.consultarDatosGraficaBarHorizontal = function (modalidad, periodoAcademico) {
            dashboardCarteraControl.dataBarHorizontalNoPagados = [];
            dashboardCarteraService.graficaBarHorizontalDashCRM(modalidad, periodoAcademico).then(function (data) {
                angular.forEach(data.responseList, function (value, key) {
                    for (var i = 0; i < value.data.length; i++) {
                        var color = '#' + Math.floor(Math.random() * 16777215).toString(16);
                        dashboardCarteraControl.colorBarra.push(color);
                        var noPagados = {
                            x: value.labels[i],
                            y: value.data[i]
                        };
                        dashboardCarteraControl.dataBarHorizontalNoPagados.push(noPagados);
                    }
                });
                cargarGraficasBarraNoPagados(dashboardCarteraControl.dataBarHorizontalNoPagados);

            });
        };

        dashboardCarteraControl.consultarDatosGraficaPagadosBarHorizontal = function (modalidad, periodoAcademico) {
            dashboardCarteraControl.dataBarHorizontalPagados = [];
            dashboardCarteraService.graficaPagadosBarHorizontalDashCRM(modalidad, periodoAcademico).then(function (data) {
                angular.forEach(data.responseList, function (value, key) {
                    for (var i = 0; i < value.data.length; i++) {
                        var pagados = {
                            x: value.labels[i],
                            y: value.data[i]
                        };
                        dashboardCarteraControl.dataBarHorizontalPagados.push(pagados);
                    }
                });
                cargarGraficasBarraPagados(dashboardCarteraControl.dataBarHorizontalPagados);
            });
        };

        dashboardCarteraControl.consultarListaModalidadesCartera = function () {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_AREA_MODALIDAD, appGenericConstant.MICRO_SERVICIO_CRM).then(function (data) {
                dashboardCarteraControl.listaModalidadesCartera = data;
                if (data[1]) {
                    dashboardCarteraControl.dashboardCartera.modalidad = dashboardCarteraControl.listaModalidadesCartera[1];
                    dashboardCarteraControl.dashboardCartera.modalidadPagados = dashboardCarteraControl.listaModalidadesCartera[1];
                    dashboardCarteraControl.dashboardCartera.modalidadLinea = dashboardCarteraControl.listaModalidadesCartera[1];
                }
            });
        };

        dashboardCarteraControl.consultarListaPeridosAcademicosCartera = function () {
            dashboardCarteraService.listaPeriodosAcademicosCartera().then(function (data) {
                dashboardCarteraControl.listaPeriodoAcademicosCartera = data;
                if (data[0]) {
                    dashboardCarteraControl.dashboardCartera.periodoAcademico = data[0];

                    dashboardCarteraControl.consultarDatosGraficaDonut(dashboardCarteraControl.dashboardCartera.periodoAcademico.nombrePeriodoAcademico);
                    dashboardCarteraControl.consultarDatosGraficaLinea(dashboardCarteraControl.dashboardCartera.modalidadLinea.valor, dashboardCarteraControl.dashboardCartera.periodoAcademico.nombrePeriodoAcademico);
                    dashboardCarteraControl.consultarDatosGraficaBarHorizontal(dashboardCarteraControl.dashboardCartera.modalidad.valor, dashboardCarteraControl.dashboardCartera.periodoAcademico.nombrePeriodoAcademico);
                    dashboardCarteraControl.consultarDatosGraficaPagadosBarHorizontal(dashboardCarteraControl.dashboardCartera.modalidadPagados.valor, dashboardCarteraControl.dashboardCartera.periodoAcademico.nombrePeriodoAcademico);
                    dashboardCarteraControl.consultarListadoGeneralConvenios(dashboardCarteraControl.dashboardCartera.periodoAcademico.id);

                }
            });
        };

        dashboardCarteraControl.onCambiarSelectModalidadBarHorizontal = function () {
            dashboardCarteraControl.consultarDatosGraficaBarHorizontal(dashboardCarteraControl.dashboardCartera.modalidad.valor, dashboardCarteraControl.dashboardCartera.periodoAcademico);
            dashboardCarteraControl.dashboardCartera.modalidad;
            dashboardCarteraControl.dashboardCartera.modalidadPagados;
            dashboardCarteraControl.dashboardCartera.modalidadLinea;
            dashboardCarteraControl.dashboardCartera.periodoAcademico;
            dashboardCarteraControl.counter = 0;
        };

        dashboardCarteraControl.onCambiarSelectPeriodoAcademico = function () {

            dashboardCarteraControl.consultarDatosGraficaDonut(dashboardCarteraControl.dashboardCartera.periodoAcademico.nombrePeriodoAcademico);
            dashboardCarteraControl.consultarDatosGraficaLinea(dashboardCarteraControl.dashboardCartera.modalidadLinea.valor, dashboardCarteraControl.dashboardCartera.periodoAcademico.nombrePeriodoAcademico);
            dashboardCarteraControl.consultarDatosGraficaBarHorizontal(dashboardCarteraControl.dashboardCartera.modalidad.valor, dashboardCarteraControl.dashboardCartera.periodoAcademico.nombrePeriodoAcademico);
            dashboardCarteraControl.consultarDatosGraficaPagadosBarHorizontal(dashboardCarteraControl.dashboardCartera.modalidadPagados.valor, dashboardCarteraControl.dashboardCartera.periodoAcademico.nombrePeriodoAcademico);

            dashboardCarteraControl.consultarListadoGeneralConvenios(dashboardCarteraControl.dashboardCartera.periodoAcademico.id);

            dashboardCarteraControl.dashboardCartera.modalidad;
            dashboardCarteraControl.dashboardCartera.modalidadPagados;
            dashboardCarteraControl.dashboardCartera.modalidadLinea;
            dashboardCarteraControl.dashboardCartera.periodoAcademico;
            dashboardCarteraControl.counter = 0;
        };

        dashboardCarteraControl.onCambiarSelectPagadosModalidadBarHorizontal = function () {
            dashboardCarteraControl.consultarDatosGraficaPagadosBarHorizontal(dashboardCarteraControl.dashboardCartera.modalidadPagados.valor, dashboardCarteraControl.dashboardCartera.periodoAcademico.nombrePeriodoAcademico);
            dashboardCarteraControl.dashboardCartera.modalidad;
            dashboardCarteraControl.dashboardCartera.modalidadPagados;
            dashboardCarteraControl.dashboardCartera.modalidadLinea;
            dashboardCarteraControl.dashboardCartera.periodoAcademico;
            dashboardCarteraControl.counter = 0;
        };

        dashboardCarteraControl.onCambiarSelectModalidadLinea = function () {
            dashboardCarteraControl.consultarDatosGraficaLinea(dashboardCarteraControl.dashboardCartera.modalidadLinea.valor, dashboardCarteraControl.dashboardCartera.periodoAcademico.nombrePeriodoAcademico);
            dashboardCarteraControl.dashboardCartera.modalidad;
            dashboardCarteraControl.dashboardCartera.modalidadLinea;
            dashboardCarteraControl.dashboardCartera.periodoAcademico;
            dashboardCarteraControl.counter = 0;
        };

        //        var refreshGraficas = function counter() {
        //            dashboardCarteraControl.counter = dashboardCarteraControl.counter + 1;
        //            if (dashboardCarteraControl.counter === 10) {
        //                dashboardCarteraControl.onCambiarSelectModalidadBarHorizontal();
        //                dashboardCarteraControl.onCambiarSelectPeriodoAcademico();
        //                dashboardCarteraControl.onCambiarSelectPagadosModalidadBarHorizontal();
        //                dashboardCarteraControl.onCambiarSelectModalidadLinea();
        //                dashboardCarteraControl.counter = 0;
        //            }
        //        }

        //        var promise = $interval(refreshGraficas, 1000);

        function cargarGraficasDonut(data) {
            dashboardCarteraControl.dataDoughtNut = data;
        }

        function cargarGraficasLine(data) {
            dashboardCarteraControl.lineasSerie = [];
            for (var i = 0; i < data.length; i++) {
                var newData = {
                    key: data[i].x,
                    values: [{
                        x: data[i].x,
                        y: data[i].y
                    }]
                };
                dashboardCarteraControl.lineasSerie.push(newData);
            }
        }

        function cargarGraficasBarraNoPagados(data) {
            dashboardCarteraControl.dataBarraNoPagados = [];
            for (var i = 0; i < data.length; i++) {
                var newData = {
                    key: data[i].x,
                    values: [{
                        x: data[i].x,
                        y: data[i].y
                    }]
                };
                dashboardCarteraControl.dataBarraNoPagados.push(newData);
            }

        }

        function cargarGraficasBarraPagados(data) {
            dashboardCarteraControl.dataBarraPagados = [];
            for (var i = 0; i < data.length; i++) {
                var newData = {
                    key: data[i].x,
                    values: [{
                        x: data[i].x,
                        y: data[i].y
                    }]
                };
                dashboardCarteraControl.dataBarraPagados.push(newData);
            }
        }

        dashboardCarteraControl.optionsDoughNut = {
            chart: {
                type: 'pieChart',
                height: 450,
                x: function (d) {
                    return d.key;
                },
                y: function (d) {
                    return d.y;
                },
                showLabels: true,
                labelType: 'value',
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                },
                noData: 'No hay datos.'
            }
        };

        dashboardCarteraControl.optionsLine = {
            chart: {
                type: 'lineChart',
                height: 450,
                x: function (d) {
                    return d.x;
                },
                y: function (d) {
                    return d.y;
                },
                showControls: false,
                showValues: true,
                duration: 500,
                margin: {
                    top: 50,
                    right: 20,
                    bottom: 120,
                    left: 30
                },
                xTickFormat: function (d) {
                    return dashboardCarteraControl.modalidades[d];
                },
                xAxis: {
                    rotateLabels: 90
                },
                useInteractiveGuideline: true,
                noData: 'No hay datos.'
            }
        };

        dashboardCarteraControl.optionsBar = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                x: function (d) {
                    return d.x;
                },
                y: function (d) {
                    return d.y;
                },
                showControls: false,
                showValues: true,
                duration: 500,
                margin: {
                    top: 30,
                    right: 50,
                    bottom: 120,
                    left: 45
                },
                xAxis: {
                    rotateLabels: 45
                },
                yAxis: {
                    tickFormat: function (d) {
                        return d3.format(',.02f')(d);
                    }
                },
                discretebar: {
                    color: function () {
                        $scope.api2.getScope().chart.color(['#aec7e8']);
                    },
                    margin: {
                        left: 41.5
                    }
                },
                noData: 'No hay datos.'
            }
        };

        dashboardCarteraControl.optionsBarNo = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                x: function (d) {
                    return d.x;
                },
                y: function (d) {
                    return d.y;
                },
                showControls: false,
                showValues: true,
                duration: 500,
                margin: {
                    top: 30,
                    right: 50,
                    bottom: 120,
                    left: 45
                },
                xAxis: {
                    rotateLabels: 45,
                    wrapLabels: true
                },
                yAxis: {
                    tickFormat: function (d) {
                        return d3.format(',.02f')(d);
                    }
                },
                discretebar: {
                    color: function () {
                        $scope.api.getScope().chart.color(['#4fb94f']);
                    },
                    margin: {
                        left: 41.5
                    },
                    width: 90
                },
                noData: 'No hay datos.'
            }
        };

        function toUpper(valor) {
            if (typeof valor === 'string') {
                valor = valor.toUpperCase();
            }
            return valor;
        }

        dashboardCarteraControl.init();

        $scope.config = {
            visible: true, // default: true
            extended: false, // default: false
            disabled: false, // default: false
            refreshDataOnly: true, // default: true
            deepWatchOptions: true, // default: true
            deepWatchData: true, // default: true
            deepWatchDataDepth: 2, // default: 2
            debounce: 5 // default: 10
        };



        dashboardCarteraControl.consultarListadoGeneralConvenios = function (periodoAcademico) {
            dashboardCarteraControl.listCuotasByEstado = [];
            dashboardCarteraControl.listCuotasEstadoPrograma = [];
            dashboardCarteraControl.listCreditosByEstado = [];
            dashboardCarteraControl.listCreditosByEstadoPrograma = [];
            dashboardCarteraControl.listCreditosGeneralEstado = [];
            dashboardCarteraControl.listCreditosGeneralEstadoPrograma = [];

            dashboardCarteraService.listaConvenioGeneral(periodoAcademico).then(function (data) {

                dashboardCarteraControl.listCuotasByEstado = data.listCuotasByEstado;
                dashboardCarteraControl.listCuotasEstadoPrograma = data.listCuotasEstadoPrograma;
                dashboardCarteraControl.listCreditosByEstado = data.listCreditosByEstado;
                dashboardCarteraControl.listCreditosByEstadoPrograma = data.listCreditosByEstadoPrograma;
                dashboardCarteraControl.listCreditosGeneralEstado = data.listCreditosGeneralEstado;
                dashboardCarteraControl.listCreditosGeneralEstadoPrograma = data.listCreditosGeneralEstadoPrograma;

            });
        };

    }
})();

