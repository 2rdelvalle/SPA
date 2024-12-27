(function () {
  'use strict';
  angular.module('mytodoApp.service').service('asistenciaServices', asistenciaServices);
  asistenciaServices.$inject = ['utilServices'];

  function asistenciaServices(utilServices) {
    var servicioAsistencia = this;

    servicioAsistencia.findListadoByProgramaPeriodo = getListadoAsistenciaByPrograma;
    servicioAsistencia.getListadoAsistenciaByProgramaDelDia = getListadoAsistenciaByProgramaDelDia;
    servicioAsistencia.getListadoAsistenciaByProgramaCertificado = getListadoAsistenciaByProgramaCertificado;
    servicioAsistencia.getListadoAsistenciaByProgramaCertificadoEnviado = getListadoAsistenciaByProgramaCertificadoEnviado;
    servicioAsistencia.getListadoAsistenciaByProgramaDisponible = getListadoAsistenciaByProgramaDisponible;
    servicioAsistencia.getListadoAsistenciaByProgramaAsistenciaDelDia = getListadoAsistenciaByProgramaAsistenciaDelDia;
    servicioAsistencia.getPeriodosAcademicos = getPeriodosAcademicos;
    servicioAsistencia.getPeriodosAcademicosAll = getPeriodosAcademicosAll;
    servicioAsistencia.getProgramasByNivelFormacion = getProgramasByNivelFormacion;
    servicioAsistencia.getUniversidad = getUniversidad;
    servicioAsistencia.postGuardarAsistencia = guardarAsistencia;
    servicioAsistencia.enviarEmailCertificado = enviarEmailCertificado;
    servicioAsistencia.enviarEmailCertificadoMasivo = enviarEmailCertificadoMasivo;
    servicioAsistencia.getAsistenciaEstudiante = getListadoAsistenciaEstudiante;
    servicioAsistencia.updateEnviadoMatricula = onUpdateEnviadoMatricula;

    var url2 = '/api/matricula/';

    function guardarAsistencia(rs) {
      var urlRequest = url2 + 'Asistencia';
      return utilServices.EJECUTAR_SERVICE_POST(urlRequest, rs);
    }

    function getListadoAsistenciaByPrograma(programa, periodo) {
      var urlRequest = url2 + 'Asistencia/asistenciaByProgramaPeriodo/' + programa + '/' + periodo;
      return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
    }

    function getListadoAsistenciaByProgramaDelDia(programa, periodo) {
      var urlRequest = url2 + 'Asistencia/asistenciaByProgramaPeriodoDelDia/' + programa + '/' + periodo;
      return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
    }

    function getListadoAsistenciaByProgramaCertificado(programa, periodo) {
      var urlRequest = url2 + 'Asistencia/asistenciaByProgramaPeriodoCertificados/' + programa + '/' + periodo;
      return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
    }

    function getListadoAsistenciaByProgramaCertificadoEnviado(programa, periodo, enviado) {
      var urlRequest = url2 + 'Asistencia/asistenciaByProgramaPeriodoCertificadosEnviado/' + programa + '/' + periodo + '/' + enviado;
      return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
    }

    function getListadoAsistenciaEstudiante(codigo) {
      var urlRequest = url2 + 'Asistencia/consultarAsistenciaSeminario/' + codigo;
      return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
    }

    function getListadoAsistenciaByProgramaDisponible(programa, periodo, codigo) {
      var urlRequest = url2 + 'Asistencia/asistenciaByProgramaPeriodoDisponible/' + programa + '/' + periodo + '/' + codigo;
      return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
    }

    function getListadoAsistenciaByProgramaAsistenciaDelDia(programa, periodo, codigo) {
      var urlRequest = url2 + 'Asistencia/asistenciaByProgramaPeriodoParaAsistenciaDelDia/' + programa + '/' + periodo + '/' + codigo;
      return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
    }

    function getPeriodosAcademicos() {
      var urlRequest = url2 + 'PeriodoAcademico/ByEstadoAbiertoInscripto';
      return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
    }

    function getPeriodosAcademicosAll() {
      var urlRequest = url2 + 'PeriodoAcademico/todos';
      return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
    }

    function getProgramasByNivelFormacion(idNivelFormacion) {
      var urlRequest = url2 + 'Programa/programaByIdNivelFormacion/' + idNivelFormacion;
      return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
    }

    function getUniversidad(idUniversidad) {
      var urlRequest = url2 + 'Universidad/byId/' + idUniversidad;
      return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
    }

    function onUpdateEnviadoMatricula(idMatricula, enviado) {
      var urlRequest = url2 + 'Matricula/updateEnviadoMatricula/' + idMatricula + "/" + enviado;
      return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
    }

    function enviarEmailCertificado(rs) {
      var urlEmail = "/api/email/";
      var urlRequest = urlEmail + 'Email/enviarCorreoCertificado';
      return utilServices.EJECUTAR_SERVICE_POST(urlRequest, rs);
    }
    
    function enviarEmailCertificadoMasivo(rs) {
      var urlEmail = "/api/matricula/";
      var urlRequest = urlEmail + 'Email/enviarCorreoCertificado';
      return utilServices.EJECUTAR_SERVICE_POST(urlRequest, rs);
    }

    
  }
})();
