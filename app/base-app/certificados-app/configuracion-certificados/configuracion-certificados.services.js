(function () {
    'use strict';
    angular.module('mytodoApp.service').service('confiCertificiadosServices', confiCertificiadosServices);
    confiCertificiadosServices.$inject = ['$http', '$q'];
    function confiCertificiadosServices($http, $q) {
        var servicioCertificados = this;
        servicioCertificados.listarConfiguraciones = getConfiguracion;
        servicioCertificados.GenerarConfiguraciones = postConfiguracion;
        servicioCertificados.ActulizarConfiguraciones = putConfiguracion;
        servicioCertificados.listarConceptos = listarConceptos;
        servicioCertificados.certificado = {};
        servicioCertificados.certificadoAuxiliar = {};

        var url = 'api/financiero/';

        function getConfiguracion() {
            var urlRequest = url + 'Certificado';
            return ejecutarServicesGet(urlRequest);
        }
        function putConfiguracion(configuracion) {
            var urlRequest = url + 'Certificado';
            return ejecutarServicesPut(urlRequest, configuracion);
        }
        function postConfiguracion(configuracion) {
            var urlRequest = url + 'Certificado';
            return ejecutarServicesPost(urlRequest, configuracion);
        }

        function listarConceptos(generaCertificado) {
            var urlRequest = url + 'ConceptoFacturacion/concepto/certificado/'+ generaCertificado;
            return ejecutarServicesGet(urlRequest);
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