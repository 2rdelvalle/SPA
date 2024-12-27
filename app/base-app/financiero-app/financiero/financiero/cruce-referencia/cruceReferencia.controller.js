(function () {
    'use strict';
    angular.module('mytodoApp').controller('cruceReferenciasCtrl', cruceReferenciasCtrl);

    cruceReferenciasCtrl.$inject = ['$scope', '$http', 'cruceReferenciasService', '$window', 'growl', 'ValidationService', 'localStorageService', '$filter', 'appConstant', 'utilServices', 'appGenericConstant'];
    function cruceReferenciasCtrl($scope, $http, cruceReferenciasService, $window, growl, ValidationService, localStorageService, $filter, appConstant, utilServices, appGenericConstant) {

        var cruceReferenciasControl = this;
        cruceReferenciasControl.nuevoCruce = cruceReferenciasService.cruceReferencias;
        cruceReferenciasControl.cruceReferenciasAux = cruceReferenciasService.cruceReferenciasAuxiliar;
        cruceReferenciasControl.cruceReferenciasAuxiTotal = cruceReferenciasService.cruceReferenciasAuxiTotal;
        cruceReferenciasControl.listaAbono = [];
        cruceReferenciasControl.listaIdAbonos = [];
        cruceReferenciasControl.listaDetalleLiquidacion = [];
        cruceReferenciasControl.listaDetalleLiquidacionSupletorio = [];
        cruceReferenciasControl.listaDetalleLiquidacionBuscada = [];
        cruceReferenciasControl.reporteJsonData;
        cruceReferenciasControl.cruceReferenciasAux.onDeshabilitar = false;
        cruceReferenciasControl.cruceReferenciasAux.onDeshabilitarBoton = false;
        cruceReferenciasControl.nuevoCruce.total = 0;
        cruceReferenciasControl.valorMinimoCruzar = 0;
        cruceReferenciasControl.valorMinimoCruzarAux = 0;
        cruceReferenciasControl.nuevoCruce.aplicaSupletorio = 'NO';

        cruceReferenciasControl.options = appConstant.FILTRO_TABLAS;
        cruceReferenciasControl.selectedOption = cruceReferenciasControl.options[1];
        cruceReferenciasControl.report = {
            selected: null
        };

        function init() {
            cruceReferenciasControl.nuevoCruce.codigoReferencia = null;
        }

        cruceReferenciasControl.sumaSeleccionados = function (clase, item) {
            if (!clase) {
                cruceReferenciasControl.nuevoCruce.total = cruceReferenciasControl.nuevoCruce.total + item.importe;
                cruceReferenciasControl.listaIdAbonos.push(item.id);
                cruceReferenciasControl.cruceReferenciasAux.onDeshabilitarBoton = true;
            } else {
                cruceReferenciasControl.nuevoCruce.total = cruceReferenciasControl.nuevoCruce.total - item.importe;
                var index = cruceReferenciasControl.listaIdAbonos.indexOf(item.id);
                cruceReferenciasControl.listaIdAbonos.splice(index, 1);
                if (cruceReferenciasControl.nuevoCruce.total === 0) {
                    cruceReferenciasControl.cruceReferenciasAux.onDeshabilitarBoton = false;
                }
            }
        };

        cruceReferenciasControl.onLimpiar = function () {
            cruceReferenciasControl.nuevoCruce.total = 0;
            cruceReferenciasControl.nuevoCruce.id = null;
            cruceReferenciasControl.nuevoCruce.idLiquidacion = null;
            cruceReferenciasControl.nuevoCruce.nombresCompleto = null;
            cruceReferenciasControl.nuevoCruce.identificacion = null;
            cruceReferenciasControl.nuevoCruce.periodoActual = null;
            cruceReferenciasControl.nuevoCruce.programaNombre = null;
            cruceReferenciasControl.cruceReferenciasAux.onDeshabilitar = false;
            cruceReferenciasControl.cruceReferenciasAux.onDeshabilitarBoton = false;
            cruceReferenciasControl.listaAbono = [];
            cruceReferenciasControl.listaIdAbonos = [];
            cruceReferenciasControl.listaDetalleLiquidacionBuscada = [];
            cruceReferenciasControl.listaDetalleLiquidacionSupletorio = [];
            cruceReferenciasControl.listaDetalleLiquidacion = [];
            cruceReferenciasControl.nuevoCruce.aplicaSupletorio = 'SI';
            new ValidationService().resetForm($scope.formConsultarReferencia);
        };

        cruceReferenciasControl.onCampoVacio = function () {
            cruceReferenciasControl.onLimpiar();
        };

        cruceReferenciasControl.onPresionarEnter = function (tecla) {
            if (tecla.keyCode === 13) {
                cruceReferenciasControl.onConsultarReferencia();
            }
        };

        cruceReferenciasControl.onConsultarReferencia = function () {
            cruceReferenciasControl.onLimpiar();
            if (new ValidationService().checkFormValidity($scope.formConsultarReferencia)) {
                var codRef = cruceReferenciasControl.nuevoCruce.codigoReferencia;
                appConstant.MSG_LOADING('Consultando registros con el código ' + codRef + '...');
                appConstant.CARGANDO();
                cruceReferenciasService.buscarComprobantes(codRef).then(function (data) {
                    appConstant.CERRAR_SWAL();
                    switch (data.tipo) {
                        case null:
                            cruceReferenciasControl.cruceReferenciasAux.onDeshabilitar = true;
                            cruceReferenciasControl.nuevoCruce.id = data.objectResponse.estudiante.id;
                            cruceReferenciasControl.nuevoCruce.idLiquidacion = data.objectResponse.idLiquidacion;
                            cruceReferenciasControl.nuevoCruce.nombresCompleto = data.objectResponse.estudiante.nombreEstudiante + " " + data.objectResponse.estudiante.apellidoEstudiante;
                            cruceReferenciasControl.nuevoCruce.identificacion = data.objectResponse.estudiante.identificacionEstudiante.nombreTipoIdentificacion + " " + data.objectResponse.estudiante.codigo;
                            cruceReferenciasControl.nuevoCruce.periodoActual = data.objectResponse.estudiante.nombrePeriodoAcademico;
                            cruceReferenciasControl.nuevoCruce.programaNombre = data.objectResponse.estudiante.nombrePrograma;
                            cruceReferenciasControl.nuevoCruce.saldo = data.objectResponse.valorTotal;
                            cruceReferenciasControl.valorMinimoCruzar = data.objectResponse.valorTotal;

                            cruceReferenciasControl.onConsultarListaAbono(data.objectResponse.estudiante.id);
                            cruceReferenciasControl.onConsultarDetalleLiquidacion(data.objectResponse.idLiquidacion);

                            break;
                        case 409:
                            appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                            cruceReferenciasControl.cruceReferenciasAux.onDeshabilitar = false;
                            break;
                    }
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                    return;
                });
            }
        };

        cruceReferenciasControl.onConsultarDetalleLiquidacion = function (id) {
            cruceReferenciasControl.listaDetalleLiquidacion = [];
            cruceReferenciasControl.listaDetalleLiquidacionBuscada = [];
            cruceReferenciasService.getDetalleLiquidacionList(id).then(function (data) {
                cruceReferenciasControl.listaDetalleLiquidacion = data.listDetalleConceptoMatriculaSemestreCredito;
                cruceReferenciasControl.listaDetalleLiquidacionSupletorio = data.listDetalleConceptoSupletorio;

                if (cruceReferenciasControl.listaDetalleLiquidacion.length > 0 || cruceReferenciasControl.listaDetalleLiquidacionSupletorio.length > 0) {
                    cruceReferenciasControl.nuevoCruce.saldo = 0;

                    cruceReferenciasControl.valorMinimoCruzar = data.listDetalleConceptoMatriculaSemestreCredito.length > 0 ? data.listDetalleConceptoMatriculaSemestreCredito[0].valor : data.listDetalleConceptoSupletorio.length > 0 ? data.listDetalleConceptoSupletorio[0].valor : cruceReferenciasControl.valorMinimoCruzar;
                    angular.forEach(cruceReferenciasControl.listaDetalleLiquidacion, function (value, key) {

                        if (value.valor < cruceReferenciasControl.nuevoCruce.valorMinimoCruzar) {
                            cruceReferenciasControl.nuevoCruce.valorMinimoCruzar = value.valor;
                        }
                        value.estado = value.estado === null ? 'ABIERTA' : value.estado;
                        cruceReferenciasControl.listaDetalleLiquidacionBuscada.push(value);
                        cruceReferenciasControl.nuevoCruce.saldo = cruceReferenciasControl.nuevoCruce.saldo + value.valor;
                    });

                    angular.forEach(cruceReferenciasControl.listaDetalleLiquidacionSupletorio, function (value, key) {
                        value.estado = value.estado === null ? 'ABIERTA' : value.estado;
                        cruceReferenciasControl.listaDetalleLiquidacionBuscada.push(value);
                    });

                    if (data.valorDescontado > 0) {
                        angular.forEach(data.listDetalleConceptoDescuento, function (value, key) {
                            cruceReferenciasControl.listaDetalleLiquidacionBuscada.push(value);
                        });

                        cruceReferenciasControl.valorMinimoCruzar = data.valorDescontado;
                        cruceReferenciasControl.nuevoCruce.saldo = data.valorDescontado;
                    }
                }

                if (cruceReferenciasControl.listaDetalleLiquidacionSupletorio.length === 0) {
                    cruceReferenciasControl.nuevoCruce.aplicaSupletorio = 'NO';
                }

                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ADVERTENCIA("Error al consultar Detalle");
                return;
            });
        };

        cruceReferenciasControl.onConsultarListaAbono = function (id) {
            appConstant.MSG_LOADING(appGenericConstant.CONSULTANDO_ABONOS_REALIZADOS);
            appConstant.CARGANDO();
            cruceReferenciasService.consultarDetalleAbono(id).then(function (data) {
                angular.forEach(data.objectResponse, function (value, key) {
                    var abono = {
                        id: value.id,
                        referencia: value.referencia,
                        fechaPago: $filter('date')(value.fechaPago, 'dd/MM/yyyy hh:mm:ss'),
                        importe: value.importe
                    };
                    cruceReferenciasControl.listaAbono.push(abono);
                });
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NO_HAY_ABONOS);
                return;
            });
        }
        ;
        cruceReferenciasControl.onChangeAplicaSupletorio = function () {
            if (cruceReferenciasControl.nuevoCruce.aplicaSupletorio === 'SI') {
//                cruceReferenciasControl.valorMinimoCruzar = cruceReferenciasControl.nuevoCruce.saldo;

                angular.forEach(cruceReferenciasControl.listaDetalleLiquidacionSupletorio, function (value, key) {
                    value.estado = value.estado === null ? 'ABIERTA' : value.estado;
                    cruceReferenciasControl.nuevoCruce.saldo = cruceReferenciasControl.nuevoCruce.saldo + value.valor;
                });

            } else {
                cruceReferenciasControl.valorMinimoCruzar = cruceReferenciasControl.listaDetalleLiquidacion.length > 0 ? cruceReferenciasControl.listaDetalleLiquidacion[0].valor : cruceReferenciasControl.listaDetalleLiquidacionSupletorio.length > 0 ? cruceReferenciasControl.listaDetalleLiquidacionSupletorio[0].valor : cruceReferenciasControl.valorMinimoCruzar;
                cruceReferenciasControl.valorMinimoCruzarAux = 0;

                angular.forEach(cruceReferenciasControl.listaDetalleLiquidacionSupletorio, function (value, key) {
                    value.estado = value.estado === null ? 'ABIERTA' : value.estado;
                    cruceReferenciasControl.nuevoCruce.saldo = cruceReferenciasControl.nuevoCruce.saldo - value.valor;
                });
            }
        };

        cruceReferenciasControl.onGuardar = function () {
            cruceReferenciasControl.listadoAbonos = [];

            if ((cruceReferenciasControl.listaDetalleLiquidacion.length === 0 && cruceReferenciasControl.listaDetalleLiquidacionSupletorio.length > 0) && cruceReferenciasControl.nuevoCruce.aplicaSupletorio === 'NO') {
                appConstant.MSG_GROWL_ADVERTENCIA("Debe aplicar supletorios para realizar el cruce de referencia");
                return;
            }

            cruceReferenciasControl.onValidarAbono();
        };

        cruceReferenciasControl.onValidarAbono = function () {

            if (cruceReferenciasControl.nuevoCruce.aplicaSupletorio === 'NO') {
                if ((cruceReferenciasControl.nuevoCruce.total >= cruceReferenciasControl.valorMinimoCruzar && (cruceReferenciasControl.nuevoCruce.total <= cruceReferenciasControl.nuevoCruce.saldo || cruceReferenciasControl.nuevoCruce.total >= cruceReferenciasControl.nuevoCruce.saldo))) {
                    cruceReferenciasControl.onGuardarCruce();
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.ABONO_INSUFICIENTE);
                    return;
                }
            } else {
                if (cruceReferenciasControl.nuevoCruce.total >= cruceReferenciasControl.nuevoCruce.saldo) {
                    cruceReferenciasControl.onGuardarCruce();
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.ABONO_INSUFICIENTE);
                    return;
                }
            }
        };

        cruceReferenciasControl.onGuardarCruce = function () {
            appConstant.MSG_CONFIRMACION();
            appConstant.CARGANDO();
            angular.forEach(cruceReferenciasControl.listaIdAbonos, function (value, key) {
                var formatJSON = {
                    idLiquidacionAbono: value
                };
                cruceReferenciasControl.listadoAbonos.push(formatJSON);
            });
            var cruce = {
                idUsuario: localStorageService.get("autorizacion").objectResponse.userDto.id,
                idLiquidacion: cruceReferenciasControl.nuevoCruce.idLiquidacion,
                valorTotal: cruceReferenciasControl.nuevoCruce.saldo,
                diferencia: cruceReferenciasControl.nuevoCruce.total - cruceReferenciasControl.nuevoCruce.saldo,
                cruceReferenciaDetalleDTO: cruceReferenciasControl.listadoAbonos,
                aplicaSupletorio: cruceReferenciasControl.nuevoCruce.aplicaSupletorio === 'SI',
                userName: localStorageService.get('usuario').username
            };
            cruceReferenciasService.guardarCruce(cruce).then(function (data) {
                appConstant.CERRAR_SWAL();
                switch (data.tipo) {
                    case 200:
                        appConstant.MSG_GROWL_OK(data.message);
                        cruceReferenciasControl.nuevoCruce.codigoReferencia = null;
                        cruceReferenciasControl.onLimpiar();
                        cruceReferenciasControl.listaDetalleLiquidacionBuscada = [];
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

        cruceReferenciasControl.onGenerarReporte = function (datosObj) {
            appConstant.MSG_REPORTE();
            appConstant.CARGANDO();
            cruceReferenciasControl.item = [];
            var headers = {
                Authorization: localStorageService.get('autorizacion').token,
                Campus: localStorageService.get('autorizacion').objectResponse.idUniversidad
            };
            var objReportEstudiante = {
                liquidacioReporte: datosObj
            };
            var jsonString = JSON.stringify(objReportEstudiante);
            jsonString = "2" + jsonString;
            var urlRequest = '/api/financiero/report/crearReport/';
            $http.post(urlRequest, jsonString, headers).then(function (data) {
                appConstant.CERRAR_SWAL();
                cruceReferenciasControl.item.push(data.data.message);
                getIdArchivo(cruceReferenciasControl.item[0]);
            });
        };

        function getIdArchivo(itemId) {
            cruceReferenciasControl.itemArchivo = "";
            cruceReferenciasControl.itemArchivo = itemId;
            cruceReferenciasControl.download(cruceReferenciasControl.itemArchivo);
        }

        cruceReferenciasControl.download = function (itemArc) {
            var file = utilServices.downloadArchivo(itemArc, appConstant.MICRO_SERVICIO_FINANCIERO);
            if (file !== null && itemArc !== null && itemArc !== undefined) {
                utilServices.downloadReporte(file, itemArc);
            }
        };

        init();
    }
})();