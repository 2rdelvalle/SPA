(function () {
    'use strict';
    angular.module('mytodoApp.service').service('certificiadosServices', certificiadosServices);
    certificiadosServices.$inject = ['$http', '$q'];
    function certificiadosServices($http, $q) {
        var servicioCertificados = this;
        servicioCertificados.listarCertificados = getCertificado;
        servicioCertificados.GenerarCertificados = postCertificado;
        servicioCertificados.ActulizarCertificados = putCertificado;

        var url = 'api/financiero/Certificado';

        function getCertificado() {
            var urlRequest = url;
            return ejecutarServicesGet(urlRequest);
        }
        function putCertificado(configuracion) {
            var urlRequest = url;
            return ejecutarServicesPut(urlRequest, configuracion);
        }
        function postCertificado(configuracion) {
            var urlRequest = url;
            return ejecutarServicesPost(urlRequest, configuracion);
        }


        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function ejecutarServicesPost(urlRequest, configuracion) {
            var defered = $q.defer();
            $http.post(urlRequest, configuracion).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function ejecutarServicesPut(urlRequest, configuracion) {
            var defered = $q.defer();
            $http.put(urlRequest, configuracion).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
    }
})();