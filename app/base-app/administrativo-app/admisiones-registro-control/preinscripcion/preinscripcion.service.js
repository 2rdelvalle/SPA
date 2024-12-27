(function () {
    'use strict';
    angular.module('mytodoApp.service').service('preinscripcionService', preinscripcionService);

    preinscripcionService.$inject = ['$http', '$q'];

    function preinscripcionService($http, $q) {

        var preinscripcionSerivicio = this;

        preinscripcionSerivicio.preinscripcion = {};
        preinscripcionSerivicio.preinscripcion.periodo = {};

        preinscripcionSerivicio.visible = {};
        preinscripcionSerivicio.visible.validoseccional = false;
        preinscripcionSerivicio.visible.validoformacion = false;
        preinscripcionSerivicio.visible.validoprograma = false;
        preinscripcionSerivicio.visible.validoinstitucion = false;
        preinscripcionSerivicio.visible.validoconvenio = false;
        preinscripcionSerivicio.visible.validoemail = false;
        preinscripcionSerivicio.visible.validotelefono = false;
        preinscripcionSerivicio.visible.validocelular = false;
        preinscripcionSerivicio.visible.validotelefonosize = false;
        preinscripcionSerivicio.visible.validocelularsize = false;
        preinscripcionSerivicio.consultarSeccional = getSeccional;
        preinscripcionSerivicio.consultarNivelFormacion = getNivelFormacion;
        preinscripcionSerivicio.consultarProgramaPorNivel = getProgramaNivelFormacion;
        preinscripcionSerivicio.consultarModalidadPorPrograma = getProgramaModalidad;
        preinscripcionSerivicio.consultarHorarioPorPrograma = getProgramaHorario;
        preinscripcionSerivicio.consultarTipoDocumento = getTipoDocumento;
        preinscripcionSerivicio.consultarBarrios = getBarrios;
        preinscripcionSerivicio.consultarColegio = getColegio;
        preinscripcionSerivicio.consultarTipoConvenio = getTipoConvenio;
        preinscripcionSerivicio.consultarPeriodoAcademico = getPeriodoAcademico;
        preinscripcionSerivicio.registrarPreinscripcion = postPreinscripcion;
        preinscripcionSerivicio.consultarAspirante = getDatosAspirantePreinscripcion;
        preinscripcionSerivicio.buscarConfiguracionByProgramaAndPeriodoAcademico = buscarconfiguracionByProgramaAndPeriodoAcademico;

        function postPreinscripcion(rs) {
            var defered = $q.defer();
            var urlrequest = '/api/admisiones/Inscripcion/guardarPreInscripcion';
            $http.post(urlrequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function buscarconfiguracionByProgramaAndPeriodoAcademico(idPrograma, idPeriodo) {
            var urlRequest = '/api/admisiones/ConfiguracionEducacionContinuada/byProgramaAndPeriodoAcademico/' + idPrograma + '/' + idPeriodo;
            return ejecutarServiceGet(urlRequest);
        }

        function getDatosAspirantePreinscripcion(rs) {
            var urlrequest = '/api/admisiones/Inscripcion/byIdentificacionAspirante/' + rs.idTipoIdentificacion + '/' + rs.identificacion;
            return ejecutarServiceGet(urlrequest);
        }

        function getPeriodoAcademico() {
            var urlrequest = '/api/admisiones/PeriodoAcademico/ByEstadoAbiertoInscripto';
            return ejecutarServiceGet(urlrequest);
        }
        //
        function getSeccional() {
            var urlrequest = '/api/admisiones/Seccional';
            return ejecutarServiceGet(urlrequest);
        }

        function getNivelFormacion() {
            var urlrequest = '/api/admisiones/NivelFormacion';
            return ejecutarServiceGet(urlrequest);
        }

        function getProgramaNivelFormacion(nivel, periodo, sede) {
//            var urlrequest = '/api/admisiones/Programa/nivelformacionPrograma/' + rs;
            var urlrequest = '/api/admisiones/Programa/nivelformProgramabyPlaneacion/' + nivel + '/' + periodo+ '/' + sede;
            return ejecutarServiceGet(urlrequest);
        }

        function getProgramaModalidad(rs) {
            var urlrequest = '/api/admisiones/Programa/modalidadPrograma/' + rs;
            return ejecutarServiceGet(urlrequest);
        }

        function getProgramaHorario(rs) {
            var urlrequest = '/api/admisiones/Programa/horarioPrograma/' + rs;
            return ejecutarServiceGet(urlrequest);
        }

        function getBarrios() {
            var urlrequest = '/api/configeneral/Barrio/all';
            return ejecutarServiceGet(urlrequest);
        }

        function getTipoConvenio() {
            var urlrequest = '/api/admisiones/TipoConvenio';
            return ejecutarServiceGet(urlrequest);
        }

        function getColegio() {
            var urlrequest = '/api/admisiones/Institucion/institucionActivas';
            return ejecutarServiceGet(urlrequest);
        }

        function getTipoDocumento() {
            var urlrequest = '/api/configeneral/Institucion';
            return ejecutarServiceGet(urlrequest);
        }


        function ejecutarServiceGet(urlrequest) {
            var defered = $q.defer();
            $http.get(urlrequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function ejecutarServicePost(urlrequest, rs) {
            var defered = $q.defer();
            $http.post(urlrequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function ejecutarServicePut(urlrequest, rs) {
            var defered = $q.defer();
            $http.put(urlrequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                var x = {
                    tipo: 300,
                    meesage: 'xxx'
                };
                defered.resolve(x);
            });
            return defered.promise;
        }

        function ejecutarServiceDelete(urlrequest, rs) {
            var defered = $q.defer();
            //aqui debe ir metodo $http.delete pero como es borrado logico se actualiza la información
            $http.delete(urlrequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
    }

})();
