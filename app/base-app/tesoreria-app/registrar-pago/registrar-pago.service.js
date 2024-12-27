(function () {
    'use strict';
    angular.module('mytodoApp.service').service('registrarPagoServices', registrarPagoServices);
    registrarPagoServices.$inject = ['$http', '$q', 'appGenericConstant'];

    function registrarPagoServices($http, $q, appGenericConstant) {
        var servicioRegistrarPago = this;
        var url ='/api/financiero/';
        servicioRegistrarPago.registroPago = {};
        servicioRegistrarPago.registroPagoAuxiliar = {};
        servicioRegistrarPago.buscarComprobantes = getComprobantes;
        servicioRegistrarPago.agregarPagos = postPagos;
        servicioRegistrarPago.getUsuario = getUsuario;
        servicioRegistrarPago.updateRecibo = updateRecibo;

        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getComprobantes(referencia) {
            var urlRequest = url + 'CajaMovimientoDiario/byReferencia/' + referencia;
            return ejecutarServicesGet(urlRequest);
        }

        function postPagos(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'CajaMovimientoDiario';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function updateRecibo(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'CajaMovimientoDiario/updateRecibo';
            $http.put(urlRequest, rs).success(function (response) {
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