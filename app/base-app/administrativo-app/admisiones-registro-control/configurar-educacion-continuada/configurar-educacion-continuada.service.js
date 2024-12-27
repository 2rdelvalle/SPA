(function () {
    'use strict';
    angular.module('mytodoApp.service').service('confiEducacionContinuadaServices', confiEducacionContinuadaServices);
    confiEducacionContinuadaServices.$inject = ['$http', '$q'];
    function confiEducacionContinuadaServices($http, $q) {
        var servicio = this;
        var url = '/api/';
        servicio.buscarConfiguracion = buscarConfiguracion;
        servicio.buscarPrograma = buscarPrograma;
        servicio.buscarPeriodosAcademicos = buscarPeriodosAcademicos;
        servicio.buscarTipoEducacionContinuada = buscarTipoEducacionContinuada;
        servicio.buscarConfiguracionByProgramaAndPeriodoAcademico = buscarconfiguracionByProgramaAndPeriodoAcademico;
        servicio.RegistrarConfiguracionEducacionContinuada = Agregar;
        servicio.confiEduCon = {};
        servicio.confiEduConAuxiliar = {};
        function ejecutarservice(urlRequest) {
            var deferred = $q.defer();
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        function buscarConfiguracion() {
            var urlRequest = url + 'matricula/ConfiguracionEducacionContinuada';
            return ejecutarservice(urlRequest);
        }
        function buscarTipoEducacionContinuada() {
            var categoria = "TIPO_EDUCACION_CONTINUADA";
            var urlRequest = url + 'matricula/ListaValor/'+categoria;
            return ejecutarservice(urlRequest);
        }
        function buscarconfiguracionByProgramaAndPeriodoAcademico(idPrograma, idPeriodo) {
            var urlRequest = url + 'matricula/ConfiguracionEducacionContinuada/byProgramaAndPeriodoAcademico/' + idPrograma + '/' + idPeriodo;
            return ejecutarservice(urlRequest);
        }
        function Agregar(programa) {
            var defered = $q.defer();
            var urlRequest = url + 'matricula/ConfiguracionEducacionContinuada';
            $http.post(urlRequest, programa).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
         function buscarPrograma() {
            var idNivelFormacion = 3;
            var urlRequest = url + 'matricula/Programa/programaByIdNivelFormacion/' + idNivelFormacion ;
            //var urlRequest = url + 'matricula/Programa';
            return ejecutarservice(urlRequest);
        }

        function buscarPeriodosAcademicos() {
            var urlRequest = url + 'matricula/PeriodoAcademico' ;
            return ejecutarservice(urlRequest);
        }
    }
})();
