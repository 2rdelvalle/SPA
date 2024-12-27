(function () {
    'use strict';
    angular.module('mytodoApp').controller('liquidarConceptosEstudianteCtrl', liquidarConceptosEstudianteCtrl);

    liquidarConceptosEstudianteCtrl.$inject = ['$scope', '$http', 'liquidarConceptosEstudianteService', '$window', 'growl', 'ValidationService', 'appConstant', 'appGenericConstant', 'utilServices', 'localStorageService'];

    function liquidarConceptosEstudianteCtrl($scope, $http, liquidarConceptosEstudianteService, $window, growl, ValidationService, appConstant, appGenericConstant, utilServices, localStorageService) {

        var liquidarConceptosControl = this;
        liquidarConceptosControl.nuevoLiquidarConceptos = liquidarConceptosEstudianteService.liquidarConceptos;
        liquidarConceptosControl.liquidarConceptosAux = liquidarConceptosEstudianteService.liquidarConceptosAuxiliar;
        liquidarConceptosControl.liquidarConceptosAuxiTotal = liquidarConceptosEstudianteService.liquidarConceptosAuxiTotal;
        liquidarConceptosControl.datosEstudianteSer = liquidarConceptosEstudianteService.datosEstudianteSer;
        liquidarConceptosControl.listaDetalleConceptoFacturacion = [];
        liquidarConceptosControl.nuevoLiquidarConceptos.listaConceptosAFacturar = [];
        liquidarConceptosControl.listaAbono = [];
        liquidarConceptosControl.reporteJsonData;
        liquidarConceptosControl.liquidarConceptosAux.onDeshabilitar = false;
        liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarCampo = true;
        liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarBoton = true;
        liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarBotonCancelar = true;
        var fechaLimitePago;
        var valor;
        liquidarConceptosControl.usuario = "";
        function init() {
            liquidarConceptosControl.nuevoLiquidarConceptos.codigoEstudianteCampo = null;

            if (localStorageService.get('usuario') !== null) {
                var usuario = localStorageService.get('usuario');
                liquidarConceptosControl.usuario = usuario;
            }
            liquidarConceptosControl.onConsultarEstudiante();
        }

        liquidarConceptosControl.onCampoVacio = function () {
            liquidarConceptosControl.nuevoLiquidarConceptos.id = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.idPeriodo = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.nombre = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.apellido = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.nombresCompleto = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.documentoCompleto = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.tipoDocumento = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.identificacion = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.periodoActual = null;
            liquidarConceptosControl.listaProgramas = [];
            liquidarConceptosControl.liquidarConceptosAux.onDeshabilitar = false;
            liquidarConceptosControl.nuevoLiquidarConceptos.idPrograma = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.idEstudiante = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.nivelFormacion = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.programaNombre = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.modalidad = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.horario = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.semestre = null;
            liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarBoton = true;
            liquidarConceptosControl.listaDetalleConceptoFacturacion = [];
            liquidarConceptosControl.nuevoLiquidarConceptos.listaConceptosAFacturar = [];
            if (liquidarConceptosControl.concepFacturacion !== undefined) {
                liquidarConceptosControl.concepFacturacion.conceptoAFacturar = null;
            }
            liquidarConceptosControl.liquidarConceptosAux.onDeshabilitar = false;
            liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarCampo = true;
            liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarBoton = true;
            liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarBotonCancelar = true;
        }

        function onConsultarConceptosFacturacion() {
            liquidarConceptosEstudianteService.consultarConceptosALiquidar().then(function (data) {
                liquidarConceptosControl.listaConceptosAFacturar = data;
            });
        }

        liquidarConceptosControl.options = appConstant.FILTRO_TABLAS;

        liquidarConceptosControl.selectedOption = liquidarConceptosControl.options[1];

        liquidarConceptosControl.report = {
            selected: null
        };

        liquidarConceptosControl.onLimpiar = function () {
            liquidarConceptosControl.nuevoLiquidarConceptos.id = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.idPeriodo = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.nombre = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.apellido = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.nombresCompleto = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.documentoCompleto = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.tipoDocumento = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.identificacion = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.periodoActual = null;
            liquidarConceptosControl.listaProgramas = [];
            liquidarConceptosControl.liquidarConceptosAux.onDeshabilitar = false;
            liquidarConceptosControl.nuevoLiquidarConceptos.idPrograma = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.idEstudiante = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.nivelFormacion = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.programaNombre = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.modalidad = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.horario = null;
            liquidarConceptosControl.nuevoLiquidarConceptos.semestre = null;
            liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarBoton = true;
            liquidarConceptosControl.listaDetalleConceptoFacturacion = [];
            liquidarConceptosControl.nuevoLiquidarConceptos.listaConceptosAFacturar = [];
            if (liquidarConceptosControl.concepFacturacion !== undefined) {
                liquidarConceptosControl.concepFacturacion.conceptoAFacturar = null;
            }
        };

        liquidarConceptosControl.onPresionarEnter = function (tecla) {
            if (tecla.keyCode === 13) {
                liquidarConceptosControl.onConsultarEstudiante();
            }
        };

        liquidarConceptosControl.onConsultarEstudiante = function () {
            liquidarConceptosControl.onLimpiar();
            var codEstudiante = liquidarConceptosControl.usuario.identificacion;
                appConstant.MSG_LOADING('Consultando registros con el código ' + codEstudiante + '...');
                appConstant.CARGANDO();
                liquidarConceptosEstudianteService.consultarEstudiante(codEstudiante, 'LiqConEstCont').then(function (data) {
                    switch (data.tipo) {
                        case 200:
                            appConstant.CERRAR_SWAL();
                            if (data.objectResponse.estudiantePrograma.length === 1) {
                                liquidarConceptosControl.liquidarConceptosAux.onDeshabilitar = true;
                                liquidarConceptosControl.nuevoLiquidarConceptos.id = data.objectResponse.id;
                                liquidarConceptosControl.nuevoLiquidarConceptos.nombre = data.objectResponse.nombre;
                                liquidarConceptosControl.nuevoLiquidarConceptos.apellido = data.objectResponse.apellido;
                                liquidarConceptosControl.nuevoLiquidarConceptos.nombresCompleto = data.objectResponse.nombre + " " + data.objectResponse.apellido;
                                liquidarConceptosControl.nuevoLiquidarConceptos.documentoCompleto = data.objectResponse.tipoDocumento + " " + data.objectResponse.identificacion;
                                liquidarConceptosControl.nuevoLiquidarConceptos.tipoDocumento = data.objectResponse.tipoDocumento;
                                liquidarConceptosControl.nuevoLiquidarConceptos.identificacion = data.objectResponse.identificacion;

                                liquidarConceptosControl.listaProgramas = data.objectResponse.estudiantePrograma;
                                liquidarConceptosControl.nuevoLiquidarConceptos.idPeriodo = liquidarConceptosControl.listaProgramas[0].idPeriodo;
                                liquidarConceptosControl.nuevoLiquidarConceptos.periodoActual = liquidarConceptosControl.listaProgramas[0].periodoActual;
                                liquidarConceptosControl.nuevoLiquidarConceptos.idPrograma = liquidarConceptosControl.listaProgramas[0].idPrograma;
                                liquidarConceptosControl.nuevoLiquidarConceptos.idEstudiante = liquidarConceptosControl.listaProgramas[0].idEstudiante;
                                liquidarConceptosControl.nuevoLiquidarConceptos.nivelFormacion = liquidarConceptosControl.listaProgramas[0].nivelFormacion;
                                liquidarConceptosControl.nuevoLiquidarConceptos.programaNombre = liquidarConceptosControl.listaProgramas[0].programa;
                                liquidarConceptosControl.nuevoLiquidarConceptos.modalidad = liquidarConceptosControl.listaProgramas[0].modalidad;
                                liquidarConceptosControl.nuevoLiquidarConceptos.horario = liquidarConceptosControl.listaProgramas[0].horario;
                                liquidarConceptosControl.nuevoLiquidarConceptos.semestre = liquidarConceptosControl.listaProgramas[0].semestre;
                            } else {
                                liquidarConceptosControl.nuevoLiquidarConceptos.id = data.objectResponse.id;
                                liquidarConceptosControl.nuevoLiquidarConceptos.nombre = data.objectResponse.nombre;
                                liquidarConceptosControl.nuevoLiquidarConceptos.apellido = data.objectResponse.apellido;
                                liquidarConceptosControl.nuevoLiquidarConceptos.nombresCompleto = data.objectResponse.nombre + " " + data.objectResponse.apellido;
                                liquidarConceptosControl.nuevoLiquidarConceptos.documentoCompleto = data.objectResponse.tipoDocumento + " " + data.objectResponse.identificacion;
                                liquidarConceptosControl.nuevoLiquidarConceptos.tipoDocumento = data.objectResponse.tipoDocumento;
                                liquidarConceptosControl.nuevoLiquidarConceptos.identificacion = data.objectResponse.identificacion;
                                liquidarConceptosControl.listaProgramas = data.objectResponse.estudiantePrograma;
                            }
                            break;
                        case 409:
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                            liquidarConceptosControl.liquidarConceptosAux.onDeshabilitar = false;
                            break;

                    }
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                    return;
                });
        };

        liquidarConceptosControl.onCambiarPrograma = function () {
            if (!new ValidationService().checkFormValidity($scope.formConsultarPrograma)) {
                if (liquidarConceptosControl.nuevoLiquidarConceptos.idProgramaSelected !== null) {
                    var index = liquidarConceptosControl.listaProgramas.indexOf(liquidarConceptosControl.nuevoLiquidarConceptos.idProgramaSelected);
                    liquidarConceptosControl.liquidarConceptosAux.onDeshabilitar = true;
                    liquidarConceptosControl.nuevoLiquidarConceptos.idPrograma = liquidarConceptosControl.listaProgramas[index].idPrograma;
                    liquidarConceptosControl.nuevoLiquidarConceptos.idEstudiante = liquidarConceptosControl.listaProgramas[index].idEstudiante;
                    liquidarConceptosControl.nuevoLiquidarConceptos.nivelFormacion = liquidarConceptosControl.listaProgramas[index].nivelFormacion;
                    liquidarConceptosControl.nuevoLiquidarConceptos.programaNombre = liquidarConceptosControl.listaProgramas[index].programa;
                    liquidarConceptosControl.nuevoLiquidarConceptos.modalidad = liquidarConceptosControl.listaProgramas[index].modalidad;
                    liquidarConceptosControl.nuevoLiquidarConceptos.horario = liquidarConceptosControl.listaProgramas[index].horario;
                    liquidarConceptosControl.nuevoLiquidarConceptos.semestre = liquidarConceptosControl.listaProgramas[index].semestre;
                    liquidarConceptosControl.nuevoLiquidarConceptos.idPeriodo = liquidarConceptosControl.listaProgramas[index].idPeriodo;
                    liquidarConceptosControl.nuevoLiquidarConceptos.periodoActual = liquidarConceptosControl.listaProgramas[index].periodoActual;
                } else {
                    liquidarConceptosControl.liquidarConceptosAux.onDeshabilitar = false;
                }
            } else {
                if (liquidarConceptosControl.nuevoLiquidarConceptos.idProgramaSelected !== null) {
                    var index = liquidarConceptosControl.listaProgramas.indexOf(liquidarConceptosControl.nuevoLiquidarConceptos.idProgramaSelected);
                    liquidarConceptosControl.liquidarConceptosAux.onDeshabilitar = true;
                    liquidarConceptosControl.nuevoLiquidarConceptos.idPrograma = liquidarConceptosControl.listaProgramas[index].idPrograma;
                    liquidarConceptosControl.nuevoLiquidarConceptos.idEstudiante = liquidarConceptosControl.listaProgramas[index].idEstudiante;
                    liquidarConceptosControl.nuevoLiquidarConceptos.nivelFormacion = liquidarConceptosControl.listaProgramas[index].nivelFormacion;
                    liquidarConceptosControl.nuevoLiquidarConceptos.programaNombre = liquidarConceptosControl.listaProgramas[index].programa;
                    liquidarConceptosControl.nuevoLiquidarConceptos.modalidad = liquidarConceptosControl.listaProgramas[index].modalidad;
                    liquidarConceptosControl.nuevoLiquidarConceptos.horario = liquidarConceptosControl.listaProgramas[index].horario;
                    liquidarConceptosControl.nuevoLiquidarConceptos.semestre = liquidarConceptosControl.listaProgramas[index].semestre;
                    liquidarConceptosControl.nuevoLiquidarConceptos.idPeriodo = liquidarConceptosControl.listaProgramas[index].idPeriodo;
                    liquidarConceptosControl.nuevoLiquidarConceptos.periodoActual = liquidarConceptosControl.listaProgramas[index].periodoActual;
                } else {
                    liquidarConceptosControl.liquidarConceptosAux.onDeshabilitar = false;
                }
            }
        };

        liquidarConceptosControl.onCambiarConcepto = function () {
            liquidarConceptosControl.listaAbono = [];
            if (liquidarConceptosControl.concepFacturacion.conceptoAFacturar === null) {
                return;
            }
            appConstant.MSG_LOADING(appGenericConstant.CONSULTANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            if (liquidarConceptosControl.concepFacturacion.conceptoAFacturar !== null && liquidarConceptosControl.concepFacturacion.conceptoAFacturar.codigo !== 'CFI10') {
                liquidarConceptosControl.listaDetalleConceptoFacturacion = [];
                liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarBoton = false;
                var objFacturar = {
                    idEstudiante: liquidarConceptosControl.nuevoLiquidarConceptos.idEstudiante,
                    idPrograma: liquidarConceptosControl.nuevoLiquidarConceptos.idPrograma,
                    idPeriodo: liquidarConceptosControl.nuevoLiquidarConceptos.idPeriodo,
                    idConcepto: liquidarConceptosControl.concepFacturacion.conceptoAFacturar.id
                };
                liquidarConceptosEstudianteService.consultarDetalleConceptoALiquidar(objFacturar).then(function (data) {
                    switch (data.tipo) {
                        case 200:
                            fechaLimitePago = data.objectResponse.fechaLimitePago;
                            liquidarConceptosControl.total = data.objectResponse.valorLiquidado;
                            liquidarConceptosControl.idPlantilla = data.objectResponse.idPlantilla;
                            data = data.objectResponse.liquidacionConceptoDetalleDTO;
                            angular.forEach(data, function (value, key) {
                                var conceptoDetalle = {
                                    id: value.id,
                                    idPlantilla: value.idPlantilla,
                                    idLiquidacion: value.idLiquidacion,
                                    idConcepto: value.idConcepto,
                                    codigoConcepto: value.codigoConcepto,
                                    nombreConcepto: value.nombreConcepto,
                                    cantidad: value.cantidad,
                                    valor: value.valor
                                };
                                liquidarConceptosControl.listaDetalleConceptoFacturacion.push(conceptoDetalle);
                            });
                            liquidarConceptosControl.nuevoLiquidarConceptos.listaConceptosAFacturar = liquidarConceptosControl.listaDetalleConceptoFacturacion;
                            appConstant.CERRAR_SWAL();
                            break;
                        case 409:
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                            liquidarConceptosControl.nuevoLiquidarConceptos.listaConceptosAFacturar = [];
                            break;
                        default:
                            appConstant.CERRAR_SWAL();
                            liquidarConceptosControl.nuevoLiquidarConceptos.listaConceptosAFacturar = [];
                            break;
                    }

                });
            } else {
                liquidarConceptosControl.agregarAbono(liquidarConceptosControl.concepFacturacion.conceptoAFacturar.codigo);
                appConstant.CERRAR_SWAL();
            }
        };

        if (localStorageService.get('usuario') !== null) {
            var usuario = localStorageService.get('usuario');
            liquidarConceptosControl.usuario = usuario;
        }

        liquidarConceptosControl.onGuardar = function () {
            if (liquidarConceptosControl.concepFacturacion.conceptoAFacturar.codigo === 'CFI10') {
                liquidarConceptosControl.nuevoLiquidarConceptos.listaConceptosAFacturar = liquidarConceptosControl.listaAbono;
            }
            appConstant.MSG_CONFIRMACION();
            appConstant.CARGANDO();
            var liquidacionObj = {
                idPeriodo: liquidarConceptosControl.nuevoLiquidarConceptos.idPeriodo,
                idEstudiante: liquidarConceptosControl.nuevoLiquidarConceptos.idEstudiante,
                valorLiquidado: liquidarConceptosControl.total,
                idPlantilla: liquidarConceptosControl.idPlantilla,
                fechaLimitePago: fechaLimitePago,
                liquidacionConceptoDetalleDTO: liquidarConceptosControl.nuevoLiquidarConceptos.listaConceptosAFacturar,
                pkUsuario: localStorageService.get('usuario').id,
                userName: localStorageService.get('usuario').username
            };
            liquidarConceptosEstudianteService.guardarLiquidacion(liquidacionObj).then(function (data) {
                appConstant.CERRAR_SWAL();
                switch (data.tipo) {
                    case 200:
                        appConstant.MSG_GROWL_OK(data.message);
                        liquidarConceptosControl.reporteJsonData = data.objectResponse;
                        //liquidarConceptosControl.onGenerarReporte(liquidarConceptosControl.reporteJsonData);
                        var objReportEstudiante = {
                            liquidacioReporte: liquidarConceptosControl.reporteJsonData
                        };
                        onGenerarReporteDirecto(objReportEstudiante, 2)
                        liquidarConceptosControl.nuevoLiquidarConceptos.codigoEstudianteCampo = null;
                        liquidarConceptosControl.onLimpiar();
                        break;
                    case 409:
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        break;
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        function onGenerarReporteDirecto(json, opcion) {
            appConstant.MSG_REPORTE();
            appConstant.CARGANDO();

            var jsonString = JSON.stringify(json);
            jsonString = opcion + "" + jsonString;
            var urlRequest = '/api/financiero/report/crearReportD/';

            $http.post(urlRequest, jsonString, {
                transformRequest: angular.identity,
                headers: {
                    Authorization: localStorageService.get('autorizacion').token,
                    Campus : localStorageService.get('autorizacion').objectResponse.idUniversidad
                },
                responseType: 'arraybuffer'
            }).success(function (data) {

                var file = new Blob([data], {
                    type: 'application/pdf'
                });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                appConstant.CERRAR_SWAL();

            }).error(function () {
                appConstant.MSG_GROWL_ERROR("Error de conexión: No fue posible conectarse con el servidor");
                appConstant.CERRAR_SWAL();
            });

        };

        liquidarConceptosControl.onGenerarReporte = function (datosObj) {
            appConstant.MSG_LOADING(appGenericConstant.GENERANDO_REPORTE_ESPERE);
            appConstant.CARGANDO();
            liquidarConceptosControl.item = [];
            var headers = {
                Authorization: localStorageService.get('autorizacion').token,
                Campus : localStorageService.get('autorizacion').objectResponse.idUniversidad
            };
            var objReportEstudiante = {
                liquidacioReporte: datosObj
            };
            var jsonString = JSON.stringify(objReportEstudiante);
            jsonString = "2" + jsonString;
            var urlRequest = '/api/financiero/report/crearReport/';
            $http.post(urlRequest, jsonString, headers).then(function (data) {
                appConstant.CERRAR_SWAL();
                liquidarConceptosControl.item.push(data.data.message);
                getIdArchivo(liquidarConceptosControl.item[0]);
            }).catch(function (e) {
                swal({
                    title: appGenericConstant.NO_GENERAR_REPORTE,
                    type: 'error'
                });
            });
        };

        function getIdArchivo(itemId) {
            liquidarConceptosControl.itemArchivo = "";
            liquidarConceptosControl.itemArchivo = itemId;
            liquidarConceptosControl.download(liquidarConceptosControl.itemArchivo);
        }

        liquidarConceptosControl.download = function (itemArc) {
            var file = utilServices.downloadArchivo(itemArc, appGenericConstant.MICRO_SERVICIO_FINANCIERO);
            if (file !== null && itemArc !== null && itemArc !== undefined) {
                utilServices.downloadReporte(file, itemArc);
            }
        };


        liquidarConceptosControl.agregarAbono = function (codigo) {
            if (codigo === 'CFI10') {
                var abono = {
                    id: null,
                    idPlantilla: liquidarConceptosControl.concepFacturacion.conceptoAFacturar.idPlantilla,
                    idLiquidacion: liquidarConceptosControl.concepFacturacion.conceptoAFacturar.idLiquidacion,
                    idConcepto: liquidarConceptosControl.concepFacturacion.conceptoAFacturar.id,
                    codigoConcepto: liquidarConceptosControl.concepFacturacion.conceptoAFacturar.codigo,
                    nombreConcepto: liquidarConceptosControl.concepFacturacion.conceptoAFacturar.nombre,
                    cantidad: liquidarConceptosControl.concepFacturacion.conceptoAFacturar.cantidad,
                    valor: '$ 0'
                }
                liquidarConceptosControl.listaAbono.push(abono);
                liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarBoton = true;
                liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarCampo = true;
            }
        }

        liquidarConceptosControl.mostrarCampo = function (item) {
            $("#inputHid" + item).prop("disabled", false);
            $('#inputHid' + item).focus();
            $("#btnComd" + item).hide();
            $("#btnCheck" + item).show();
            $("#btnCancel" + item).show();
            valor = $("#inputHid" + item).val();
            liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarCampo = true;
            if (valor === "" || valor === '$ 0') {
                liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarBoton = true;
            } else {
                liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarBoton = true;
            }
        };

        liquidarConceptosControl.ocultarCampo = function (item) {
            valor = $("#inputHid" + item).val();
            if (valor === "" || valor === '$ 0') {
                $('#inputHid' + item).focus();
                $("#inputHid" + item).css("box-shadow", "0 0 3px #CC0000");
            } else {
                $("#inputHid" + item).css("box-shadow", "inset 1px 1px 3px #f6f6f6");
                $("#inputHid" + item).prop("disabled", true);
                $("#btnComd" + item).show();
                $("#btnCheck" + item).hide();
                $("#btnCancel" + item).hide();
                liquidarConceptosControl.total = parseInt(valor.replace(/[^0-9\.]+/g, ""));
                liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarCampo = true;
                liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarBoton = false;
                liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarBotonCancelar = false;
            }
        };

        liquidarConceptosControl.cancelarCampo = function (item) {
            if ($("#inputHid" + item).val() === "" || $("#inputHid" + item).val() === "$ 0") {
                $('#inputHid' + item).focus();
                $("#inputHid" + item).css("box-shadow", "0 0 3px #CC0000");
                liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarCampo = false;
                liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarBoton = true;
            } else {
                $("#inputHid" + item).val(valor);
                $("#inputHid" + item).css("box-shadow", "inset 1px 1px 3px #f6f6f6");
                $("#inputHid" + item).prop("disabled", true);
                $("#btnComd" + item).show();
                $("#btnCheck" + item).hide();
                $("#btnCancel" + item).hide();
                liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarCampo = true;
                liquidarConceptosControl.liquidarConceptosAux.onDeshabilitarBoton = false;
            }
        };

        onConsultarConceptosFacturacion();
        init();
    }
})();