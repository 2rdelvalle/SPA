'use strict';
angular.module('mytodoApp.service').service('corteService', ['utilServices', function (utilServices) {
        var servicio = this;

        var url = '/api/admisiones/';
        var url2 = '/api/crm/';
        var url3 = '/api/financiero/';

        servicio.registrarSeguimientoCartera = function (seguimientoCartera) {
            var urlRequest = url2 + 'SequimientoLlamada/seguimientoCartera';
            return utilServices.EJECUTAR_SERVICE_POST(urlRequest, seguimientoCartera);
        };

        servicio.onConsultarCorteLiquidacionesConvenios = function (fecha1, fecha2) {
            var urlRequest = url + 'Reporte/getFechaCorteCarteraConvenio/' + fecha1 + '/' + fecha2;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        };

        servicio.onConsultarCorteLiquidacionesConveniosGeneral = function (fecha1, fecha2) {
            var urlRequest = url + 'Reporte/getFechaCorteCarteraConvenioGeneral/' + fecha1 + '/' + fecha2;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        };

        servicio.onConsultarEstudiantesConConveniosVencidos = function (id) {
            var urlRequest = url3 + 'Reporte/exportarAspirante/' + id;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        };

        servicio.onConsultarSeguimientoCarteraPorActividadAndAspirante = function (item) {
            var urlRequest = url2 + 'SequimientoLlamada/seguimientoCar/' + item.idActividad + '/' + item.idAspirante;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        };

        servicio.onConsultarEstadisticaLlamadaCartera = function (item) {
            var urlRequest = url2 + 'SequimientoLlamada/seguimientoCartera/' + item;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        };

    }]);

