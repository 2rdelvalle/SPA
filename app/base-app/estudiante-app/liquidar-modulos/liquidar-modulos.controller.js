(function () {
    'use strict';
    angular.module('mytodoApp').controller('liquidarModuloEstudienteCtrl', liquidarModuloEstudienteCtrl);

    liquidarModuloEstudienteCtrl.$inject = ['$scope', '$http', 'liquidarConceptosService', 'liquidarModuloEstudienteService', 'ValidationService', 'appConstant', 'appGenericConstant', 'utilServices', 'localStorageService'];
    function liquidarModuloEstudienteCtrl($scope, $http, liquidarConceptosService, liquidarModuloEstudienteService, ValidationService, appConstant, appGenericConstant, utilServices, localStorageService) {
        var liquidarModuloControl = this;
        liquidarModuloControl.liquidarModulo = liquidarModuloEstudienteService.liquidarMatricula;
        liquidarModuloControl.liquidarMatriculaAux = liquidarModuloEstudienteService.liquidarMatriculaAuxiliar;
        liquidarModuloControl.listaModulosMatricula = [];
        liquidarModuloControl.listaDescuentosEstudiante = [];
        liquidarModuloControl.reporteJsonData;
        liquidarModuloControl.descuento = {};
        liquidarModuloControl.liquidarModulo.valorDescontado = 0;
        liquidarModuloControl.listadoDescuentos = [{id: 1, valor: '10%', valorPorcentaje: 0.10},
            {id: 1, valor: '20%', valorPorcentaje: 0.20}, {id: 1, valor: '30%', valorPorcentaje: 0.30},
            {id: 1, valor: '40%', valorPorcentaje: 0.40}, {id: 1, valor: '50%', valorPorcentaje: 0.50},
            {id: 1, valor: '60%', valorPorcentaje: 0.60}, {id: 1, valor: '70%', valorPorcentaje: 0.70},
            {id: 1, valor: '80%', valorPorcentaje: 0.80}, {id: 1, valor: '90%', valorPorcentaje: 0.90},
            {id: 1, valor: '100%', valorPorcentaje: 1}

        ];

        liquidarModuloControl.report = {
            selectedModulo: null
        };

        function init() {
            liquidarModuloControl.liquidarModulo.codigoEstudianteCampo = null;
            liquidarModuloControl.liquidarMatriculaAux.onDeshabilitar = false;
            liquidarModuloControl.listaModulosMatricula = [];
            liquidarModuloControl.liquidarModulo.total = 0;
            liquidarModuloControl.report.selectedModulo = null;
            liquidarModuloControl.reporteJsonData;
            liquidarModuloControl.descuento = {};
            liquidarModuloControl.listadoDescuentos = [{id: 1, valor: '10%', valorPorcentaje: 0.10},
                {id: 2, valor: '20%', valorPorcentaje: 0.20},
                {id: 3, valor: '30%', valorPorcentaje: 0.30},
                {id: 4, valor: '40%', valorPorcentaje: 0.40},
                {id: 5, valor: '50%', valorPorcentaje: 0.50},
                {id: 6, valor: '60%', valorPorcentaje: 0.60},
                {id: 7, valor: '70%', valorPorcentaje: 0.70},
                {id: 8, valor: '80%', valorPorcentaje: 0.80},
                {id: 9, valor: '90%', valorPorcentaje: 0.90},
                {id: 10, valor: '100%', valorPorcentaje: 1}];
        }

        function onBuscarModulos(buscar) {
            liquidarModuloControl.liquidarModulo.listaModulos = [];
            liquidarModuloEstudienteService.armarModulos(buscar).then(function (data) {
                angular.forEach(data.objectResponse, function (value) {
                    var modulo = {
                        id: value.id,
                        nombreModulo: value.nombreModulo,
                        vencimiento: value.vencimiento,
                        valorModulo: value.valorModulo,
                        disabled: value.disabled,
                        //disabled: false,
                        idPlantilla: value.idPlantilla,
                        idConcepto: value.idConcepto,
                        codigoConcepto: value.codigoConcepto,
                        nombreConcepto: value.nombreConcepto,
                        idDetalleCalendario: value.idDetalleCalendario,
                        estado: value.estado
                    };
                    liquidarModuloControl.liquidarModulo.listaModulos.push(modulo);
                });
                if (liquidarModuloControl.liquidarModulo.listaModulos.length === 0) {
                    liquidarModuloControl.liquidarMatriculaAux.onDeshabilitar = false;
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    return;
                }
            }).catch(function (e) {
                liquidarModuloControl.liquidarMatriculaAux.onDeshabilitar = false;
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }

        liquidarModuloControl.onLimpiar = function () {
            liquidarModuloControl.liquidarMatriculaAux.onDeshabilitar = false;
            liquidarModuloControl.listaProgramas = [];
            liquidarModuloControl.liquidarModulo.listaModulos = [];
            liquidarModuloControl.liquidarModulo.total = 0;
        };


        function onConsultarEstudiante() {
            liquidarModuloControl.onLimpiar();
            var codEstudiante = localStorageService.get('usuario').identificacion;
            liquidarModuloEstudienteService.consultarEstudiante(codEstudiante, 'LiqModEst').then(function (data) {
                switch (data.tipo) {
                    case 200:
                        if (data.objectResponse.estudiantePrograma.length === 1) {
                            liquidarModuloControl.liquidarMatriculaAux.onDeshabilitar = true;
                            liquidarModuloControl.liquidarModulo.id = data.objectResponse.id;
                            liquidarModuloControl.liquidarModulo.nombre = data.objectResponse.nombre;
                            liquidarModuloControl.liquidarModulo.apellido = data.objectResponse.apellido;
                            liquidarModuloControl.liquidarModulo.nombresCompleto = data.objectResponse.nombre + " " + data.objectResponse.apellido;
                            liquidarModuloControl.liquidarModulo.documentoCompleto = data.objectResponse.tipoDocumento + " " + data.objectResponse.identificacion;
                            liquidarModuloControl.liquidarModulo.tipoDocumento = data.objectResponse.tipoDocumento;
                            liquidarModuloControl.liquidarModulo.identificacion = data.objectResponse.identificacion;
                            liquidarModuloControl.listaProgramas = data.objectResponse.estudiantePrograma;
                            liquidarModuloControl.liquidarModulo.idPeriodo = liquidarModuloControl.listaProgramas[0].idPeriodo;
                            liquidarModuloControl.liquidarModulo.periodoActual = liquidarModuloControl.listaProgramas[0].periodoActual;
                            liquidarModuloControl.liquidarModulo.idPrograma = liquidarModuloControl.listaProgramas[0].idPrograma;
                            liquidarModuloControl.liquidarModulo.idEstudiante = liquidarModuloControl.listaProgramas[0].idEstudiante;
                            liquidarModuloControl.liquidarModulo.nivelFormacion = liquidarModuloControl.listaProgramas[0].nivelFormacion;
                            liquidarModuloControl.liquidarModulo.programaNombre = liquidarModuloControl.listaProgramas[0].programa;
                            liquidarModuloControl.liquidarModulo.modalidad = liquidarModuloControl.listaProgramas[0].modalidad;
                            liquidarModuloControl.liquidarModulo.horario = liquidarModuloControl.listaProgramas[0].horario;
                            liquidarModuloControl.liquidarModulo.semestre = liquidarModuloControl.listaProgramas[0].semestre;
                            liquidarModuloControl.liquidarModulo.idModalidad = liquidarModuloControl.listaProgramas[0].idModalidad;
                            var buscar = {
                                idModalidad: liquidarModuloControl.liquidarModulo.idModalidad,
                                idPeriodo: liquidarModuloControl.liquidarModulo.idPeriodo,
                                idPrograma: liquidarModuloControl.liquidarModulo.idPrograma,
                                nivel: liquidarModuloControl.liquidarModulo.semestre,
                                idEstudiante: liquidarModuloControl.liquidarModulo.idEstudiante
                            };

                            onBuscarModulos(buscar);
                            liquidarModuloControl.onConsultarDescuentosEstudiante(liquidarModuloControl.liquidarModulo.identificacion);
                        } else {
                            liquidarModuloControl.liquidarModulo.id = data.objectResponse.id;
                            liquidarModuloControl.liquidarModulo.nombre = data.objectResponse.nombre;
                            liquidarModuloControl.liquidarModulo.apellido = data.objectResponse.apellido;
                            liquidarModuloControl.liquidarModulo.nombresCompleto = data.objectResponse.nombre + " " + data.objectResponse.apellido;
                            liquidarModuloControl.liquidarModulo.documentoCompleto = data.objectResponse.tipoDocumento + " " + data.objectResponse.identificacion;
                            liquidarModuloControl.liquidarModulo.tipoDocumento = data.objectResponse.tipoDocumento;
                            liquidarModuloControl.liquidarModulo.identificacion = data.objectResponse.identificacion;
                            liquidarModuloControl.listaProgramas = data.objectResponse.estudiantePrograma;
                            liquidarModuloControl.onConsultarDescuentosEstudiante(liquidarModuloControl.liquidarModulo.identificacion);
                        }
                        break;
                    case 409:
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        liquidarModuloControl.liquidarMatriculaAux.onDeshabilitar = false;
                        break;

                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }
        ;

        liquidarModuloControl.onCambiarPrograma = function () {
            if (!new ValidationService().checkFormValidity($scope.formConsultarPrograma)) {
                if (liquidarModuloControl.liquidarModulo.idProgramaSelected !== null) {

                    if (liquidarModuloControl.liquidarModulo.idProgramaSelected.nivelFormacion === "TECNICO LABORAL") {
                        liquidarModuloControl.liquidarMatriculaAux.onDeshabilitar = true;
                        var index = liquidarModuloControl.listaProgramas.indexOf(liquidarModuloControl.liquidarModulo.idProgramaSelected);
                        liquidarModuloControl.liquidarModulo.idPrograma = liquidarModuloControl.listaProgramas[index].idPrograma;
                        liquidarModuloControl.liquidarModulo.idEstudiante = liquidarModuloControl.listaProgramas[index].idEstudiante;
                        liquidarModuloControl.liquidarModulo.nivelFormacion = liquidarModuloControl.listaProgramas[index].nivelFormacion;
                        liquidarModuloControl.liquidarModulo.programaNombre = liquidarModuloControl.listaProgramas[index].programa;
                        liquidarModuloControl.liquidarModulo.modalidad = liquidarModuloControl.listaProgramas[index].modalidad;
                        liquidarModuloControl.liquidarModulo.horario = liquidarModuloControl.listaProgramas[index].horario;
                        liquidarModuloControl.liquidarModulo.semestre = liquidarModuloControl.listaProgramas[index].semestre;
                        liquidarModuloControl.liquidarModulo.idPeriodo = liquidarModuloControl.listaProgramas[index].idPeriodo;
                        liquidarModuloControl.liquidarModulo.periodoActual = liquidarModuloControl.listaProgramas[index].periodoActual;
                        liquidarModuloControl.liquidarModulo.idModalidad = liquidarModuloControl.listaProgramas[index].idModalidad;

                        var buscar = {
                            idModalidad: liquidarModuloControl.liquidarModulo.idModalidad,
                            idPeriodo: liquidarModuloControl.liquidarModulo.idPeriodo,
                            idPrograma: liquidarModuloControl.liquidarModulo.idPrograma,
                            nivel: liquidarModuloControl.liquidarModulo.semestre,
                            idEstudiante: liquidarModuloControl.liquidarModulo.idEstudiante
                        };

                        onBuscarModulos(buscar);
                    } else {
                        appConstant.MSG_GROWL_ADVERTENCIA("El programa seleccionado no se puede liquidar matricula por modulo");
                        liquidarModuloControl.liquidarMatriculaAux.onDeshabilitar = false;
                    }

                } else {
                    liquidarModuloControl.liquidarMatriculaAux.onDeshabilitar = false;
                }
            } else {
                liquidarModuloControl.liquidarMatriculaAux.onDeshabilitar = false;
            }

            liquidarModuloControl.liquidarModulo.idProgramaSelected = null;

        };

        liquidarModuloControl.onCalcularTotal = function (clase, item) {
            if (clase === 'undefined' && liquidarModuloControl.report.selectedModulo.length > 0) {
                clase = false;
            }
            if (clase) {
                liquidarModuloControl.liquidarModulo.total = liquidarModuloControl.liquidarModulo.total - item.valorModulo + liquidarModuloControl.liquidarModulo.valorDescontado;
                liquidarModuloControl.liquidarModulo.valorDescontado = 0;
                liquidarModuloControl.descuento = null;

                if (liquidarModuloControl.liquidarModulo.total < 0) {
                    liquidarModuloControl.liquidarModulo.total = 0;
                    liquidarModuloControl.liquidarModulo.valorDescontado = 0;
                    liquidarModuloControl.descuento = null;
                }

            } else {
                liquidarModuloControl.liquidarModulo.total = liquidarModuloControl.liquidarModulo.total + item.valorModulo + liquidarModuloControl.liquidarModulo.valorDescontado;
                liquidarModuloControl.liquidarModulo.valorDescontado = 0;
                liquidarModuloControl.descuento = null;
            }


        };

        if (localStorageService.get('usuario') !== null) {
            var usuario = localStorageService.get('usuario');
            liquidarModuloControl.usuario = usuario;
        }

        liquidarModuloControl.onGuardar = function () {
            appConstant.MSG_LOADING(appGenericConstant.GENERANDO_REPORTE_ESPERE);
            appConstant.CARGANDO();
            var totoalLiquidacion = 0;
            var idPlantilla;
            angular.forEach(liquidarModuloControl.report.selectedModulo, function (value, key) {

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

                var liquidacionObj = {
                    idPeriodo: liquidarMatriculaControl.nuevoLiquidarMatricula.idPeriodo,
                    idEstudiante: liquidarMatriculaControl.nuevoLiquidarMatricula.idEstudiante,
                    valorLiquidado: totoalLiquidacion,
                    idPlantilla: idPlantilla,
                    fechaLimitePago: null,
                    liquidacionConceptoDetalleDTO: liquidarMatriculaControl.listaModulosMatricula
                    , pkUsuario: liquidarMatriculaControl.usuario.id,
                    userName: liquidarMatriculaControl.usuario.username
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

        liquidarModuloControl.onGenerarReporte = function (datosObj) {
            appConstant.MSG_LOADING(appGenericConstant.GENERANDO_REPORTE_ESPERE);
            appConstant.CARGANDO();
            liquidarModuloControl.item = [];
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
                liquidarModuloControl.item.push(data.data.message);
                getIdArchivo(liquidarModuloControl.item[0]);
            }).catch(function (e) {
                swal({
                    title: appGenericConstant.NO_GENERAR_REPORTE,
                    type: 'error'
                });
            });
        };

        function getIdArchivo(itemId) {
            liquidarModuloControl.itemArchivo = "";
            liquidarModuloControl.itemArchivo = itemId;
            liquidarModuloControl.download(liquidarModuloControl.itemArchivo);
        }

        liquidarModuloControl.download = function (itemArc) {
            var file = utilServices.downloadArchivo(itemArc, appGenericConstant.MICRO_SERVICIO_FINANCIERO);
            if (file !== null && itemArc !== null && itemArc !== undefined) {
                utilServices.downloadReporte(file, itemArc);
            }
        };

        liquidarModuloControl.onConsultarDescuentosEstudiante = function (codigo) {
            liquidarModuloEstudienteService.consultarEstudianteDescuento(codigo).then(function (data) {
                liquidarModuloControl.listaDescuentosEstudiante = [];
                liquidarModuloControl.listaDescuentosEstudiante = data;

                liquidarModuloControl.mostrarInputBecado = data.length > 0;

            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        liquidarModuloControl.onMostrarModal = function (item) {
            $('#' + item).modal({backdrop: 'static', keyboard: false});
            $("#" + item).modal("show");
        };

        liquidarModuloControl.onChangeDescuento = function () {

            if (liquidarModuloControl.report.selectedModulo.length > 0) {
                liquidarModuloControl.liquidarModulo.total = 0;
                angular.forEach(liquidarModuloControl.report.selectedModulo, function (value, key) {
                    liquidarModuloControl.liquidarModulo.total = liquidarModuloControl.liquidarModulo.total + value.valorModulo;
                });
                liquidarModuloControl.liquidarModulo.valorDescontado = liquidarModuloControl.liquidarModulo.total * liquidarModuloControl.descuento.valorPorcentaje;
                liquidarModuloControl.liquidarModulo.total = liquidarModuloControl.liquidarModulo.total - liquidarModuloControl.liquidarModulo.total * liquidarModuloControl.descuento.valorPorcentaje;
            }
        };

        init();
        onConsultarEstudiante();
    }
})();