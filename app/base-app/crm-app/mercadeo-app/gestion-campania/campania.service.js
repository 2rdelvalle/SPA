(function () {
    'use strict';
    angular.module('mytodoApp.service').service('campaniaService', campaniaService);

    campaniaService.$inject = ['$http', '$q', 'utilServices'];

    function campaniaService($http, $q, utilServices) {

        var campaniaServicio = this;

        campaniaServicio.campania = {};
        campaniaServicio.actividad = {};
        campaniaServicio.seguimientoLlamada = {};
        campaniaServicio.visible = {};
        campaniaServicio.visible.titulo = "";
        campaniaServicio.visible.eseditable = false;
        campaniaServicio.visible.rendered = false;
        campaniaServicio.visible.renderedbutton = false;

        campaniaServicio.consultarCampanias = getCampanias;
        campaniaServicio.consultarCampaniaByNombreTipoCampania = getCampaniaByNombreTipoCampania;
        campaniaServicio.consultarTipoCampanias = getTipoCampanias;
        campaniaServicio.consultarTipoActividades = getTipoActividades;
        campaniaServicio.consultarActividadeByNombre = getActividadByNombre;
        campaniaServicio.consultarEstadosCampanias = getEstadosCampanias;
        campaniaServicio.consultarActividadesByCampania = getActividadesByCampania;
        campaniaServicio.registrarCampania = postCampania;
        campaniaServicio.registrarActividad = postActividad;
        campaniaServicio.actualizaCampania = putCampania;
        campaniaServicio.actualizaActividad = putActividad;
        campaniaServicio.eliminarCampania = deleteCampania;
        campaniaServicio.eliminarActividad = deleteActividad;
        campaniaServicio.onBuscarDashboardCampana = buscarDashboardCampana;
        var url = '/api/crm/';

        function getCampanias() {
            var urlRequest = url + 'Campanha';
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getCampaniaByNombreTipoCampania(campania) {
            var urlRequest = url + 'Campanha/filter/' + campania.nombreCampanha + '/' + campania.idTipoCampanha;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getActividadesByCampania(campania) {
            var urlRequest = url + 'Actividad/asignada/' + campania;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getTipoCampanias() {
            var urlRequest = url + 'TiposCampanha/estado';
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getTipoActividades() {
            var urlRequest = '';
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function getActividadByNombre(actividad) {
            var urlRequest = url + 'Actividad/filter/' + actividad.nombreActividad;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function postCampania(campania) {
            var urlRequest = url + 'Campanha';
            return utilServices.EJECUTAR_SERVICE_POST(urlRequest, campania);
        }

        function postActividad(actividad) {
            var urlRequest = url + 'Actividad';
            return utilServices.EJECUTAR_SERVICE_POST(urlRequest, actividad);
        }

        function getEstadosCampanias() {
            var urlRequest = '';
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        function buscarDashboardCampana(idTipo, idCampana, idPeriodo) {
            var urlRequest = url + 'Campanha/dashboardCampana/' + idTipo + "/" + idCampana + "/" + idPeriodo;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        }

        campaniaServicio.BuscarDetalleByIdCampania = function (id) {
            var urlRequest = url + 'Campanha/detalleByIdCampania/' + id;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        };

        campaniaServicio.BuscarDetalleDiaByIdCampania = function (id) {
            var urlRequest = url + 'Campanha/detalleDiaByIdCampania/' + id;
            return utilServices.EJECUTAR_SERVICE_GET(urlRequest);
        };

        function putActividad(actividad) {
            var urlRequest = url + 'Actividad';
            return ejecutarServicePut(urlRequest, actividad);
        }

        function putCampania(campania) {
            var urlRequest = url + 'Campanha';
            return ejecutarServicePut(urlRequest, campania);
        }

        function deleteCampania(campania) {
            var urlRequest = url + 'Campanha/' + campania.id;
            return ejecutarServiceDelete(urlRequest);
        }

        function deleteActividad(actividad) {
            var urlRequest = url + 'Actividad/' + actividad.id;
            return ejecutarServiceDelete(urlRequest, actividad);
        }

        function ejecutarServicePut(urlRequest, rs) {
            var defered = $q.defer();
            $http.put(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function ejecutarServiceDelete(urlRequest) {
            var defered = $q.defer();
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
    }

})();
