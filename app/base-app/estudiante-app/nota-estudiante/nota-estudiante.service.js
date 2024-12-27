(function () {
    'use strict';
    angular.module('mytodoApp.service').service('notaEstudianteService', notaEstudianteService);

    notaEstudianteService.$inject = ['$http', '$q', 'appGenericConstant'];

    function notaEstudianteService($http, $q, appGenericConstant) {
        var notasEstudianteService = this;


        notasEstudianteService.entidad = {};
        notasEstudianteService.consultarPeriodo = getPeriodoAcademico;
        notasEstudianteService.consultarNotas = getNotas;
        notasEstudianteService.consultarProgramas= getProgramas;

        var url = "/api/matricula/";

        function ejecutarservice(urlRequest) {
            var deferred = $q.defer();
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getPeriodoAcademico(identificacion) {
            var urlRequest = url + "PeriodoAcademico/periodosMatriculados/" + identificacion;
            return ejecutarservice(urlRequest);
        }
        
        function getNotas(idPeriodo,identificacion,idPrograma) {
            var urlRequest = url + "MatriculaAcademica/notasEstudiante/"+idPeriodo+"/"+identificacion+"/"+idPrograma;
            return ejecutarservice(urlRequest);
        }
        
        function getProgramas(identificacion,id) {
            var urlRequest = url + "Programa/ProgramaByIdentificacionEstudanteAndIdPeriodo/"+identificacion+"/"+id;
            return ejecutarservice(urlRequest);
        }

    }

})();



