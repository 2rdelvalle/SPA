(function () {
    'use strict';
    angular.module('mytodoApp.service').service('historialLiquidacionServices', historialLiquidacionServices);
    historialLiquidacionServices.$inject = ['utilServices'];
    function historialLiquidacionServices(utilServices) {
        var servicioHistorialCreditos = this;
        servicioHistorialCreditos.buscarEstudianteByCodigo = getEstudianteByCodigo;
        servicioHistorialCreditos.buscarHIstorialEstudianteByCodigo = gethistorialEstudianteByCodigo;
        servicioHistorialCreditos.anularLiquidacion = PosthistorialAnularLiquidacion;
        servicioHistorialCreditos.castigarEstudiante = onCastigarEstudiante;
        servicioHistorialCreditos.estudiante = {};
        servicioHistorialCreditos.onGuardarDescuento = postGuardarDescuento;
        servicioHistorialCreditos.onGuardarDescuentoPago = postGuardarPago;
        servicioHistorialCreditos.onGuardarSupletorio = postGuardarSupletorio;
        var url = '/api/financiero';

        function getEstudianteByCodigo(identificacion) {
            var urlRequest = url + '/LiquidacionConcepto/historialLiquidacion/' + identificacion;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function gethistorialEstudianteByCodigo(identificacion) {
            var urlRequest = url + '/LiquidacionConcepto/historialLiquidacionDetalle/' + identificacion;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        this.getHistorialEstudianteByCodigoConRecibo = function (identificacion) {
            var urlRequest = url + '/LiquidacionConcepto/historialLiquidacionDetalleRecibo/' + identificacion;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        };

        function onCastigarEstudiante(identificacion, idUsuario) {
            var urlRequest = url + '/LiquidacionConcepto/castigarEstudiante/' + identificacion + '/' + idUsuario;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function PosthistorialAnularLiquidacion(liquidacion) {
            var urlRequest = url + '/LiquidacionConcepto/anularLiquidacion';
            return utilServices.EJECUTAR_SERVICE_POST(urlRequest, liquidacion);
        }

        function postGuardarDescuento(liquidacion) {
            var urlRequest = url + '/LiquidacionConcepto/aplicarDescuentoLiquidacion';
            return utilServices.EJECUTAR_SERVICE_POST(urlRequest, liquidacion);
        }

        function postGuardarPago(liquidacion) {
            var urlRequest = url + '/LiquidacionConcepto/aplicarPagoLiquidacion';
            return utilServices.EJECUTAR_SERVICE_POST(urlRequest, liquidacion);
        }
        
        function postGuardarSupletorio(liquidacion) {
            var urlRequest = url + '/LiquidacionConcepto/appSup';
            return utilServices.EJECUTAR_SERVICE_POST(urlRequest, liquidacion);
        }
    }
})();