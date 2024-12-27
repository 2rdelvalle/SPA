(function () {
    'use strict';
    angular.module('mytodoApp.service').service('dashboardTotalesService', dashboardTotalesService);
    dashboardTotalesService.$inject = ['$http', '$q', 'appGenericConstant'];
    function dashboardTotalesService($http, $q, appGenericConstant) {
        var dashboardTotalesService = this;

        dashboardTotalesService.consultarGraficaMatriculadosPeriodo = getGraficaMatriculadosPeriodo;
        dashboardTotalesService.consultarGraficaTotalesModalidadesPeriodos= getGraficaTotalesModalidadesPeriodos;
        dashboardTotalesService.consultarGraficaTotalesModalidadesBarrios= getGraficaTotalesModalidadesBarrios;
        dashboardTotalesService.listaPeriodosAcademicos = getListaPeridosAcademicosCartera;
        dashboardTotalesService.listaSemestres = getListaSemestres;
        dashboardTotalesService.consultarGraficaTotalMatriculadosSemestre = getGraficaTotalMatriculadosSemestre;
        dashboardTotalesService.consultarGraficaTotalMatriculadosSemestrePrograma = getGraficaTotalMatriculadosSemestrePrograma;
        dashboardTotalesService.consultarGraficaTotalMatriculadosSemestreBarrios = getGraficaTotalMatriculadosSemestreBarrios;
        dashboardTotalesService.consultarGraficaTotalModalidadesHorariosPeriodos = getGraficaTotalesModalidadesHorariosPeriodos;
        dashboardTotalesService.consultarGraficaTotalModalidadesHorariosPeriodosSemestre = getGraficaTotalesModalidadesHorariosPeriodosSemestre;
        dashboardTotalesService.consultarGraficaTotalMatriculadosColegios = getGraficaTotalMatriculadosColegios;
        dashboardTotalesService.dashboardTotales = {};
        dashboardTotalesService.dashboardTotalesAuxiliar = {};

        var url ='/api/crm/';

        function getListaPeridosAcademicosCartera() {
            var urlRequest = url + 'PeriodoAcademico/byEstado/ACTIVO';
            return ejecutarservice(urlRequest);
        }
        
        function getListaSemestres() {
            var urlRequest = url + 'DashboardCRM/listarSemestres/';
            return ejecutarservice(urlRequest);
        }

        function getGraficaMatriculadosPeriodo() {
            var urlRequest = url + 'DashboardCRM/dashboardClienteProgramaPorPeriodo/';
            return ejecutarservice(urlRequest);
        }

        function getGraficaTotalesModalidadesPeriodos() {
            var urlRequest = url + 'DashboardCRM/dashboardTotalesModalidadesPeriodos/';
            return ejecutarservice(urlRequest);
        }
        
        function getGraficaTotalesModalidadesHorariosPeriodos() {
            var urlRequest = url + 'DashboardCRM/dashboardTotalesModalidadesHorariosPeriodos/';
            return ejecutarservice(urlRequest);
        }

        function getGraficaTotalesModalidadesHorariosPeriodosSemestre(semestre) {
            var urlRequest = url + 'DashboardCRM/dashboardTotalesModalidadesHorariosPeriodosSemestre/'+semestre;
            return ejecutarservice(urlRequest);
        }
        
        function getGraficaTotalesModalidadesBarrios(periodoAcademico) {
            var urlRequest = url + 'DashboardCRM/dashboardTotalesModalidadesBarrios/'+ periodoAcademico;
            return ejecutarservice(urlRequest);
        }
        
        function getGraficaTotalMatriculadosSemestre() {
            var urlRequest = url + 'DashboardCRM/totalMatriculadosSemestre/';
            return ejecutarservice(urlRequest);
        }
        
        function getGraficaTotalMatriculadosSemestrePrograma() {
            var urlRequest = url + 'DashboardCRM/totalMatriculadosSemestrePrograma/';
            return ejecutarservice(urlRequest);
        }
        
        function getGraficaTotalMatriculadosSemestreBarrios(semestre) {
            var urlRequest = url + 'DashboardCRM/totalMatriculadosBarrios/'+semestre;
            return ejecutarservice(urlRequest);
        }
        
        function getGraficaTotalMatriculadosColegios(periodoAcademico,top,orden) {
            var urlRequest = url + 'DashboardCRM/totalMatriculadosColegios/'+periodoAcademico+'/'+top+'/'+orden;
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