(function () {
    'use strict';
    angular.module('mytodoApp').controller('confiProgramaAcademicoCtrl', confiProgramaAcademicoCtrl);
    confiProgramaAcademicoCtrl.$inject = ['$scope', 'confiProgramaServices', '$location', 'growl', 'ValidationService', 'localStorageService', 'utilServices', 'appConstant', '$interval', 'appGenericConstant'];
    function confiProgramaAcademicoCtrl($scope, confiProgramaServices, $location, growl, ValidationService, localStorageService, utilServices, appConstant, $interval, appGenericConstant) {

        var gestionConfiPrograma = this;
        gestionConfiPrograma.camposMatHabilitados = [];
        gestionConfiPrograma.camposSemHabilitados = [];
        gestionConfiPrograma.botonesHabilitados = [];
        var valSem, valMat;
        gestionConfiPrograma.Programas = [];
        gestionConfiPrograma.confiPrograma = confiProgramaServices.confiPrograma;
        gestionConfiPrograma.confiProgramaAuxiliar = confiProgramaServices.confiProgramaAuxiliar;
        gestionConfiPrograma.config = { globalTimeToLive: 3000, disableCountDown: true };
        gestionConfiPrograma.confiProgramaAuxiliar.hideTabla = true;
        gestionConfiPrograma.counter = appGenericConstant.CERO;
        gestionConfiPrograma.options = appConstant.FILTRO_TABLAS;
        gestionConfiPrograma.report = { selected: null };
        gestionConfiPrograma.selectedOption = gestionConfiPrograma.options[0];
        function onBuscarPrograma() {
            gestionConfiPrograma.counter = appGenericConstant.CERO;
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            confiProgramaServices.buscarPrograma().then(function (data) {
                angular.forEach(data, function (value, key) {
                    if (value.estado === 'ACTIVO') {
                        gestionConfiPrograma.Programas.push(value);
                    }
                });
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }

        if (localStorageService.get('confiprogramasAcademicos') !== null) {
            gestionConfiPrograma.confiPrograma = localStorageService.get('confiprogramasAcademicos');
        }

        if (localStorageService.get('confiprogramasAcademicosAuxiliar') !== null) {
            gestionConfiPrograma.confiProgramaAuxiliar = localStorageService.get('confiprogramasAcademicosAuxiliar');

        }
        function onConsulTipoCobro() {
            utilServices.buscarListaValorByCategoria('TIPO_COBRO', 'financiero').then(function (data) {
                gestionConfiPrograma.listaTipoCobro = data;
            });
        }
        gestionConfiPrograma.onLimpiarRegistro = function () {
            localStorageService.remove('confiprogramasAcademicos');
            localStorageService.remove('confiprogramasAcademicosAuxiliar');
        };
        gestionConfiPrograma.onClickToView = function (programa) {
            confiProgramaServices.buscarProgramaByid(programa.idPrograma).then(function (item) {
                gestionConfiPrograma.confiProgramaAuxiliar.titulo = appGenericConstant.CONFIGURACION_TIPO_COBRO;
                gestionConfiPrograma.confiProgramaAuxiliar.onDeshabilitar = true;
                gestionConfiPrograma.confiProgramaAuxiliar.onDeshabilitarPanel = false;
                gestionConfiPrograma.confiProgramaAuxiliar.onDeshabilitarCodigos = true;
                gestionConfiPrograma.confiProgramaAuxiliar.onDeshabilitarCampoEstado = false;
                gestionConfiPrograma.confiPrograma.id = gestionConfiPrograma.confiPrograma.idPrograma = item.idPrograma;
                gestionConfiPrograma.confiPrograma.codigo = item.codigoPrograma;
                gestionConfiPrograma.confiPrograma.nombrePrograma = item.nombrePrograma;
                gestionConfiPrograma.confiPrograma.jornadas = gestionConfiPrograma.jornadas;
                gestionConfiPrograma.confiPrograma.duracion = item.duracion;
                gestionConfiPrograma.confiPrograma.listaPeriodos = item.listaPeriodos;
                gestionConfiPrograma.confiPrograma.idPeriodo = null;
                $location.path('/gestion-configurar-programa');
            });
        };

        gestionConfiPrograma.onConfiguracionPrograma = function (programa) {
            confiProgramaServices.buscarProgramaByid(programa.idPrograma).then(function (item) {
                gestionConfiPrograma.confiProgramaAuxiliar.titulo = appGenericConstant.CONFIGURACION_TIPO_COBRO;
                gestionConfiPrograma.confiProgramaAuxiliar.onDeshabilitar = false;
                gestionConfiPrograma.confiProgramaAuxiliar.onDeshabilitarPanel = false;
                gestionConfiPrograma.confiProgramaAuxiliar.onDeshabilitarCodigos = true;
                gestionConfiPrograma.confiProgramaAuxiliar.onDeshabilitarCampoEstado = false;
                gestionConfiPrograma.confiPrograma.id = gestionConfiPrograma.confiPrograma.idPrograma = item.idPrograma;
                gestionConfiPrograma.confiPrograma.codigo = item.codigoPrograma;
                gestionConfiPrograma.confiPrograma.nombrePrograma = item.nombrePrograma;
                gestionConfiPrograma.confiPrograma.jornadas = gestionConfiPrograma.jornadas;
                gestionConfiPrograma.confiPrograma.duracion = item.duracion;
                 gestionConfiPrograma.confiPrograma.listaPeriodos = [];
                
                angular.forEach(item.listaPeriodos, function (value, key) {

                    if(value.idEstadoPeriodo === 11 || value.idEstadoPeriodo === 10){
                        gestionConfiPrograma.confiPrograma.listaPeriodos.push(value);
                    }

                });

                gestionConfiPrograma.confiPrograma.idPeriodo = null;
                gestionConfiPrograma.confiPrograma.idNivelFormacion = item.idNivelFormacion;
                $location.path('/gestion-configurar-programa');
            });
        };

        gestionConfiPrograma.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formConfigurarPrograma)) {
                if (gestionConfiPrograma.camposMatHabilitados.length >= 1) {
                    swal({
                        title: appGenericConstant.HAY_DATOS_SIN_CONFIRMAR,
                        text: appGenericConstant.PREG_DESEA_GUARDARLOS,
                        type: appGenericConstant.QUESTION,
                        showCancelButton: true,
                        confirmButtonText: appGenericConstant.ACEPTAR,
                        cancelButtonText: appGenericConstant.CANCELAR,
                        allowOutsideClick: false
                    }).then(function () {
                        onConfiguracionProgramasAcademicos();
                        new ValidationService().resetForm($scope.formConfigurarPrograma);
                        for (var i = 0; i < gestionConfiPrograma.camposMatHabilitados.length; i++) {
                            var inputMat = gestionConfiPrograma.camposMatHabilitados[i];
                            var inputSem = gestionConfiPrograma.camposSemHabilitados[i];
                            var botonID = gestionConfiPrograma.botonesHabilitados[i];
                            $("#" + inputMat + "").prop("disabled", true);
                            $("#" + inputSem + "").prop("disabled", true);
                            $("#btnComd" + botonID).show();
                            $("#btnCheck" + botonID).hide();
                            $("#btnCancel" + botonID).hide();
                        }
                        gestionConfiPrograma.camposMatHabilitados = [];
                        gestionConfiPrograma.camposSemHabilitados = [];
                        gestionConfiPrograma.botonesHabilitados = [];
                    }, function (dismiss) {
                        if (dismiss === appGenericConstant.CANCEL) {
                            return;
                        }
                    });
                } else {
                    onConfiguracionProgramasAcademicos();
                    new ValidationService().resetForm($scope.formConfigurarPrograma);
                }
            }
        };

        function onConfiguracionProgramasAcademicos() {
            var newConfiguracion = {
                id: gestionConfiPrograma.confiPrograma.id,
                idPrograma: gestionConfiPrograma.confiPrograma.idPrograma,
                idTipoCobro: gestionConfiPrograma.confiPrograma.TipoCobro,
                maximoCredito: parseInt(gestionConfiPrograma.confiPrograma.maximoCredito),
                valorSupletorio: parseInt(gestionConfiPrograma.confiPrograma.supletorio),
                maximoCreditoAdicional: parseInt(gestionConfiPrograma.confiPrograma.maximoCreditoAdicional),
                valorCreditoAdicional: gestionConfiPrograma.confiPrograma.valorCreditoAdicional,
                listaConfigTipoCobro: gestionConfiPrograma.confiPrograma.listaConfigTipoCobro,
                idPeridoAcademico: gestionConfiPrograma.confiPrograma.idPeriodo.id,
                idUsuario: localStorageService.get('autorizacion').objectResponse.userDto.id
            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            confiProgramaServices.RegistrarConfiguracionPrograma(newConfiguracion).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(data.message);
                    localStorageService.set('confiprogramasAcademicos', gestionConfiPrograma.confiPrograma);
                    localStorageService.set('confiprogramasAcademicosAuxiliar', gestionConfiPrograma.confiProgramaAuxiliar);
                    gestionConfiPrograma.confiPrograma.idPeriodo = 0;
                    gestionConfiPrograma.confiProgramaAuxiliar.onDeshabilitarPanel = false;
                } else if (data.tipo === 500) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                }
            });
        }

        gestionConfiPrograma.buscarConfigPeriodo = function (item) {
            if (item === null) {
                gestionConfiPrograma.confiProgramaAuxiliar.onDeshabilitarPanel = false;
            } else {
                confiProgramaServices.buscarJornadas(gestionConfiPrograma.confiPrograma.idPrograma).then(function (data) {
                    confiProgramaServices.buscarConfiguracion(gestionConfiPrograma.confiPrograma.idPrograma, item.id).then(function (info) {
                        gestionConfiPrograma.confiPrograma.listaJornada = data[0].idJornadas;
                        gestionConfiPrograma.confiPrograma.jornadas = gestionConfiPrograma.jornadas;
                        if (info.objectResponse !== null) {
                            gestionConfiPrograma.confiPrograma.idConfigPrograma = info.objectResponse.id;
                            gestionConfiPrograma.confiPrograma.TipoCobro = info.objectResponse.idTipoCobro;
                            gestionConfiPrograma.confiPrograma.id = info.objectResponse.id;
                            gestionConfiPrograma.confiPrograma.maximoCredito = info.objectResponse.maximoCredito;
                            gestionConfiPrograma.confiPrograma.supletorio = info.objectResponse.valorSupletorio;
                            gestionConfiPrograma.confiPrograma.maximoCreditoAdicional = info.objectResponse.maximoCreditoAdicional;
                            gestionConfiPrograma.confiPrograma.valorCreditoAdicional = info.objectResponse.valorCreditoAdicional;
                            gestionConfiPrograma.confiPrograma.listaConfigTipoCobroAux = info.objectResponse.listaConfigTipoCobro;
                            if (info.objectResponse.listaConfigTipoCobro === null) {
                                gestionConfiPrograma.confiPrograma.listaConfigTipoCobro = info.objectResponse.listaConfigTipoCobro;
                                gestionConfiPrograma.CreaLista(gestionConfiPrograma.confiPrograma.TipoCobro);
                            } else {
                                gestionConfiPrograma.confiProgramaAuxiliar.hideTabla = true;
                                for (var i = 0; i < gestionConfiPrograma.listaTipoCobro.length; i++) {
                                    if (gestionConfiPrograma.listaTipoCobro[i].codigo === gestionConfiPrograma.confiPrograma.TipoCobro) {
                                        gestionConfiPrograma.confiPrograma.nombreTipoCobro = gestionConfiPrograma.listaTipoCobro[i].valor;
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
                                                gestionConfiPrograma.confiPrograma.listaConfigTipoCobro = info.objectResponse.listaConfigTipoCobro;
                                                gestionConfiPrograma.confiPrograma.hayDatos = true;
                                            }
                                        }
                                    }
                                });
                            }
                        } else {
                            gestionConfiPrograma.confiPrograma.idConfigPrograma = null;
                            gestionConfiPrograma.confiPrograma.TipoCobro = null;
                            gestionConfiPrograma.confiPrograma.id = null;
                            gestionConfiPrograma.confiPrograma.maximoCredito = null;
                            gestionConfiPrograma.confiPrograma.supletorio = null;
                            gestionConfiPrograma.confiPrograma.maximoCreditoAdicional = null;
                            gestionConfiPrograma.confiPrograma.valorCreditoAdicional = null;
                            gestionConfiPrograma.confiPrograma.listaConfigTipoCobro = null;
                            gestionConfiPrograma.confiProgramaAuxiliar.hideTabla = false;
                        }
                        if (item.idEstadoPeriodo === 13) {
                            gestionConfiPrograma.confiProgramaAuxiliar.periodoCerrado = true;
                        } else {
                            gestionConfiPrograma.confiProgramaAuxiliar.periodoCerrado = false;
                        }
                        gestionConfiPrograma.confiProgramaAuxiliar.onDeshabilitarPanel = true;
                        localStorageService.set('confiprogramasAcademicos', gestionConfiPrograma.confiPrograma);
                        localStorageService.set('confiprogramasAcademicosAuxiliar', gestionConfiPrograma.confiProgramaAuxiliar);
                    });
                });
            }
        };

        gestionConfiPrograma.CreaLista = function (item) {
            if (item !== null) {
                if (typeof gestionConfiPrograma.confiPrograma.listaConfigTipoCobro === 'object' && (gestionConfiPrograma.confiPrograma.listaConfigTipoCobro === null || gestionConfiPrograma.confiPrograma.listaConfigTipoCobro.length === 0)) {
                    for (var i = 0; i < gestionConfiPrograma.listaTipoCobro.length; i++) {
                        if (gestionConfiPrograma.listaTipoCobro[i].codigo === item) {
                            gestionConfiPrograma.confiPrograma.nombreTipoCobro = gestionConfiPrograma.listaTipoCobro[i].valor;
                            break;
                        }
                    }
                    gestionConfiPrograma.confiPrograma.listaConfigTipoCobro = [];
                    for (var i = 0; i < gestionConfiPrograma.confiPrograma.duracion; i++) {
                        var listaCobro = {
                            id: null,
                            nivel: (i + 1),
                            valorMatricula: 0,
                            valorSemestre: 0,
                            idConfigPrograma: gestionConfiPrograma.confiPrograma.idConfigPrograma,
                            idTipoCobro: item
                        };
                        gestionConfiPrograma.confiPrograma.listaConfigTipoCobro.push(listaCobro);
                    }
                    gestionConfiPrograma.confiProgramaAuxiliar.hideTabla = true;
                } else {
                    angular.forEach(gestionConfiPrograma.confiPrograma.listaConfigTipoCobroAux, function (value, key) {
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
                                    gestionConfiPrograma.confiPrograma.listaConfigTipoCobro = gestionConfiPrograma.confiPrograma.listaConfigTipoCobroAux;
                                    gestionConfiPrograma.confiPrograma.hayDatos = true;
                                }
                            }
                        }
                    });
                    gestionConfiPrograma.confiProgramaAuxiliar.hideTabla = true;
                }
            } else {
                gestionConfiPrograma.confiProgramaAuxiliar.hideTabla = false;
            }
        };

        gestionConfiPrograma.mostrarCampo = function (item) {
            gestionConfiPrograma.camposMatHabilitados.push($("#inputHid" + item.nivel).attr("id"));
            gestionConfiPrograma.camposSemHabilitados.push($("#inputHid2" + item.nivel).attr("id"));
            gestionConfiPrograma.botonesHabilitados.push(item.nivel);
            $("#inputHid" + item.nivel).prop("disabled", false);
            $("#inputHid2" + item.nivel).prop("disabled", false);
            $('#inputHid' + item.nivel).focus();
            $("#btnComd" + item.nivel).hide();
            $("#btnCheck" + item.nivel).show();
            $("#btnCancel" + item.nivel).show();
            valMat = $("#inputHid" + item.nivel).val();
            valSem = $("#inputHid2" + item.nivel).val();

        };

        gestionConfiPrograma.ocultarCampo = function (item) {
            var index = gestionConfiPrograma.camposMatHabilitados.indexOf($("#inputHid" + item).attr("id"));
            var i = gestionConfiPrograma.botonesHabilitados.indexOf(item);
            gestionConfiPrograma.camposMatHabilitados.splice(index, 1);
            gestionConfiPrograma.camposSemHabilitados.splice(index, 1);
            gestionConfiPrograma.botonesHabilitados.splice(i, 1);
            valMat = $("#inputHid" + item).val();
            valSem = $("#inputHid2" + item).val();
            if (valMat === "" && valSem === "") {
                $('#inputHid' + item).focus();
                $("#inputHid" + item).css("box-shadow", "0 0 3px #CC0000");
                $("#inputHid2" + item).css("box-shadow", "0 0 3px #CC0000");
            } else {
                if (valMat === "") {
                    $('#inputHid' + item).focus();
                    $("#inputHid" + item).css("box-shadow", "0 0 3px #CC0000");
                    $("#inputHid2" + item).css("box-shadow", "inset 1px 1px 3px #f6f6f6");
                } else {
                    if (valSem === "") {
                        $('#inputHid2' + item).focus();
                        $("#inputHid" + item).css("box-shadow", "inset 1px 1px 3px #f6f6f6");
                        $("#inputHid2" + item).css("box-shadow", "0 0 3px #CC0000");
                    } else {
                        $("#inputHid" + item).val(valMat);
                        $("#inputHid2" + item).val(valSem);
                        $("#inputHid" + item).css("box-shadow", "inset 1px 1px 3px #f6f6f6");
                        $("#inputHid2" + item).css("box-shadow", "inset 1px 1px 3px #f6f6f6");
                        $("#inputHid" + item).prop("disabled", true);
                        $("#inputHid2" + item).prop("disabled", true);
                        $("#btnComd" + item).show();
                        $("#btnCheck" + item).hide();
                        $("#btnCancel" + item).hide();
                    }
                }
            }
        };

        gestionConfiPrograma.cancelarCampo = function (item) {
            var index = gestionConfiPrograma.camposMatHabilitados.indexOf($("#inputHid" + item).attr("id"));
            var i = gestionConfiPrograma.botonesHabilitados.indexOf(item);
            gestionConfiPrograma.camposMatHabilitados.splice(index, 1);
            gestionConfiPrograma.camposSemHabilitados.splice(index, 1);
            gestionConfiPrograma.botonesHabilitados.splice(i, 1);
            if ($("#inputHid" + item).val() === "") {
                $('#inputHid' + item).val(0);
            } else {
                $("#inputHid" + item).val(valMat);
            }
            if ($("#inputHid2" + item).val() === "") {
                $('#inputHid2' + item).val("$ 0");
            } else {
                $("#inputHid2" + item).val(valSem);
            }
            $("#inputHid" + item).css("box-shadow", "inset 1px 1px 3px #f6f6f6");
            $("#inputHid2" + item).css("box-shadow", "inset 1px 1px 3px #f6f6f6");
            $("#inputHid" + item).prop("disabled", true);
            $("#inputHid2" + item).prop("disabled", true);
            $("#btnComd" + item).show();
            $("#btnCheck" + item).hide();
            $("#btnCancel" + item).hide();
        };

        $(document).ready(function () {
            gestionConfiPrograma.disabledInput = false;
            gestionConfiPrograma.totalArqueoEfectivo = 0;
        });
        onConsulTipoCobro();
        onBuscarPrograma();
    }
})();
