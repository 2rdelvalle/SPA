(function () {
    'use strict';
    angular.module('mytodoApp.service').service('pazSalvoAcademicoService', pazSalvoAcademicoService);

    pazSalvoAcademicoService.$inject = ['$http', '$q', 'appGenericConstant', 'utilServices'];

    function pazSalvoAcademicoService($http, $q, appGenericConstant, utilServices) {
        var notasEstudianteService = this;

        notasEstudianteService.entidad = {};
        notasEstudianteService.estudiante = {};
        notasEstudianteService.consultaMalla = getMallaDetalleByIdPrograma;
        notasEstudianteService.consultarProgramas = getProgramas;
        notasEstudianteService.consultarProgramasIdentificacion = getProgramasIdentificacion;
        notasEstudianteService.buscarEstudianteByCodigo = consultarEstudiante;
        notasEstudianteService.consultarPeriodo = getPeriodoAcademico;
        notasEstudianteService.consultarNotas = getNotas;
        notasEstudianteService.consultarNotasCertificado = getCertificado;
        notasEstudianteService.entidadAuxiliar = {};
        notasEstudianteService.listaAux = {};
        notasEstudianteService.modulos = {};

        var url = "/api/matricula/";
        var url2 = "/api/financiero/";

        this.getListadoPazSalvoFinancieroGeneradoByIdentificacion = function (identificacion) {
            var urlRequest = url2 + "pazSalvoFinanciero/getListadoPazSalvoFinancieroGeneradoByIdentificacion/" + identificacion;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        };

        this.postGuardarPazSalvoFinanciero = function (rs) {
            var urlRequest = url2 + "pazSalvoFinanciero/";
            return utilServices.EJECUTAR_SERVICE_POST(urlRequest, rs);
        }

        function getProgramas(identificacion) {
            var urlRequest = url + "Programa/ProgramaByIdentificacionEstudante/" + identificacion;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getProgramasIdentificacion(identificacion, id) {
            var urlRequest = url + "Programa/ProgramaByIdentificacionEstudanteAndIdPeriodo/" + identificacion + "/" + id;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }
        function getMallaDetalleByIdPrograma(id) {
            var urlRequest = url + "MallaAcademica/consultaMallaByidPrograma/" + id;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        var urlAdmision = '/api/admisiones/Estudiante/';
        function consultarEstudiante(parametro) {
            var urlRequest = urlAdmision + 'consultarEstudiante/' + parametro;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getPeriodoAcademico(identificacion) {
            var urlRequest = url + "PeriodoAcademico/periodosMatriculados/" + identificacion;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getNotas(idPeriodo, identificacion, idPrograma) {
            var urlRequest = url + "MatriculaAcademica/notasEstudiante/" + idPeriodo + "/" + identificacion + "/" + idPrograma;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getCertificado(idPeriodo, identificacion, idPrograma) {
            var urlRequest = url + "MatriculaAcademica/certificadoNota/" + idPeriodo + "/" + identificacion + "/" + idPrograma;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

    }
})();


