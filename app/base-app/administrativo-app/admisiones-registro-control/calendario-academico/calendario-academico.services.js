(function () {
    'use strict';
    angular.module('mytodoApp.service').service('calendarioAcademicoServices', calendarioAcademicoServices);
    calendarioAcademicoServices.$inject = ['$http', '$q'];
    function calendarioAcademicoServices($http, $q) {
        var servicio = this;
        servicio.buscarCalendarioAcademicos = Buscar;
        servicio.agregarCalendariosAcademicos = Agregar;
        servicio.eliminarDetalleCalendario = Eliminar;
        servicio.eliminarProgramasAcademicosMasivo = EliminarMasivo;
        servicio.actualizarCalendarioAcademicos = Actualizar;
        servicio.cargarListaNivelFormacion = ListaNivelFormacion;
        servicio.cargarListaFacultades = ListaFacultades;
        servicio.cargarListaEstados = ListaEstados;
        servicio.cargarListaJornada = ListaJornada;
        servicio.cargarListaReconocimiento = ListaReconocimiento;
        servicio.buscarCalendarioDetalle = BuscarDetalle;
        servicio.buscarMaximoCortes = BuscarMaxCortes;
        servicio.buscarPeriodosAcademicos = BuscarPeriodos;
        servicio.calendariosAcademicos = {};
        servicio.calendariosAcademicosAux = {};
        servicio.visible = {};
        servicio.visible.validaJornada = false;
        var url ='/api/admisiones/';

        function BuscarPeriodos() {
            var defered = $q.defer();
            var urlRequest = url + 'PeriodoAcademico/todos';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function BuscarMaxCortes() {
            var defered = $q.defer();
            var urlRequest = url + 'Universidad/all';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function Buscar() {
            var defered = $q.defer();
            var urlRequest = url + 'CalendarioAcademico';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function BuscarDetalle(detalle) {
            var defered = $q.defer();
            var urlRequest = url + 'CalendarioDetalle/byIdCalendario/' + detalle.id;
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function Agregar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'CalendarioAcademico';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function ListaReconocimiento() {
//            var defered = $q.defer();
//            var urlRequest = 'http://localhost:3700/listavalor?categoria=RECONOCIMIENTO_MEN';
//            $http.get(urlRequest).success(function (response) {
//                defered.resolve(response);
//            }).error(function (error) {
//                defered.reject(error);
//            });
//            return defered.promise;
        }

        function ListaNivelFormacion() {
            var defered = $q.defer();
            var urlRequest = url + 'NivelFormacion';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function ListaFacultades() {
            var defered = $q.defer();
            var urlRequest = url + 'Facultad';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function ListaEstados() {
//            var defered = $q.defer();
//            var urlRequest = 'http://localhost:3700/listaEstados';
//            $http.get(urlRequest).success(function (response) {
//                defered.resolve(response);
//            }).error(function (error) {
//                defered.reject(error);
//            });
//            return defered.promise;
        }

        function ListaJornada() {
//            var defered = $q.defer();
//            var urlRequest = 'http://localhost:3700/jornada';
//            $http.get(urlRequest).success(function (response) {
//                defered.resolve(response);
//            }).error(function (error) {
//                defered.reject(error);
//            });
//            return defered.promise;
        }

        function Eliminar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'CalendarioDetalle/' + rs;
            $http.delete(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function Actualizar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'CalendarioAcademico';
            $http.put(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function EliminarMasivo(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'calendariosAcademicos/masivo/' + rs;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

    }
})();