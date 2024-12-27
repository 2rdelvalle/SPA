(function () {
    'use strict';
    angular.module('mytodoApp.service').service('conceptoValorEntitiesService', conceptoValorEntitiesService);
    conceptoValorEntitiesService.$inject = ['$http', '$q', 'appGenericConstant'];

    function conceptoValorEntitiesService($http, $q, appGenericConstant) {
        var servicio = this;
        servicio.buscarConceptoValorConf = BuscarConf;
        servicio.buscarConceptoValor = Buscar;
        servicio.buscarPeriodos = buscarPeriodos;
        servicio.buscarConceptosFacturacion = buscarConceptosFacturacion;
        servicio.agregarConceptoValor = Agregar;
        servicio.conceptoValor = {};
        servicio.conceptoValorAux = {};

        var url ='/api/financiero/';
        
        function BuscarConf(idConcepto,idPeriodo) {
            var defered = $q.defer();
            var urlRequest = url + 'ConceptoFacturacionValor/ByIdconceptoAndIdperiodo/'+idConcepto+'/'+idPeriodo;
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function Buscar() {
            var defered = $q.defer();
            var urlRequest = url + 'ConceptoFacturacion/todos';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        
        function buscarPeriodos() {
            var defered = $q.defer();
            var urlRequest = url + 'PeriodoAcademico/';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function buscarConceptosFacturacion() {
            var defered = $q.defer();
            var urlRequest = url + 'ConceptoFacturacion/concepto/valor';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function Agregar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'ConceptoFacturacionValor/';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

    }
})();

