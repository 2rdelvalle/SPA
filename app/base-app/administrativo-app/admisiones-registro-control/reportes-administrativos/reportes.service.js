'use strict';
angular.module('mytodoApp.service').service('reportesServices', ['utilServices', function (utilServices) {
  var servicio = this;
  servicio.onGetConsultarListadoEstudiantesMatricula = onConsultarListadoEstudiantesMatricula;
  servicio.onGetConsultarListadoEstudiantesMatriculaAbono = onConsultarListadoEstudiantesMatriculaAbono;
  servicio.onGetConsultarCantidadLiquidacionesModulo = onConsultarCantidadLiquidacionesModulo;
  servicio.onGetConsultarTotalConceptos = onConsultarTotalConceptos;

  var url = '/api/admisiones/';
  var url2 = '/api/matricula/';
  var url3 = '/api/financiero/';

  function onConsultarListadoEstudiantesMatricula(rs) {
    var urlRequest = url + 'Reporte/onConsultarListadoEstudiantesMatricula/' + rs;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  }

  function onConsultarListadoEstudiantesMatriculaAbono(rs) {
    var urlRequest = url + 'Reporte/onConsultarListadoEstudiantesMatriculaAbono/' + rs;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  }

  function onConsultarCantidadLiquidacionesModulo(rs, idModalidad, fecha1, fecha2) {
    var urlRequest = url + 'Reporte/onConsultarCantidadLiquidacionesModulo/' + rs + '/' + idModalidad + '/' + fecha1 + '/' + fecha2;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  }

  function onConsultarTotalConceptos(rs, fecha1, fecha2) {
    var urlRequest = url + 'Reporte/onConsultarTotalConceptos/' + rs + '/' + fecha1 + '/' + fecha2;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  }

  servicio.onConsultarEstudiantesPorConcepto = function (rs, fecha1, fecha2) {
    var urlRequest = url + 'Reporte/onConsultarEstudiantesPorConcepto/' + rs + '/' + fecha1 + '/' + fecha2;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

  servicio.onConsultarEstudianteReferenciaEspecifica = function (rs, fecha1, fecha2) {
    var urlRequest = url + 'Reporte/onConsultarEstudianteReferenciaEspecifica/' + rs + '/' + fecha1 + '/' + fecha2;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

  servicio.onConsultarEstudianteReferenciaSumaDeudaAbono = function (rs, fecha1, fecha2) {
    var urlRequest = url + 'Reporte/onConsultarEstudianteReferenciaSumaDeudaAbono/' + rs + '/' + fecha1 + '/' + fecha2;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

  servicio.onConsultarEstudianteAdmitidosSinPeriodo = function (rs, fecha1, fecha2) {
    var urlRequest = url + 'Reporte/onConsultarEstudianteAdmitidosSinPeriodo/' + rs + '/' + fecha1 + '/' + fecha2;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

  servicio.onConsultarEstudianteReferenciaPagoSinPeriodo = function (rs, fecha1, fecha2) {
    var urlRequest = url + 'Reporte/onConsultarEstudianteReferenciaPagoSinPeriodo/' + rs + '/' + fecha1 + '/' + fecha2;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

  servicio.onConsultarProgramaConcepto = function (rs, fecha1, fecha2) {
    var urlRequest = url + 'Reporte/onConsultarProgramaConcepto/' + rs + '/' + fecha1 + '/' + fecha2;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

  servicio.onConsultarListadoDePagosSinPeriodo = function (rs, fecha1, fecha2) {
    var urlRequest = url + 'Reporte/onConsultarListadoDePagosSinPeriodo/' + rs + '/' + fecha1 + '/' + fecha2;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

  servicio.getListadoEstudiantesMayor = function () {
    var urlRequest = url + 'Reporte/getListadoEstudiantesMayor';
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

  servicio.onConsultarListadoCastigada = function (fecha1, fecha2) {
    var urlRequest = url + 'Reporte/onConsultarListadoCastigada/' + fecha1 + '/' + fecha2;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

  servicio.onConsultarMovimientosInterfaz = function (fecha1, fecha2) {
    var urlRequest = url + 'Reporte/onConsultarListadoInterfazContable/' + fecha1 + '/' + fecha2;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

  servicio.onConsultarTercerosInterfaz = function (fecha1, fecha2) {
    var urlRequest = url + 'Reporte/getTercerosInterfazContable/' + fecha1 + '/' + fecha2;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

  servicio.onConsultarCorteLiquidaciones = function (fecha1, fecha2) {
    var urlRequest = url + 'Reporte/getFechaCorteCarteraVencida/' + fecha1 + '/' + fecha2;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

  servicio.onConsultarCorteLiquidacionesConvenios = function (fecha1, fecha2) {
    var urlRequest = url + 'Reporte/getFechaCorteCarteraConvenio/' + fecha1 + '/' + fecha2;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

  servicio.onConsultarCorteLiquidacionesConveniosGeneral = function (fecha1, fecha2) {
    var urlRequest = url + 'Reporte/getFechaCorteCarteraConvenioGeneral/' + fecha1 + '/' + fecha2;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

  servicio.getListadoSIET = function () {
    var urlRequest = url2 + 'Encuesta/getListadoSIET';
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

  servicio.onMarcarEstudiantesInterfaz = function (id) {
    var urlRequest = url + 'Reporte/exportarAspirante/' + id;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  };

  servicio.onGetListadoAuditoriaNotaFaltantes = function (id, tipo) {
    var urlRequest = url + 'Reporte/consultarNotasFaltantesByPeriodo/' + id + "/" + tipo;
    return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
  }

}]);
