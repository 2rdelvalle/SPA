(function () {
    'use strict';
    angular.module('mytodoApp.service').service('nivelFormacionEntitiesService', nivelFormacionEntitiesService);
    nivelFormacionEntitiesService.$inject = ['$http', '$q', 'appGenericConstant'];

    function nivelFormacionEntitiesService($http, $q, appGenericConstant) {
        var servicio = this;
        servicio.buscarNivelFormacion = Buscar;
        servicio.agregarNivelFormacion = Agregar;
        servicio.eliminarNivelFormacion = Eliminar;
        servicio.eliminarMasivoNivelFormacion = EliminarMasivo;
        servicio.actualizarNivelFormacion = Actualizar;
        servicio.nivelFormacion = {};
        servicio.nivelFormacionAux = {};

        var url ='/api/configeneral/';

        function Buscar() {
            var defered = $q.defer();
            var urlRequest = url + 'NivelFormacion';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function Agregar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'NivelFormacion';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function Eliminar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'NivelFormacion/' + rs.id;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function EliminarMasivo(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'NivelFormacion/masivo/' + rs;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function Actualizar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'NivelFormacion';
            $http.put(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

    }
})();

