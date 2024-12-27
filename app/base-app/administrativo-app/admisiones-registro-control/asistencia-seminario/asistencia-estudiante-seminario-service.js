(function () {
    'use strict';
    angular.module('mytodoApp.service').service('asistenciaSeminarioServices', asistenciaSeminarioServices);
    asistenciaSeminarioServices.$inject = ['utilServices'];
    function asistenciaSeminarioServices(utilServices) {
        var servicioAsistenciaSeminario = this;
        servicioAsistenciaSeminario.getListadoEstudiantes = getListarEstudiantes;
        servicioAsistenciaSeminario.postGuardarAsistencia = guardarAsistencia;
        servicioAsistenciaSeminario.consultarPeriodoAcademico = getPeriodoAcademico;
        servicioAsistenciaSeminario.buscarConfiguracionByProgramaAndPeriodoAcademico = buscarconfiguracionByProgramaAndPeriodoAcademico;


        var url2 = '/api/matricula/';
        var url3 = '/api/financiero/';
        var url4 = '/api/matricula/';


        function buscarconfiguracionByProgramaAndPeriodoAcademico( idPeriodo) {
            var urlRequest = '/api/admisiones/ConfiguracionEducacionContinuada/byProgramaAndPeriodoAcademico/' + '/' + idPeriodo;
            return ejecutarServiceGet(urlRequest);
        }

        function guardarAsistencia(rs) {
            var urlRequest = url2 + 'Asistencia';
            return utilServices.EJECUTAR_SERVICE_POST(urlRequest, rs);
        }

        function getListarEstudiantes() {
            var urlRequest = url3 + 'CodigosAsistencia/SEM';
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getPeriodoAcademico() {
            var urlRequest = url4 + 'PeriodoAcademico/todos';
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }
    }
})();
