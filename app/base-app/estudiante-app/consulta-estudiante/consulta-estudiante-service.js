'use strict';
angular.module('mytodoApp.service').service('estudianteConsultaService', ['$http', '$q', function ($http, $q) {
        var servicio = this;
        servicio.buscarEstudiante = consultarEstuidante;
        servicio.estudiante = {};
        servicio.estudianteAux = {};
        var url = '/api/admisiones/Estudiante/';
        
        function consultarEstuidante(parametro) {
            var defered = $q.defer();
            var urlRequest = url + 'consultarEstudianteBy?nombre=' + parametro.toUpperCase();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
    }]);
