(function () {
    'use strict';
    angular.module('mytodoApp.service').service('configuracionNotaService', configuracionNotaService);
    configuracionNotaService.$inject = ['$http', '$q', 'appGenericConstant'];

    function configuracionNotaService($http, $q, appGenericConstant) {
        var servicioConfiguracionNota = this;
        servicioConfiguracionNota.buscarConfiguracion = getConfiguracion;
        servicioConfiguracionNota.agregarConfiguracion = postConfiguracion;
 
        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        var url ='/';

        function getConfiguracion() {
            var urlRequest = url + 'api/matricula/ConfiguracionNota';
            return ejecutarServicesGet(urlRequest);
        }

        function postConfiguracion(grupo) {
            var defered = $q.defer();
            var urlRequest = url + 'api/matricula/ConfiguracionNota';
            $http.post(urlRequest, grupo).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function deleteGrupo(grupo) {
            var defered = $q.defer();
            var urlRequest = url + 'api/matricula/Grupo/' + grupo.id;
            $http.delete(urlRequest, grupo).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function putGrupo(grupo) {
            var defered = $q.defer();
            var urlRequest = url + 'api/matricula/Grupo';
            $http.put(urlRequest, grupo).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

    }
})();