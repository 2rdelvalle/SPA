'use strict';
angular.module('mytodoApp.service').service('reportesAuditoriaService', ['utilServices', function (utilServices) {
  var servicio = this;

  var url = '/api/admisiones/';
  var url2 = '/api/matricula/';
  var url3 = '/api/financiero/';


  servicio.onConsultarRecibosUniformeByEstado = function (estado) {
    var urlRequest = url3 + 'DetalleDescripcionRecibo/getByEstadoJSON/' + estado
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

  servicio.onActualizarEntrega = function (dto) {
    var urlRequest = url3 + 'DetalleDescripcionRecibo/actualizarEntrega/'
    return utilServices.EJECUTAR_SERVICE_POST(urlRequest, dto);
  };

  servicio.onListarUltimoInicio = function () {
    var urlRequest = url + 'Reporte/consultarUltimoInicioSesion/';
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

  servicio.onGetListadoConvenio = function (idPeriodo) {
    var urlRequest = url3 + 'SolicitudCreditoConvenio/historialReporteConvenioGeneral/' + idPeriodo;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

}]);
