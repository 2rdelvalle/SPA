(function () {
    'use strict';
    angular.module('mytodoApp.service').service('matriculaServices', matriculaServices);
    matriculaServices.$inject = ['$http', '$q', 'appGenericConstant'];

    function matriculaServices($http, $q, appGenericConstant) {
        var servicioMatricula = this;
        servicioMatricula.buscarEstudiantes = getEstudiantes;
        servicioMatricula.buscarNivelesFormacion = getNivelesFormacion;
        servicioMatricula.buscarProgramasAcademicos = getProgramasAcademicos;
        servicioMatricula.buscarPeriodosAcademicos = getPeriodoAcademico;
        servicioMatricula.buscarHorariosByPrograma = getHorariosByPrograma;
        servicioMatricula.buscarNivelesByPrograma = getNivelesByPrograma;
        servicioMatricula.buscarGruposByPrograma = getGruposByPrograma;
        servicioMatricula.actualizarMatriculas = putMatriculas;
        servicioMatricula.actualizarMatriculasMasivas = putMatriculasMasivas;
        servicioMatricula.matricula = {};

        var url ="/api/matricula/";

        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getEstudiantes(idPeriodo, idNivelFormacion, idPrograma, idHorario, idNivel) {
            var urlRequest = url + 'Matricula/filtroEstudiante/' + idPeriodo + '/' + idNivelFormacion + '/' + idPrograma + '/' + idHorario + '/' + idNivel;
            return ejecutarServicesGet(urlRequest);
        }

        function getNivelesFormacion() {
            var urlRequest = url + 'NivelFormacion';
            return ejecutarServicesGet(urlRequest);
        }

        function getProgramasAcademicos(idNivelFormacion) {
            var urlRequest = url + 'Programa/programaByIdNivelFormacion/' + idNivelFormacion;
            return ejecutarServicesGet(urlRequest);
        }
        function getPeriodoAcademico() {
            var urlRequest = url + 'PeriodoAcademico';
            return ejecutarServicesGet(urlRequest);
        }

        function getNivelesByPrograma(idPrograma) {
            var urlRequest = url + 'Programa/nivelesByIdPrograma/' + idPrograma;
            return ejecutarServicesGet(urlRequest);
        }

        function getHorariosByPrograma(idPrograma) {
            var urlRequest = url + 'Programa/horarioByIdPrograma/' + idPrograma;
            return ejecutarServicesGet(urlRequest);
        }

        function getGruposByPrograma(idPrograma) {
            var urlRequest = url + 'Grupo/grupoByIdPrograma/' + idPrograma;
            return ejecutarServicesGet(urlRequest);
        }

        function putMatriculas(matricula) {
            var defered = $q.defer();
            var urlRequest = url + 'Inscripcion';
            $http.put(urlRequest, matricula).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function putMatriculasMasivas(listaMatriculas) {
            var defered = $q.defer();
            var urlRequest = url + 'Inscripcion/masive';
            $http.put(urlRequest, listaMatriculas).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
    }
})();