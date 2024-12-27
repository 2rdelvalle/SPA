(function () {
    'use strict';
    angular.module('mytodoApp.service').service('seccionalesServices', seccionalesServices);
    seccionalesServices.$inject = ['$http', '$q', 'appGenericConstant'];

    function seccionalesServices($http, $q, appGenericConstant) {
        var servicioSeccionales = this;
        servicioSeccionales.buscarSeccional = getSeccionales;

        servicioSeccionales.buscarPrograma = getProgramas;
        servicioSeccionales.listEstados = getEstados;
        servicioSeccionales.agregarSeccional = postSeccionales;
        servicioSeccionales.actualizarSeccional = putSeccional;
        servicioSeccionales.seccional = {};
        servicioSeccionales.seccionalAuxiliar = {};
        servicioSeccionales.seccionalCodExiste = buscarCodSeccional;
        var url ='/api/configeneral/';
        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getEstados() {

            var urlRequest = 'http://192.168.1.162:3700/listaEstados';
            return ejecutarServicesGet(urlRequest);
        }
        function getProgramas() {

            var urlRequest = url + 'Programa';
            return ejecutarServicesGet(urlRequest);
        }
        function getSeccionales() {
            var urlRequest = url + 'Seccional';
            return ejecutarServicesGet(urlRequest);
        }

        function postSeccionales(Seccional) {
            var defered = $q.defer();
            var urlRequest = url + 'Seccional';
            $http.post(urlRequest, Seccional).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function putSeccional(Seccional) {
            var defered = $q.defer();
            var urlRequest = url + 'Seccional';
            $http.put(urlRequest, Seccional).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function buscarCodSeccional(Seccional) {
            var deferred = $q.defer();
            var urlRequest = 'http://192.168.1.162:3700/seccionales?estadoLogico=A&codigoSeccional=' + Seccional.codigoSeccional;
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;

        }

    }
})();

