(function () {
    'use strict';
    angular.module('mytodoApp.service').service('gruposServices', gruposServices);
    gruposServices.$inject = ['$http', '$q', 'appGenericConstant'];

    function gruposServices($http, $q, appGenericConstant) {
        var servicioGrupo = this;
        servicioGrupo.buscarGrupos = getGrupos;
        servicioGrupo.agregarGrupo = postGrupo;
        servicioGrupo.eliminarGrupo = deleteGrupo;
        servicioGrupo.actualizarGrupo = putGrupo;
        servicioGrupo.onBuscarModulo = getModulo;
        servicioGrupo.onBuscarDocente = getDocente;
        servicioGrupo.onBuscarPeriodoAcademico = getPeriodoAcademico;
        servicioGrupo.grupo = {};
        servicioGrupo.grupoAuxiliar = {};
        servicioGrupo.onBuscarModulos = getNumeroModulo;
        servicioGrupo.onBuscarMaximacapacidadAula= getMaxCapacidad;
         
        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        var url = '/';

        function getGrupos() {
            var urlRequest = url + 'api/matricula/Grupo/buscarGrupos';
            return ejecutarServicesGet(urlRequest);
        }

        function getModulo() {
            var urlRequest = url + 'api/matricula/Modulo';
            return ejecutarServicesGet(urlRequest);
        }
        function getPeriodoAcademico() {
            var urlRequest = url + 'api/matricula/PeriodoAcademico/ByEstadoAbiertoInscripto';
            return ejecutarServicesGet(urlRequest);
        }
        function getDocente(idProgramacion) {
            var urlRequest = url + 'api/matricula/Docente/ConsultaDocenteByProgramacion/' + idProgramacion;
            return ejecutarServicesGet(urlRequest);
        }
        
          function getNumeroModulo(idPeriodo,idHorario,idModulo) {
            var urlRequest = url + 'api/matricula/Grupo/buscarNumeroModulos/' + idPeriodo+'/'+idHorario+'/'+idModulo;
            return ejecutarServicesGet(urlRequest);
        }

        function postGrupo(grupo) {
            var defered = $q.defer();
            var urlRequest = url + 'api/matricula/Grupo';
            $http.post(urlRequest, grupo).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function deleteGrupo(grupo) {
            var defered = $q.defer();
            var urlRequest = url + 'api/matricula/Grupo/' + grupo.id;
            $http.delete(urlRequest, grupo).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function putGrupo(grupo) {
            var defered = $q.defer();
            var urlRequest = url + 'api/matricula/Grupo';
            $http.put(urlRequest, grupo).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        
         function  getMaxCapacidad(idConfiguracionProgramacionAcade){
              var urlRequest = url + 'api/matricula/Grupo/buscarMaxCapacidad/' + idConfiguracionProgramacionAcade;
            return ejecutarServicesGet(urlRequest);
         }

    }
})();