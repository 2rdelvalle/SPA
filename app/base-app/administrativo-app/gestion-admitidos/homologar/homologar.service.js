(function () {
    'use strict';
    angular.module('mytodoApp.service').service('homologarService', homologarService);
    homologarService.$inject = ['$http', '$q'];
    function homologarService($http, $q) {
        var cambioHorario = this;
        cambioHorario.buscarEstudianteByCodigo = getEstudianteByCodigo;
        cambioHorario.buscarMallaByPrograma = getMallaByIdPrograma;
        cambioHorario.buscarMallaDetalle = getMallaDetalle;
        cambioHorario.consultarProgramaPorEstudiante = getProgramaEstudiante;
        cambioHorario.cambiarHorarioEstudiante = postCambioHorario;
        cambioHorario.buscarModulo = Buscar;
        cambioHorario.buscarModulosHomologados = getModulosHomologados;
        cambioHorario.estudiante = {};

        cambioHorario.visible = {};
        cambioHorario.visible.validoprograma = false;
        cambioHorario.visible.validomodalidad = false;
        cambioHorario.visible.validoHorario = false;

        var url = '/api/admisiones';

        function postCambioHorario(rs) {
            var defered = $q.defer();
            var urlrequest = '/api/matricula/MatriculaAcademica/guardarHomologar';
            $http.post(urlrequest, rs).success(function (response) {
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

        function getEstudianteByCodigo(identificacion) {
            var urlRequest = url + '/CambioHorario/consultaEstudiante/' + identificacion;
            return ejecutarServicesGet(urlRequest);
        }

        function getMallaByIdPrograma(idPrograma) {
            var urlRequest = url + '/MallaAcademica/byIdProgramaEstado/' + idPrograma;
            return ejecutarServicesGet(urlRequest);
        }

        function getMallaDetalle(idMalla) {
            var urlRequest = url + '/MallaAcademica/byIdMalla/' + idMalla;
            return ejecutarServicesGet(urlRequest);
        }
        
        function getModulosHomologados(codigo, idPrograma) {
            var urlRequest = '/api/matricula/MatriculaAcademica/moduloHomologado/' + codigo + '/' + idPrograma;
            return ejecutarServicesGet(urlRequest);
        }

        function getProgramaEstudiante(idEstudiante) {
//            var urlrequest = '/api/admisiones/Programa/nivelformacionPrograma/' + rs;
            var urlrequest = '/api/admisiones/Programa/consultarPrograma/' + idEstudiante;
            return ejecutarServicesGet(urlrequest);
        }

        function Buscar() {
            var defered = $q.defer();
            var urlRequest = url + '/Modulo';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

    }
})();