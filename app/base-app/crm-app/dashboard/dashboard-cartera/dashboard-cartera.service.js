(function () {
    'use strict';

    angular.module('mytodoApp.service').service('dashboardCarteraService', dashboardCarteraService);

    dashboardCarteraService.$inject = ['$http', '$q', 'appGenericConstant'];

    function dashboardCarteraService($http, $q, appGenericConstant) {

        var dashboardCarteraServicio = this;

        dashboardCarteraServicio.graficaDonutDashCRM = getGraficaDonutDashCRM;
        dashboardCarteraServicio.graficaLineaDashCRM = getGraficaLineaDashCRM;
        dashboardCarteraServicio.graficaBarHorizontalDashCRM = getGraficaBarHorizontalDashCRM;
        dashboardCarteraServicio.graficaPagadosBarHorizontalDashCRM = getGraficaPagadosBarHorizontalDashCRM;
        dashboardCarteraServicio.listaModalidadesCartera = getListaModalidadesCarteraDashCRM;
        dashboardCarteraServicio.listaPeriodosAcademicosCartera = getListaPeridosAcademicosCarteraDashCRM;
        dashboardCarteraServicio.listaConvenioGeneral = getListadoGeneralConvenios;

        dashboardCarteraServicio.dashboardCartera = {};
        dashboardCarteraServicio.dashboardCarteraAuxiliar = {};

        var url = '/api/crm/';

        function getGraficaDonutDashCRM(periodoAcademico) {
            var urlRequest = url + 'DashboardCRM/chartDonutCRM/' + periodoAcademico;
            return ejecutarservice(urlRequest);
        }

        function getGraficaLineaDashCRM(modalidad, periodoAcademico) {
            var urlRequest = url + 'DashboardCRM/chartLineaCRM/' + modalidad + "/" + periodoAcademico;
            return ejecutarservice(urlRequest);
        }

        function getGraficaBarHorizontalDashCRM(modalidad, periodoAcademico) {
            var urlRequest = url + 'DashboardCRM/chartBarHorizontalCRM/' + modalidad + "/" + periodoAcademico;
            return ejecutarservice(urlRequest);
        }

        function getGraficaPagadosBarHorizontalDashCRM(modalidad, periodoAcademico) {
            var urlRequest = url + 'DashboardCRM/chartBarHorizontalPagadosCRM/' + modalidad + "/" + periodoAcademico;
            return ejecutarservice(urlRequest);
        }

        function getListaModalidadesCarteraDashCRM() {
            var urlRequest = url + 'DashboardCRM/listarModalidadesCartera';
            return ejecutarservice(urlRequest);
        }

        function getListaPeridosAcademicosCarteraDashCRM() {
            var urlRequest = url + 'PeriodoAcademico/byEstado/ACTIVO';
            return ejecutarservice(urlRequest);
        }

        function getListadoGeneralConvenios(idPeriodo) {
            var urlRequest = url + 'DashboardCRM/listadoConvenio/' + idPeriodo;
            return ejecutarservice(urlRequest);
        }

        function ejecutarservice(urlRequest) {
            var deferred = $q.defer();
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;

        }

    }
})();


