'use strict';

angular.module('mytodoApp.service').service('mallaService', ['$http', '$q', 'appGenericConstant', function ($http, $q, appGenericConstant) {
        var servicio = this;

        servicio.consultarMallas = getlistadoMallaAcademica;
        servicio.consultarMallaXId = getMallaAcademicaDatos;
        servicio.consultarNivelesFormacion = getlistadoNivelesFormacion;
        servicio.consultarProgramas = getlistadoProgramas;
        servicio.consultarModulos = getListadoModulos;
        servicio.consultarNivelesProgramas = getlistadoNivelesProgramas;
        servicio.agregarMallaAcademica = postMallaAcademica;
        servicio.agregarDetalleMallaAcademica = postDetalleMallaAcademica;
        servicio.actualizarMallaAcademica = putMallaAcademica;
        servicio.consultarModulosProgrma = getListadoModulosByProgrma;
        servicio.buscarModuloId = getModuloById;
        servicio.buscarDetalleMallaByIdPrograma = getMallaDetalleByIdPrograma;
        servicio.getMallaByIdPrograma = getMallaByIdPrograma;
        servicio.entidad = {};
        servicio.entidadAuxiliar = {};
        servicio.listaAux = {};
        servicio.modulos = {};

        var url = "/api/matricula/";

        function ejecutarservice(urlRequest) {
            var deferred = $q.defer();
            $http.get(urlRequest).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function ejecutarservice(urlRequest, rs) {
            var deferred = $q.defer();
            $http.get(urlRequest, rs).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function ejecutarServicePost(urlRequest, malla) {
            var deferred = $q.defer();
            $http.post(urlRequest, malla).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function ejecutarServicePut(urlRequest, malla) {
            var defered = $q.defer();
            $http.put(urlRequest, malla).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function getlistadoMallaAcademica() {
            var urlRequest = url + "MallaAcademica/todos";
            return ejecutarservice(urlRequest);
        }

        function getMallaAcademicaDatos(id) {
            var urlRequest = url + "MallaAcademica/byIdMalla/" + id;
            return ejecutarservice(urlRequest, id);
        }

        function getlistadoNivelesFormacion() {
            var urlRequest = url + "NivelFormacion";
            return ejecutarservice(urlRequest);
        }

        function getListadoModulos() {
            var urlRequest = url + "Modulo";
            return ejecutarservice(urlRequest);
        }

        function getlistadoProgramas(id) {
            var urlRequest = url + "Programa/programaByIdNivelFormacion/" + id;
            return ejecutarservice(urlRequest);
        }

        function getlistadoNivelesProgramas(id) {
            var urlRequest = url + "Programa/nivelesByIdPrograma/" + id;
            return ejecutarservice(urlRequest);
        }

        function postMallaAcademica(rs) {
            var urlRequest = url + "MallaAcademica";
            return ejecutarServicePost(urlRequest, rs);
        }

        function postDetalleMallaAcademica(rs) {
            var urlRequest = url + "DetalleMallaAcademica";
            return ejecutarServicePost(urlRequest, rs);
        }

        function putMallaAcademica(rs) {
            var urlRequest = url + "MallaAcademica";
            return ejecutarServicePut(urlRequest, rs);
        }

        function getListadoModulosByProgrma(id) {
            var urlRequest = url + "Modulo/byIdProgarma/" + id;
            return ejecutarservice(urlRequest);
        }

        function getModuloById(id) {
            var urlRequest = url + "Modulo/findById/" + id;
            return ejecutarservice(urlRequest);
        }
        function getMallaDetalleByIdPrograma(id) {
            var urlRequest = url + "MallaAcademica/consultaDetalle/" + id;
            return ejecutarservice(urlRequest);
        }
        function getMallaByIdPrograma(id) {
            var urlRequest = url + "MallaAcademica/consultaMallaByidPrograma/" + id;
            return ejecutarservice(urlRequest);
        }

        // function getNotificacionMasiva(cliente) {
        //     var urlRequest = url + "Cartera/notificacion/masiva";
        //     var deferred = $q.defer();
        //     $http.post(urlRequest, cliente).success(function (response) {
        //         deferred.resolve(response);
        //     }).error(function (error) {
        //         deferred.reject(error);
        //     });
        //     return deferred.promise;
        // }
    }]);


