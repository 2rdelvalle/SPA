(function () {
    'use strict';
    angular.module('mytodoApp.service').service('grupoModuloServices', grupoModuloServices);
    grupoModuloServices.$inject = ['$http', '$q', 'appGenericConstant'];

    function grupoModuloServices($http, $q, appGenericConstant) {
        var agregarGrupoModulo = this;

        agregarGrupoModulo.agregarGrupoModulo = postGrupo;
        agregarGrupoModulo.buscarGrupoModulo = getGrupoModulo;
        agregarGrupoModulo.buscarGrupo = getGrupo;
        agregarGrupoModulo.buscarModulo = getModulo;
        agregarGrupoModulo.buscarPeriodos = getPeriodo;
        agregarGrupoModulo.actulizarGrupoModulo= putGrupo;
        agregarGrupoModulo.grupoModulo = {};
        agregarGrupoModulo.grupoModuloAuxiliar = {};

        var url = '/';


        function postGrupo(grupoModulo) {
            var defered = $q.defer();
            var urlRequest = url + 'api/matricula/GrupoModulo';
            $http.post(urlRequest, grupoModulo).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        
         function putGrupo(grupoModulo) {
            var defered = $q.defer();
            var urlRequest = url + 'api/matricula/GrupoModulo';
            $http.put(urlRequest, grupoModulo).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
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

        function getGrupoModulo() {
            var urlRequest = url + 'api/matricula/GrupoModulo/grupoModuloAll';
            return ejecutarServicesGet(urlRequest);
        }
        
         function getModulo() {
            var urlRequest = url + 'api/matricula/Modulo';
            return ejecutarServicesGet(urlRequest);
        }
         function getGrupo() {
            var urlRequest = url + 'api/matricula/Grupo/buscarGrupos';
            return ejecutarServicesGet(urlRequest);
        }
        
         function getPeriodo() {
            var urlRequest = url + 'api/matricula/PeriodoAcademico/ByEstadoAbiertoInscripto';
            return ejecutarServicesGet(urlRequest);
        }


    }
})();