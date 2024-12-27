(function () {
    'use strict';
    angular.module('mytodoApp.service').service('estadoFinancieroServices', estadoFinancieroServices);
    estadoFinancieroServices.$inject = ['$http', '$q', 'appGenericConstant'];

    function estadoFinancieroServices($http, $q, appGenericConstant) {
        var servicioHistorialCreditos = this;

        servicioHistorialCreditos.buscarEstudianteByCodigo = getEstudianteByCodigo;
        servicioHistorialCreditos.buscarEstudianteByCodigoAndEstado = getEstudianteByCodigoAndEstado;
        servicioHistorialCreditos.estudiante = {};
        servicioHistorialCreditos.liquidacion = {};
        

        var url = '/api/financiero';

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
            var urlRequest = url + '/EstadoFinanciero/buscarEstudianteByCodigo/' + identificacion;
            return ejecutarServicesGet(urlRequest);
        }

//        function getEstudianteByCodigoAndEstado(identificacion) {
//            var urlRequest = url + '/EstadoFinanciero/byCodigoAndEstado/' + identificacion + '/' + appGenericConstant.ABIERTA;
//            return ejecutarServicesGet(urlRequest);
//        }

     function getEstudianteByCodigoAndEstado(identificacion) {
            var urlRequest = url + '/EstadoFinanciero/byCodigoAndEstado/' + identificacion;
            return ejecutarServicesGet(urlRequest);
        }
        
    }
})();


