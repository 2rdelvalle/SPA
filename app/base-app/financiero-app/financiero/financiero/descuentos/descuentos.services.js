(function () {

    'use strict';

    angular.module('mytodoApp.service').service('gestionDescuentoService', gestionDescuentoService);

    gestionDescuentoService.$inject = ['$http', '$q', 'appGenericConstant'];

    function gestionDescuentoService($http, $q, appGenericConstant) {

        var gestionDescuentosSer = this;

        var ip = appGenericConstant.URL;


        gestionDescuentosSer.consultarEstudiante = getEstudianteById;
        gestionDescuentosSer.consultarDescuentosALiquidar = getListaDescuentosALiquidar;
        gestionDescuentosSer.consultarDetalleConceptoALiquidar = getDetalleConceptoALiquidar;
        gestionDescuentosSer.guardarLiquidacion = postGuardarLiquidacion;
        gestionDescuentosSer.consultarEstudianteDescuento = getListaEstudianteConDescuento;

        gestionDescuentosSer.gestionDescuentos = {};

        gestionDescuentosSer.gestionDescuentosAuxiliar = {};

        gestionDescuentosSer.gestionDescuentosAuxTotal = {};

        gestionDescuentosSer.datosEstudianteSer = {};
        gestionDescuentosSer.downloadArchivo = onDownloadArchivos;

        function getEstudianteById(rs) {
            var urlRequest = "/api/financiero/Estudiante/liquidacion/byCodigo/" + rs;
            return ejectutarServiceId(urlRequest, rs);
        }

        function getListaDescuentosALiquidar() {
            var urlRequest = "/api/financiero/ConceptoFacturacion/concepto/ingreso";
            return ejectutarServiceId(urlRequest);
        }
        
        function getListaEstudianteConDescuento() {
            var urlRequest = "/api/financiero/LiquidacionConcepto/historialLiquidacionEstudianteDescuento";
            return ejectutarServiceId(urlRequest);
        }

        function getDetalleConceptoALiquidar(rs) {
            var urlRequest = "/api/financiero/LiquidacionConcepto/detalleConceptoLiquidado/" + rs.idEstudiante + "/" + rs.idPrograma + "/" + rs.idPeriodo + "/" + rs.idConcepto;
            return ejectutarServiceId(urlRequest, rs);
        }

        function postGuardarLiquidacion(rs) {
            var urlRequest = "/api/financiero/LiquidacionConcepto";
            return ejectutarServicePost(urlRequest, rs);
        }

        function ejectutarServiceId(urlRequest, rs) {
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
            var urlRequest = '/api/financiero/report/' + file;
            return urlRequest;
        }

    }
})();
