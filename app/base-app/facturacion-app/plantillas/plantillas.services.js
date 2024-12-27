(function () {
    'use strict';
    angular.module('mytodoApp.service').service('plantillaEntitiesService', plantillaEntitiesService);
    plantillaEntitiesService.$inject = ['$http', '$q'];

    function plantillaEntitiesService($http, $q) {
        var servicio = this;
        servicio.buscarPlantilla = Buscar;
        servicio.buscarConceptosFacturacion = buscarConceptosFacturacion;
        servicio.buscarConceptosAsociados = buscarConceptosAsociados;
        servicio.agregarPlantilla = Agregar;
        servicio.eliminarPlantilla = Eliminar;
        servicio.plantilla = {};
        servicio.plantillaAux = {};

        var urlConceptos = '/api/financiero/ConceptoFacturacion/concepto/';
        var urlPlantilla = '/api/financiero/PlantillaLiquidacion';
        function Buscar() {
            var defered = $q.defer();
            var urlRequest = urlPlantilla;
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function buscarConceptosFacturacion() {
            var defered = $q.defer();
            var urlRequest = urlConceptos + 'excludePlantilla';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function buscarConceptosAsociados(rs) {
            var defered = $q.defer();
            var urlRequest = urlConceptos + 'exclude/' + rs;
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function Agregar(rs) {
            var defered = $q.defer();
            var urlRequest = urlPlantilla;
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function Eliminar(rs) {
            var defered = $q.defer();
            var urlRequest = urlPlantilla + '/' + rs.id;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
    }
})();

