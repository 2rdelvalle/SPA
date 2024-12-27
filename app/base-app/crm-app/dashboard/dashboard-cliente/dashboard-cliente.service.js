(function () {
    'use strict';

    angular.module('mytodoApp.service').service('dashboardClienteService', dashboardClienteService);

    dashboardClienteService.$inject = ['$http', '$q', 'appGenericConstant'];

    function dashboardClienteService($http, $q, appGenericConstant) {

        var dashboardClienteService = this;

        dashboardClienteService.consultarGraficaPreinscritosMastriculados = getGraficaPreinscritosMastriculados;
        dashboardClienteService.consultarGraficaIngresosDifusion = getGraficaIngresosDifusion;
        dashboardClienteService.consultarGraficaMatriculadosUbicacion = getGraficaMatriculadosUbicacion;
        dashboardClienteService.consultarGraficaMatriculadosUbicacionPorPrograma = getGraficaMatriculadosUbicacionPorPrograma;
        dashboardClienteService.consultarGraficaMatriculadosPeriodo = getGraficaMatriculadosPeriodo;
        dashboardClienteService.listaPeriodosAcademicosCartera = getListaPeridosAcademicosCartera;
        dashboardClienteService.buscarProgramasAcademicos = getListaProgramasAcademicos;

        dashboardClienteService.dashboardCliente = {};
        dashboardClienteService.dashboardClienteAuxiliar = {};

        var url ='/api/crm/';

        function getListaPeridosAcademicosCartera() {
            var urlRequest = url + 'PeriodoAcademico/byEstado/ACTIVO';
            return ejecutarservice(urlRequest);
        }

        function getListaProgramasAcademicos() {
            var urlRequest = url + 'Programa';
            return ejecutarservice(urlRequest);
        }

        function getGraficaPreinscritosMastriculados(modalidad, periodoAcademico) {
            var urlRequest = url + 'DashboardCRM/dashboardClienteInscritosModalidad/' + modalidad + "/" + periodoAcademico;
            return ejecutarservice(urlRequest);
        }

        function getGraficaIngresosDifusion(modalidad, periodoAcademico) {
            var urlRequest = url + 'DashboardCRM/dashboardClienteEtapaMedioDifusion/' + modalidad + "/" + periodoAcademico;
            return ejecutarservice(urlRequest);
        }

        function getGraficaMatriculadosUbicacion(modalidad, periodoAcademico) {
            var urlRequest = url + 'DashboardCRM/dashboardClienteEtapaBarrio/' + modalidad + "/" + periodoAcademico;
            return ejecutarservice(urlRequest);
        }

        function getGraficaMatriculadosUbicacionPorPrograma(modalidad, periodoAcademico,idPrograma) {
            var urlRequest = url + 'DashboardCRM/dashboardClienteEtapaBarrio/' + modalidad + "/" + periodoAcademico+ "/" + idPrograma;
            return ejecutarservice(urlRequest);
        }

        function getGraficaMatriculadosPeriodo() {
            var urlRequest = url + 'DashboardCRM/dashboardClienteProgramaPorPeriodo/';
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


