(function () {
    'use strict';
    angular.module('mytodoApp.service').service('inscripcionService', inscripcionService);

    inscripcionService.$inject = ['$http', '$q', 'appGenericConstant'];

    function inscripcionService($http, $q, appGenericConstant) {
        var inscripcionSerivicio = this;
        inscripcionSerivicio.inscripcion = {};
        inscripcionSerivicio.inscripcionInicial = {};
        inscripcionSerivicio.inscripcion.aspirante = {};
        inscripcionSerivicio.infopersonal = {};
        inscripcionSerivicio.modowizard = {working: 'working', complete: 'complete', error: 'error'};
        inscripcionSerivicio.estadopasos = {paso1: '', paso2: '', paso3: '', paso4: ''};
        inscripcionSerivicio.visible = {};
        inscripcionSerivicio.visible.estadoforminicio = true;
        inscripcionSerivicio.visible.estadoformtipopago = false;
        inscripcionSerivicio.visible.estadoformcapturapin = false;
        inscripcionSerivicio.visible.ocultarbotonsalir = false;
        inscripcionSerivicio.visible.botoncambio = false;
        /* -- PASOS WIZARD -- */
        inscripcionSerivicio.visible.activetabstep1 = appGenericConstant.ACTIVO;
        inscripcionSerivicio.visible.activetabstep2 = ' ';
        inscripcionSerivicio.visible.activetabstep3 = ' ';
        inscripcionSerivicio.visible.activetabstep4 = ' ';
        inscripcionSerivicio.visible.desctivarbotonatras = true;
        inscripcionSerivicio.visible.desctivarbotoncontinuar = false;
        inscripcionSerivicio.visible.desctivarboton = false;
        inscripcionSerivicio.visible.workingstep1 = inscripcionSerivicio.modowizard.working;
        inscripcionSerivicio.visible.workingstep2 = '';
        inscripcionSerivicio.visible.workingstep3 = '';
        inscripcionSerivicio.visible.workingstep4 = '';
        inscripcionSerivicio.visible.validafechaexpedicion = false;
        inscripcionSerivicio.visible.validafechanacimiento = false;
        inscripcionSerivicio.visible.validaexpedicion = false;
        inscripcionSerivicio.visible.validalugarnacimiento = false;
        inscripcionSerivicio.visible.validaedad = false;
        inscripcionSerivicio.visible.validalugarresidencia = false;
        inscripcionSerivicio.visible.validaaniofinalizacion = false;
        inscripcionSerivicio.visible.validaaniopresentacion = false;
        inscripcionSerivicio.visible.validainstitucion = false;
        inscripcionSerivicio.visible.validanivelformacionpadre = false;
        inscripcionSerivicio.visible.validalugarresidenciapadre = false;
        inscripcionSerivicio.visible.validanivelformacionmadre = false;
        inscripcionSerivicio.visible.validalugarresidenciamadre = false;
        inscripcionSerivicio.visible.validanivelformacionacudiente = false;
        inscripcionSerivicio.visible.validaseccional = false;
        inscripcionSerivicio.visible.validanivelformacion = false;
        inscripcionSerivicio.visible.validaprograma = false;
        inscripcionSerivicio.visible.validatipoconvenio = false;
        inscripcionSerivicio.visible.activomsjpaisexp = false;
        inscripcionSerivicio.visible.activomsjdepartamentoexp = false;
        inscripcionSerivicio.visible.activomsjmunicipioexp = false;
        inscripcionSerivicio.visible.activomsjpaislgnacimto = false;
        inscripcionSerivicio.visible.activomsjdepartamentonacimto = false;
        inscripcionSerivicio.visible.activomsjmunicipionacimto = false;
        inscripcionSerivicio.visible.activomsjpaislgrecidencia = false;
        inscripcionSerivicio.visible.activomsjdepartamentorecidencia = false;
        inscripcionSerivicio.visible.activomsjmunicipiorecidencia = false;
        inscripcionSerivicio.visible.validotelefono = false;
        inscripcionSerivicio.visible.validotelefonopadre = false;
        inscripcionSerivicio.visible.validotelefonomadre = false;
        inscripcionSerivicio.visible.validotelefonoacudiente = false;
        inscripcionSerivicio.visible.validocelular = false;
        inscripcionSerivicio.visible.validocelularpadre = false;
        inscripcionSerivicio.visible.validocelularmadre = false;
        inscripcionSerivicio.visible.validocelularacudiente = false;
        inscripcionSerivicio.visible.validotelefonosize = false;
        inscripcionSerivicio.visible.validotelefonopadresize = false;
        inscripcionSerivicio.visible.validotelefonomadresize = false;
        inscripcionSerivicio.visible.validotelefonoacudientesize = false;
        inscripcionSerivicio.visible.validocelularsize = false;
        inscripcionSerivicio.visible.validocelularpadresize = false;
        inscripcionSerivicio.visible.validocelularmadresize = false;
        inscripcionSerivicio.visible.validocelularacudientesize = false;
        inscripcionSerivicio.visible.validoemail = false;
        inscripcionSerivicio.visible.validoemailpadre = false;
        inscripcionSerivicio.visible.validoemailacudiente = false;
        inscripcionSerivicio.visible.validoempresa = false;
        inscripcionSerivicio.visible.validocargo = false;
        inscripcionSerivicio.visible.validotiempolaborado = false;
        inscripcionSerivicio.visible.estadobotonesinicio = false;
        inscripcionSerivicio.visible.validobarrio = false;
        inscripcionSerivicio.visible.estadotienehijos = 'no';
        inscripcionSerivicio.visible.estadogrupoetnico = 'no';
        inscripcionSerivicio.visible.estadoenfermedad = 'no';
        inscripcionSerivicio.visible.estadodiscapacidad = 'no';
        inscripcionSerivicio.visible.estadosisben = 'no';
        inscripcionSerivicio.visible.estadovotoelecciones = 'no';
        inscripcionSerivicio.visible.estadoLabora = 'no';
        inscripcionSerivicio.visible.esvacialistaprograma = false;
        inscripcionSerivicio.visible.esvacialistahorario = false;
        inscripcionSerivicio.consultarSeccional = getSeccional;
        inscripcionSerivicio.consultarNivelFormacion = getNivelFormacion;
        inscripcionSerivicio.consultarPrograma = getPrograma;
        inscripcionSerivicio.consultarProgramaNivelFormacion = getProgramaNivelFormacion;
        inscripcionSerivicio.consultarJornadaPrograma = getJornadaPrograma;
        inscripcionSerivicio.consultarTipoConvenio = getTipoConvenio;
        inscripcionSerivicio.consultarPais = getPais;
        inscripcionSerivicio.consultarColegio = getColegio;
        inscripcionSerivicio.consultarDepartamentoPais = getDepartamentoPais;
        inscripcionSerivicio.consultarMunicipioPorDepartamento = getMunicipioPorDepartamento;
        inscripcionSerivicio.consultarPreinscripcion = getPreinscripcion;
        inscripcionSerivicio.consultarBarrios = getBarrios;
        inscripcionSerivicio.registrarInscripcion = postInscripcion;
        //inscripcionSerivicio.consultarBarriosPorMunicipios = getListaBarriosxMunicipio;
        inscripcionSerivicio.consultarAllBarrios = getListaBarriosAll;
        inscripcionSerivicio.consultarAllModalidadesxPrograma = getListaModalidadesxPrograma;
        inscripcionSerivicio.consultarAllHorariosxProgramaxModalidad = getListaHorariosxProgramaxModalidad;
        inscripcionSerivicio.verificarEstadoInscritoAspirante = getVerificarEstadoInscrito;
        inscripcionSerivicio.consultarPeriodoAcademico = getPeriodoAcademico;
        inscripcionSerivicio.buscarConfiguracionByProgramaAndPeriodoAcademico = buscarconfiguracionByProgramaAndPeriodoAcademico;
        inscripcionSerivicio.consultarAlianza= getAlianzas;

        inscripcionSerivicio.botonVolver = {};


        function buscarconfiguracionByProgramaAndPeriodoAcademico(idPrograma, idPeriodo) {
            var urlRequest = '/api/admisiones/ConfiguracionEducacionContinuada/byProgramaAndPeriodoAcademico/' + idPrograma + '/' + idPeriodo;
            return ejecutarServiceGet(urlRequest);
        }

        function getAlianzas() {
            var urlRequest = '/api/admisiones/Alianza';
            return ejecutarServiceGet(urlRequest);
        }


        function getPreinscripcion(item) {
            var urlrequest = '/api/admisiones/Inscripcion/existAspirantePago/' + item.identificacionAspirante.idTipoIdentificacion + '/' + item.identificacionAspirante.identificacion;
            return ejecutarServiceGet(urlrequest);
        }

        function getBarrios() {
            var urlrequest = '/api/configeneral/Barrio/all';
            return ejecutarServiceGet(urlrequest);
        }

        function getPeriodoAcademico() {
            var urlrequest = '/api/admisiones/PeriodoAcademico/ByEstadoAbiertoInscripto';
            return ejecutarServiceGet(urlrequest);
        }

        function getPais() {
            var urlrequest = '/api/admisiones/Pais';
            return ejecutarServiceGet(urlrequest);
        }

        function getDepartamentoPais(item) {
            var urlrequest = '/api/admisiones/Departamento/pais/' + item.id;
            return ejecutarServiceGet(urlrequest);
        }

        function getMunicipioPorDepartamento(item) {
            var urlrequest = '/api/admisiones/Municipio/departamento/' + item.id;
            return ejecutarServiceGet(urlrequest);

        }

        function getSeccional() {
            var urlrequest = '/api/admisiones/Seccional';
            return ejecutarServiceGet(urlrequest);
        }

        function getPrograma() {
            var urlrequest = '/api/admisiones/Programa';
            return ejecutarServiceGet(urlrequest);
        }

        function getJornadaPrograma(rs) {
            var urlrequest = '/api/admisiones/Programa/jornadaPrograma/' + rs;
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

        function postInscripcion(rs) {
            var urlrequest = '/api/admisiones/Inscripcion';
            return ejecutarServicePost(urlrequest, rs);

        }


        function getVerificarEstadoInscrito(rs) {
            var urlrequest = '/api/admisiones/Inscripcion/existeSolicitud/' + rs.idAspirante + '/' + rs.idPrograma + '/' + rs.idPeriodoAcademico;
            return ejecutarServiceGet(urlrequest, rs);
        }

        function getListaBarriosAll(rs) {
            var urlrequest = '/api/configeneral/Barrio/all';
            return ejecutarServiceGet(urlrequest, rs);
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

        function getNivelFormacion() {
            var urlrequest = '/api/admisiones/NivelFormacion';
            return ejecutarServiceGet(urlrequest);
        }

        function getProgramaNivelFormacion(programa, periodo, sede) {
            var urlrequest = '/api/admisiones/Programa/nivelformProgramabyPlaneacion/' + programa + '/' + periodo+ '/' + sede;
            return ejecutarServiceGet(urlrequest);
        }

        function getListaModalidadesxPrograma(rs) {
            var urlrequest = '/api/admisiones/Programa/modalidadPrograma/' + rs;
            return ejecutarServiceGet(urlrequest);
        }

        function getListaHorariosxProgramaxModalidad(rs) {
            var urlrequest = '/api/admisiones/Programa/horarioPrograma/' + rs;
            return ejecutarServiceGet(urlrequest);
        }
    }

})();
