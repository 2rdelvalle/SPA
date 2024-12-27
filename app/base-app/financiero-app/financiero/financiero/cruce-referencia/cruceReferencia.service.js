(function () {

    'use strict';

    angular.module('mytodoApp.service').service('cruceReferenciasService', cruceReferenciasService);

    cruceReferenciasService.$inject = ['$http', '$q', 'appGenericConstant'];

    function cruceReferenciasService($http, $q, appGenericConstant) {

        var cruceReferenciasSer = this;
        var url = "/api/financiero/";


        // cruceReferenciasSer.consultarEstudiante = getEstudianteById;
        cruceReferenciasSer.consultarDetalleAbono = getDetalleAbono;
        cruceReferenciasSer.guardarCruce = postGuardarCruce;
        cruceReferenciasSer.guardarCruceBrila = postGuardarCruceBrila;
        cruceReferenciasSer.buscarComprobantes = getComprobantes;
        cruceReferenciasSer.getDetalleLiquidacionList = getDetalleLiquidacionList;
        cruceReferenciasSer.guardarCruceMasivo = postGuardarCruceMasivo;

        cruceReferenciasSer.cruceReferencias = {};
        cruceReferenciasSer.cruceReferenciasAuxiliar = {};
        cruceReferenciasSer.cruceReferenciasAuxiTotal = {};
        cruceReferenciasSer.datosEstudianteSer = {};
        cruceReferenciasSer.downloadArchivo = onDownloadArchivos;

        function getDetalleLiquidacionList(rs) {
            var urlRequest = url + "LiquidacionConcepto/getListaDetalleLiquidacionById/" + rs;
            return ejecutarServicesGet(urlRequest, rs);
        }

        function getDetalleAbono(rs) {
            var urlRequest = url + "LiquidacionConcepto/abono/" + rs;
            return ejecutarServicesGet(urlRequest, rs);
        }

        function getComprobantes(referencia) {
            var urlRequest = url + 'CajaMovimientoDiario/byReferencia/' + referencia;
            return ejecutarServicesGet(urlRequest);
        }

        function postGuardarCruce(rs) {
            var urlRequest = url + "CruceReferencia";
            return ejectutarServicePost(urlRequest, rs);
        }

        function postGuardarCruceBrila(rs) {
            var urlRequest = url + "CruceReferencia/guardarCruceBrilla/";
            return ejectutarServicePost(urlRequest, rs);
        }

        function postGuardarCruceMasivo(rs) {
            var urlRequest = url + "CruceReferencia/guardarCruceMasivo/";
            return ejectutarServicePost(urlRequest, rs);
        }

        function ejecutarServicesGet(urlRequest, rs) {
            var defered = $q.defer();
            $http.get(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (response) {
                defered.reject(response);
            });
            return defered.promise;
        }

        function ejectutarServicePost(urlRequest, rs) {
            var defered = $q.defer();
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function onDownloadArchivos(file) {
            var urlRequest = url + 'report/' + file;
            return urlRequest;
        }
    }
})();
