(function () {
    'use strict';
    angular.module('mytodoApp').controller('liquidarMatriculaSinDescuentoCtrl', liquidarMatriculaSinDescuentoCtrl);

    liquidarMatriculaSinDescuentoCtrl.$inject = ['$scope', '$http', 'liquidarConceptosService', 'liquidarMatriculaService', 'ValidationService', 'appConstant', 'appGenericConstant', 'utilServices', 'localStorageService'];
    function liquidarMatriculaSinDescuentoCtrl($scope, $http, liquidarConceptosService, liquidarMatriculaService, ValidationService, appConstant, appGenericConstant, utilServices, localStorageService) {

        var liquidarMatriculaControl = this;
        liquidarMatriculaControl.nuevoLiquidarMatricula = liquidarMatriculaService.liquidarMatricula;
        liquidarMatriculaControl.liquidarMatriculaAux = liquidarMatriculaService.liquidarMatriculaAuxiliar;
        liquidarMatriculaControl.listaModulosMatricula = [];
        liquidarMatriculaControl.listaDescuentosEstudiante = [];
        liquidarMatriculaControl.reporteJsonData;
        liquidarMatriculaControl.descuento = {};
        liquidarMatriculaControl.nuevoLiquidarMatricula.valorDescontado = 0;
        liquidarMatriculaControl.listadoDescuentos = appConstant.LISTA_DESCUENTOS;
        liquidarMatriculaControl.report = { selectedModulo: null };
        liquidarMatriculaControl.selectTodos = false;
        function init() {
            liquidarMatriculaControl.nuevoLiquidarMatricula.codigoEstudianteCampo = null;
            liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = false;
            liquidarMatriculaControl.listaModulosMatricula = [];
            liquidarMatriculaControl.nuevoLiquidarMatricula.total = 0;
            liquidarMatriculaControl.report.selectedModulo = null;
            liquidarMatriculaControl.reporteJsonData;
            liquidarMatriculaControl.descuento = {};
            liquidarMatriculaControl.listadoDescuentos = appConstant.LISTA_DESCUENTOS;
            liquidarMatriculaControl.selectTodos = false;
        }

        function onBuscarModulos(buscar) {
            liquidarMatriculaControl.nuevoLiquidarMatricula.listaModulos = [];
            liquidarMatriculaService.armarModulos(buscar).then(function (data) {
                angular.forEach(data.objectResponse, function (value) {
                    var modulo = {
                        id: value.id,
                        nombreModulo: value.nombreModulo,
                        vencimiento: value.vencimiento,
                        valorModulo: value.valorModulo,
                        disabled: value.disabled,
                        fecha1Supletorio: value.fecha1Supletorio,
                        fecha2Supletorio: value.fecha2Supletorio,
                        //disabled: false,
                        idPlantilla: value.idPlantilla,
                        idConcepto: value.idConcepto,
                        codigoConcepto: value.codigoConcepto,
                        nombreConcepto: value.nombreConcepto,
                        idDetalleCalendario: value.idDetalleCalendario,
                        estado: value.estado
                    };
                    liquidarMatriculaControl.nuevoLiquidarMatricula.listaModulos.push(modulo);
                });
                if (liquidarMatriculaControl.nuevoLiquidarMatricula.listaModulos.length === 0) {
                    liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = false;
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    return;
                }
            }).catch(function (e) {
                liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = false;
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }

        liquidarMatriculaControl.onLimpiar = function () {
            liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = false;
            liquidarMatriculaControl.listaProgramas = [];
            liquidarMatriculaControl.nuevoLiquidarMatricula.listaModulos = [];
            liquidarMatriculaControl.nuevoLiquidarMatricula.total = 0;
            new ValidationService().resetForm($scope.formConsultarEstudiante);
        };

        liquidarMatriculaControl.onPresionarEnter = function (tecla) {
            if (tecla.keyCode === 13) {
                liquidarMatriculaControl.onConsultarEstudiante();
            }
        };

        liquidarMatriculaControl.onConsultarEstudiante = function () {
            liquidarMatriculaControl.onLimpiar();
            var codEstudiante = liquidarMatriculaControl.nuevoLiquidarMatricula.codigoEstudianteCampo;
            if (new ValidationService().checkFormValidity($scope.formConsultarEstudiante)) {
                appConstant.MSG_LOADING('Consultando registros con el código ' + codEstudiante + '...');
                appConstant.CARGANDO();
                liquidarMatriculaService.consultarEstudiante(codEstudiante).then(function (data) {
                    switch (data.tipo) {
                        case 200:
                            appConstant.CERRAR_SWAL();
                            if (data.objectResponse.estudiantePrograma.length === 1) {
                                liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = true;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.id = data.objectResponse.id;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.nombre = data.objectResponse.nombre;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.apellido = data.objectResponse.apellido;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.nombresCompleto = data.objectResponse.nombre + " " + data.objectResponse.apellido;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.documentoCompleto = data.objectResponse.tipoDocumento + " " + data.objectResponse.identificacion;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.tipoDocumento = data.objectResponse.tipoDocumento;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.identificacion = data.objectResponse.identificacion;

                                liquidarMatriculaControl.listaProgramas = data.objectResponse.estudiantePrograma;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.idPeriodo = liquidarMatriculaControl.listaProgramas[0].idPeriodo;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.periodoActual = liquidarMatriculaControl.listaProgramas[0].periodoActual;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.idPrograma = liquidarMatriculaControl.listaProgramas[0].idPrograma;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.idEstudiante = liquidarMatriculaControl.listaProgramas[0].idEstudiante;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.nivelFormacion = liquidarMatriculaControl.listaProgramas[0].nivelFormacion;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.programaNombre = liquidarMatriculaControl.listaProgramas[0].programa;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.modalidad = liquidarMatriculaControl.listaProgramas[0].modalidad;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.horario = liquidarMatriculaControl.listaProgramas[0].horario;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.semestre = liquidarMatriculaControl.listaProgramas[0].semestre;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.idModalidad = liquidarMatriculaControl.listaProgramas[0].idModalidad;
                                var buscar = {
                                    idModalidad: liquidarMatriculaControl.nuevoLiquidarMatricula.idModalidad,
                                    idPeriodo: liquidarMatriculaControl.nuevoLiquidarMatricula.idPeriodo,
                                    idPrograma: liquidarMatriculaControl.nuevoLiquidarMatricula.idPrograma,
                                    nivel: liquidarMatriculaControl.nuevoLiquidarMatricula.semestre,
                                    idEstudiante: liquidarMatriculaControl.nuevoLiquidarMatricula.idEstudiante
                                };

                                onBuscarModulos(buscar);
                                liquidarMatriculaControl.onConsultarDescuentosEstudiante(liquidarMatriculaControl.nuevoLiquidarMatricula.identificacion);
                            } else {
                                liquidarMatriculaControl.nuevoLiquidarMatricula.id = data.objectResponse.id;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.nombre = data.objectResponse.nombre;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.apellido = data.objectResponse.apellido;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.nombresCompleto = data.objectResponse.nombre + " " + data.objectResponse.apellido;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.documentoCompleto = data.objectResponse.tipoDocumento + " " + data.objectResponse.identificacion;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.tipoDocumento = data.objectResponse.tipoDocumento;
                                liquidarMatriculaControl.nuevoLiquidarMatricula.identificacion = data.objectResponse.identificacion;
                                liquidarMatriculaControl.listaProgramas = data.objectResponse.estudiantePrograma;
                                liquidarMatriculaControl.onConsultarDescuentosEstudiante(liquidarMatriculaControl.nuevoLiquidarMatricula.identificacion);
                            }
                            break;
                        case 409:
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                            liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = false;
                            break;

                    }
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                    return;
                });
            }
        };

        liquidarMatriculaControl.onCambiarPrograma = function () {
            if (!new ValidationService().checkFormValidity($scope.formConsultarPrograma)) {
                if (liquidarMatriculaControl.nuevoLiquidarMatricula.idProgramaSelected !== null) {

                    if (liquidarMatriculaControl.nuevoLiquidarMatricula.idProgramaSelected.nivelFormacion === "TECNICO LABORAL") {
                        liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = true;
                        var index = liquidarMatriculaControl.listaProgramas.indexOf(liquidarMatriculaControl.nuevoLiquidarMatricula.idProgramaSelected);
                        liquidarMatriculaControl.nuevoLiquidarMatricula.idPrograma = liquidarMatriculaControl.listaProgramas[index].idPrograma;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.idEstudiante = liquidarMatriculaControl.listaProgramas[index].idEstudiante;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.nivelFormacion = liquidarMatriculaControl.listaProgramas[index].nivelFormacion;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.programaNombre = liquidarMatriculaControl.listaProgramas[index].programa;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.modalidad = liquidarMatriculaControl.listaProgramas[index].modalidad;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.horario = liquidarMatriculaControl.listaProgramas[index].horario;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.semestre = liquidarMatriculaControl.listaProgramas[index].semestre;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.idPeriodo = liquidarMatriculaControl.listaProgramas[index].idPeriodo;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.periodoActual = liquidarMatriculaControl.listaProgramas[index].periodoActual;
                        liquidarMatriculaControl.nuevoLiquidarMatricula.idModalidad = liquidarMatriculaControl.listaProgramas[index].idModalidad;

                        var buscar = {
                            idModalidad: liquidarMatriculaControl.nuevoLiquidarMatricula.idModalidad,
                            idPeriodo: liquidarMatriculaControl.nuevoLiquidarMatricula.idPeriodo,
                            idPrograma: liquidarMatriculaControl.nuevoLiquidarMatricula.idPrograma,
                            nivel: liquidarMatriculaControl.nuevoLiquidarMatricula.semestre,
                            idEstudiante: liquidarMatriculaControl.nuevoLiquidarMatricula.idEstudiante
                        };

                        onBuscarModulos(buscar);
                    } else {
                        appConstant.MSG_GROWL_ADVERTENCIA("El programa seleccionado no se puede liquidar matricula por modulo");
                        liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = false;
                    }

                } else {
                    liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = false;
                }
            } else {
                liquidarMatriculaControl.liquidarMatriculaAux.onDeshabilitar = false;
            }

            liquidarMatriculaControl.nuevoLiquidarMatricula.idProgramaSelected = null;

        };

        liquidarMatriculaControl.onCalcularTotal = function (clase, item) {
            if (clase === 'undefined' && liquidarMatriculaControl.report.selectedModulo.length > 0) {
                clase = false;
            }
            if (clase) {
                liquidarMatriculaControl.nuevoLiquidarMatricula.total = liquidarMatriculaControl.nuevoLiquidarMatricula.total - item.valorModulo + liquidarMatriculaControl.nuevoLiquidarMatricula.valorDescontado;
                liquidarMatriculaControl.nuevoLiquidarMatricula.valorDescontado = 0;
                liquidarMatriculaControl.descuento = null;

                if (liquidarMatriculaControl.nuevoLiquidarMatricula.total < 0) {
                    liquidarMatriculaControl.nuevoLiquidarMatricula.total = 0;
                    liquidarMatriculaControl.nuevoLiquidarMatricula.valorDescontado = 0;
                    liquidarMatriculaControl.descuento = null;
                }
            } else {
                liquidarMatriculaControl.nuevoLiquidarMatricula.total = liquidarMatriculaControl.nuevoLiquidarMatricula.total + item.valorModulo + liquidarMatriculaControl.nuevoLiquidarMatricula.valorDescontado;
                liquidarMatriculaControl.nuevoLiquidarMatricula.valorDescontado = 0;
                liquidarMatriculaControl.descuento = null;
            }

        };

        if (localStorageService.get('usuario') !== null) {
            var usuario = localStorageService.get('usuario');
            liquidarMatriculaControl.usuario = usuario;
        }

        liquidarMatriculaControl.onGuardar = function () {
            appConstant.MSG_LOADING('Guardando Liquidaciones, Por favor Espere');
            appConstant.CARGANDO();
            var totoalLiquidacion = 0;
            var idPlantilla;
            var contadorModulos = 1;
            liquidarMatriculaControl.listaLiquidaciones = [];
            angular.forEach(liquidarMatriculaControl.report.selectedModulo, function (value, key) {
                liquidarMatriculaControl.listaModulosMatricula = [];
                totoalLiquidacion = 0;
                var liquidacionObj = {};
                var moduloDetalle = {
                    id: null,
                    idPlantilla: value.idPlantilla,
                    idLiquidacion: null,
                    idConcepto: value.idConcepto,
                    codigoConcepto: value.codigoConcepto,
                    nombreConcepto: value.nombreConcepto,
                    idDetalleCalendario: value.idDetalleCalendario,
                    cantidad: null,
                    valor: value.valorModulo,
                    fechaVecimiento: value.vencimiento
                    , estado: value.estado,
                    modulo: value.nombreModulo
                };
                idPlantilla = value.idPlantilla;
                totoalLiquidacion = totoalLiquidacion + value.valorModulo;
                liquidarMatriculaControl.listaModulosMatricula.push(moduloDetalle);
                var dateVencimiento = new Date(value.vencimiento);
                var dateVenModulo5 = new Date(1492732800000);

                if (liquidarMatriculaControl.nuevoLiquidarMatricula.idPrograma !== 74) {
                    if (value.nombreModulo.replace('MODULO ', '') === '1' && liquidarMatriculaControl.nuevoLiquidarMatricula.semestre === '1') {

                    } else {
                        if (dateVencimiento > dateVenModulo5) {
                            if (value.fecha1Supletorio) {
                                var moduloDetalle = {
                                    id: null,
                                    idPlantilla: "003",
                                    idLiquidacion: null,
                                    idConcepto: 45,
                                    codigoConcepto: "CFI12",
                                    nombreConcepto: 'SUPLETORIO 1ER PARCIAL',
                                    cantidad: null,
                                    valor: 8000,
                                    fechaVecimiento: value.vencimiento,
                                    estado: value.estado,
                                    modulo: value.nombreModulo
                                };
                                totoalLiquidacion = totoalLiquidacion + moduloDetalle.valor;
                                liquidarMatriculaControl.listaModulosMatricula.push(moduloDetalle);
                            }

                            if (value.fecha2Supletorio) {
                                var moduloDetalle = {
                                    id: null,
                                    idPlantilla: "003",
                                    idLiquidacion: null,
                                    idConcepto: 45,
                                    codigoConcepto: "CFI12",
                                    nombreConcepto: 'SUPLETORIO 2DO PARCIAL',
                                    cantidad: null,
                                    valor: 8000,
                                    fechaVecimiento: value.vencimiento
                                    , estado: value.estado,
                                    modulo: value.nombreModulo
                                };
                                totoalLiquidacion = totoalLiquidacion + moduloDetalle.valor;
                                liquidarMatriculaControl.listaModulosMatricula.push(moduloDetalle);
                            }
                        }
                    }
                }

                if (liquidarMatriculaControl.descuento !== null && liquidarMatriculaControl.descuento !== undefined) {
                    var valorDescontadoIndivudal = liquidarMatriculaControl.nuevoLiquidarMatricula.valorDescontado / liquidarMatriculaControl.report.selectedModulo.length;
                    var moduloDetalle = {
                        id: null,
                        idPlantilla: "003",
                        idLiquidacion: null,
                        idConcepto: 10,
                        codigoConcepto: "CFD01",
                        nombreConcepto: 'BECA' + ' ' + 'DESCUENTO ' + liquidarMatriculaControl.descuento.valor,
                        cantidad: null,
                        valor: -valorDescontadoIndivudal,
                        fechaVecimiento: null
                    };
                    liquidarMatriculaControl.listaModulosMatricula.push(moduloDetalle);
                    totoalLiquidacion = totoalLiquidacion - valorDescontadoIndivudal;
                }

                var liquidacionObj = {
                    idPeriodo: liquidarMatriculaControl.nuevoLiquidarMatricula.idPeriodo,
                    idEstudiante: liquidarMatriculaControl.nuevoLiquidarMatricula.idEstudiante,
                    valorLiquidado: totoalLiquidacion,
                    idPlantilla: idPlantilla,
                    fechaLimitePago: null,
                    liquidacionConceptoDetalleDTO: liquidarMatriculaControl.listaModulosMatricula
                    , pkUsuario: localStorageService.get('usuario').id,
                    userName: localStorageService.get('usuario').username
                };

                liquidarMatriculaControl.listaLiquidaciones.push(liquidacionObj);
            });
            liquidarConceptosService.guardarLiquidacionModulo(liquidarMatriculaControl.listaLiquidaciones).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.MSG_GROWL_OK(data.message);
                    appConstant.CERRAR_SWAL();
                    init();
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    appConstant.CERRAR_SWAL();
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                appConstant.CERRAR_SWAL();
            });
        };

        liquidarMatriculaControl.onGenerarReporte = function (datosObj) {
            appConstant.MSG_LOADING(appGenericConstant.GENERANDO_REPORTE_ESPERE);
            appConstant.CARGANDO();
            liquidarMatriculaControl.item = [];
            var headers = { 
                Authorization: localStorageService.get('autorizacion').token,
                Campus : localStorageService.get('autorizacion').objectResponse.idUniversidad
            };
            var objReportEstudiante = { liquidacioReporte: datosObj };
            var jsonString = JSON.stringify(objReportEstudiante);
            jsonString = "2" + jsonString;
            var urlRequest = '/api/financiero/report/crearReport/';
            $http.post(urlRequest, jsonString, headers).then(function (data) {
                appConstant.CERRAR_SWAL();
                liquidarMatriculaControl.item.push(data.data.message);
                getIdArchivo(liquidarMatriculaControl.item[0]);
            }).catch(function (e) {
                swal({
                    title: appGenericConstant.NO_GENERAR_REPORTE,
                    type: 'error'
                });
            });
        };

        function getIdArchivo(itemId) {
            liquidarMatriculaControl.itemArchivo = "";
            liquidarMatriculaControl.itemArchivo = itemId;
            liquidarMatriculaControl.download(liquidarMatriculaControl.itemArchivo);
        }

        liquidarMatriculaControl.download = function (itemArc) {
            var file = utilServices.downloadArchivo(itemArc, appGenericConstant.MICRO_SERVICIO_FINANCIERO);
            if (file !== null && itemArc !== null && itemArc !== undefined) {
                utilServices.downloadReporte(file, itemArc);
            }
        };

        liquidarMatriculaControl.onConsultarDescuentosEstudiante = function (codigo) {
            liquidarMatriculaService.consultarEstudianteDescuento(codigo).then(function (data) {
                liquidarMatriculaControl.listaDescuentosEstudiante = [];
                liquidarMatriculaControl.listaDescuentosEstudiante = data;
                liquidarMatriculaControl.mostrarInputBecado = data.length > 0;
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        liquidarMatriculaControl.onMostrarModal = function (item) {
            $('#' + item).modal({ backdrop: 'static', keyboard: false });
            $("#" + item).modal("show");
        };

        liquidarMatriculaControl.onChangeDescuento = function () {

            if (liquidarMatriculaControl.report.selectedModulo.length > 0) {
                liquidarMatriculaControl.nuevoLiquidarMatricula.total = 0;
                angular.forEach(liquidarMatriculaControl.report.selectedModulo, function (value, key) {
                    liquidarMatriculaControl.nuevoLiquidarMatricula.total = liquidarMatriculaControl.nuevoLiquidarMatricula.total + value.valorModulo;
                });
                liquidarMatriculaControl.nuevoLiquidarMatricula.valorDescontado = liquidarMatriculaControl.nuevoLiquidarMatricula.total * liquidarMatriculaControl.descuento.valorPorcentaje;
                liquidarMatriculaControl.nuevoLiquidarMatricula.total = liquidarMatriculaControl.nuevoLiquidarMatricula.total - liquidarMatriculaControl.nuevoLiquidarMatricula.total * liquidarMatriculaControl.descuento.valorPorcentaje;
            }
        };

        init();
    }
})();