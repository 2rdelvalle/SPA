'use strict';
angular.module('mytodoApp').controller('reportesCtrl', ['localStorageService', 'reportesServices', 'appConstant', 'asistenciaServices', 'appGenericConstant', '$filter',
    function (localStorageService, reportesServices, appConstant, asistenciaServices, appGenericConstant, $filter) {
        var reportes = this;
        reportes.listadoPeriodos = [];
        reportes.listaEstudiantesMatricula = [];
        reportes.listaEstudiantesMatriculaAbono = [];

        if (localStorageService.get("usuario") !== null) {
            reportes.user = localStorageService.get("usuario");
        }

        reportes.fechaBusqueda = $filter('date')(new Date().getTime(), 'dd/MM/yyyy');
        reportes.fechaBusqueda2 = $filter('date')(new Date().getTime(), 'dd/MM/yyyy');

        reportes.onChangePeriodoAcademico = function () {

            if (reportes.fechaBusqueda === "" || reportes.fechaBusqueda === null || reportes.fechaBusqueda === undefined) {
                reportes.fechaBusqueda = $filter('date')(new Date().getTime(), 'dd/MM/yyyy');
                reportes.fechaBusqueda2 = $filter('date')(new Date().getTime(), 'dd/MM/yyyy');
            }

            var fechaLong1 = appConstant.TO_DATE_LONG(reportes.fechaBusqueda);
            var fechaLong2 = appConstant.TO_DATE_LONG(reportes.fechaBusqueda2);

            reportes.onConsultarListadoEstudiantesMatricula();
//            reportes.onConsultarListadoEstudiantesMatriculaAbono();
            reportes.onConsultarListadoEstudiantesMatriculaAbono20(20, fechaLong1, fechaLong2);
            reportes.onConsultarListadoEstudiantesMatriculaAbono21(21, fechaLong1, fechaLong2);
            reportes.onConsultarListadoEstudiantesMatriculaAbono66(66, fechaLong1, fechaLong2);
            reportes.onGetConsultarTotalConceptos(fechaLong1, fechaLong2);
            reportes.onConsultarEstudiantesPorConcepto(fechaLong1, fechaLong2);
            reportes.onConsultarEstudianteReferenciaEspecifica(fechaLong1, fechaLong2);
            reportes.onConsultarEstudianteReferenciaSumaDeudaAbono(fechaLong1, fechaLong2);
//            reportes.onConsultarMovimientosInterfaz(fechaLong1, fechaLong2);
            onConsultarCarteraCastigada(fechaLong1, fechaLong2);
        };

        reportes.onChangeFechas = function () {

            if (reportes.fechaBusqueda === "" || reportes.fechaBusqueda === null || reportes.fechaBusqueda === undefined) {
                reportes.fechaBusqueda = $filter('date')(new Date().getTime(), 'dd/MM/yyyy');
                reportes.fechaBusqueda2 = $filter('date')(new Date().getTime(), 'dd/MM/yyyy');
            }

            var fechaLong1 = appConstant.TO_DATE_LONG(reportes.fechaBusqueda);
            var fechaLong2 = appConstant.TO_DATE_LONG(reportes.fechaBusqueda2);

            reportes.onConsultarEstudianteAdmitidosSinPeriodo(fechaLong1, fechaLong2);
            reportes.onConsultarEstudianteReferenciaPagoSinPeriodo(fechaLong1, fechaLong2);
            reportes.onConsultarProgramaConcepto(fechaLong1, fechaLong2);
            reportes.onConsultarListadoDePagosSinPeriodo(fechaLong1, fechaLong2);
//            reportes.onConsultarListadoLiquidaciones(fechaLong1, fechaLong2);
            reportes.onConsultarMovimientosInterfaz(fechaLong1, fechaLong2);
            onConsultarCarteraCastigada(fechaLong1, fechaLong2);
        };

        reportes.onChangeFechasCorte = function () {
            var fechaLong1 = appConstant.TO_DATE_LONG(reportes.fechaBusqueda);
            var fechaLong2 = appConstant.TO_DATE_LONG(reportes.fechaBusqueda2);
            onConusltarCorte(fechaLong1, fechaLong2);
        };


        $('#fechaCampanha.input-daterange').datepicker({
            format: "dd/mm/yyyy",
            language: "es",
            autoclose: true,
            clearBtn: true,
            beforeShowYear: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            },
            beforeShowMonth: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            },
            beforeShowDay: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            }
        });

        reportes.onConsultarListadoEstudiantesMatricula = function () {
            reportes.listaEstudiantesMatricula = [];
            reportesServices.onGetConsultarListadoEstudiantesMatricula(reportes.idPeriodo.id).then(function (data) {
                reportes.listaEstudiantesMatricula = data;
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        reportes.onConsultarListadoEstudiantesMatriculaAbono = function () {
            reportes.listaEstudiantesMatriculaAbono = [];
            reportesServices.onGetConsultarListadoEstudiantesMatriculaAbono(reportes.idPeriodo.id).then(function (data) {
                reportes.listaEstudiantesMatriculaAbono = data;
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        reportes.onConsultarListadoEstudiantesMatriculaAbono20 = function (idModalidad, fechaLong1, fechaLong2) {
            reportes.lista20 = [];
            reportesServices.onGetConsultarCantidadLiquidacionesModulo(reportes.idPeriodo.id, idModalidad, fechaLong1, fechaLong2).then(function (data) {
                reportes.lista20 = data;
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        reportes.onConsultarListadoEstudiantesMatriculaAbono21 = function (idModalidad, fechaLong1, fechaLong2) {
            reportes.lista21 = [];
            reportesServices.onGetConsultarCantidadLiquidacionesModulo(reportes.idPeriodo.id, idModalidad, fechaLong1, fechaLong2).then(function (data) {
                reportes.lista21 = data;
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        reportes.onConsultarListadoEstudiantesMatriculaAbono66 = function (idModalidad, fechaLong1, fechaLong2) {
            reportes.lista66 = [];
            reportesServices.onGetConsultarCantidadLiquidacionesModulo(reportes.idPeriodo.id, idModalidad, fechaLong1, fechaLong2).then(function (data) {
                reportes.lista66 = data;
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        reportes.onGetConsultarTotalConceptos = function (fechaLong1, fechaLong2) {
            reportes.listaConceptos = [];
            reportesServices.onGetConsultarTotalConceptos(reportes.idPeriodo.id, fechaLong1, fechaLong2).then(function (data) {
                reportes.listaConceptos = data;
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        reportes.onConsultarEstudiantesPorConcepto = function (fechaLong1, fechaLong2) {
            reportes.listaEstudiantesConcepto = [];
            reportesServices.onConsultarEstudiantesPorConcepto(reportes.idPeriodo.id, fechaLong1, fechaLong2).then(function (data) {
                reportes.listaEstudiantesConcepto = data;
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        reportes.onConsultarEstudianteReferenciaEspecifica = function (fechaLong1, fechaLong2) {
            reportes.listaEstudianteReferencia = [];
            reportesServices.onConsultarEstudianteReferenciaEspecifica(reportes.idPeriodo.id, fechaLong1, fechaLong2).then(function (data) {
                reportes.listaEstudianteReferencia = data;
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        reportes.onConsultarEstudianteReferenciaSumaDeudaAbono = function (fechaLong1, fechaLong2) {
            reportes.listaReferenciaDeudaAbono = [];
            reportesServices.onConsultarEstudianteReferenciaSumaDeudaAbono(reportes.idPeriodo.id, fechaLong1, fechaLong2).then(function (data) {
                reportes.listaReferenciaDeudaAbono = data;
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        reportes.onConsultarEstudianteAdmitidosSinPeriodo = function (fechaLong1, fechaLong2) {
            reportes.listaEstudiantesAdmitidosSinPeriodo = [];
            reportesServices.onConsultarEstudianteAdmitidosSinPeriodo(0, fechaLong1, fechaLong2).then(function (data) {
                reportes.listaEstudiantesAdmitidosSinPeriodo = data;
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };
        reportes.onConsultarEstudianteReferenciaPagoSinPeriodo = function (fechaLong1, fechaLong2) {
            reportes.listaEStudiantesReferenciaPagoSinPeriodo = [];
            reportesServices.onConsultarEstudianteReferenciaPagoSinPeriodo(0, fechaLong1, fechaLong2).then(function (data) {
                reportes.listaEStudiantesReferenciaPagoSinPeriodo = data;
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };
        reportes.onConsultarProgramaConcepto = function (fechaLong1, fechaLong2) {
            reportes.listProgramaConcepto = [];
            reportesServices.onConsultarProgramaConcepto(0, fechaLong1, fechaLong2).then(function (data) {
                reportes.listProgramaConcepto = data;
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        reportes.onConsultarListadoDePagosSinPeriodo = function (fechaLong1, fechaLong2) {
            reportes.listPagosSinPeriodo = [];
            reportesServices.onConsultarListadoDePagosSinPeriodo(0, fechaLong1, fechaLong2).then(function (data) {
                reportes.listPagosSinPeriodo = data;
            }).catch(function (e) {
                appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                return;
            });
        };

        reportes.getTotalPendiente = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].saldoPendiente);
            }
            return Math.round(totalNumber);
        };



        function onConsultarPeriodos() {
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

        function onConsultarListadoSIET() {
            reportesServices.getListadoSIET().then(function (data) {
                reportes.listaSIET = data;
            });
        }

        reportes.listEstudiantesMayoriaEdad = [];
        function onConsultarListadoEstudiantesMayor() {
            reportesServices.getListadoEstudiantesMayor().then(function (data) {
                reportes.listEstudiantesMayoriaEdad = [];
                reportes.listEstudiantesMayoriaEdad = data;
            });
        }

        reportes.onConsultarMovimientosInterfaz = function (fechaLong1, fechaLong2) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            reportesServices.onConsultarMovimientosInterfaz(fechaLong1, fechaLong2).then(function (data) {
                reportes.listFormatoInterfaz = data;
                appConstant.CERRAR_SWAL();
            });
        };

        reportes.listFormatoInterfazTerceros = [];
        function onConsultarTercerosInterfaz() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            reportes.listFormatoInterfazTerceros = [];

            if (reportes.fechaBusqueda === "" || reportes.fechaBusqueda === null || reportes.fechaBusqueda === undefined) {
                reportes.fechaBusqueda = $filter('date')(new Date().getTime(), 'dd/MM/yyyy');
                reportes.fechaBusqueda2 = $filter('date')(new Date().getTime(), 'dd/MM/yyyy');
            }

            var fechaLong1 = appConstant.TO_DATE_LONG(reportes.fechaBusqueda);
            var fechaLong2 = appConstant.TO_DATE_LONG(reportes.fechaBusqueda2);

            reportesServices.onConsultarTercerosInterfaz(fechaLong1, fechaLong2).then(function (data) {
                reportes.listFormatoInterfazTerceros = data;
                appConstant.CERRAR_SWAL();
            });
        }

        function onConsultarCarteraCastigada(fechaLong1, fechaLong2) {
            reportesServices.onConsultarListadoCastigada(fechaLong1, fechaLong2).then(function (data) {
                reportes.listCarteraCastigada = data;
            });
        }
        function onConusltarCorte(fechaLong1, fechaLong2) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            reportesServices.onConsultarCorteLiquidaciones(fechaLong1, fechaLong2).then(function (data) {
                reportes.listadoCorte = data;
                appConstant.CERRAR_SWAL();
            });
        }

        reportes.onMarcarEstudiantesInterfaz = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            angular.forEach(reportes.listFormatoInterfazTerceros, function (value, key) {
                reportesServices.onMarcarEstudiantesInterfaz(value.idAspirante).then(function (data) {


                }).catch(function (e) {
                    appConstant.MSG_ERROR(appGenericConstant.ERROR_INTERNO_SISTEMA, 'error');
                    appConstant.CERRAR_SWAL();
                    return;
                });
            });

            $("#exportTerceros").trigger("click");
            appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
            onConsultarTercerosInterfaz();
            appConstant.CERRAR_SWAL();
            //onclick
        };

        onConsultarPeriodos();
        onConsultarListadoSIET();
        onConsultarListadoEstudiantesMayor();
        onConsultarTercerosInterfaz();

    }]);


