(function () {
    'use strict';
    angular.module('mytodoApp').controller('aspiranteGrandoCtrl', aspiranteGrandoCtrl);
    aspiranteGrandoCtrl.$inject = ['$scope', 'aspiranteGraduados', 'asignarNotaServiceGnrl', 'historialLiquidacionServices', 'asistenciaServices', 'pazSalvoAcademicoService', 'localStorageService', 'appConstant', 'appGenericConstant'];
    function aspiranteGrandoCtrl($scope, aspiranteGraduados, asignarNotaServiceGnrl, historialLiquidacionServices, asistenciaServices, pazSalvoAcademicoService, localStorageService, appConstant, appGenericConstant) {

        var aspiranteGrado = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };

        aspiranteGrado.display;
        aspiranteGrado.selectTodos = false;
        aspiranteGrado.filtrados = [];
        aspiranteGrado.estados = [];
        aspiranteGrado.listadoEstudianteArchivo = [];
        aspiranteGrado.options = appConstant.FILTRO_TABLAS;
        aspiranteGrado.selectedOption = aspiranteGrado.options[0];
        aspiranteGrado.configuracionNota = {};
        aspiranteGrado.tipoArchivoValido = true;
        aspiranteGrado.listaOtros = [];

        aspiranteGrado.listadoEstudiantes = [];

        aspiranteGrado.report = {
            selected: null
        };

        aspiranteGrado.onConsultarEstudiantesAspirante = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            aspiranteGrado.listadoEstudiantes = [];
            asignarNotaServiceGnrl.onBuscarEstudiantesAspirantesGrado().then(function (data) {
                aspiranteGrado.listadoEstudiantes = data;
                aspiranteGrado.listaOtros = [];

                if (data === "" || data === null || data === undefined) {
                    appConstant.MSG_GROWL_ADVERTENCIA('No se encontraron estudiantes que se encuentren en ultimo semestre');
                }
            });
            $("div").removeClass("div.swal2-overlay");
            appConstant.CERRAR_SWAL();
        };

        aspiranteGrado.onMostrarModal = function (item) {
            $('#' + item).modal({backdrop: 'static', keyboard: false});
            $("#" + item).modal("show");
        };

        aspiranteGrado.onOcultarModal = function (item) {
            $("#" + item).hide();
//            $("body").removeClass("modal-open");
//            $("div").removeClass("modal-backdrop fade in");
        };


        aspiranteGrado.ModalUsuario = function (item) {
            consultarLiquidaciones(item);
            aspiranteGrado.nombreModal = item.estudiante;
            $('#myModal').modal({backdrop: 'static', keyboard: false});
            $("#myModal").modal("show");
        };

        function consultarLiquidaciones(item) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            historialLiquidacionServices.buscarHIstorialEstudianteByCodigo(item.identificacion).then(function (data) {
                if (data.objectResponse === null || data.objectResponse === undefined || data.objectResponse.length === 0) {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    aspiranteGrado.liquidacionEstudiante = [];
                    aspiranteGrado.liquidacionEstudianteAuxiliar = [];
                    appConstant.CERRAR_SWAL();
                    return;
                } else {
                    aspiranteGrado.liquidacionEstudiante = [];
                    aspiranteGrado.liquidacionEstudianteAuxiliar = [];
                    angular.forEach(data.objectResponse, function (value, key) {
                        var liquidacion = {
                            id: value.id,
                            referencia: value.referencia,
                            liquidacionConceptoDetalleDTO: value.liquidacionConceptoDetalleDTO,
                            nombrePrograma: value.nombrePrograma,
                            concepto: value.nombreConcepto + " " + (value.liquidacionConceptoDetalleDTO[0].modulo === null ? "" : value.liquidacionConceptoDetalleDTO[0].modulo),
                            nombrePeriodo: value.nombrePeriodo,
                            valorLiquidado: value.valorLiquidado,
                            saldoPendiente: value.saldoPendiente,
                            saldoAbonado: value.saldoAbonado
                        };
                        liquidacion.referenciaNumero = parseInt(liquidacion.referencia.replace("MAT-", "").replace("MTS-", ""));
                        aspiranteGrado.liquidacionEstudianteAuxiliar.push(liquidacion);
                    });

                    angular.forEach(aspiranteGrado.liquidacionEstudianteAuxiliar, function (liquidacion, key) {
                        if (liquidacion.estadoLiquidacion === 'ABIERTA') {
                            aspiranteGrado.liquidacionEstudiante.push(liquidacion);
                        }
                    });
                    appConstant.CERRAR_SWAL();
                    if (aspiranteGrado.liquidacionEstudiante.length === 0) {
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.ESTUDIANTE_NO_SOLICITUDES);
                        appConstant.CERRAR_SWAL();

                        return;
                    }
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }

        aspiranteGrado.onConsultarNotas = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            pazSalvoAcademicoService.consultarNotas(
                    aspiranteGrado.idPeriodo.id,
                    aspiranteGrado.datosConsultar.identificacion,
                    aspiranteGrado.datosConsultar.idPrograma).then(function (data) {
                appConstant.CERRAR_SWAL();
                aspiranteGrado.listaNotas = data;
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });
        };

        aspiranteGrado.ModalUsuarioNotas = function (item) {
            aspiranteGrado.datosConsultar = [];
            aspiranteGrado.datosConsultar = item;
            aspiranteGrado.nombreModal = item.estudiante;
            aspiranteGrado.onConsultarNotas();
            $('#myModal2').modal({backdrop: 'static', keyboard: false});
            $("#myModal2").modal("show");
        };

        aspiranteGrado.ModalGraduar = function (item) {
            consultarLiquidaciones(item);
            aspiranteGrado.datosGraduar = item;
            $('#myModal3').modal({backdrop: 'static', keyboard: false});
            $("#myModal3").modal("show");
        };

        aspiranteGrado.onGraduar = function () {
            $("#myModal3").modal("hide");

            if (aspiranteGrado.liquidacionEstudiante.length > 0) {
                appConstant.MSG_GROWL_ADVERTENCIA("Estudiante Presenta Liquidaciones por Pagar");
                appConstant.CERRAR_SWAL();
                return;
            }

            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();

            var json = {};
            json.idEstudiante = aspiranteGrado.datosGraduar.id;
            json.idPeriodo = aspiranteGrado.idPeriodoTemporal.id;
            json.resolucion = aspiranteGrado.datosGraduar.resolucion;
            json.nombreEstudiante = aspiranteGrado.datosGraduar.estudiante;
            json.pkUsuario = localStorageService.get('usuario').id;
            json.userName = localStorageService.get('usuario').username;
            json.consecutivo = 0;

            aspiranteGraduados.onGuardarGraduado(json).then(function (data) {
                appConstant.CERRAR_SWAL();
                switch (data.tipo) {
                    case 200:
                        appConstant.MSG_GROWL_OK(data.message);
                        appConstant.CERRAR_SWAL();
                        aspiranteGrado.onConsultarEstudiantesAspirante();
                        break;
                    case 409:
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        appConstant.CERRAR_SWAL();
                        break;
                }
            });
        };

        function buscarPeriodos() {
            aspiranteGrado.listadoPeriodos = [];
            asistenciaServices.getPeriodosAcademicosAll().then(function (data) {
                angular.forEach(data, function (value, key) {
                    var periodo = {
                        id: value.id,
                        nombre: value.nombrePeriodoAcademico,
                        idEstadoPeriodo: value.idEstadoPeriodo
                    };
                    aspiranteGrado.listadoPeriodos.push(periodo);
                    if (periodo.idEstadoPeriodo === 11) {
                        aspiranteGrado.idPeriodoTemporal = periodo;
                    }
                });
                aspiranteGrado.idPeriodo = aspiranteGrado.listadoPeriodos[0];
            });
        }

        buscarPeriodos();
        aspiranteGrado.onConsultarEstudiantesAspirante();
    }
})();