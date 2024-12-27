(function () {
    'use strict';
    angular.module('mytodoApp.service').service('grupoMatriculaServices', grupoMatriculaServices);
    grupoMatriculaServices.$inject = ['$http', '$q', 'appGenericConstant'];

    function grupoMatriculaServices($http, $q, appGenericConstant) {
        var servicioGrupoMatricula = this;
        servicioGrupoMatricula.buscarGrupos = getGrupos;
//        servicioGrupoMatricula.buscarNivelesByPrograma = getNivelesByPrograma;
//        servicioGrupoMatricula.buscarHorariosByPrograma = getHorariosByPrograma;
//        servicioGrupoMatricula.buscarProgramasByNivelFormacion = getProgramasByNivelFormacion;
//        servicioGrupoMatricula.buscarNivelesFormacion = getNivelesFormacion;
        servicioGrupoMatricula.registrarGrupoMatricula = postGrupoMatricula;
        servicioGrupoMatricula.registrarGrupoMatriculaEstudiante = postGrupoMatriculaEstudiante;
        servicioGrupoMatricula.registrarEvaluacionDocente = postResultadoEvaluacion;
        servicioGrupoMatricula.eliminarGrupo = deleteGrupo;
        servicioGrupoMatricula.actualizarGrupo = putGrupo;
        servicioGrupoMatricula.onBuscarEstudiante = getEstudiante;
        servicioGrupoMatricula.buscarPeriodos = getPeriodo;
        servicioGrupoMatricula.buscarGruposPorPeriodo = getGruposPorPerido;
        servicioGrupoMatricula.buscarPreguntasRespuestaByIdEncuesta = getPreguntaRespuestaByIdEncuesta;
        servicioGrupoMatricula.buscarPreguntasByIdEncuesta = getPreguntaByIdEncuesta;
        servicioGrupoMatricula.buscarEncuestas = getAllEncuesta;
        servicioGrupoMatricula.onCargarResultadoEncuesta = getEncuestaEstudianteResultado;
        servicioGrupoMatricula.grupomatricula = {};
        servicioGrupoMatricula.grupoAuxiliar = {};
        servicioGrupoMatricula.obtenerIdEstudianteByIdPrograma = getEstudianteByIdentificacionByIdPrograma;

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

        function getGrupos() {
            var urlRequest = url + 'api/matricula/Grupo/buscarGrupos';
            return ejecutarServicesGet(urlRequest);
        }
        function getGruposPorPerido(id) {
            var urlRequest = url + 'api/matricula/Grupo/grupoByIdPerido/' + id;
            return ejecutarServicesGet(urlRequest);
        }

//        function getEstudiante(id) {
//            var urlRequest = url + 'api/matricula/GrupoMatricula/estduiantes/'+ id;
//            return ejecutarServicesGet(urlRequest);
//        }
//        
        function getEstudiante(id) {
            var urlRequest = url + 'api/matricula/GrupoMatricula/estduiantesMatricula/' + id;
            return ejecutarServicesGet(urlRequest);
        }

        function getPreguntaRespuestaByIdEncuesta(id) {
            var urlRequest = url + 'api/matricula/Encuesta/preguntasRespuestaByIdEncuesta/' + id;
            return ejecutarServicesGet(urlRequest);
        }

        function getPreguntaByIdEncuesta(id) {
            var urlRequest = url + 'api/matricula/Encuesta/preguntasByIdEncuesta/' + id;
            return ejecutarServicesGet(urlRequest);
        }

        function getAllEncuesta() {
            var urlRequest = url + 'api/matricula/Encuesta/getAllEncuesta/';
            return ejecutarServicesGet(urlRequest);
        }

        function getEncuestaEstudianteResultado() {
            var urlRequest = url + 'api/matricula/Encuesta/getEncuestaEstudianteResultado/';
            return ejecutarServicesGet(urlRequest);
        }

        function getPeriodo() {
            var urlRequest = url + 'api/matricula/PeriodoAcademico/todos';
            return ejecutarServicesGet(urlRequest);
        }

        function postResultadoEvaluacion(grupoMatricula) {
            var defered = $q.defer();
            var urlRequest = url + 'api/matricula/Encuesta';
            $http.post(urlRequest, grupoMatricula).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function postGrupoMatricula(grupoMatricula) {
            var defered = $q.defer();
            var urlRequest = url + 'api/matricula/GrupoMatricula';
            $http.post(urlRequest, grupoMatricula).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        
        function postGrupoMatriculaEstudiante(grupoMatricula) {
            var defered = $q.defer();
            var urlRequest = url + 'api/matricula/GrupoMatricula/guardarMatriculaEstudiante';
            $http.post(urlRequest, grupoMatricula).success(function (response) {
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

        function getEstudianteByIdentificacionByIdPrograma(identificacion, idPrograma) {
            var urlRequest = url + 'api/matricula/Estudiante/consultarEstudianteByIdPrograma/' + identificacion + '/' + idPrograma;
            return ejecutarServicesGet(urlRequest);
        }

    }
})();


