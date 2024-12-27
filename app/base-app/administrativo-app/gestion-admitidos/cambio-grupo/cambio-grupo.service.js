(function () {
    'use strict';
    angular.module('mytodoApp.service').service('cambioGrupoService', cambioGrupoService);
    cambioGrupoService.$inject = ['$http', '$q', 'appGenericConstant'];

    function cambioGrupoService($http, $q, appGenericConstant) {
        var cambioGrupoService = this;
        cambioGrupoService.asignarNota = postMatriculaAcademica;
        cambioGrupoService.guardarCambioGrupo = postMatriculaAcademicaCambioGrupo;
        cambioGrupoService.buscarGruposModulo = buscarGruposByModulo;
        cambioGrupoService.buscarModulo = getModulo;
        cambioGrupoService.buscarConfiguracion = getConfiguracion;
        cambioGrupoService.buscarEstudiantesByGrupo = buscarEstudiantesByGrupo;
        cambioGrupoService.buscarEstudiantesByGrupoCambioGrupo = buscarEstudiantesByGrupoCambioGrupo;

//        cambioGrupoService.buscarEstudiantePorGrupo = buscarEstudianteByGrupo;

        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        var url = '/';

        function getModulo() {
            var urlRequest = url + 'api/matricula/Modulo';
            return ejecutarServicesGet(urlRequest);
        }

        function getConfiguracion() {
            var urlRequest = url + 'api/matricula/ConfiguracionNota';
            return ejecutarServicesGet(urlRequest);
        }


        function buscarGruposByModulo(rs) {
            var urlRequest = url + 'api/matricula/Grupo/grupoByIdModulo/' + rs;
            return ejecutarServicesGet(urlRequest);
        }

        function buscarEstudiantesByGrupo(rs) {
            var urlRequest = url + 'api/matricula/Grupo/buscarMatriculasByGrupo/' + rs;
            return ejecutarServicesGet(urlRequest);
        }
        
        function buscarEstudiantesByGrupoCambioGrupo(rs) {
            var urlRequest = url + 'api/matricula/Grupo/buscarMatriculasByGrupoCambioGrupo/' + rs;
            return ejecutarServicesGet(urlRequest);
        }


        function getModulo() {
            var urlRequest = url + 'api/matricula/Modulo';
            return ejecutarServicesGet(urlRequest);
        }

        function postMatriculaAcademica(grupo) {
            var defered = $q.defer();
            var urlRequest = url + 'api/matricula/MatriculaAcademica/guardarMatriculaNota';
            $http.post(urlRequest, grupo).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function postMatriculaAcademicaCambioGrupo(grupo) {
            var defered = $q.defer();
            var urlRequest = url + 'api/matricula/GrupoMatricula/guardarCambioGrupo';
            $http.post(urlRequest, grupo).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function deleteGrupo(grupo) {
            var defered = $q.defer();
            var urlRequest = url + 'api/matricula/Grupo/' + grupo.id;
            $http.delete(urlRequest, grupo).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function putGrupo(grupo) {
            var defered = $q.defer();
            var urlRequest = url + 'api/matricula/Grupo';
            $http.put(urlRequest, grupo).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

    }
})();