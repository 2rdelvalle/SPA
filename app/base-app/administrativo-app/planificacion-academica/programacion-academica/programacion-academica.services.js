(function () {
    'use strict';
    angular.module('mytodoApp.service').service('programacionAcademicaServices', programacionAcademicaServices);
    programacionAcademicaServices.$inject = ['$http', '$q'];
    function programacionAcademicaServices($http, $q) {
        var servicioProgramacionAcademica = this;
        servicioProgramacionAcademica.buscarProgramacionAcademicaAuto = getProgramacionAcademicaAuto;
        servicioProgramacionAcademica.buscarProgramacionAcademica = getProgramacionAcademica;
        servicioProgramacionAcademica.programasAdemicos = BuscarProgamasAcademios;
        servicioProgramacionAcademica.listarNivelesFormacion = listaNivelesFormacion;
        servicioProgramacionAcademica.buscarPeriodo = buscarPeriodoAcademico;
        servicioProgramacionAcademica.buscarModalidadesPorModulos = buscarModalidadesByModulos;
        servicioProgramacionAcademica.buscarHorarioModulo = getHorarioModulo;
        servicioProgramacionAcademica.buscarModulosPorPeriodo = buscarModuloByPeriodoAcademico;
        servicioProgramacionAcademica.buscarRecursoFisico = getRecursoEducativoFisico;
        servicioProgramacionAcademica.agregarProgramacionAcademica = postProgramacionAcademica;
        servicioProgramacionAcademica.actualizarProgramacionAcademica = putProgramacionAcademica;
        servicioProgramacionAcademica.descartarProgramacionAcademica = putDescartarProgramacionAcademica;
        servicioProgramacionAcademica.consultarProgramaNivelformacion = getProgramaNivelFormacion;
        servicioProgramacionAcademica.consultarDocenteSedePorEstado = getDocentesByEstado;
        servicioProgramacionAcademica.consultarAsignaturasByProgramaAndNivel = getAsignaturasByProgramaAndNivel;
        servicioProgramacionAcademica.buscarPorProgramacion = getbuscarPorProgramacion;
        servicioProgramacionAcademica.buscarPorProgramacionExport = getProgramacionExport;
        servicioProgramacionAcademica.programacionAcademica = {};
        servicioProgramacionAcademica.programacionAcademicaAuxiliar = {};
        servicioProgramacionAcademica.promaca = {};
        servicioProgramacionAcademica.modulos = {};
        servicioProgramacionAcademica.agregarProgramacionAcademicaHorario = postAddHorarioProgramacion;
        servicioProgramacionAcademica.actualizarProgramacionAcademicaHorario = putUpdateHorarioProgramacion;
        servicioProgramacionAcademica.validarDisponibilidadAula = getValidarDisponibilidadAula;
        servicioProgramacionAcademica.getbuscarModulo = getbuscarModulo;
        servicioProgramacionAcademica.getbuscarProgramasModulo = getbuscarProgramasModulo;
        servicioProgramacionAcademica.postAddHorarioProgramacionTransversales = postAddHorarioProgramacionTransversales;
        servicioProgramacionAcademica.consultarSeccional = getSeccional;
        servicioProgramacionAcademica.consultarNivelFormacion = getNivelFormacion;
        var url = '/api/admisiones/';
        var urlaca = '/api/academic/';

        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getNivelFormacion() {
            var urlrequest = '/api/admisiones/NivelFormacion';
            return ejecutarServicesGet(urlrequest);
        }
        
        function getSeccional() {
            var urlrequest = '/api/admisiones/Seccional';
            return ejecutarServicesGet(urlrequest);
        }
        function getbuscarModulo(idModulo) {
            var urlRequest = url + 'Modulo/getModulosById/' + idModulo;
            return ejecutarServicesGet(urlRequest);
        }
        function getbuscarProgramasModulo(idModulo, nivel, periodo, seccional) {
            var urlRequest = url + 'Programa/modulo/' + idModulo +'/' + nivel + '/' + periodo + '/' + seccional;
            return ejecutarServicesGet(urlRequest);
        }
        function getProgramacionAcademica() {
            var urlRequest = url + 'ProgramacionAcademica/all';
            return ejecutarServicesGet(urlRequest);
        }
        function getProgramacionAcademicaAuto() {
            var urlRequest = urlaca + '/generateAll';
            return ejecutarServicesGet(urlRequest);
        }
        function postProgramacionAcademica(ProgramacionAcademica) {
            var defered = $q.defer();
            var urlRequest = url + 'ProgramacionAcademica';
            $http.post(urlRequest, ProgramacionAcademica).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function putProgramacionAcademica(ProgramacionAcademica) {
            var defered = $q.defer();
            var urlRequest = url + 'ProgramacionAcademica';
            $http.put(urlRequest, ProgramacionAcademica).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function postAddHorarioProgramacion(ProgramacionAcademica) {
            var defered = $q.defer();
            var urlRequest = url + 'ProgramacionAcademica/70d704be70379052969617ab9daed90b';
            $http.post(urlRequest, ProgramacionAcademica).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
      function postAddHorarioProgramacionTransversales(ProgramacionAcademica) {
        var defered = $q.defer();
        var urlRequest = url + 'ProgramacionAcademica/transversales';
        $http.post(urlRequest, ProgramacionAcademica).success(function (response) {
          defered.resolve(response);
        }).error(function (error) {
          defered.reject(error);
        });
        return defered.promise;
      }
        function putUpdateHorarioProgramacion(ProgramacionAcademica) {
            var defered = $q.defer();
            var urlRequest = url + 'ProgramacionAcademica/394cf7050769f5c2bfe0956577cacd02';
            $http.put(urlRequest, ProgramacionAcademica).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function putDescartarProgramacionAcademica(ProgramacionAcademica) {
            var defered = $q.defer();
            var urlRequest = url + 'ProgramacionAcademica/descartar';
            $http.put(urlRequest, ProgramacionAcademica).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function getbuscarPorProgramacion(programacion) {
            var urlRequest = url + 'ProgramacionAcademica/findProgramacion/' + programacion;
            return ejecutarServicesGet(urlRequest);
        }
        function getProgramaNivelFormacion(nivel, periodo, sede) {
            var urlrequest = url + 'Programa/nivelformProgramabyPlaneacion/' + nivel + '/' + periodo+ '/' + sede;
            return ejecutarServicesGet(urlrequest);
        }

        function getDocentesByEstado(seccional) {
            var urlrequest = '/api/docente/Docente/sedes/'+seccional;
            return ejecutarServicesGet(urlrequest);
        }

        function BuscarProgamasAcademios(dato) {
            var defered = $q.defer();
            var urlRequest = url + 'Programa/nivelformacionPrograma/' + dato;
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function buscarPeriodoAcademico() {
            var urlRequest = url + 'PeriodoAcademico/ByEstadoAbiertoInscripto';
            return ejecutarServicesGet(urlRequest);
        }
        function buscarModuloByPeriodoAcademico(periodo) {
            var urlRequest = url + 'ProgramacionAcademica/findModulo/' + periodo;
            return ejecutarServicesGet(urlRequest);
        }
        function buscarModalidadesByModulos(modulos, nombre) {
            var urlRequest = url + 'ProgramacionAcademica/findModalidad/' + modulos.replace(/ /g, "") + '/' + nombre;
            return ejecutarServicesGet(urlRequest);
        }
        function getAsignaturasByProgramaAndNivel(programa, nivel) {
            var urlRequest = url + 'MallaAcademica/findAsignaturasMalla/' + programa + '/' + nivel;
            return ejecutarServicesGet(urlRequest);
        }
        function getProgramacionExport(modulo, modalidad, horario) {
            var urlRequest = url + 'ProgramacionAcademica/export/' + modulo + '/' + modalidad + '/' + horario;
            return ejecutarServicesGet(urlRequest);
        }
        function getRecursoEducativoFisico(seccional) {
            var urlRequest = url + 'RecursoEducativo/all/seccional/'+ seccional;
            return ejecutarServicesGet(urlRequest);
        }
        function getHorarioModulo(modalidad, horario, modulos, nombre) {
            var urlRequest = url + 'ProgramacionAcademica/findHorarioModalidadByModulosEstudiantes/'+ modalidad+'/'+ horario +'/'+ modulos.replace(/ /g, "") + '/'+ nombre;
            return ejecutarServicesGet(urlRequest);
        }
        function listaNivelesFormacion() {
            var defered = $q.defer();
            var urlRequest = url + 'NivelFormacion';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getValidarDisponibilidadAula(idAula, numeroModulo, periodoAcademico, idHorario, idModuloAsignatura) {
            var urlRequest = url + 'ProgramacionAcademica/validarDisponibilidadAula/'+ idAula + '/' + numeroModulo +'/'+ periodoAcademico+ '/' + idHorario+'/' + idModuloAsignatura ;
            return ejecutarServicesGet(urlRequest);
        }

    }
})();



