(function () {
    'use strict';
    angular.module('mytodoApp.service').service('historialCreditoServices', historialCreditoServices);
    historialCreditoServices.$inject = ['$http', '$q', 'appGenericConstant'];

    function historialCreditoServices($http, $q, appGenericConstant) {
        var servicioHistorialCreditos = this;
        servicioHistorialCreditos.buscarEstudianteByCodigo = getEstudianteByCodigo;
        servicioHistorialCreditos.estudiante = {};
        var url ='/api/financiero';
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
            var urlRequest = url + '/SolicitudCreditoConvenio/historialEstudiante/' + identificacion;
            return ejecutarServicesGet(urlRequest);
        }

    }
})();