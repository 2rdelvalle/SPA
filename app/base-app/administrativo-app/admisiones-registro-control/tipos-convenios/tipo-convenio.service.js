(function () {
    'use strict';
    angular.module('mytodoApp.service').service('tiposConveniosServices', tiposConveniosServices);
    tiposConveniosServices.$inject = ['$http', '$q', 'appGenericConstant'];

    function tiposConveniosServices($http, $q, appGenericConstant) {
        var servicioTipoConvenio = this;
        servicioTipoConvenio.buscarTiposConvenios = getTipoConvenio;
        servicioTipoConvenio.agregarTipoConvenio = postTipoConvenio;
        servicioTipoConvenio.eliminarTipoConvenio = deleteOneTipoConvenio;
        servicioTipoConvenio.eliminarTiposConvenios = deleteTipoConvenio;
        servicioTipoConvenio.actualizarTipoConvenio = putTipoConvenio;
        servicioTipoConvenio.tipoConvenio = {};
        servicioTipoConvenio.tipoConvenioAuxiliar = {};
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

        function getTipoConvenio() {
            var urlRequest = url + 'TipoConvenio';
            return ejecutarServicesGet(urlRequest);
        }

        function postTipoConvenio(tipoConvenio) {
            var defered = $q.defer();
            var urlRequest = url + 'TipoConvenio';
            $http.post(urlRequest, tipoConvenio).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function deleteOneTipoConvenio(tipoConvenio) {
            var defered = $q.defer();
            var urlRequest = url + 'TipoConvenio/' + tipoConvenio.id;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function deleteTipoConvenio(listaTiposConvenios) {
            var defered = $q.defer();
            var urlRequest = url + 'TipoConvenio/masivo/' + listaTiposConvenios;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function putTipoConvenio(tipoConvenio) {
            var defered = $q.defer();
            var urlRequest = url + 'TipoConvenio';
            $http.put(urlRequest, tipoConvenio).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

    }
})();