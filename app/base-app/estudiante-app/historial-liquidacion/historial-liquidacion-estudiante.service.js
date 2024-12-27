(function () {
    'use strict';
    angular.module('mytodoApp.service').service('historialLiquidacionEstudianteServices', historialLiquidacionEstudianteServices);
    historialLiquidacionEstudianteServices.$inject = ['$http', '$q'];
    function historialLiquidacionEstudianteServices($http, $q) {
        var servicioHistorialCreditos = this;
        servicioHistorialCreditos.buscarEstudianteByCodigo = getEstudianteByCodigo;
        servicioHistorialCreditos.buscarHIstorialEstudianteByCodigo = gethistorialEstudianteByCodigo;
        servicioHistorialCreditos.anularLiquidacion = PosthistorialAnularLiquidacion;
        servicioHistorialCreditos.estudiante = {};
        servicioHistorialCreditos.onGuardarDescuento = postGuardarDescuento;
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
            var urlRequest = url + '/LiquidacionConcepto/historialLiquidacion/' + identificacion;
            return ejecutarServicesGet(urlRequest);
        }

        function gethistorialEstudianteByCodigo(identificacion) {
            var urlRequest = url + '/LiquidacionConcepto/historialLiquidacionDetalle/' + identificacion;
            return ejecutarServicesGet(urlRequest);
        }

        function PosthistorialAnularLiquidacion(liquidacion) {
            var urlRequest = url + '/LiquidacionConcepto/anularLiquidacion';
            var defered = $q.defer();
            $http.post(urlRequest, liquidacion).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        
        function postGuardarDescuento(liquidacion) {
            var urlRequest = url + '/LiquidacionConcepto/aplicarDescuentoLiquidacion';
            var defered = $q.defer();
            $http.post(urlRequest, liquidacion).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
    }
})();