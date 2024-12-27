(function () {
    'use strict';
    angular.module('mytodoApp.service').service('cambioHorarioServices', cambioHorarioServices);
    cambioHorarioServices.$inject = ['$http', '$q'];
    function cambioHorarioServices($http, $q) {
        var cambioHorario = this;
        cambioHorario.buscarEstudianteByCodigo = getEstudianteByCodigo;
        cambioHorario.consultarProgramaPorEstudiante = getProgramaEstudiante;
        cambioHorario.consultarProgramaPorEstudianteNivelFormacion = getProgramaEstudianteNivelFormacion;
        cambioHorario.cambiarHorarioEstudiante = postCambioHorario;
        cambioHorario.cambiarSemestreEstudiante = postCambioSemestre;
        cambioHorario.estudiante = {};
        
        cambioHorario.visible = {};
        cambioHorario.visible.validoprograma = false;
        cambioHorario.visible.validomodalidad = false;
        cambioHorario.visible.validoHorario = false;
        
        var url ='/api/admisiones';
        
        function postCambioHorario(rs) {
            var defered = $q.defer();
            var urlrequest = '/api/admisiones/CambioHorario/guardarCambio';
            $http.post(urlrequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function postCambioSemestre(rs) {
            var defered = $q.defer();
            var urlrequest = '/api/admisiones/CambioHorario/guardarCambioSemestre';
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
        
        function getProgramaEstudiante(idEstudiante) {
//            var urlrequest = '/api/admisiones/Programa/nivelformacionPrograma/' + rs;
            var urlrequest = '/api/admisiones/Programa/consultarPrograma/' + idEstudiante;
            return ejecutarServicesGet(urlrequest);
        }
        
        function getProgramaEstudianteNivelFormacion(idPrograma,idNivelFormacion) {
//            var urlrequest = '/api/admisiones/Programa/nivelformacionPrograma/' + rs;
            var urlrequest = '/api/admisiones/Programa/consultarProgramaNivelFormacion/'+idPrograma+'/'+idNivelFormacion;
            return ejecutarServicesGet(urlrequest);
        }
        
    }
})();