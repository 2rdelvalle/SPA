(function () {
    'use strict';
    angular.module('mytodoApp.service').service('EstadoAcademicoEService', EstadoAcademicoEService);

    EstadoAcademicoEService.$inject = ['$http', '$q', 'appGenericConstant'];

    function EstadoAcademicoEService($http, $q, appGenericConstant) {
        var notasEstudianteService = this;


        notasEstudianteService.entidad = {};
        notasEstudianteService.consultaMalla = getMallaDetalleByIdPrograma;
        notasEstudianteService.consultarProgramas= getProgramas;
        notasEstudianteService.entidadAuxiliar = {};
        notasEstudianteService.listaAux = {};
        notasEstudianteService.modulos={};

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

        
         function getProgramas(identificacion) {
            var urlRequest = url + "Programa/ProgramaByIdentificacionEstudante/"+identificacion;
            return ejecutarservice(urlRequest);
        }
        function getMallaDetalleByIdPrograma(id) {
                   var urlRequest = url + "MallaAcademica/consultaMallaByidPrograma/" + id;
                   return ejecutarservice(urlRequest);
               }
    }

})();





