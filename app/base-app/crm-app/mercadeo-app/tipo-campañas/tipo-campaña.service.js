(function () {
    'use strict';
    angular.module('mytodoApp.service').service('tipoCampaniasServices', tipoCampaniasServices);
    tipoCampaniasServices.$inject = ['$http', '$q', 'appGenericConstant'];

    function tipoCampaniasServices($http, $q, appGenericConstant) {
        var servicioTipoCampania = this;
        servicioTipoCampania.buscarTipoCampania = getTipoCampania;
        servicioTipoCampania.buscarTipoCampaniaByCodigo = getTipoCampaniaByCodigo;
        servicioTipoCampania.buscarTipoCampaniaByNombre = getTipoCampaniarByNombre;
        servicioTipoCampania.agregarTipoCampania = postTipoCampania;
        servicioTipoCampania.eliminarTipoCampania = deleteTipoCampania;
        servicioTipoCampania.eliminarMasivoTipoCampania = deleteMasivoTipoCampania;
        servicioTipoCampania.actualizarTipoCampania = putTipoCampania;
        servicioTipoCampania.tipoCampania = {};
        servicioTipoCampania.tipoCampaniaAuxiliar = {};

        var url ='/api/crm/';

        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getTipoCampania() {
            var urlRequest = url + 'TiposCampanha';
            return ejecutarServicesGet(urlRequest);
        }

        function getTipoCampaniaByCodigo(tipoCampania) {
            var urlRequest = url + 'TiposCampanha/codigo/' + tipoCampania.codigo.toUpperCase();
            return ejecutarServicesGet(urlRequest);
        }

        function getTipoCampaniarByNombre(tipoCampania) {
            var urlRequest = url + 'TiposCampanha/nombre/' + tipoCampania.nombre.toUpperCase();
            return ejecutarServicesGet(urlRequest);
        }

        function postTipoCampania(tipoCampania) {
            var defered = $q.defer();
            var urlRequest = url + 'TiposCampanha/';
            $http.post(urlRequest, tipoCampania).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function deleteTipoCampania(tipoCampania) {
            var defered = $q.defer();
            var urlRequest = url + 'TiposCampanha/' + tipoCampania.id;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function putTipoCampania(tipoCampania) {
            var defered = $q.defer();
            var urlRequest = url + 'TiposCampanha';
            $http.put(urlRequest, tipoCampania).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function deleteMasivoTipoCampania(tipoCampania) {
            var defered = $q.defer();
            var urlRequest = url + 'TiposCampanha/masivo/' + tipoCampania;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

    }
})();