(function () {
    'use strict';
    angular.module('mytodoApp.service').service('aplazamientoServices', aplazamientoServices);
    aplazamientoServices.$inject = ['$http', '$q'];
    function aplazamientoServices($http, $q) {
        var aplazarModulo = this;
        aplazarModulo.buscarEstudianteByCodigo = getEstudianteByCodigo;
        aplazarModulo.guardarAplazamiento = postAplazamiento;
        aplazarModulo.estudiante = {};
        var url = '/api/matricula/';

        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function postAplazamiento(rs) {
            var defered = $q.defer();
            var urlrequest = url + 'Aplazamiento/';
            $http.post(urlrequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getEstudianteByCodigo(identificacion) {
            var urlRequest = url + 'Estudiante/consultarEstudiante/' + identificacion;
            return ejecutarServicesGet(urlRequest);
        }
    }
})();