(function () {
    'use strict';
    angular.module('mytodoApp.service').service('confiProgramaServices', confiProgramaEntity);
    confiProgramaEntity.$inject = ['$http', '$q'];
    function confiProgramaEntity($http, $q) {
        var servicio = this;
        var url = '/api/';
        servicio.buscarPrograma = buscar;
        servicio.buscarProgramaByid = buscarPrograma;
        servicio.buscarJornadas = buscarJornada;
        servicio.buscarConfiguracion = buscarconfiguracion;
        servicio.RegistrarConfiguracionPrograma = Agregar;
        servicio.confiPrograma = {};
        servicio.confiProgramaAuxiliar = {};
        function ejecutarservice(urlRequest) {
            var deferred = $q.defer();
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        function buscar() {
            var urlRequest = url + 'financiero/ConfiguracionPrograma/todos';
            return ejecutarservice(urlRequest);
        }
        function buscarJornada(id) {
            var urlRequest = url + 'financiero/Programa/jornada/' + id;
            return ejecutarservice(urlRequest);
        }
        function buscarconfiguracion(idPrograma, idPeriodo) {
            var urlRequest = url + 'financiero/ConfiguracionPrograma/byPrograma/' + idPrograma + '/' + idPeriodo;
            return ejecutarservice(urlRequest);
        }
        function Agregar(programa) {
            var defered = $q.defer();
            var urlRequest = url + 'financiero/ConfiguracionPrograma';
            $http.post(urlRequest, programa).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function buscarPrograma(idPrograma) {
            var urlRequest = url + 'financiero/ConfiguracionPrograma/byProgramaConfigurar/' + idPrograma;
            return ejecutarservice(urlRequest);
        }
    }
})();