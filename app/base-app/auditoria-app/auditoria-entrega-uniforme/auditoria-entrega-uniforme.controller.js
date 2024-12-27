'use strict';
angular.module('mytodoApp').controller('auditoriaEntregaCtrl', ['localStorageService', 'reportesAuditoriaService', 'appConstant', 'appGenericConstant', '$filter',
    function (localStorageService, reportesAuditoriaService, appConstant, appGenericConstant, $filter) {
        var reportes = this;
        reportes.listSinEntregar = [];
        reportes.listEntregadas = [];

        if (localStorageService.get("usuario") !== null) {
            reportes.user = localStorageService.get("usuario");
        }

        reportes.onConsultarListadoAuditoriaNotasFaltantes = function () {
            reportes.listSinEntregar = [];
            reportesAuditoriaService.onConsultarRecibosUniformeByEstado("PENDIENTE").then(function (data) {
                reportes.listSinEntregar = data;
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });

            reportes.listEntregadas = [];
            reportesAuditoriaService.onConsultarRecibosUniformeByEstado("ENTREGADO").then(function (data) {
                reportes.listEntregadas = data;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        reportes.onConsultarListadoEstudiantesNota = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            reportes.listaEstudiantesMatricula = [];
            reportesAuditoriaService.onGetListadoAuditoriaNotaFaltantes(reportes.idPeriodo.id, "2").then(function (data) {
                reportes.listEstudiantesNotas = data;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        reportes.onModalEntrega = function (data) {
            reportes.item = data;
            reportes.observacion = "";
            $('#modalEntregarDescripcion').modal({ backdrop: 'static', keyboard: false });
            $("#modalEntregarDescripcion").modal("show");
        }

        reportes.onClickToView = function (data) {
            reportes.item = data;
            $('#modalDatos').modal({ backdrop: 'static', keyboard: false });
            $("#modalDatos").modal("show");
        };

        reportes.onGenerarEntrega = function () {

            if (reportes.observacion === "" || reportes.observacion === null || reportes.observacion === undefined) {
                appConstant.MSG_GROWL_ADVERTENCIA("No ha registrado observación de entrega");
                return;
            }

            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            var dto = {
                id: reportes.item.id,
                observacion: reportes.observacion
            }
            reportesAuditoriaService.onActualizarEntrega(dto).then(function (data) {
                reportes.onConsultarListadoAuditoriaNotasFaltantes();
                appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                $("#modalEntregarDescripcion").modal("hide");
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });

        }

        reportes.onConsultarListadoAuditoriaNotasFaltantes();
    }]);


