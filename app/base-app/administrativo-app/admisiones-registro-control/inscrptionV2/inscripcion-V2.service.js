(function () {
    'use strict';
    angular.module('mytodoApp.service').service('inscripcionCurService', inscripcionCurService);

    inscripcionCurService.$inject = ['$http', '$q','localStorageService','appConstant'];

    function inscripcionCurService($http, $q, localStorageService,appConstant) {
        var inscripcionCursoServicio = this;
        inscripcionCursoServicio.inscripcion = {};
        inscripcionCursoServicio.inscripcionInicial = {};
        inscripcionCursoServicio.inscripcion.aspirante = {};
        inscripcionCursoServicio.infopersonal = {};
        inscripcionCursoServicio.modowizard = {working: 'working', complete: 'complete', error: 'error'};
        inscripcionCursoServicio.estadopasos = {paso1: '', paso2: '', paso3: '', paso4: ''};
        inscripcionCursoServicio.visible = {};
        inscripcionCursoServicio.visible.estadoforminicio = true;
        inscripcionCursoServicio.visible.estadoformtipopago = false;
        inscripcionCursoServicio.visible.estadoformcapturapin = false;
        inscripcionCursoServicio.visible.ocultarbotonsalir = false;
        inscripcionCursoServicio.visible.botoncambio = false;
        inscripcionCursoServicio.visible.desctivarbotonatras = true;
        inscripcionCursoServicio.visible.desctivarbotoncontinuar = false;
        inscripcionCursoServicio.visible.desctivarboton = false;
        inscripcionCursoServicio.visible.validafechaexpedicion = false;
        inscripcionCursoServicio.visible.validafechanacimiento = false;
        inscripcionCursoServicio.visible.validaexpedicion = false;
        inscripcionCursoServicio.visible.validalugarnacimiento = false;
        inscripcionCursoServicio.visible.validaedad = false;
        inscripcionCursoServicio.visible.validalugarresidencia = false;
        inscripcionCursoServicio.visible.validaaniofinalizacion = false;
        inscripcionCursoServicio.visible.validaaniopresentacion = false;
        inscripcionCursoServicio.visible.validainstitucion = false;
        inscripcionCursoServicio.visible.validanivelformacionpadre = false;
        inscripcionCursoServicio.visible.validalugarresidenciapadre = false;
        inscripcionCursoServicio.visible.validanivelformacionmadre = false;
        inscripcionCursoServicio.visible.validalugarresidenciamadre = false;
        inscripcionCursoServicio.visible.validanivelformacionacudiente = false;
        inscripcionCursoServicio.visible.validaseccional = false;
        inscripcionCursoServicio.visible.validanivelformacion = false;
        inscripcionCursoServicio.visible.validaprograma = false;
        inscripcionCursoServicio.visible.validatipoconvenio = false;
        inscripcionCursoServicio.visible.activomsjpaisexp = false;
        inscripcionCursoServicio.visible.activomsjdepartamentoexp = false;
        inscripcionCursoServicio.visible.activomsjmunicipioexp = false;
        inscripcionCursoServicio.visible.activomsjpaislgnacimto = false;
        inscripcionCursoServicio.visible.activomsjdepartamentonacimto = false;
        inscripcionCursoServicio.visible.activomsjmunicipionacimto = false;
        inscripcionCursoServicio.visible.activomsjpaislgrecidencia = false;
        inscripcionCursoServicio.visible.activomsjdepartamentorecidencia = false;
        inscripcionCursoServicio.visible.activomsjmunicipiorecidencia = false;
        inscripcionCursoServicio.visible.validotelefono = false;
        inscripcionCursoServicio.visible.validotelefonopadre = false;
        inscripcionCursoServicio.visible.validotelefonomadre = false;
        inscripcionCursoServicio.visible.validotelefonoacudiente = false;
        inscripcionCursoServicio.visible.validocelular = false;
        inscripcionCursoServicio.visible.validocelularpadre = false;
        inscripcionCursoServicio.visible.validocelularmadre = false;
        inscripcionCursoServicio.visible.validocelularacudiente = false;
        inscripcionCursoServicio.visible.validotelefonosize = false;
        inscripcionCursoServicio.visible.validotelefonopadresize = false;
        inscripcionCursoServicio.visible.validotelefonomadresize = false;
        inscripcionCursoServicio.visible.validotelefonoacudientesize = false;
        inscripcionCursoServicio.visible.validocelularsize = false;
        inscripcionCursoServicio.visible.validocelularpadresize = false;
        inscripcionCursoServicio.visible.validocelularmadresize = false;
        inscripcionCursoServicio.visible.validocelularacudientesize = false;
        inscripcionCursoServicio.visible.validoemail = false;
        inscripcionCursoServicio.visible.validoemailpadre = false;
        inscripcionCursoServicio.visible.validoemailacudiente = false;
        inscripcionCursoServicio.visible.validoempresa = false;
        inscripcionCursoServicio.visible.validocargo = false;
        inscripcionCursoServicio.visible.validotiempolaborado = false;
        inscripcionCursoServicio.visible.estadobotonesinicio = false;
        inscripcionCursoServicio.visible.validobarrio = false;
        inscripcionCursoServicio.visible.estadotienehijos = 'no';
        inscripcionCursoServicio.visible.estadogrupoetnico = 'no';
        inscripcionCursoServicio.visible.estadoenfermedad = 'no';
        inscripcionCursoServicio.visible.estadodiscapacidad = 'no';
        inscripcionCursoServicio.visible.estadosisben = 'no';
        inscripcionCursoServicio.visible.estadovotoelecciones = 'no';
        inscripcionCursoServicio.visible.estadoLabora = 'no';
        inscripcionCursoServicio.visible.esvacialistaprograma = false;
        inscripcionCursoServicio.visible.esvacialistahorario = false;
        inscripcionCursoServicio.consultarNivelFormacion = getNivelFormacion;
        inscripcionCursoServicio.consultarPrograma = getPrograma;
        inscripcionCursoServicio.consultarProgramaNivelFormacion = getProgramaNivelFormacion;
        inscripcionCursoServicio.consultarJornadaPrograma = getJornadaPrograma;
        inscripcionCursoServicio.consultarTipoConvenio = getTipoConvenio;


        inscripcionCursoServicio.consultarDepartamentoPais = getDepartamentoPais;
        inscripcionCursoServicio.consultarMunicipioPorDepartamento = getMunicipioPorDepartamento;
        inscripcionCursoServicio.findPreinscripcion = getPreinscripcion;
        inscripcionCursoServicio.consultarBarrios = getBarrios;
        inscripcionCursoServicio.registrarInscripcion = postInscripcion;
        //inscripcionCursoServicio.consultarBarriosPorMunicipios = getListaBarriosxMunicipio;
        inscripcionCursoServicio.consultarAllModalidadesxPrograma = getListaModalidadesxPrograma;
        inscripcionCursoServicio.consultarAllHorariosxProgramaxModalidad = getListaHorariosxProgramaxModalidad;
        inscripcionCursoServicio.verificarEstadoInscritoAspirante = getVerificarEstadoInscrito;
        inscripcionCursoServicio.consultarPeriodoAcademico = getPeriodoAcademico;
        inscripcionCursoServicio.buscarConfiguracionByProgramaAndPeriodoAcademico = buscarconfiguracionByProgramaAndPeriodoAcademico;
        inscripcionCursoServicio.consultarAlianza= getAlianzas;
        inscripcionCursoServicio.getSedes = getSedes;
        inscripcionCursoServicio.getCursos = getCursos;
        inscripcionCursoServicio.getListaValorByCategoria = getListaValorByCategoria;
        inscripcionCursoServicio.postInscripcionCurso = postInscripcionCurso;

        inscripcionCursoServicio.botonVolver = {};


        function buscarconfiguracionByProgramaAndPeriodoAcademico(idPrograma, idPeriodo) {
            var urlRequest = '/api/admisiones/ConfiguracionEducacionContinuada/byProgramaAndPeriodoAcademico/' + idPrograma + '/' + idPeriodo;
            return ejecutarServiceGet(urlRequest);
        }

        function getAlianzas() {
            var urlRequest = '/api/admisiones/Alianza';
            return ejecutarServiceGet(urlRequest);
        }


        function getPreinscripcion(item) {
            var urlrequest = '/api/admisiones/Inscripcion/existAspirantePago/' + item.idTipoIdentificacion + '/' + item.identificacion;
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
        function postInscripcionCurso(inscription) {
            var urlrequest = '/api/admisiones/Cursos';
            return ejecutarServicePost(urlrequest, inscription);

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
            let defered = $q.defer();
          return  $http.post(urlrequest, rs);
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
      function getSedes() {
        var urlRequest = '/api/admisiones/Universidad/all';
        return ejecutarServiceGet(urlRequest);
      }

      function getCursos (sede, periodo) {
        let urlRequest = `/api/admisiones/Programa/nivelformProgramabyPlaneacionSede/${sede}/${periodo}`;
        return ejecutarServiceGet(urlRequest);
      }

      function getListaValorByCategoria(categoria, microservicio) {
        if (localStorageService.get('listaValor') !== null) {
          var deferred = $q.defer();
          var listaValor = localStorageService.get('listaValor');
          var filterData = [];

          listaValor.filter(function (obj) {
            if (obj.categoria === categoria) {
              filterData.push(obj);
            }
          });
          deferred.resolve(filterData);
          return deferred.promise;
        } else {
          let urlRequest = '/api/' + microservicio + '/ListaValor/' + categoria;
          return ejecutarServiceGet(urlRequest);
        }
      }

    }

})();
