'use strict';
angular.module('mytodoApp.service').service('movCajaService', ['utilServices', function (utilServices) {
        var servicio = this;

        servicio.consultarListado = getlistadoMovCaja;
        servicio.consultarDetalle = getlistadoMovCajaDetalle;
        servicio.getDetalleRecibo = getDetalleRecibo;
        servicio.entidad = {};
        servicio.entidadBus = {};
        servicio.entidadAuxiliar = {};

        var url = "/api/financiero/";

        function getlistadoMovCaja(fecha, fecha2) {
            var urlRequest = url + "HistorialMovimientoCaja/" + fecha + "/" + fecha2;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getlistadoMovCajaDetalle(id) {
            var urlRequest = url + "HistorialMovimientoCaja/getDetalleRecibo/" + id;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getDetalleRecibo(data) {
          var urlRequest = url + "LiquidacionConcepto/reporte";
          return utilServices.EJECUTAR_SERVICE_POST(urlRequest, data);
        }

    }]);


