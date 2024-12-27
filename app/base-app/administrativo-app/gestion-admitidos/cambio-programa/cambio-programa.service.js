(function () {
    'use strict';
    angular.module('mytodoApp.service').service('cambioProgramaServices', cambioProgramaServices);
    cambioProgramaServices.$inject = ['$http', '$q'];
    function cambioProgramaServices($http, $q) {
        var cambioPrograma = this;
        cambioPrograma.buscarEstudianteByCodigo = getEstudianteByCodigo;
        cambioPrograma.buscarProgramas = getProgramas;
        cambioPrograma.buscarProgramasByNivelFormacion = getProgramasByNivelFormacion;
        cambioPrograma.guardarCambioPrograma = postCambioPrograma;
        cambioPrograma.estudiante = {};
        var url = '/api/admisiones';
        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getEstudianteByCodigo(identificacion) {
            var urlRequest = url + '/CambioPrograma/consultaEstudiante/' + identificacion;
            return ejecutarServicesGet(urlRequest);
        }

        function getProgramas() {
            var urlRequest = url + '/Programa/todos';
            return ejecutarServicesGet(urlRequest);
        }

        function getProgramasByNivelFormacion(idNivelFormacion) {
            var urlRequest = url + '/Programa/nivelformacionPrograma/' + idNivelFormacion;
            return ejecutarServicesGet(urlRequest);
        }

        function postCambioPrograma(cambioPrograma) {
            var defered = $q.defer();
            var urlrequest = url + '/CambioPrograma/guardarCambioPrograma';
            $http.post(urlrequest, cambioPrograma).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }


    }
})();