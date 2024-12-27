'use strict';
angular.module('mytodoApp').controller('auditoriaNotaCtrl', ['localStorageService', 'reportesAuditoriaService', 'reportesServices', 'appConstant', 'asistenciaServices', 'appGenericConstant', '$filter',
    function (localStorageService, reportesAuditoriaService, reportesServices, appConstant, asistenciaServices, appGenericConstant, $filter) {
        var reportes = this;
        reportes.listadoPeriodos = [];
        reportes.idPeriodo = [];
        reportes.listEstudiantes = [];
        reportes.listEstudiantesNotas = [];
        reportes.listEstudiantesAsistencia = [];
        reportes.listConvenios = [];

        if (localStorageService.get("usuario") !== null) {
            reportes.user = localStorageService.get("usuario");
        }

        reportes.onConsultarListadoAuditoriaNotasFaltantes = function () {
            reportes.listaEstudiantesMatricula = [];
            reportesServices.onGetListadoAuditoriaNotaFaltantes(reportes.idPeriodo.id, "1").then(function (data) {
                reportes.listEstudiantes = data;
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });


            reportes.listEstudiantesAsistencia = [];
            reportesServices.onGetListadoAuditoriaNotaFaltantes(reportes.idPeriodo.id, "3").then(function (data) {
                reportes.listEstudiantesAsistencia = data;
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
            reportesServices.onGetListadoAuditoriaNotaFaltantes(reportes.idPeriodo.id, "2").then(function (data) {
                reportes.listEstudiantesNotas = data;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        reportes.onConsultarListadoEstudiantesAsistencia = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            reportes.listEstudiantesAsistencia = [];
            reportesServices.onGetListadoAuditoriaNotaFaltantes(reportes.idPeriodo.id, "3").then(function (data) {
                reportes.listEstudiantesAsistencia = data;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        reportes.onConsultarListadoConvenio = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            reportes.listConvenios = [];
            reportesAuditoriaService.onGetListadoConvenio(reportes.idPeriodo.id).then(function (data) {
                reportes.listConvenios = data;
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        reportes.onChangeListadoReportesAdministrados = function () {
            reportes.onConsultarListadoAuditoriaNotasFaltantes();
            reportes.onConsultarListadoEstudiantesAsistencia();
             reportes.onConsultarListadoEstudiantesNota();
        };

        reportes.onChangePeriodo = function () {
            reportes.onConsultarListadoConvenio();
        };



        function buscarPeriodos() {
            asistenciaServices.getPeriodosAcademicosAll().then(function (data) {
                angular.forEach(data, function (value, key) {
                    var periodo = {
                        id: value.id,
                        nombre: value.nombrePeriodoAcademico
                    };
                    reportes.listadoPeriodos.push(periodo);
                });
            });
        }

        buscarPeriodos();


    }]);


