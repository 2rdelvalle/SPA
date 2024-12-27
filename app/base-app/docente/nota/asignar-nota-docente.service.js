(function () {
    'use strict';
    angular.module('mytodoApp.service').service('asignarNotaDocenteService', asignarNotaDocenteService);
    asignarNotaDocenteService.$inject = ['$http', '$q', 'appGenericConstant'];

    function asignarNotaDocenteService($http, $q, appGenericConstant) {
        var asignarNotaDocenteService = this;
        asignarNotaDocenteService.asignarNota = postMatriculaAcademica;
        asignarNotaDocenteService.buscarGruposModulo = buscarGruposByModulo;
        asignarNotaDocenteService.buscarModulo = getModulo;
        asignarNotaDocenteService.buscarModuloByDocente = getModuloByDocente;
        asignarNotaDocenteService.getVerificarModuloByDocente = getVerificarModuloByDocente;
        asignarNotaDocenteService.buscarConfiguracion = getConfiguracion;
        asignarNotaDocenteService.buscarEstudiantesByGrupo = buscarEstudiantesByGrupo;
        asignarNotaDocenteService.enviarEmailCertificado = enviarEmailCertificado;
        asignarNotaDocenteService.descargarPlantillaDocente = descargarPlantillaDocente;
        asignarNotaDocenteService.uploadPlantillaDocente = uploadPlantillaDocente;

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

        var url = '/';

        function getModulo() {
            var urlRequest = url + 'api/matricula/Modulo';
            return ejecutarServicesGet(urlRequest);
        }

        function getModuloByDocente(rs) {
            var urlRequest = url + 'api/admisiones/Modulo/getModulosByIdentidicacionDocente/' + rs;
            return ejecutarServicesGet(urlRequest);
        }

        function getVerificarModuloByDocente(rs) {
            var urlRequest = url + 'api/admisiones/Modulo/getVerificarModuloByDocente/' + rs;
            return ejecutarServicesGet(urlRequest);
        }

        function getConfiguracion() {
            var urlRequest = url + 'api/matricula/ConfiguracionNota';
            return ejecutarServicesGet(urlRequest);
        }


        function buscarGruposByModulo(idModulo, identificacion, idPeriodo, idHorario) {
            var urlRequest = url + 'api/matricula/Grupo/grupoByIdModuloIdHorarioIdperiodo/' + idModulo + '/' + identificacion.trim() + '/' + idPeriodo + '/' + idHorario;
            return ejecutarServicesGet(urlRequest);
        }
        function descargarPlantillaDocente (idGrupo, idModulo, idPeriodo,) {
            var defered = $q.defer();
            var urlRequest = `/api/generatefile/assistance/${idGrupo}/${idModulo}/${idPeriodo}`;
           
            $http.get(urlRequest,{responseType:'blob'}).success(function (response) {
              defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function uploadPlantillaDocente (file) {
            var defered = $q.defer();
            var urlRequest = `/api/generatefile//assistance/uploadAssitanceFile`;
           
             $http({
                method:"PUT",
                url:urlRequest,
                headers:{
                    "Content-Type": undefined
                },
                data: file
            }).success(function (response) {
                defered.resolve(response);
              }).error(function (error) {
                  defered.reject(error);
              });
              return defered.promise;
        }
        function buscarEstudiantesByGrupo(rs) {
            var urlRequest = url + 'api/matricula/Grupo/buscarMatriculasByGrupo/' + rs;
            return ejecutarServicesGet(urlRequest);
        }


        function getModulo() {
            var urlRequest = url + 'api/matricula/Modulo';
            return ejecutarServicesGet(urlRequest);
        }

        function postMatriculaAcademica(grupo) {
            var defered = $q.defer();
            var urlRequest = url + 'api/matricula/MatriculaAcademica/guardarMatriculaNota';
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

        function enviarEmailCertificado(rs) {
            var urlEmail = "/api/email/";
            var urlrequest = urlEmail + 'Email/enviarNotaDocente';
            return ejecutarServicePost(urlrequest, rs);
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
    }
})();