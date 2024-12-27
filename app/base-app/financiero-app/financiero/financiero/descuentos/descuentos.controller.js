(function () {
    'use strict';
    angular.module('mytodoApp').controller('gestionDescuentoCtrl', gestionDescuentoCtrl);
    gestionDescuentoCtrl.$inject = ['$scope', '$http', 'gestionDescuentoService', 'liquidarMatriculaService', 'growl', 'ValidationService', 'appConstant', 'utilServices', 'appGenericConstant'];
    function gestionDescuentoCtrl($scope, $http, gestionDescuentoService, liquidarMatriculaService, growl, ValidationService, appConstant, utilServices, appGenericConstant) {
        var gestionDescuentoControl = this;
        gestionDescuentoControl.nuevoDescuento = gestionDescuentoService.nuevoDescuento;
        gestionDescuentoControl.nuevoDescuentoAux = gestionDescuentoService.gestionDescuentosAuxiliar;
        gestionDescuentoControl.nuevoDescuentoAuxTotal = gestionDescuentoService.gestionDescuentosAuxTotal;
        gestionDescuentoControl.datosEstudianteSer = gestionDescuentoService.datosEstudianteSer;
        gestionDescuentoControl.listaDetalleConceptoFacturacion = [];
        gestionDescuentoControl.listaEstudianteDescuento = [];
        gestionDescuentoControl.reporteJsonData;
        gestionDescuentoControl.nuevoDescuentoAux.onDeshabilitar = false;
        gestionDescuentoControl.codigoEstudianteCampo = "";
        function onConsultarDescuentos() {
            gestionDescuentoService.consultarDescuentosALiquidar().then(function (data) {
                gestionDescuentoControl.listaDescuentosAFacturar = data;
            });
        }
        
        gestionDescuentoControl.onConsultarEstudianteDescuento = function() {
            gestionDescuentoService.consultarEstudianteDescuento().then(function (data) {
                gestionDescuentoControl.listaEstudianteDescuento = data;
            });
        }
        gestionDescuentoControl.options = appConstant.FILTRO_TABLAS;

        gestionDescuentoControl.selectedOption = gestionDescuentoControl.options[1];

        gestionDescuentoControl.report = {
            selected: null
        };

        gestionDescuentoControl.onLimpiar = function () {
            gestionDescuentoControl.nuevoDescuento.codigoEstudianteCampo = null;
            gestionDescuentoControl.nuevoDescuento.id = null;
            gestionDescuentoControl.nuevoDescuento.idPeriodo = null;
            gestionDescuentoControl.nuevoDescuento.nombre = null;
            gestionDescuentoControl.nuevoDescuento.apellido = null;
            gestionDescuentoControl.nuevoDescuento.nombresCompleto = null;
            gestionDescuentoControl.nuevoDescuento.documentoCompleto = null;
            gestionDescuentoControl.nuevoDescuento.tipoDocumento = null;
            gestionDescuentoControl.nuevoDescuento.identificacion = null;
            gestionDescuentoControl.nuevoDescuento.periodoActual = null;
            gestionDescuentoControl.listaProgramas = [];
            gestionDescuentoControl.nuevoDescuentoAux.onDeshabilitar = false;
            gestionDescuentoControl.nuevoDescuento.idPrograma = null;
            gestionDescuentoControl.nuevoDescuento.idEstudiante = null;
            gestionDescuentoControl.nuevoDescuento.nivelFormacion = null;
            gestionDescuentoControl.nuevoDescuento.programaNombre = null;
            gestionDescuentoControl.nuevoDescuento.jornada = null;
            gestionDescuentoControl.nuevoDescuento.semestre = null;
            gestionDescuentoControl.listaDetalleConceptoFacturacion = [];
            gestionDescuentoControl.nuevoDescuento.conceptoAFacturar = null;
            new ValidationService().resetForm($scope.formConsultarEstudiante);
        };

        gestionDescuentoControl.onConsultarEstudiante = function () {
            var codEstudiante = gestionDescuentoControl.nuevoDescuento.codigoEstudianteCampo;
            if (new ValidationService().checkFormValidity($scope.formConsultarEstudiante)) {
                gestionDescuentoService.consultarEstudiante(codEstudiante, 'DescuentoCont').then(function (data) {
                    switch (data.tipo) {
                        case 200:
                            gestionDescuentoControl.nuevoDescuento.id = data.objectResponse.id;
                            gestionDescuentoControl.nuevoDescuento.idPeriodo = data.objectResponse.idPeriodo;
                            gestionDescuentoControl.nuevoDescuento.nombre = data.objectResponse.nombre;
                            gestionDescuentoControl.nuevoDescuento.apellido = data.objectResponse.apellido;
                            gestionDescuentoControl.nuevoDescuento.nombresCompleto = data.objectResponse.nombre + " " + data.objectResponse.apellido;
                            gestionDescuentoControl.nuevoDescuento.documentoCompleto = data.objectResponse.tipoDocumento + " " + data.objectResponse.identificacion;
                            gestionDescuentoControl.nuevoDescuento.tipoDocumento = data.objectResponse.tipoDocumento;
                            gestionDescuentoControl.nuevoDescuento.identificacion = data.objectResponse.identificacion;
                            gestionDescuentoControl.nuevoDescuento.periodoActual = data.objectResponse.periodoActual;
                            gestionDescuentoControl.listaProgramas = data.objectResponse.estudiantePrograma;
                            break;
                        case 409:
                            appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                            gestionDescuentoControl.nuevoDescuentoAux.onDeshabilitar = false;
                            break;
                        default:
                            appConstant.MSG_GROWL_ERROR();
                            break;
                    }
                });
            }
        };

        gestionDescuentoControl.onCambiarPrograma = function () {
            if (gestionDescuentoControl.nuevoDescuento.idProgramaSelected !== null) {
                var index = gestionDescuentoControl.listaProgramas.indexOf(gestionDescuentoControl.nuevoDescuento.idProgramaSelected);
                gestionDescuentoControl.nuevoDescuentoAux.onDeshabilitar = true;
                gestionDescuentoControl.nuevoDescuento.idPrograma = gestionDescuentoControl.listaProgramas[index].idPrograma;
                gestionDescuentoControl.nuevoDescuento.idEstudiante = gestionDescuentoControl.listaProgramas[index].idEstudiante;
                gestionDescuentoControl.nuevoDescuento.nivelFormacion = gestionDescuentoControl.listaProgramas[index].nivelFormacion;
                gestionDescuentoControl.nuevoDescuento.programaNombre = gestionDescuentoControl.listaProgramas[index].programa;
                gestionDescuentoControl.nuevoDescuento.jornada = gestionDescuentoControl.listaProgramas[index].jornada;
                gestionDescuentoControl.nuevoDescuento.semestre = gestionDescuentoControl.listaProgramas[index].semestre;
            } else {
                gestionDescuentoControl.nuevoDescuentoAux.onDeshabilitar = false;
            }
        };

        gestionDescuentoControl.onCambiarConcepto = function () {
            if (gestionDescuentoControl.nuevoDescuento.conceptoAFacturar !== null) {
                gestionDescuentoControl.listaDetalleConceptoFacturacion = [];
                var objFacturar = {
                    idEstudiante: gestionDescuentoControl.nuevoDescuento.idEstudiante,
                    idPrograma: gestionDescuentoControl.nuevoDescuento.idPrograma,
                    idPeriodo: gestionDescuentoControl.nuevoDescuento.idPeriodo,
                    idConcepto: gestionDescuentoControl.nuevoDescuento.conceptoAFacturar.id
                };
                gestionDescuentoService.consultarDetalleConceptoALiquidar(objFacturar).then(function (data) {
                    switch (data.tipo) {
                        case 200:
                            gestionDescuentoControl.total = data.objectResponse.valorLiquidado;
                            gestionDescuentoControl.idPlantilla = data.objectResponse.idPlantilla;
                            data = data.objectResponse.liquidacionConceptoDetalleDTO;
                            angular.forEach(data, function (value, key) {
                                var conceptoDetalle = {
                                    id: value.id,
                                    idPlantilla: value.idPlantilla,
                                    idLiquidacion: value.idLiquidacion,
                                    idConcepto: value.idConcepto,
                                    codigo: value.codigoConcepto,
                                    nombre: value.nombreConcepto,
                                    cantidad: value.cantidad,
                                    valor: value.valor
                                };
                                gestionDescuentoControl.listaDetalleConceptoFacturacion.push(conceptoDetalle);
                            });

                            gestionDescuentoControl.nuevoDescuento.listaDescuentosAFacturar = gestionDescuentoControl.listaDetalleConceptoFacturacion;
                            break;
                        case 409:
                            appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                            gestionDescuentoControl.nuevoDescuento.listaDescuentosAFacturar = [];
                            break;
                        default:
                            gestionDescuentoControl.nuevoDescuento.listaDescuentosAFacturar = [];
                            break;
                    }
                });
            } else {
                return;
            }
        };

        gestionDescuentoControl.onGuardar = function () {
            var liquidacionObj = {
                idPeriodo: gestionDescuentoControl.nuevoDescuento.idPeriodo,
                idEstudiante: gestionDescuentoControl.nuevoDescuento.idEstudiante,
                valorLiquidado: gestionDescuentoControl.total,
                idPlantilla: gestionDescuentoControl.idPlantilla,
                liquidacionConceptoDetalleDTO: gestionDescuentoControl.nuevoDescuento.listaDescuentosAFacturar
            };
            gestionDescuentoService.guardarLiquidacion(liquidacionObj).then(function (data) {
                switch (data.tipo) {
                    case 200:
                        appConstant.MSG_GROWL_OK(data.message);
                        gestionDescuentoControl.reporteJsonData = data.objectResponse;
                        //gestionDescuentoControl.onGenerarReporte(gestionDescuentoControl.reporteJsonData);
                        var objReportEstudiante = { liquidacioReporte: gestionDescuentoControl.reporteJsonData };
                        onGenerarReporteDirecto(objReportEstudiante, 2)
                        gestionDescuentoControl.onLimpiar();
                        break;
                    case 409:
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        break;

                }
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
                    Campus: localStorageService.get('autorizacion').objectResponse.idUniversidad
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

        gestionDescuentoControl.onGenerarReporte = function (datosObj) {
            gestionDescuentoControl.item = [];
            var headers = { 
                Authorization: localStorageService.get('autorizacion').token,
                Campus: localStorageService.get('autorizacion').objectResponse.idUniversidad
            };
            var objReportEstudiante = { liquidacioReporte: datosObj };
            var jsonString = JSON.stringify(objReportEstudiante);
            jsonString = "2" + jsonString;
            var urlRequest = '/api/financiero/report/crearReport/';
            $http.post(urlRequest, jsonString, headers).then(function (data) {
                gestionDescuentoControl.item.push(data.data.message);
                getIdArchivo(gestionDescuentoControl.item[0]);
            });
        };

        function getIdArchivo(itemId) {
            gestionDescuentoControl.itemArchivo = "";
            gestionDescuentoControl.itemArchivo = itemId;
            gestionDescuentoControl.download(gestionDescuentoControl.itemArchivo);
        }

        gestionDescuentoControl.download = function (itemArc) {
            var file = utilServices.downloadArchivo(itemArc, appConstant.MICRO_SERVICIO_FINANCIERO);
            if (file !== null && itemArc !== null && itemArc !== undefined) {
                utilServices.downloadReporte(file, itemArc);
            }
        };

        gestionDescuentoControl.onPresionarEnter = function (tecla) {
            if (tecla.keyCode === 13) {
                gestionDescuentoControl.onConsultarDescuentosEstudiante();
            }
        };

        gestionDescuentoControl.onConsultarDescuentosEstudiante = function (codigo) {
            liquidarMatriculaService.consultarEstudianteDescuento(codigo).then(function (data) {
                gestionDescuentoControl.listaDescuentosEstudiante = [];
                gestionDescuentoControl.listaDescuentosEstudiante = data;
                gestionDescuentoControl.mostrarInputBecado = data.length > 0;
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        // onConsultarDescuentos();
        // onConsultarEstudianteDescuento();

    }
})();