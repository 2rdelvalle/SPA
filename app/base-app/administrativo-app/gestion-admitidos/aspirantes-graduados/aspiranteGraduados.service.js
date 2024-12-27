(function () {
    'use strict';
    angular.module('mytodoApp.service').service('aspiranteGraduados', aspiranteGraduados);
    aspiranteGraduados.$inject = ['utilServices'];
    function aspiranteGraduados(utilServices) {

        var aspiranteGradoService = this;
        var url = "/api/matricula/MatriculaAcademica/";

        aspiranteGradoService.buscarEstudiantesAspirantesGrado = buscarEstudiante;
        aspiranteGradoService.onBuscarListadoGraduadosByPeriodo = buscarListadoGraduadosByPeriodo;
        aspiranteGradoService.onGuardarGraduado = guardarGraduado;

        function buscarEstudiante(rs) {
            var urlRequest = url + "estudiantesAspiranteGrado";
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }
        function buscarListadoGraduadosByPeriodo(rs) {
            var urlRequest = url + "estudiantesAspiranteGradoByPeriodo";
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function guardarGraduado(liquidacion) {
            var urlRequest = url + 'guardarHistorialGraduado';
            return utilServices.EJECUTAR_SERVICE_POST(urlRequest, liquidacion);
        }
    }
})();
