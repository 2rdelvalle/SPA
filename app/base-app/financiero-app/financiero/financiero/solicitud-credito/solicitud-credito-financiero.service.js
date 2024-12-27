(function () {
    'use strict';
    angular.module('mytodoApp.service').service('solicitudCreditoFinancieroServices', solicitudCreditoFinancieroServices);
    solicitudCreditoFinancieroServices.$inject = ['utilServices'];

    function solicitudCreditoFinancieroServices(utilServices) {
        var servicioSolicitudCredito = this;
        servicioSolicitudCredito.buscarEstudiante = getEstudiante;
        servicioSolicitudCredito.buscarSolicitudes = getSolicitudes;
        servicioSolicitudCredito.buscarModulosByModalidad = getModulosByModalidad;
        servicioSolicitudCredito.buscarParametroCreditoByidLinea = getParametroCreditoByidLinea;
        servicioSolicitudCredito.buscarParametroCreditoByid = getParametroCreditoByid;
        servicioSolicitudCredito.generarReporteSolicitudByIdSolicitud = getGenerarReporteByIdSolicitud;
        servicioSolicitudCredito.agregarSolicitudCredito = postSolicitudCredito;
        servicioSolicitudCredito.modificarFechasAmortizacion = putModificarFechasAmortizacion;
        servicioSolicitudCredito.eliminarSolicitudCredito = deleteSolicitudCredito;
        servicioSolicitudCredito.actualizarSolicitudCredito = putSolicitudCredito;
        servicioSolicitudCredito.onBuscarConfiguracionModulos = buscarConfiguracionModulos;
        servicioSolicitudCredito.solicitudCredito = {};
        servicioSolicitudCredito.solicitudCreditoAuxiliar = {};
        servicioSolicitudCredito.consultarCredito = {};
        servicioSolicitudCredito.consultarCreditoAuxiliar = {};

        var url = '/api/financiero';

        function getEstudiante(identificacion) {
            var urlRequest = url + '/SolicitudCreditoConvenio/estudiante/' + identificacion;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getSolicitudes() {
            var urlRequest = url + '/SolicitudCreditoConvenio/todos';
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getModulosByModalidad(idModalidad, idPeriodo) {
            var urlRequest = url + '/CalendarioDetalle/calendarioByModalidad/' + idModalidad + '/' + idPeriodo;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getParametroCreditoByidLinea(idLinea) {
            var urlRequest = url + '/ParametroCredito/parametro/' + idLinea;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getParametroCreditoByid(id) {
            var urlRequest = url + '/ParametroCredito/byId/' + id;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getGenerarReporteByIdSolicitud(idSolicitud) {
            var urlRequest = url + '/SolicitudCreditoConvenio/generarReporte/' + idSolicitud;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        this.getReporteHistorialConvenio = function (codigo) {
            var urlRequest = url + '/SolicitudCreditoConvenio/historialReporteConvenio/' + codigo;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        };

        function postSolicitudCredito(solicitudCredito) {
            var urlRequest = url + '/SolicitudCreditoConvenio/save';
            return utilServices.EJECUTAR_SERVICE_POST(urlRequest, solicitudCredito);
        }

        function putModificarFechasAmortizacion(solicitudCredito) {
            var urlRequest = url + '/SolicitudCreditoConvenio/actualizarFecha';
            return utilServices.EJECUTAR_SERVICE_PUT(urlRequest, solicitudCredito);
        }

        function deleteSolicitudCredito(solicitudCredito) {
            var urlRequest = url + '/SolicitudCreditoConvenio/' + solicitudCredito.id;
            return utilServices.EJECUTAR_SERVICE_DELETE(urlRequest, solicitudCredito);
        }

        function putSolicitudCredito(solicitudCredito) {
            var urlRequest = url + '/SolicitudCreditoConvenio/' + solicitudCredito.id;
            return utilServices.EJECUTAR_SERVICE_PUT(urlRequest, solicitudCredito);
        }

        function buscarConfiguracionModulos(idPrograma, idNivel) {
            var urlRequest = url + '/Programa/cantidadModulosProgramaNivel/' + idPrograma + '/' + idNivel;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

    }
})();