(function () {
    'use strict';
    angular.module('mytodoApp.service').service('admisionesServices', admisionesServices);
    admisionesServices.$inject = ['$http', '$q', 'growl', 'utilServices'];
    function admisionesServices($http, $q, growl, utilServices) {
        var servicioAdmisiones = this;
        servicioAdmisiones.buscarInscritos = getInscritos;
        servicioAdmisiones.buscarNivelesFormacion = getNivelesFormacion;
        servicioAdmisiones.buscarProgramasAcademicos = getProgramasAcademicos;
        servicioAdmisiones.buscarPeriodosAcademicos = getPeriodoAcademico;
        servicioAdmisiones.buscarJornadasProgramas = getJornadas;
        servicioAdmisiones.actualizarAdmision = putAdmisiones;
        servicioAdmisiones.actualizarAdmisionesMasiva = putAdmisionesMasivas;
        servicioAdmisiones.admision = {};
        servicioAdmisiones.subirarchivos = onSubirArchivos;
        servicioAdmisiones.downloadArchivo = onDownloadArchivos;
        servicioAdmisiones.verificarRequisitos = putRequisitoAspirante;
        servicioAdmisiones.downloadArchivoReport = onDownloadArchivosReport;
        servicioAdmisiones.semestreValido = true;
        servicioAdmisiones.maximoNivelPrograma = bucarMaxNivel;
        servicioAdmisiones.onPostEntrevista = postEntrevista;

        var url = '/api/admisiones/';
        var urlf = '/api/financiero/';

        function postEntrevista(campania) {
            var urlRequest = url + 'Admision';
            return utilServices.EJECUTAR_SERVICE_POST(urlRequest, campania);
        }


        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getInscritos(periodo, nivel, modalidad) {
            var urlRequest = url + 'Admision/filtroAspirante/' + periodo + '/' + nivel + '/' + modalidad;
            return ejecutarServicesGet(urlRequest);
        }

        function getNivelesFormacion() {
            var urlRequest = url + 'NivelFormacion';
            return ejecutarServicesGet(urlRequest);
        }

        function getProgramasAcademicos(nivel) {
            var urlRequest = url + 'Programa/nivelformacion/' + nivel;
            return ejecutarServicesGet(urlRequest);
        }
        function getPeriodoAcademico() {
            var urlRequest = url + 'PeriodoAcademico/ByEstadoAbiertoInscripto';
            return ejecutarServicesGet(urlRequest);
        }

        function getJornadas(programa) {
            var urlRequest = url + 'Programa/jornadaPrograma/' + programa;
            return ejecutarServicesGet(urlRequest);
        }

        function putAdmisiones(admision) {
            var defered = $q.defer();
            var urlRequest = url + 'Inscripcion';
            $http.put(urlRequest, admision).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function putAdmisionesMasivas(listaAdmisiones) {
            var defered = $q.defer();
            var urlRequest = url + 'Inscripcion/masive';
            $http.put(urlRequest, listaAdmisiones).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function onSubirArchivos() {
            var urlRequest = url + 'fileupload/upload';
            return urlRequest;
        }

        function onDownloadArchivos(file) {
            var urlRequest = urlf + 'fileupload/download/' + file;
            return urlRequest;
        }

        function putRequisitoAspirante(listaRequisitos) {
            var defered = $q.defer();
            var urlRequest = url + 'Admision';
            $http.put(urlRequest, listaRequisitos).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                growl.error("<div><i class='glyphicon  glyphicon-fire' style='padding-left: 15px;font-size: 20px;'></i>&nbsp;&nbsp;<span><strong>¡Alto Ahí!  </strong>" + error.message + " </div>");
                defered.reject(error);
            });
            return defered.promise;
        }

        function onDownloadArchivosReport(file) {
            var urlRequest = '/api/financiero/report/' + file;
            return urlRequest;
        }
        function bucarMaxNivel(programa) {
            var urlRequest = url + 'Admision/nivelMaximo/' + programa;
            return ejecutarServicesGet(urlRequest);
        }

    }
})();