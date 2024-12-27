(function () {

    'use strict';

    angular.module('mytodoApp.service').service('prerequisitosService', prerequisitosService);

    prerequisitosService.$inject = ['$http', '$q', 'appGenericConstant'];

    function prerequisitosService($http, $q, appGenericConstant) {

        var preinscipservice = this;

        preinscipservice.consultarPreinscripciones = getPreinscripciones;
        preinscipservice.agregarPrerequisito = postAgregarPrerequisito;
        preinscipservice.actualizarPrerequisito = postActualizarPrerequisito;
        preinscipservice.eliminarPrerequisito = postEliminarPrerequisito;
        preinscipservice.eliminarMasivoPrerequisito = postEliminarMasivoPrerequisito;
        var url ='/api/configeneral/';
        preinscipservice.prerequisito = {};

        preinscipservice.prerequisitoAuxiliar = {};

        function getPreinscripciones() {
            var urlRequest = url + 'Requisito';
            return ejectutarService(urlRequest);
        }
        function postAgregarPrerequisito(rs) {
            var urlRequest = url + 'Requisito';
            return postAgregar(urlRequest, rs);
        }

        function postActualizarPrerequisito(rs) {
            var urlRequest = url + 'Requisito';
            return postActualizar(urlRequest, rs);
        }

        function postEliminarPrerequisito(rs) {
            var urlRequest = url + 'Requisito/' + rs.id;
            return postEliminar(urlRequest);
        }

        function postEliminarMasivoPrerequisito(rs) {
            var urlRequest = url + 'Requisito/masivo/' + rs;
            return postEliminar(urlRequest);
        }

        function ejectutarService(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (response) {
                defered.reject(response);
            });
            return defered.promise;
        }

        function postAgregar(urlRequest, rs) {
            var defered = $q.defer();
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function postActualizar(urlRequest, rs) {
            var defered = $q.defer();
            $http.put(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }


        function postEliminar(urlRequest) {
            var defered = $q.defer();
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
    }
})();
