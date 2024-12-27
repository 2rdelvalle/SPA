(function () {
    'use strict';
    angular.module('mytodoApp.service').service('recursoEducativosServices', recursoEducativosServices);
    recursoEducativosServices.$inject = ['$http', '$q', 'appGenericConstant'];

    function recursoEducativosServices($http, $q, appGenericConstant) {
        var servicioRecursosEducativos = this;
        servicioRecursosEducativos.buscarRecursosEdu = getRecursoEducativoByEstado;
        servicioRecursosEducativos.buscarSedes = getSedes;
        servicioRecursosEducativos.agregarRecursoEdu = postRecursoEducativo;
        servicioRecursosEducativos.eliminarRecursoEdu = deleteRecursoEducativo;
        servicioRecursosEducativos.actualizarRecursoEdu = putRecursoEducativo;
        servicioRecursosEducativos.eliminarRecursoEduMasivo = deleteRecursoEducativoMasivo;
        servicioRecursosEducativos.recursoEducativo = {};
        servicioRecursosEducativos.entidadAuxiliar = {};
        var url ='/api/admisiones/';
        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getRecursoEducativoByEstado() {
            var urlRequest = url + 'RecursoEducativo';
            return ejecutarServicesGet(urlRequest);
        }

        function getSedes() {
            var urlRequest = url + 'Seccional';
            return ejecutarServicesGet(urlRequest);
        }

        function postRecursoEducativo(recursoEducativo) {
            var defered = $q.defer();
            var urlRequest = url + 'RecursoEducativo';
            $http.post(urlRequest, recursoEducativo).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function deleteRecursoEducativo(recursoEducativo) {
            var defered = $q.defer();
            var urlRequest = url + 'RecursoEducativo/' + recursoEducativo.id;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function deleteRecursoEducativoMasivo(recursoEducativo) {
            var defered = $q.defer();
            var urlRequest = url + 'RecursoEducativo/masivo/' + recursoEducativo;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function putRecursoEducativo(recursoEducativo) {
            var defered = $q.defer();
            var urlRequest = url + 'RecursoEducativo';
            $http.post(urlRequest, recursoEducativo).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

    }
})();