(function () {
    'use strict';
    angular.module('mytodoApp.service').service('matriculaAcademicaServices', matriculaAcademicaServices);
    matriculaAcademicaServices.$inject = ['$http', '$q', 'appGenericConstant'];

    function matriculaAcademicaServices($http, $q, appGenericConstant) {
        var servicioMatricula = this;
        servicioMatricula.buscarEstudiantes = getEstudiantes;
        servicioMatricula.buscarNivelesFormacion = getNivelesFormacion;
        servicioMatricula.buscarProgramasAcademicos = getProgramasAcademicos;
        servicioMatricula.buscarPeriodosAcademicos = getPeriodoAcademico;
        servicioMatricula.buscarHorariosByPrograma = getHorariosByPrograma;
        servicioMatricula.buscarNivelesByPrograma = getNivelesByPrograma;
        servicioMatricula.buscarGruposByPrograma = getGruposByPrograma;
        servicioMatricula.actualizarMatriculas = putMatriculas;
        servicioMatricula.buscarProgramaEstudiante = getProgramasAdmitidos;
        servicioMatricula.buscarModulosProgrma = getModulosPrograma;
        servicioMatricula.registrarMatricula=postMatricula;
        servicioMatricula.matricula = {};
        servicioMatricula.estudiante = {};

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

  
        function getProgramasAdmitidos(codigoEstudiante) {
            var urlRequest = url + 'MatriculaAcademica/byCodigo/'+ codigoEstudiante;
            return ejecutarServicesGet(urlRequest);
        }
            function getEstudiantes(idPeriodo, idPrograma, idHorario, idNivel) {
            var urlRequest = url + 'MatriculaAcademica/filtrarEstudiante/' + idPeriodo + '/' + idPrograma + '/' + idHorario + '/' + idNivel;
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
            var urlRequest = url + 'PeriodoAcademico/byEstadoPeriodo';
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
        
         function getModulosPrograma(idPrograma, idEstudiante) {
            var urlRequest = url + 'MatriculaAcademica/moduloByProgramaNivel/'+ idPrograma+ '/' + idEstudiante;
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

        function postMatricula(matricula) {
            var defered = $q.defer();
            var urlRequest = url + 'MatriculaAcademica';
            $http.post(urlRequest, matricula).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
    }
})();

