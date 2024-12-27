(function () {
    'use strict';
    angular.module('mytodoApp').controller('conceptoValorCtrl', conceptoValorCtrl);

    conceptoValorCtrl.$inject = ['$scope', '$location', 'conceptoValorEntitiesService', 'growl', 'ValidationService', 'localStorageService', 'utilServices', '$filter', 'appConstant', 'appGenericConstant'];
    function conceptoValorCtrl($scope, $location, conceptoValorEntitiesService, growl, ValidationService, localStorageService, utilServices, $filter, appConstant, appGenericConstant) {
        var conceptoValorControl = this;
        conceptoValorControl.conceptoValorEntity = conceptoValorEntitiesService.conceptoValor;
        conceptoValorControl.conceptoValorVisor = conceptoValorEntitiesService.conceptoValorAux;
        conceptoValorControl.listaConceptoValor = [];
        conceptoValorControl.conceptoValorEntity.listaConceptosFacturacion = [];
        conceptoValorControl.listaPeriodos = [];
        conceptoValorControl.conceptoValorVisor.campoConceptoFacturacion = false;
        conceptoValorControl.conceptoValorVisor.banner = false;
        conceptoValorControl.conceptoValorVisor.onDeshabilitarPanel = true;
        conceptoValorControl.conceptoValorVisor.onDeshabilitarCerrado = false;
        var fecha;
        var valor;
        var config = {};
        if (localStorageService.get('conceptoValor')) {
            var conceptoValor = localStorageService.get('conceptoValor');
            conceptoValorControl.conceptoValorEntity = conceptoValor;
        }

        if (localStorageService.get('status') !== null) {
            var status = localStorageService.get('status');
            conceptoValorControl.conceptoValorVisor = status;
        }

        conceptoValorControl.options = appConstant.FILTRO_TABLAS;

        conceptoValorControl.selectedOption = conceptoValorControl.options[0];

        conceptoValorControl.report = {
            selected: null
        };

        onConsultarConceptosFacturacion();
        conceptoValorControl.onBlurValorMinimo = function () {
            if (conceptoValorControl.conceptoValorEntity.descuentoConceptoValor === 0) {
                conceptoValorControl.conceptoValorEntity.descuentoConceptoValor = 1;
            }
        };

        function onConsultarPeriodosAcademicos() {
            conceptoValorEntitiesService.buscarPeriodos().then(function (data) {
                conceptoValorControl.listaPeriodos = data;
            });
        }

        function onConsultarConceptosFacturacion() {
            conceptoValorEntitiesService.buscarConceptosFacturacion().then(function (data) {
                conceptoValorControl.conceptoValorEntity.listaConceptosFacturacion = data;
                if (conceptoValorControl.conceptoValorEntity.listaConceptosFacturacion.length === 0) {
                    conceptoValorControl.conceptoValorVisor.banner = true;
                } else {
                    conceptoValorControl.conceptoValorVisor.banner = false;
                }
            });
        }

        conceptoValorControl.onConsultarConceptoValorConf = function (item) {
            if (item.nombreEstadoPeriodo === "Cerrado") {

                conceptoValorControl.conceptoValorVisor.onDeshabilitarCerrado = true;
            } else {
                conceptoValorControl.conceptoValorVisor.onDeshabilitarCerrado = false;
            }
            conceptoValorControl.datapiker();
            if (item !== null) {
                conceptoValorEntitiesService.buscarConceptoValorConf(conceptoValorControl.conceptoValorEntity.idConceptoFacturacion, item.id).then(function (data) {
                    if (data.length !== 0) {
                        angular.forEach(data, function (value, key) {

                            conceptoValorControl.conceptoValorVisor.onDeshabilitarPanel = false;
                            conceptoValorControl.conceptoValorEntity.id = value.id;
                            conceptoValorControl.conceptoValorEntity.tipoConceptoFacturacion = value.clase;
                            conceptoValorControl.conceptoValorEntity.valorConceptoValor = value.valor;
                            conceptoValorControl.conceptoValorEntity.fechaInicio = $filter('date')(value.fechaInicio, 'dd/MM/yyyy');
                            conceptoValorControl.conceptoValorEntity.fechaFin = $filter('date')(value.fechaFin, 'dd/MM/yyyy');
                        });
                    } else {
                        vacio();
                        conceptoValorControl.conceptoValorVisor.onDeshabilitarPanel = false;
                    }
                });
            } else {
                vacio();
                conceptoValorControl.conceptoValorVisor.onDeshabilitarPanel = true;
            }
        };

        function vacio() {
            conceptoValorControl.conceptoValorEntity.valorConceptoValor = null;
            conceptoValorControl.conceptoValorEntity.fechaInicio = null;
            conceptoValorControl.conceptoValorEntity.fechaFin = null;
            conceptoValorControl.conceptoValorEntity.id = null;


        }
        function onConsultarConceptoValor() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            conceptoValorEntitiesService.buscarConceptoValor().then(function (data) {
                angular.forEach(data, function (value, key) {
                    if (value.clase === "INGRESO") {
                        var conceptoValor = {
                            id: value.id,
                            codigo: value.codigo,
                            nombreConcepto: value.nombre,
                            clase: value.clase,
                            estado: value.estado
                        };
                        conceptoValorControl.listaConceptoValor.push(conceptoValor);
                    }
                });
                appConstant.CERRAR_SWAL();
            });
        }
        ;

        conceptoValorControl.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formAgregarConceptoValor)) {
                conceptoValorControl.onNewRegistryConceptoValor();
                new ValidationService().resetForm($scope.formAgregarConceptoValor);
            }
        };

        conceptoValorControl.onLimpiarRegistro = function () {
            conceptoValorControl.conceptoValorEntity.id = null;
            conceptoValorControl.conceptoValorVisor.onDeshabilitar = false;
            conceptoValorControl.conceptoValorVisor.onDeshabilitarActualizar = false;
            conceptoValorControl.conceptoValorVisor.titulo = appGenericConstant.CONFIGURAR_CONCEPTO_VALOR;
            conceptoValorControl.conceptoValorEntity.conceptoFacturacion = null;
            conceptoValorControl.conceptoValorEntity.periodo = null;
            conceptoValorControl.conceptoValorEntity.valorConceptoValor = null;
            conceptoValorControl.conceptoValorEntity.fechaInicio = null;
            conceptoValorControl.conceptoValorEntity.fechaFin = null;
//            conceptoValorControl.conceptoValorVisor.campoConceptoFacturacion = true;
            conceptoValorControl.conceptoValorVisor.onDeshabilitarPanel = true;

            localStorageService.remove('conceptoValor');
            localStorageService.remove('status');
            onConsultarConceptosFacturacion();
            localStorageService.set('status', conceptoValorControl.conceptoValorVisor);
        };
        if ($location.path() === "/concepto-valor") {
            conceptoValorControl.conceptoValorEntity.id = null;
            conceptoValorControl.conceptoValorVisor.onDeshabilitar = false;
            conceptoValorControl.conceptoValorVisor.onDeshabilitarActualizar = false;
            conceptoValorControl.conceptoValorVisor.titulo = appGenericConstant.CONFIGURAR_CONCEPTO_VALOR;
            conceptoValorControl.conceptoValorEntity.conceptoFacturacion = null;
            conceptoValorControl.conceptoValorEntity.periodo = null;
            conceptoValorControl.conceptoValorEntity.valorConceptoValor = null;
            conceptoValorControl.conceptoValorEntity.fechaInicio = null;
            conceptoValorControl.conceptoValorEntity.fechaFin = null;
//            conceptoValorControl.conceptoValorVisor.campoConceptoFacturacion = true;
            conceptoValorControl.conceptoValorVisor.onDeshabilitarPanel = true;

            localStorageService.remove('conceptoValor');
            localStorageService.remove('status');
            onConsultarConceptosFacturacion();
            localStorageService.set('status', conceptoValorControl.conceptoValorVisor);
        }

        conceptoValorControl.onNewRegistryConceptoValor = function () {
            var newConceptoValor =
                    {
                        id: conceptoValorControl.conceptoValorEntity.id,
                        idConceptoFacturacion: conceptoValorControl.conceptoValorEntity.idConceptoFacturacion,
                        idPeriodo: conceptoValorControl.conceptoValorEntity.periodo.id,
                        valor: conceptoValorControl.conceptoValorEntity.valorConceptoValor,
                        fechaInicio: toDate(conceptoValorControl.conceptoValorEntity.fechaInicio),
                        fechaFin: toDate(conceptoValorControl.conceptoValorEntity.fechaFin)
                    };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();

            conceptoValorEntitiesService.agregarConceptoValor(newConceptoValor).then(function (response) {
                switch (response.tipo) {
                    case 200:
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_OK(response.message);
//                        onConsultarConceptosFacturacion();
//                        if (conceptoValorControl.conceptoValorEntity.listaConceptosFacturacion.length === 0) {
//                            $location.path('/concepto-valor');
//                        }
                        break;
                    default:
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                        break;

                }
                conceptoValorControl.onLimpiarRegistro();
            });
        };

        conceptoValorControl.onClickToView = function (item) {
            conceptoValorControl.conceptoValorVisor.campoConceptoFacturacion = true;
            conceptoValorControl.conceptoValorVisor.titulo = appGenericConstant.DETALLES_CONCEPTO_VALOR;
            conceptoValorControl.conceptoValorVisor.onDeshabilitar = true;
//            conceptoValorControl.conceptoValorVisor.onDeshabilitarActualizar = false;
//            conceptoValorControl.conceptoValorEntity.id = item.id;
            conceptoValorControl.conceptoValorEntity.idConceptoFacturacion = item.id;
            conceptoValorControl.conceptoValorEntity.conceptoFacturacionVer = item.codigo + ' - ' + item.nombreConcepto;
            conceptoValorControl.conceptoValorEntity.tipoConceptoFacturacion = item.clase;
//            conceptoValorControl.conceptoValorEntity.periodo = item.idPeriodo;
//            conceptoValorControl.conceptoValorEntity.valorConceptoValor = item.valor;
//            conceptoValorControl.conceptoValorEntity.fechaInicio = item.fechaInicio;
//            conceptoValorControl.conceptoValorEntity.fechaFin = item.fechaFin;
            localStorageService.set('conceptoValor', conceptoValorControl.conceptoValorEntity);
            localStorageService.set('status', conceptoValorControl.conceptoValorVisor);
            $location.path('/concepto-valor-gestion');
        };

        conceptoValorControl.onClickToEditar = function (item) {
            conceptoValorControl.conceptoValorVisor.campoConceptoFacturacion = true;
            conceptoValorControl.conceptoValorVisor.titulo = appGenericConstant.DETALLES_CONCEPTO_VALOR;
//            conceptoValorControl.conceptoValorVisor.onDeshabilitar = true;
//            conceptoValorControl.conceptoValorVisor.onDeshabilitarActualizar = false;
//            conceptoValorControl.conceptoValorEntity.id = item.id;
            conceptoValorControl.conceptoValorEntity.idConceptoFacturacion = item.id;
            conceptoValorControl.conceptoValorEntity.conceptoFacturacionVer = item.codigo + ' - ' + item.nombreConcepto;
            conceptoValorControl.conceptoValorEntity.tipoConceptoFacturacion = item.clase;
//            conceptoValorControl.conceptoValorEntity.periodo = item.idPeriodo;
//            conceptoValorControl.conceptoValorEntity.valorConceptoValor = item.valor;
//            conceptoValorControl.conceptoValorEntity.fechaInicio = item.fechaInicio;
//            conceptoValorControl.conceptoValorEntity.fechaFin = item.fechaFin;
            localStorageService.set('conceptoValor', conceptoValorControl.conceptoValorEntity);
            localStorageService.set('status', conceptoValorControl.conceptoValorVisor);
            $location.path('/concepto-valor-gestion');
        };

        onConsultarConceptoValor();
        onConsultarPeriodosAcademicos();

        function formattedDate(date) {
            var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            return [day, month, year].join('/');
        }

        function toDate(dateStr) {
            var dateStrLong;
            if (typeof dateStr === 'undefined' || typeof dateStr === null) {
                dateStr = null;
                return dateStr;
            } else {
                var parts = [];
                if (dateStr.match('/')) {
                    parts = dateStr.split('/');
                } else {
                    parts = dateStr.split('-');
                }
                dateStr = new Date(parts[2], parts[1] - 1, parts[0]);
                dateStrLong = Date.parse(dateStr);
                return dateStrLong;
            }
        }
        conceptoValorControl.datapiker = function () {
            $('#fechaConceptoValor.input-daterange').datepicker({
                format: 'dd/mm/yyyy',
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
        };
        conceptoValorControl.onFocus = function (idCampo) {
            fecha = $(idCampo).val();
        };

        conceptoValorControl.onBlur = function (idCampo) {
            $(idCampo).val(fecha);
        };
        conceptoValorControl.buscarConfigPeriodo = function (item) {
            if (item === null) {
                conceptoValorControl.confiProgramaAuxiliar.onDeshabilitarPanel = false;
            } else {
                conceptoValorEntitiesService.buscarConfiguracion(conceptoValorControl.conceptoValorEntity.conceptoFacturacion, item.id).then(function (info) {

                    if (info.objectResponse !== null) {
                        ;
                        if (info.objectResponse.listaConfigTipoCobro === null) {

                        } else {
                            conceptoValorControl.confiProgramaAuxiliar.hideTabla = true;
                            for (var i = 0; i < conceptoValorControl.listaTipoCobro.length; i++) {
                                if (conceptoValorControl.listaTipoCobro[i].codigo === conceptoValorControl.confiPrograma.TipoCobro) {
                                    conceptoValorControl.confiPrograma.nombreTipoCobro = conceptoValorControl.listaTipoCobro[i].valor;
                                    break;
                                }
                            }
                            angular.forEach(info.objectResponse.listaConfigTipoCobro, function (value, key) {
                                if (value.valorMatricula === null && value.valorSemestre === null) {
                                    value.valorMatricula = 0;
                                    value.valorSemestre = 0;
                                } else {
                                    if (value.valorMatricula === null) {
                                        value.valorMatricula = 0;
                                    } else {
                                        if (value.valorSemestre === null) {
                                            value.valorSemestre = 0;
                                        } else {
                                            conceptoValorControl.confiPrograma.listaConfigTipoCobro = info.objectResponse.listaConfigTipoCobro;
                                            conceptoValorControl.confiPrograma.hayDatos = true;
                                        }
                                    }
                                }
                            });
                        }
                    } else {
                        conceptoValorControl.confiPrograma.idConfigPrograma = null;
                        conceptoValorControl.confiPrograma.TipoCobro = null;
                        conceptoValorControl.confiPrograma.id = null;
                        conceptoValorControl.confiPrograma.maximoCredito = null;
                        conceptoValorControl.confiPrograma.supletorio = null;
                        conceptoValorControl.confiPrograma.maximoCreditoAdicional = null;
                        conceptoValorControl.confiPrograma.valorCreditoAdicional = null;
                        conceptoValorControl.confiPrograma.listaConfigTipoCobro = null;
                        conceptoValorControl.confiProgramaAuxiliar.hideTabla = false;
                    }
                    if (item.idEstadoPeriodo === 13) {
                        conceptoValorControl.confiProgramaAuxiliar.periodoCerrado = true;
                    } else {
                        conceptoValorControl.confiProgramaAuxiliar.periodoCerrado = false;
                    }
                    conceptoValorControl.confiProgramaAuxiliar.onDeshabilitarPanel = true;
                    localStorageService.set('confiprogramasAcademicos', conceptoValorControl.confiPrograma);
                    localStorageService.set('confiprogramasAcademicosAuxiliar', conceptoValorControl.confiProgramaAuxiliar);
                });

            }
        };
    }
})();


