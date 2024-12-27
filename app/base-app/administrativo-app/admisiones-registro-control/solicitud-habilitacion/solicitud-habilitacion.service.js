(function () {
    'use strict';
    angular.module('mytodoApp.service').service('solicitudHabilitacionServices', solicitudHabilitacionServices);
    solicitudHabilitacionServices.$inject = ['$http', '$q'];
    function solicitudHabilitacionServices($http, $q) {
        var solicitudHabilitacion = this;
        solicitudHabilitacion.buscarEstudianteByCodigo = getModuloById;
        solicitudHabilitacion.buscarReferencia = getConceptoByReferencia;
        solicitudHabilitacion.buscarIdLiquidacion = getSolicitudHabilitacionByIdLiquidacion;
        solicitudHabilitacion.guardarSolicitudDeHabilitacion = postsolicitudHabilitacion;
        solicitudHabilitacion.solicitud = {};
        
        solicitudHabilitacion.visible = {};
        solicitudHabilitacion.visible.validoprograma = false;
        solicitudHabilitacion.visible.validomodalidad = false;
        solicitudHabilitacion.visible.validoHorario = false;
        
        var url ='/api/matricula';
        
        function postsolicitudHabilitacion(rs) {
            var defered = $q.defer();
            var urlrequest = url + '/Habilitacion/guardarSolicitud/';
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

        function getModuloById(id) {
            var urlRequest = url + '/Habilitacion/buscarModuloActivo/' + id;
            return ejecutarServicesGet(urlRequest);
        }

        function getSolicitudHabilitacionByIdLiquidacion(idLiquidacion) {
            var urlRequest = url + '/Habilitacion/buscarLiquidacionEnSolicitudHabilitacion/' + idLiquidacion;
            return ejecutarServicesGet(urlRequest);
        }

        function getConceptoByReferencia(referencia) {
            var urlRequest = url + '/Habilitacion/buscarConcepto/' + referencia;
            return ejecutarServicesGet(urlRequest);
        }
        
        
        
    }
})();