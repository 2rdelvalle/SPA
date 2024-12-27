(function () {
    'use strict';
    angular.module('mytodoApp.service').service('asignarNotaServiceGnrl', asignarNotaServiceGnrl);
    asignarNotaServiceGnrl.$inject = ['$http', '$q', 'appGenericConstant'];

    function asignarNotaServiceGnrl($http, $q, appGenericConstant) {
        var asignarNotaServiceGnrl = this;
        asignarNotaServiceGnrl.asignarNota = postMatriculaAcademica;
        asignarNotaServiceGnrl.buscarGruposModulo = buscarGruposByModulo;
        asignarNotaServiceGnrl.buscarGruposModuloPeriodoPrograma = buscarGruposByModuloPeriodoPrograma;
        asignarNotaServiceGnrl.buscarModulo = getModulo;
        asignarNotaServiceGnrl.buscarModuloByIdPrograma = getModuloByPrograma;
        asignarNotaServiceGnrl.buscarModuloByIdProgramaEstudiante= getModuloByProgramaByEstudiante;
        asignarNotaServiceGnrl.buscarConfiguracion = getConfiguracion;
        asignarNotaServiceGnrl.buscarEstudiantesByGrupo = buscarEstudiantesByGrupo;
        asignarNotaServiceGnrl.buscarEstudiantesCruceByGrupo = buscarEstudiantesCruceByGrupo;
        asignarNotaServiceGnrl.onBuscarEstudiantesAspirantesGrado = buscarEstudiantesAspirantesGrado;
        asignarNotaServiceGnrl.postGuardarGraduado = postGuardarGraduado;
        asignarNotaServiceGnrl.buscarGrupoByIdModuloIdEstudiante = grupoByIdModuloIdEstudiante;

//        asignarNotaServiceGnrl.buscarEstudiantePorGrupo = buscarEstudianteByGrupo;

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

        function buscarGruposByModuloPeriodoPrograma(modulo, periodo, programa) {
            var urlRequest = url + 'api/matricula/Grupo/grupoByIdModuloIdPeriodoIdPrograma/' + modulo + '/' + periodo + '/' + programa;
            return ejecutarServicesGet(urlRequest);
        }

        function grupoByIdModuloIdEstudiante(idModulo, idEstudiante) {
            var urlRequest = url + 'api/matricula/Grupo/grupoByIdModuloIdEstudiante/' + idModulo + '/' + idEstudiante 
            return ejecutarServicesGet(urlRequest);
        }

        function buscarEstudiantesByGrupo(rs) {
            var urlRequest = url + 'api/matricula/Grupo/buscarMatriculasByGrupo/' + rs;
            return ejecutarServicesGet(urlRequest);
        }

        function buscarEstudiantesCruceByGrupo(rs) {
            var urlRequest = url + 'api/matricula/Grupo/fn_estudianteMatriculaCruceMasivo/' + rs;
            return ejecutarServicesGet(urlRequest);
        }

        function buscarEstudiantesAspirantesGrado() {
            var urlRequest = url + 'api/matricula/MatriculaAcademica/estudiantesAspiranteGrado/';
            return ejecutarServicesGet(urlRequest);
        }

        function postGuardarGraduado(rs) {
            var urlRequest = url + "api/matricula/MatriculaAcademica/guardarGraduado/";
            return ejectutarServicePost(urlRequest, rs);
        }
        function getModuloByPrograma(rs) {
            var urlRequest = url + 'api/matricula/Modulo/byIdProgarma/' + rs;
            return ejecutarServicesGet(urlRequest);
        }

        function getModuloByProgramaByEstudiante(rs,idEst) {
            var urlRequest = url + 'api/matricula/Modulo/byIdEstByIdPrograma/' + rs + "/" +idEst;
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