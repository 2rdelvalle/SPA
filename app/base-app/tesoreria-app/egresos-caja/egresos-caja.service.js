(function () {
    'use strict';
    angular.module('mytodoApp.service').service('egresosServices', egresosServices);
    egresosServices.$inject = ['$http', '$q', 'appGenericConstant'];

    function egresosServices($http, $q, appGenericConstant) {
        var servicioEgresos = this;
        var url = '/api/financiero/';
        servicioEgresos.egresosEntity = {};
        servicioEgresos.egresosAuxiliar = {};
        servicioEgresos.buscarConceptosDescuentos = getConceptosDescuentos;
        servicioEgresos.agregarEgreso = postEgreso;
        servicioEgresos.getUsuario = getUsuario;

        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getConceptosDescuentos() {
            var urlRequest = url + 'ConceptoFacturacion/concepto/descuento';
            return ejecutarServicesGet(urlRequest);
        }

        function postEgreso(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'EgresoCaja';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getUsuario(idUsuario) {
            var deferred = $q.defer();
            var urlRequest = url + 'CajaMovimiento/estado/byUsuario/' + idUsuario;
            $http.get(urlRequest, idUsuario).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

    }
})();