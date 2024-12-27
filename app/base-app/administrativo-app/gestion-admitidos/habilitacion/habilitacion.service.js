(function () {
    'use strict';
    angular.module('mytodoApp.service').service('habilitacionService', habilitacionService);
    habilitacionService.$inject = ['$http', '$q'];
    function habilitacionService($http, $q) {
        var habilitacion = this;
        
        habilitacion.buscarEstudianteByCodigo = getEstudianteByCodigo;
        habilitacion.guardarHabilitacionEstudiante = postHabilitacion;
        habilitacion.estudiante = {};
        habilitacion.visible = {};
        habilitacion.visible.validoprograma = false;
        habilitacion.visible.validomodalidad = false;
        habilitacion.visible.validoHorario = false;

        var url = '/api/admisiones';

        function postHabilitacion(rs) {
            var defered = $q.defer();
            var urlrequest = '/api/matricula/MatriculaAcademica/guardarHabilitacion';
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
            var urlRequest = '/api/matricula/MatriculaAcademica/byCodigoHabilitacion/' + identificacion;
            return ejecutarServicesGet(urlRequest);
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