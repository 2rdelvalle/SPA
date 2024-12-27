(function () {
    'use strict';
    angular.module('mytodoApp.service').service('formaPagoEntitiesService', formaPagoEntitiesService);
    formaPagoEntitiesService.$inject = ['$http', '$q', 'appGenericConstant'];

    function formaPagoEntitiesService($http, $q, appGenericConstant) {
        var servicio = this;
        servicio.buscarFormaPago = Buscar;
        servicio.agregarFormaPago = Agregar;
        servicio.eliminarFormaPago = Eliminar;
        servicio.eliminarMasivoFormaPago = EliminarMasivo;
        servicio.actualizarFormaPago = Actualizar;
        servicio.formaPago = {};
        servicio.formaPagoAux = {};
        var url ='/api/financiero/';

        function Buscar() {
            var defered = $q.defer();
            var urlRequest = url + 'FormaPago';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        };

        function Agregar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'FormaPago';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        };

        function Eliminar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'FormaPago/' + rs.id;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        };

        function EliminarMasivo(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'FormaPago/masivo/' + rs;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        };

        function Actualizar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'FormaPago';
            $http.put(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        };

    }
})();

