(function () {
    'use strict';
    angular.module('mytodoApp.service').service('dashboardTreeService', dashboardTreeService);
    dashboardTreeService.$inject = ['$http', '$q', 'appGenericConstant'];
    function dashboardTreeService($http, $q, appGenericConstant) {
        var dashboardTreeService = this;

        dashboardTreeService.listaMatriculados = getMatriculados;
        dashboardTreeService.listaMatriculadosExport = getMatriculadosExport;
        dashboardTreeService.listaMatriculadosEc = getMatriculadosEc;
        dashboardTreeService.listaNivelesFormacion = getNivelesFormacion;
        dashboardTreeService.listaPeriodosAcademicos = getListaPeridosAcademicos;
        dashboardTreeService.dashboardTree = {};
        dashboardTreeService.dashboardTreeAuxiliar = {};

        var url ='/api/crm/';
        
        function getMatriculados(idPeriodoAcademico,idNivelFormacion) {
            var urlRequest = url + 'DashboardCRM/matriculados/'+idPeriodoAcademico+'/'+idNivelFormacion;
            return ejecutarservice(urlRequest);
        }
        
        function getMatriculadosExport(idPeriodoAcademico,idNivelFormacion) {
            var urlRequest = url + 'DashboardCRM/matriculadosExport/'+idPeriodoAcademico+'/'+idNivelFormacion;
            return ejecutarservice(urlRequest);
        }

        function getMatriculadosEc(idPeriodoAcademico,idNivelFormacion) {
            var urlRequest = url + 'DashboardCRM/matriculadosEc/'+idPeriodoAcademico+'/'+idNivelFormacion;
            return ejecutarservice(urlRequest);
        }
        
        function getNivelesFormacion() {
            var urlRequest = '/api/admisiones/NivelFormacion';
            return ejecutarservice(urlRequest);
        }
        
        function getListaPeridosAcademicos() {
            var urlRequest = url + 'PeriodoAcademico/byEstado/ACTIVO';
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