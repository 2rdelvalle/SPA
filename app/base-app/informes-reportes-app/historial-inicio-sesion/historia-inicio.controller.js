'use strict';
angular.module('mytodoApp').controller('auditoriaInicioSesionCtrl', ['localStorageService', 'reportesAuditoriaService', 'appConstant', 'appGenericConstant', '$filter',
    function (localStorageService, reportesAuditoriaService, appConstant, appGenericConstant, $filter) {
        var reportes = this;
        reportes.listInicioSesion = [];
        if (localStorageService.get("usuario") !== null) {
            reportes.user = localStorageService.get("usuario");
        }

        reportes.onConsultarListadoInicioSesion = function () {
            reportes.listInicioSesion = [];
            reportesAuditoriaService.onListarUltimoInicio().then(function (data) {
                reportes.listInicioSesion = data;
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        reportes.onClickToView = function (data) {
            reportes.detalle = {};
            reportes.detalle.funcionario = data.funcionario
            reportes.listHistorico = data.lista;
            $('#modalDatos').modal({ backdrop: 'static', keyboard: false });
            $("#modalDatos").modal("show");
        };


        reportes.onConsultarListadoInicioSesion();
    }]);


