(function () {
    'use strict';
    angular.module('mytodoApp.service').service('configuracionRequisitosProgramasEntitiesService', configuracionRequisitosProgramasEntitiesService);
    configuracionRequisitosProgramasEntitiesService.$inject = ['$http', '$q', 'appGenericConstant'];

    function configuracionRequisitosProgramasEntitiesService($http, $q, appGenericConstant) {
        var servicio = this;
        servicio.buscarConfiguracionRequisitosProgramas = Buscar;
        servicio.listarProgramasAcademicos = listaProgramasAcademicos;
        servicio.listarNivelesFormacion = listaNivelesFormacion;
        servicio.actualizarConfiguracionRequisitosProgramas = Actualizar;
        servicio.configuracionRequisitosProgramas = {};
        servicio.configuracionRequisitosProgramasAux = {};
        var url ='/api/admisiones/';
        
        function Buscar(programa) {
            var defered = $q.defer();
            var urlRequest = url + 'Programa/jornada/' + programa.id;
            $http.get(urlRequest, programa).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function listaNivelesFormacion() {
            var defered = $q.defer();
            var urlRequest = url + 'NivelFormacion';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }


        function listaProgramasAcademicos() {
            var defered = $q.defer();
            var urlRequest = url + 'Programa/configuracion';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }



        function Actualizar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'Programa/requisitos';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
    }
})();

