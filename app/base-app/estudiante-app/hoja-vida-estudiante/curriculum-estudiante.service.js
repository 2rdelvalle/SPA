(function () {
    'use strict';
    angular.module('mytodoApp.service').service('studentCurriculumService', studentCurriculumService);

    studentCurriculumService.$inject = ['$http', '$q', 'appGenericConstant'];

    function studentCurriculumService($http, $q, appGenericConstant) {
        var studentCurriculumService = this;
        studentCurriculumService.inscripcion = {};
        studentCurriculumService.inscripcionInicial = {};
        studentCurriculumService.inscripcion.aspirante = {};
        studentCurriculumService.infopersonal = {};
        studentCurriculumService.modowizard = {working: 'working', complete: 'complete', error: 'error'};
        studentCurriculumService.estadopasos = {paso1: '', paso2: '', paso3: '', paso4: ''};
        studentCurriculumService.visible = {};
        studentCurriculumService.visible.estadoforminicio = true;
        studentCurriculumService.visible.estadoformtipopago = false;
        studentCurriculumService.visible.estadoformcapturapin = false;
        studentCurriculumService.visible.ocultarbotonsalir = false;
        studentCurriculumService.visible.botoncambio = false;
        /* -- PASOS WIZARD -- */
        studentCurriculumService.visible.activetabstep1 = appGenericConstant.ACTIVO;
        studentCurriculumService.visible.activetabstep2 = ' ';
        studentCurriculumService.visible.activetabstep3 = ' ';
        studentCurriculumService.visible.activetabstep4 = ' ';
        studentCurriculumService.visible.desctivarbotonatras = true;
        studentCurriculumService.visible.desctivarbotoncontinuar = false;
        studentCurriculumService.visible.desctivarboton = false;
        studentCurriculumService.visible.workingstep1 = studentCurriculumService.modowizard.working;
        studentCurriculumService.visible.workingstep2 = '';
        studentCurriculumService.visible.workingstep3 = '';
        studentCurriculumService.visible.workingstep4 = '';
        studentCurriculumService.visible.validafechaexpedicion = false;
        studentCurriculumService.visible.validafechanacimiento = false;
        studentCurriculumService.visible.validaexpedicion = false;
        studentCurriculumService.visible.validalugarnacimiento = false;
        studentCurriculumService.visible.validaedad = false;
        studentCurriculumService.visible.validalugarresidencia = false;
        studentCurriculumService.visible.validaaniofinalizacion = false;
        studentCurriculumService.visible.validaaniopresentacion = false;
        studentCurriculumService.visible.validainstitucion = false;
        studentCurriculumService.visible.validanivelformacionpadre = false;
        studentCurriculumService.visible.validalugarresidenciapadre = false;
        studentCurriculumService.visible.validanivelformacionmadre = false;
        studentCurriculumService.visible.validalugarresidenciamadre = false;
        studentCurriculumService.visible.validanivelformacionacudiente = false;
        studentCurriculumService.visible.validaseccional = false;
        studentCurriculumService.visible.validanivelformacion = false;
        studentCurriculumService.visible.validaprograma = false;
        studentCurriculumService.visible.validatipoconvenio = false;
        studentCurriculumService.visible.activomsjpaisexp = false;
        studentCurriculumService.visible.activomsjdepartamentoexp = false;
        studentCurriculumService.visible.activomsjmunicipioexp = false;
        studentCurriculumService.visible.activomsjpaislgnacimto = false;
        studentCurriculumService.visible.activomsjdepartamentonacimto = false;
        studentCurriculumService.visible.activomsjmunicipionacimto = false;
        studentCurriculumService.visible.activomsjpaislgrecidencia = false;
        studentCurriculumService.visible.activomsjdepartamentorecidencia = false;
        studentCurriculumService.visible.activomsjmunicipiorecidencia = false;
        studentCurriculumService.visible.validotelefono = false;
        studentCurriculumService.visible.validotelefonopadre = false;
        studentCurriculumService.visible.validotelefonomadre = false;
        studentCurriculumService.visible.validotelefonoacudiente = false;
        studentCurriculumService.visible.validocelular = false;
        studentCurriculumService.visible.validocelularpadre = false;
        studentCurriculumService.visible.validocelularmadre = false;
        studentCurriculumService.visible.validocelularacudiente = false;
        studentCurriculumService.visible.validotelefonosize = false;
        studentCurriculumService.visible.validotelefonopadresize = false;
        studentCurriculumService.visible.validotelefonomadresize = false;
        studentCurriculumService.visible.validotelefonoacudientesize = false;
        studentCurriculumService.visible.validocelularsize = false;
        studentCurriculumService.visible.validocelularpadresize = false;
        studentCurriculumService.visible.validocelularmadresize = false;
        studentCurriculumService.visible.validocelularacudientesize = false;
        studentCurriculumService.visible.validoemail = false;
        studentCurriculumService.visible.validoemailpadre = false;
        studentCurriculumService.visible.validoemailacudiente = false;
        studentCurriculumService.visible.validoempresa = false;
        studentCurriculumService.visible.validocargo = false;
        studentCurriculumService.visible.validotiempolaborado = false;
        studentCurriculumService.visible.estadobotonesinicio = false;
        studentCurriculumService.visible.validobarrio = false;
        studentCurriculumService.visible.estadotienehijos = 'no';
        studentCurriculumService.visible.estadogrupoetnico = 'no';
        studentCurriculumService.visible.estadoenfermedad = 'no';
        studentCurriculumService.visible.estadodiscapacidad = 'no';
        studentCurriculumService.visible.estadosisben = 'no';
        studentCurriculumService.visible.estadovotoelecciones = 'no';
        studentCurriculumService.visible.estadoLabora = 'no';
        studentCurriculumService.visible.esvacialistaprograma = false;
        studentCurriculumService.visible.esvacialistahorario = false;
        studentCurriculumService.consultarSeccional = getSeccional;
        studentCurriculumService.consultarNivelFormacion = getNivelFormacion;
        studentCurriculumService.consultarPrograma = getPrograma;
        studentCurriculumService.consultarProgramaNivelFormacion = getProgramaNivelFormacion;
        studentCurriculumService.consultarJornadaPrograma = getJornadaPrograma;
        studentCurriculumService.consultarTipoConvenio = getTipoConvenio;
        studentCurriculumService.consultarPais = getPais;
        studentCurriculumService.consultarColegio = getColegio;
        studentCurriculumService.consultarDepartamentoPais = getDepartamentoPais;
        studentCurriculumService.consultarMunicipioPorDepartamento = getMunicipioPorDepartamento;
        studentCurriculumService.consultarAspirante = getAspirante;
        studentCurriculumService.consultarEstudiante = getEstudianteByCodigo;
        studentCurriculumService.consultarBarrios = getBarrios;
        studentCurriculumService.registrarInscripcion = postInscripcion;
        studentCurriculumService.registrarCambioDocumento = postInscripcionCambioDocumento;
        studentCurriculumService.registrarInscripcionInformacionAcademica = postInformacionAcademica;
        studentCurriculumService.registrarInscripcionInformacionReferencia = postInformacionReferencia;
        studentCurriculumService.registrarInscripcionInformacionOtro = postInformacionOtro;

        studentCurriculumService.consultarBarriosPorMunicipios = getListaBarriosxMunicipio;
        studentCurriculumService.consultarAllBarrios = getListaBarriosAll;
        studentCurriculumService.consultarAllModalidadesxPrograma = getListaModalidadesxPrograma;
        studentCurriculumService.consultarAllHorariosxProgramaxModalidad = getListaHorariosxProgramaxModalidad;
        studentCurriculumService.verificarEstadoInscritoAspirante = getVerificarEstadoInscrito;
        studentCurriculumService.consultarPeriodoAcademico = getPeriodoAcademico;
        studentCurriculumService.buscarConfiguracionByProgramaAndPeriodoAcademico = buscarconfiguracionByProgramaAndPeriodoAcademico;
        studentCurriculumService.postObservacionEstudiante = postObservacionEstudiante;
        studentCurriculumService.postRetiroEstudiante = postRetiroEstudiante;
        studentCurriculumService.postReintegroEstudiante = postReintegroEstudiante;
        studentCurriculumService.getListadoObservacionesByIdAspirante = getListadoObservacionesByIdAspirante;
        studentCurriculumService.getListadoOnservacionByIdMatricula = getListadoOnservacionByIdMatricula;
        studentCurriculumService.getListadoRetiroByIdAspirante = getListadoRetiroByIdAspirante;
        studentCurriculumService.getListadoReintegroByIdAspirante = getListadoReintegroByIdAspirante;
        studentCurriculumService.getFuncionario = getFuncionario;
        studentCurriculumService.botonVolver = {};

      function getFuncionario(documento) {
        var urlrequest = '/api/auth/foto/student/' + documento;
        return ejecutarServiceGet(urlrequest);
      }

        function buscarconfiguracionByProgramaAndPeriodoAcademico(idPrograma, idPeriodo) {
            var urlRequest = '/api/admisiones/ConfiguracionEducacionContinuada/byProgramaAndPeriodoAcademico/' + idPrograma + '/' + idPeriodo;
            return ejecutarServiceGet(urlRequest);
        }

        function getAspirante(item) {
            var urlrequest = '/api/admisiones/Aspirante/buscarAspirante/' + item.identificacionAspirante.idTipoIdentificacion + '/' + item.identificacionAspirante.identificacion;
            return ejecutarServiceGet(urlrequest);
        }
        function getEstudianteByCodigo(cod){
            var urlrequest = '/api/admisiones/Estudiante/consultarEstudiante/' + cod.identificacionAspirante.identificacion;
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

        function getListaBarriosxMunicipio(rs){
            var urlrequest = '/api/configeneral/Barrio/municipio/'+rs;
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
