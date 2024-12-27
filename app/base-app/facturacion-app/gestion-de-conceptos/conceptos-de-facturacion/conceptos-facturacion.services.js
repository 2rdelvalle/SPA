(function () {
    'use strict';
    angular.module('mytodoApp.service').service('concepFacturacionServices', concepFacturacionServices);
    concepFacturacionServices.$inject = ['$http', '$q'];

    function concepFacturacionServices($http, $q) {
        var servicioConcepFacturacion = this;
        servicioConcepFacturacion.buscarConcepFacturacionByEstado = getConcepFacturacionByEstado;
        servicioConcepFacturacion.cuentasContables = buscarCuentas;
        servicioConcepFacturacion.agregarConcepto = postConcepFacturacion;
        servicioConcepFacturacion.actualizarConcepto = putConcepFacturacion;
        servicioConcepFacturacion.eliminarConcepFacturacion = deleteConcepFacturacion;
        servicioConcepFacturacion.eliminarMasivoConcepFacturacion = deleteMasivoConcepFacturacion;
        servicioConcepFacturacion.concepFacturacion = {};
        servicioConcepFacturacion.concepFacturacionAuxiliar = {};
        var url ='/api/financiero/';

        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getConcepFacturacionByEstado() {
            var urlRequest = url + 'ConceptoFacturacion/todos';
            return ejecutarServicesGet(urlRequest);
        }

        function postConcepFacturacion(concepFactura) {
            var defered = $q.defer();
            var urlRequest = url + 'ConceptoFacturacion';
            $http.post(urlRequest, concepFactura).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function putConcepFacturacion(concepFactura) {
            var defered = $q.defer();
            var urlRequest = url + 'ConceptoFacturacion';
            $http.put(urlRequest, concepFactura).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function deleteConcepFacturacion(concepFactura) {
            var defered = $q.defer();
            var urlRequest = url + 'ConceptoFacturacion/' + concepFactura.id;
            $http.delete(urlRequest, concepFactura).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function deleteMasivoConcepFacturacion(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'ConceptoFacturacion/masivo/' + rs;
            $http.delete(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function buscarCuentas(cuentas) {
            var deferred = $q.defer();
            var urlRequest = url + 'Cuenta';
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

    }
})();


