(function () {
    'use strict';
    angular.module('mytodoApp.service').service('asistenciaDiariaService', asistenciaDiariaService);
    asistenciaDiariaService.$inject = ['$http', '$q', 'appGenericConstant'];

    function asistenciaDiariaService($http, $q, appGenericConstant) {
        var asistenciaDiariaServi = this;
        asistenciaDiariaServi.registarAsistencia = postAsitenciaDiaria;
        asistenciaDiariaServi.buscarGruposModulo = buscarGruposByModulo;
        asistenciaDiariaServi.buscarModulo = getModulo;
        asistenciaDiariaServi.buscarModuloByDocente = getModuloByDocente;
        asistenciaDiariaServi.buscarConfiguracion = getConfiguracion;
        asistenciaDiariaServi.buscarEstudiantesByGrupo = buscarEstudiantesByGrupo;
        asistenciaDiariaServi.buscarEstudiantesRetiradosAsistencia = buscarEstudiantesRetiradosAsistencia;

//        asignarNotaService.buscarEstudiantePorGrupo = buscarEstudianteByGrupo;

        function ejecutarServicesGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        var url = '/api/matricula';
        var url2 = '/api/admisiones';

        function getModulo() {
            var urlRequest = url + '/Modulo';
            return ejecutarServicesGet(urlRequest);
        }

        function getModuloByDocente(rs) {
            var urlRequest = url2 + '/Modulo/getModulosByIdentidicacionDocente/' + rs;
            return ejecutarServicesGet(urlRequest);
        }

        function getConfiguracion() {
            var urlRequest = url + '/ConfiguracionNota';
            return ejecutarServicesGet(urlRequest);
        }


        function buscarGruposByModulo(idModulo,identificacion,idPeriodo,idHorario) {
            var urlRequest = url + '/Grupo/grupoByIdModuloIdHorarioIdperiodo/' + idModulo+'/'+identificacion+'/'+idPeriodo+'/'+idHorario;
            return ejecutarServicesGet(urlRequest);
        }

        function buscarEstudiantesByGrupo(rs) {
            var urlRequest = url + '/AsistenciaDiaria/estudiantesValidate/' + rs;
            return ejecutarServicesGet(urlRequest);
        }

        function buscarEstudiantesRetiradosAsistencia() {
            var urlRequest = url + '/AsistenciaDiaria/estudiantesRetiradosAsistencia';
            return ejecutarServicesGet(urlRequest);
        }


        function getModulo() {
            var urlRequest = url + '/Modulo';
            return ejecutarServicesGet(urlRequest);
        }

        function postAsitenciaDiaria(asistencias) {
            var defered = $q.defer();
            var urlRequest = url + '/AsistenciaDiaria/Validate';
            $http.post(urlRequest, asistencias).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function deleteGrupo(grupo) {
            var defered = $q.defer();
            var urlRequest = url + '/Grupo/' + grupo.id;
            $http.delete(urlRequest, grupo).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function putGrupo(grupo) {
            var defered = $q.defer();
            var urlRequest = url + '/Grupo';
            $http.put(urlRequest, grupo).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

    }
})();

