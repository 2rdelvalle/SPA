(function () {

    'use strict';

    angular.module('mytodoApp.service').service('liquidarConceptosEstudianteService', liquidarConceptosEstudianteService);

    liquidarConceptosEstudianteService.$inject = ['$http', '$q'];

    function liquidarConceptosEstudianteService($http, $q) {

        var liquidarConceptosSer = this;
        var url = '/api/financiero/';


        liquidarConceptosSer.consultarEstudiante = getEstudianteById;
        liquidarConceptosSer.consultarConceptosALiquidar = getListaConceptosALiquidar;
        liquidarConceptosSer.consultarDetalleConceptoALiquidar = getDetalleConceptoALiquidar;
        liquidarConceptosSer.guardarLiquidacion = postGuardarLiquidacion;
        liquidarConceptosSer.guardarLiquidacionModulo = postGuardarLiquidacionModulo;

        liquidarConceptosSer.liquidarConceptos = {};

        liquidarConceptosSer.liquidarConceptosAuxiliar = {};

        liquidarConceptosSer.liquidarConceptosAuxiTotal = {};

        liquidarConceptosSer.datosEstudianteSer = {};
        liquidarConceptosSer.downloadArchivo = onDownloadArchivos;
        function getEstudianteById(rs, tp) {
            var urlRequest = url + "Estudiante/liquidacion/byCodigo/" + rs + "/"+tp;
            return ejectutarServiceId(urlRequest, rs);
        }

        function getListaConceptosALiquidar() {
            var urlRequest = url + "ConceptoFacturacion/concepto/ingreso";
            return ejectutarServiceId(urlRequest);
        }

        function getDetalleConceptoALiquidar(rs) {
            var urlRequest = url + "LiquidacionConcepto/detalleConceptoLiquidado/" + rs.idEstudiante + "/" + rs.idPrograma + "/" + rs.idPeriodo + "/" + rs.idConcepto;
            return ejectutarServiceId(urlRequest, rs);
        }

        function postGuardarLiquidacion(rs) {
            var urlRequest = url + "LiquidacionConcepto";
            return ejectutarServicePost(urlRequest, rs);
        }
        
        function postGuardarLiquidacionModulo(rs) {
            var urlRequest = url + "LiquidacionConcepto/guardarLiquidacionModulo";
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
            var urlRequest = url + 'report/' + file;
            return urlRequest;
        }

    }
})();
