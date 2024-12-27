(function () {
    'use strict';
    angular.module('mytodoApp.service').service('hojaVidaService', hojaVidaService);

    hojaVidaService.$inject = ['$http', '$q', 'appGenericConstant'];

    function hojaVidaService($http, $q, appGenericConstant) {
        var hojaVidaService = this;
        hojaVidaService.inscripcion = {};
        hojaVidaService.inscripcionInicial = {};
        hojaVidaService.inscripcion.aspirante = {};
        hojaVidaService.infopersonal = {};
        hojaVidaService.modowizard = {working: 'working', complete: 'complete', error: 'error'};
        hojaVidaService.estadopasos = {paso1: '', paso2: '', paso3: '', paso4: ''};
        hojaVidaService.visible = {};
        hojaVidaService.visible.estadoforminicio = true;
        hojaVidaService.visible.estadoformtipopago = false;
        hojaVidaService.visible.estadoformcapturapin = false;
        hojaVidaService.visible.ocultarbotonsalir = false;
        hojaVidaService.visible.botoncambio = false;
        /* -- PASOS WIZARD -- */
        hojaVidaService.visible.activetabstep1 = appGenericConstant.ACTIVO;
        hojaVidaService.visible.activetabstep2 = ' ';
        hojaVidaService.visible.activetabstep3 = ' ';
        hojaVidaService.visible.activetabstep4 = ' ';
        hojaVidaService.visible.desctivarbotonatras = true;
        hojaVidaService.visible.desctivarbotoncontinuar = false;
        hojaVidaService.visible.desctivarboton = false;
        hojaVidaService.visible.workingstep1 = hojaVidaService.modowizard.working;
        hojaVidaService.visible.workingstep2 = '';
        hojaVidaService.visible.workingstep3 = '';
        hojaVidaService.visible.workingstep4 = '';
        hojaVidaService.visible.validafechaexpedicion = false;
        hojaVidaService.visible.validafechanacimiento = false;
        hojaVidaService.visible.validaexpedicion = false;
        hojaVidaService.visible.validalugarnacimiento = false;
        hojaVidaService.visible.validaedad = false;
        hojaVidaService.visible.validalugarresidencia = false;
        hojaVidaService.visible.validaaniofinalizacion = false;
        hojaVidaService.visible.validaaniopresentacion = false;
        hojaVidaService.visible.validainstitucion = false;
        hojaVidaService.visible.validanivelformacionpadre = false;
        hojaVidaService.visible.validalugarresidenciapadre = false;
        hojaVidaService.visible.validanivelformacionmadre = false;
        hojaVidaService.visible.validalugarresidenciamadre = false;
        hojaVidaService.visible.validanivelformacionacudiente = false;
        hojaVidaService.visible.validaseccional = false;
        hojaVidaService.visible.validanivelformacion = false;
        hojaVidaService.visible.validaprograma = false;
        hojaVidaService.visible.validatipoconvenio = false;
        hojaVidaService.visible.activomsjpaisexp = false;
        hojaVidaService.visible.activomsjdepartamentoexp = false;
        hojaVidaService.visible.activomsjmunicipioexp = false;
        hojaVidaService.visible.activomsjpaislgnacimto = false;
        hojaVidaService.visible.activomsjdepartamentonacimto = false;
        hojaVidaService.visible.activomsjmunicipionacimto = false;
        hojaVidaService.visible.activomsjpaislgrecidencia = false;
        hojaVidaService.visible.activomsjdepartamentorecidencia = false;
        hojaVidaService.visible.activomsjmunicipiorecidencia = false;
        hojaVidaService.visible.validotelefono = false;
        hojaVidaService.visible.validotelefonopadre = false;
        hojaVidaService.visible.validotelefonomadre = false;
        hojaVidaService.visible.validotelefonoacudiente = false;
        hojaVidaService.visible.validocelular = false;
        hojaVidaService.visible.validocelularpadre = false;
        hojaVidaService.visible.validocelularmadre = false;
        hojaVidaService.visible.validocelularacudiente = false;
        hojaVidaService.visible.validotelefonosize = false;
        hojaVidaService.visible.validotelefonopadresize = false;
        hojaVidaService.visible.validotelefonomadresize = false;
        hojaVidaService.visible.validotelefonoacudientesize = false;
        hojaVidaService.visible.validocelularsize = false;
        hojaVidaService.visible.validocelularpadresize = false;
        hojaVidaService.visible.validocelularmadresize = false;
        hojaVidaService.visible.validocelularacudientesize = false;
        hojaVidaService.visible.validoemail = false;
        hojaVidaService.visible.validoemailpadre = false;
        hojaVidaService.visible.validoemailacudiente = false;
        hojaVidaService.visible.validoempresa = false;
        hojaVidaService.visible.validocargo = false;
        hojaVidaService.visible.validotiempolaborado = false;
        hojaVidaService.visible.estadobotonesinicio = false;
        hojaVidaService.visible.validobarrio = false;
        hojaVidaService.visible.estadotienehijos = 'no';
        hojaVidaService.visible.estadogrupoetnico = 'no';
        hojaVidaService.visible.estadoenfermedad = 'no';
        hojaVidaService.visible.estadodiscapacidad = 'no';
        hojaVidaService.visible.estadosisben = 'no';
        hojaVidaService.visible.estadovotoelecciones = 'no';
        hojaVidaService.visible.estadoLabora = 'no';
        hojaVidaService.visible.esvacialistaprograma = false;
        hojaVidaService.visible.esvacialistahorario = false;
        hojaVidaService.consultarSeccional = getSeccional;
        hojaVidaService.consultarNivelFormacion = getNivelFormacion;
        hojaVidaService.consultarPrograma = getPrograma;
        hojaVidaService.consultarProgramaNivelFormacion = getProgramaNivelFormacion;
        hojaVidaService.consultarJornadaPrograma = getJornadaPrograma;
        hojaVidaService.consultarTipoConvenio = getTipoConvenio;
        hojaVidaService.consultarPais = getPais;
        hojaVidaService.consultarColegio = getColegio;
        hojaVidaService.consultarDepartamentoPais = getDepartamentoPais;
        hojaVidaService.consultarMunicipioPorDepartamento = getMunicipioPorDepartamento;
        hojaVidaService.consultarAspirante = getAspirante;
        hojaVidaService.consultarBarrios = getBarrios;
        hojaVidaService.registrarInscripcion = postInscripcion;
        hojaVidaService.registrarCambioDocumento = postInscripcionCambioDocumento;
        hojaVidaService.registrarInscripcionInformacionAcademica = postInformacionAcademica;
        hojaVidaService.registrarInscripcionInformacionReferencia = postInformacionReferencia;
        hojaVidaService.registrarInscripcionInformacionOtro = postInformacionOtro;

        //inscripcionSerivicio.consultarBarriosPorMunicipios = getListaBarriosxMunicipio;
        hojaVidaService.consultarAllBarrios = getListaBarriosAll;
        hojaVidaService.consultarAllModalidadesxPrograma = getListaModalidadesxPrograma;
        hojaVidaService.consultarAllHorariosxProgramaxModalidad = getListaHorariosxProgramaxModalidad;
        hojaVidaService.verificarEstadoInscritoAspirante = getVerificarEstadoInscrito;
        hojaVidaService.consultarPeriodoAcademico = getPeriodoAcademico;
        hojaVidaService.buscarConfiguracionByProgramaAndPeriodoAcademico = buscarconfiguracionByProgramaAndPeriodoAcademico;
        hojaVidaService.postObservacionEstudiante = postObservacionEstudiante;
        hojaVidaService.postRetiroEstudiante = postRetiroEstudiante;
        hojaVidaService.postReintegroEstudiante = postReintegroEstudiante;
        hojaVidaService.getListadoObservacionesByIdAspirante = getListadoObservacionesByIdAspirante;
        hojaVidaService.getListadoOnservacionByIdMatricula = getListadoOnservacionByIdMatricula;
        hojaVidaService.getListadoRetiroByIdAspirante = getListadoRetiroByIdAspirante;
        hojaVidaService.getListadoReintegroByIdAspirante = getListadoReintegroByIdAspirante;

        hojaVidaService.botonVolver = {};


        function buscarconfiguracionByProgramaAndPeriodoAcademico(idPrograma, idPeriodo) {
            var urlRequest = '/api/admisiones/ConfiguracionEducacionContinuada/byProgramaAndPeriodoAcademico/' + idPrograma + '/' + idPeriodo;
            return ejecutarServiceGet(urlRequest);
        }

        function getAspirante(item) {
            var urlrequest = '/api/admisiones/Aspirante/buscarAspirante/' + item.identificacionAspirante.idTipoIdentificacion + '/' + item.identificacionAspirante.identificacion;
            return ejecutarServiceGet(urlrequest);
        }

        function postInscripcion(rs) {
            var urlrequest = '/api/admisiones/Aspirante/guardarAspirante';
            return ejecutarServicePost(urlrequest, rs);
        }

        function postObservacionEstudiante(rs) {
            var urlrequest = '/api/admisiones/ObservacionEstudiante/';
            return ejecutarServicePost(urlrequest, rs);
        }

        function getListadoObservacionesByIdAspirante(rs) {
            var urlrequest = '/api/admisiones/ObservacionEstudiante/findByIdAspirante/' + rs;
            return ejecutarServiceGet(urlrequest);
        }

        function getListadoOnservacionByIdMatricula(rs) {
            var urlrequest = '/api/admisiones/ObservacionEstudiante/findByIdMatricula/' + rs;
            return ejecutarServiceGet(urlrequest);
        }

        function postRetiroEstudiante(rs) {
            var urlrequest = '/api/admisiones/RetiroEstudiante/';
            return ejecutarServicePost(urlrequest, rs);
        }

        function postReintegroEstudiante(rs) {
            var urlrequest = '/api/admisiones/ReintegrarEstudiante/';
            return ejecutarServicePost(urlrequest, rs);
        }

        function getListadoRetiroByIdAspirante(rs) {
            var urlrequest = '/api/admisiones/RetiroEstudiante/findByIdAspirante/' + rs;
            return ejecutarServiceGet(urlrequest);
        }

        function getListadoReintegroByIdAspirante(rs) {
            var urlrequest = '/api/admisiones/ReintegrarEstudiante/findByIdAspirante/' + rs;
            return ejecutarServiceGet(urlrequest);
        }

        function postInscripcionCambioDocumento(rs) {
            var urlrequest = '/api/admisiones/Aspirante/guardarAspiranteCambioDocumento';
            return ejecutarServicePost(urlrequest, rs);
        }

        function postInformacionAcademica(rs) {
            var urlrequest = '/api/admisiones/Aspirante/guardarAspiranteInformacionAcademica';
            return ejecutarServicePost(urlrequest, rs);
        }
        function postInformacionReferencia(rs) {
            var urlrequest = '/api/admisiones/Aspirante/guardarAspiranteInformacionReferencia';
            return ejecutarServicePost(urlrequest, rs);
        }
        function postInformacionOtro(rs) {
            var urlrequest = '/api/admisiones/Aspirante/guardarAspiranteInformacionOtro';
            return ejecutarServicePost(urlrequest, rs);
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
            var urlrequest = '/api/admisiones/Programa/nivelformProgramabyPlaneacion/' + programa + '/' + periodo+ '/' + sede ;
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
