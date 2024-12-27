(function () {
    'use strict';
    angular.module('mytodoApp').controller('plantillaCtrl', plantillaCtrl);

    plantillaCtrl.$inject = ['$scope', '$location', 'plantillaEntitiesService', 'growl', 'ValidationService', 'localStorageService', 'utilServices', 'appConstant', '$interval', 'appGenericConstant'];
    function plantillaCtrl($scope, $location, plantillaEntitiesService, growl, ValidationService, localStorageService, utilServices, appConstant, $interval, appGenericConstant) {
        var plantillaControl = this;
        plantillaControl.plantillaEntity = plantillaEntitiesService.plantilla;
        plantillaControl.plantillaVisor = plantillaEntitiesService.plantillaAux;
        plantillaControl.listaPlantillas = [];
        plantillaControl.listaFormasPago = [];
        plantillaControl.plantillaEntity.listaConceptosFacturacion = [];
        plantillaControl.plantillaEntity.listaConceptosAsociados = [];
        plantillaControl.plantillaEntity.listaConceptosAsociadosConfig = [];
        plantillaControl.listaTiposPlantilla = [];
        plantillaControl.plantillaVisor.mensajeError = false;
        plantillaControl.plantillaVisor.conceptoFacturacionVerEditar = false;
        plantillaControl.plantillaVisor.banner = false;
        var idConceptoFacturacion;
        var idConceptoAsociado;
        var indexConceptoAsociado;
        plantillaControl.counter = 0;

        var config = {};
        if (localStorageService.get('plantilla')) {
            var plantilla = localStorageService.get('plantilla');
            plantillaControl.plantillaEntity = plantilla;
        }

        if (localStorageService.get('status') !== null) {
            var status = localStorageService.get('status');
            plantillaControl.plantillaVisor = status;
        }

        plantillaControl.getIdConceptoFacturacion = function (id) {
            if (id !== null) {
                onConsultarConceptosAsociados(id);
                plantillaControl.plantillaEntity.listaConceptosAsociadosConfig = [];
            }
        };

        plantillaControl.getIdIndexConceptoAsociado = function (item) {
            if (typeof item === 'object' && item !== null) {
                for (var i = 0; i < plantillaControl.plantillaEntity.listaConceptosAsociados.length; i++) {
                    if (item.nombre === plantillaControl.plantillaEntity.listaConceptosAsociados[i].nombre) {
                        indexConceptoAsociado = i;
                        idConceptoAsociado = plantillaControl.plantillaEntity.listaConceptosAsociados[i].id;
                        return;
                    }
                }
            }
        };

        plantillaControl.options = appConstant.FILTRO_TABLAS;

        plantillaControl.selectedOption = plantillaControl.options[0];

        plantillaControl.report = {
            selected: null
        };

        plantillaControl.onBlurValorMinimo = function () {
            if (plantillaControl.plantillaEntity.descuentoplantilla === 0) {
                plantillaControl.plantillaEntity.descuentoplantilla = 1;
            }
        };

        function onConsultarFormasPago() {
            var categoria = 'FORMA_PAGO';
            utilServices.buscarListaValorByCategoria(categoria,'financiero').then(function (data) {
                plantillaControl.listaFormasPago = data;
            });
        }

        function onConsultarTipoPlantillas() {
            var categoria = 'TIPO_PLANTILLA';
            utilServices.buscarListaValorByCategoria(categoria,'financiero').then(function (data) {
                plantillaControl.listaTiposPlantilla = data;
            });
        }

        function onConsultarConceptosFacturacion() {
            plantillaEntitiesService.buscarConceptosFacturacion().then(function (data) {
                plantillaControl.plantillaEntity.listaConceptosFacturacion = data;
                if (plantillaControl.plantillaEntity.listaConceptosFacturacion.length === 0) {
                    plantillaControl.plantillaVisor.banner = true;
                }
                else {
                    plantillaControl.plantillaVisor.banner = false;
                }
            });
        }

        function onConsultarConceptosAsociados(id) {
            plantillaEntitiesService.buscarConceptosAsociados(id).then(function (data) {
                plantillaControl.plantillaEntity.listaConceptosAsociados = data;
            });
        }

        plantillaControl.onConsultarConceptosAsociadosNoConfig = function (item) {
            plantillaEntitiesService.buscarConceptosAsociados(item.idConceptoFacturacion).then(function (data) {
                plantillaControl.plantillaEntity.listaConceptosAsociados = data;
                plantillaControl.onClickToEditar(item);
                $location.path('/plantillas-gestion');
            });

        };

        function onConsultarPlantilla() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            plantillaControl.listaPlantillas = [];
            plantillaControl.counter = 0;
            plantillaEntitiesService.buscarPlantilla().then(function (data) {
                angular.forEach(data, function (value, key) {
                    var plantillaLista =
                        {
                            id: value.id,
                            codigo: value.codigo,
                            descripcion: value.descripcion,
                            tipoPlantilla: value.tipoPlantilla,
                            idConceptoFacturacion: value.idConceptoFacturacion,
                            nombreConcepto: value.nombreConcepto,
                            literal: value.literal,
                            numeracion: value.numeracion,
                            formatoNumeracion: value.literal + '-' + value.numeracion,
                            formaPagosDTO: value.formaPagosDTO,
                            leyenda: value.leyenda,
                            detallesDTO: value.detallesDTO
                        };
                    plantillaControl.listaPlantillas.push(plantillaLista);
                });
                appConstant.CERRAR_SWAL();
            });
        }

        var refreshTabla = function counter() {
            plantillaControl.counter = plantillaControl.counter + 1;
            if (plantillaControl.counter === 10) {
                plantillaEntitiesService.buscarPlantilla().then(function (data) {
                    plantillaControl.listaPlantillas = [];
                    angular.forEach(data, function (value, key) {
                        var plantillaLista =
                            {
                                id: value.id,
                                codigo: value.codigo,
                                descripcion: value.descripcion,
                                tipoPlantilla: value.tipoPlantilla,
                                idConceptoFacturacion: value.idConceptoFacturacion,
                                nombreConcepto: value.nombreConcepto,
                                literal: value.literal,
                                numeracion: value.numeracion,
                                formatoNumeracion: value.literal + '-' + value.numeracion,
                                formaPagosDTO: value.formaPagosDTO,
                                leyenda: value.leyenda,
                                detallesDTO: value.detallesDTO
                            };
                        plantillaControl.listaPlantillas.push(plantillaLista);
                    });
                    plantillaControl.counter = 0;
                });
            }
        }

        //

        plantillaControl.cancelarInterval = function () {
            //
        }

        plantillaControl.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formAgregarPlantilla)) {
                plantillaControl.onNewRegistryPlantilla();
                new ValidationService().resetForm($scope.formAgregarPlantilla);
            }
            else {
                plantillaControl.seleccionFormaPago();
            }
        };

        plantillaControl.seleccionFormaPago = function () {
            if (plantillaControl.plantillaEntity.formaPago === undefined ||
                plantillaControl.plantillaEntity.formaPago === null ||
                plantillaControl.plantillaEntity.formaPago.length === 0) {
                plantillaControl.plantillaVisor.mensajeError = true;
            }
            else {
                plantillaControl.plantillaVisor.mensajeError = false;
            }
        };

        plantillaControl.onAgregarConceptoAsociado = function () {
            if (new ValidationService().checkFormValidity($scope.formAgregarConceptoAsociado)) {
                var nuevoConceptoAsociado = {
                    id: null,
                    idConceptoFacturacionAsociado: idConceptoAsociado,
                    idPlantillaLiquidacion: null,
                    nombreConceptoAsociado: plantillaControl.plantillaEntity.conceptosAsociados.nombre
                };
                plantillaControl.plantillaEntity.listaConceptosAsociados.splice(indexConceptoAsociado, 1);
                plantillaControl.plantillaEntity.listaConceptosAsociadosConfig.push(nuevoConceptoAsociado);
                plantillaControl.plantillaEntity.conceptosAsociados = null;
                new ValidationService().resetForm($scope.formAgregarConceptoAsociado);
            }
        };

        plantillaControl.onClickToDeleteAsociado = function (index, item) {
            var viejoConceptoAsociado = {
                nombre: item.nombreConceptoAsociado
            };
            plantillaControl.plantillaEntity.listaConceptosAsociadosConfig.splice(index, 1);
            plantillaControl.plantillaEntity.listaConceptosAsociados.push(viejoConceptoAsociado);
        };

        plantillaControl.onLimpiarRegistro = function () {
            plantillaControl.plantillaEntity.id = null;
            plantillaControl.plantillaVisor.onDeshabilitar = false;
            plantillaControl.plantillaVisor.onDeshabilitarCodigo = false;
            plantillaControl.plantillaVisor.mensajeError = false;
            plantillaControl.plantillaVisor.conceptoFacturacionVerEditar = false;
            plantillaControl.plantillaVisor.titulo = appGenericConstant.AGREGAR_PLANTILLA;
            plantillaControl.plantillaEntity.id = null;
            plantillaControl.plantillaEntity.codigo = null;
            plantillaControl.plantillaEntity.nombre = null;
            plantillaControl.plantillaEntity.tipoPlantilla = plantillaControl.listaTiposPlantilla[0].codigo;
            plantillaControl.plantillaEntity.conceptoFacturacion = null;
            plantillaControl.plantillaEntity.formatoNumeracionLiteral = null;
            plantillaControl.plantillaEntity.formatoNumeracionNumero = null;
            plantillaControl.plantillaEntity.formaPago = null;
            plantillaControl.plantillaEntity.leyenda = null;
            plantillaControl.plantillaEntity.listaConceptosAsociadosConfig = null;
            localStorageService.remove('plantilla');
            localStorageService.remove('status');
            localStorageService.set('plantilla', plantillaControl.plantillaEntity);
            localStorageService.set('status', plantillaControl.plantillaVisor);

        };

        plantillaControl.onNewRegistryPlantilla = function () {
            if (plantillaControl.plantillaEntity.id === null || plantillaControl.plantillaEntity.id === undefined) {
                var formaPagoObject = [];
                angular.forEach(plantillaControl.plantillaEntity.formaPago, function (key, value) {
                    var formaPago = {
                        idFormaPago: key
                    };
                    formaPagoObject.push(formaPago);
                });
                var newPlantilla =
                    {
                        id: null,
                        codigo: appConstant.VALIDAR_STRING(plantillaControl.plantillaEntity.codigo),
                        descripcion: appConstant.VALIDAR_STRING(plantillaControl.plantillaEntity.nombre),
                        tipoPlantilla: plantillaControl.plantillaEntity.tipoPlantilla,
                        idConceptoFacturacion: plantillaControl.plantillaEntity.conceptoFacturacion,
                        literal: appConstant.VALIDAR_STRING(plantillaControl.plantillaEntity.formatoNumeracionLiteral),
                        numeracion: plantillaControl.plantillaEntity.formatoNumeracionNumero,
                        formaPagosDTO: formaPagoObject,
                        leyenda: plantillaControl.plantillaEntity.leyenda,
                        detallesDTO: plantillaControl.plantillaEntity.listaConceptosAsociadosConfig
                    };
                plantillaEntitiesService.agregarPlantilla(newPlantilla).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            appConstant.MSG_GROWL_OK(response.message);
                            plantillaControl.onLimpiarRegistro();
                            onConsultarPlantilla();
                            onConsultarConceptosFacturacion();
                            break;
                        case 409:
                            appConstant.MSG_GROWL_ADVERTENCIA(response.message);
                            break;
                    }
                });
            }
            else {
                var formaPagoObject = [];
                angular.forEach(plantillaControl.plantillaEntity.formaPago, function (key, value) {
                    var formaPago = {
                        idFormaPago: key
                    };
                    formaPagoObject.push(formaPago);
                });
                var updatePlantilla =
                    {
                        id: plantillaControl.plantillaEntity.id,
                        codigo: appConstant.VALIDAR_STRING(plantillaControl.plantillaEntity.codigo),
                        descripcion: appConstant.VALIDAR_STRING(plantillaControl.plantillaEntity.nombre),
                        tipoPlantilla: plantillaControl.plantillaEntity.tipoPlantilla,
                        idConceptoFacturacion: plantillaControl.plantillaEntity.idConceptoFacturacion,
                        literal: appConstant.VALIDAR_STRING(plantillaControl.plantillaEntity.formatoNumeracionLiteral),
                        numeracion: plantillaControl.plantillaEntity.formatoNumeracionNumero,
                        formaPagosDTO: formaPagoObject,
                        leyenda: plantillaControl.plantillaEntity.leyenda,
                        detallesDTO: plantillaControl.plantillaEntity.listaConceptosAsociadosConfig
                    };

                plantillaEntitiesService.agregarPlantilla(updatePlantilla).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            appConstant.MSG_GROWL_OK(response.message);
                            break;
                    }
                }).catch(function (e) {
                    appConstant.MSG_GROWL_ERROR();
                    throw e;
                });
            };
        };

        plantillaControl.onClickToView = function (item) {
            var arrayFormaPago = [];
            for (var i = 0; i < item.formaPagosDTO.length; i++) {
                arrayFormaPago.push(item.formaPagosDTO[i].idFormaPago);
            }

            plantillaControl.plantillaVisor.onDeshabilitar = true;
            plantillaControl.plantillaVisor.onDeshabilitarCodigo = true;
            plantillaControl.plantillaVisor.conceptoFacturacionVerEditar = true;
            plantillaControl.plantillaVisor.titulo = appGenericConstant.DETALLE_PLANTILLA;
            plantillaControl.plantillaEntity.codigo = item.codigo;
            plantillaControl.plantillaEntity.nombre = item.descripcion;
            plantillaControl.plantillaEntity.tipoPlantilla = item.tipoPlantilla;
            plantillaControl.plantillaEntity.conceptoFacturacion = item.nombreConcepto;
            plantillaControl.plantillaEntity.formatoNumeracionLiteral = item.literal;
            plantillaControl.plantillaEntity.formatoNumeracionNumero = item.numeracion;
            plantillaControl.plantillaEntity.formaPago = arrayFormaPago;
            plantillaControl.plantillaEntity.leyenda = item.leyenda;
            plantillaControl.plantillaEntity.listaConceptosAsociadosConfig = item.detallesDTO;
            localStorageService.set('plantilla', plantillaControl.plantillaEntity);
            localStorageService.set('status', plantillaControl.plantillaVisor);
            $location.path('/plantillas-gestion');
        };

        plantillaControl.onClickToEditar = function (item) {
            var arrayFormaPago = [];
            for (var i = 0; i < item.formaPagosDTO.length; i++) {
                arrayFormaPago.push(item.formaPagosDTO[i].idFormaPago);
            }

            plantillaControl.plantillaVisor.titulo = appGenericConstant.MODIFICAR_PLANTILLA;
            plantillaControl.plantillaVisor.onDeshabilitar = false;
            plantillaControl.plantillaVisor.onDeshabilitarCodigo = true;
            plantillaControl.plantillaVisor.conceptoFacturacionVerEditar = true;
            plantillaControl.plantillaEntity.id = item.id;
            plantillaControl.plantillaEntity.codigo = item.codigo;
            plantillaControl.plantillaEntity.nombre = item.descripcion;
            plantillaControl.plantillaEntity.tipoPlantilla = item.tipoPlantilla;
            plantillaControl.plantillaEntity.conceptoFacturacion = item.nombreConcepto;
            plantillaControl.plantillaEntity.idConceptoFacturacion = item.idConceptoFacturacion;
            plantillaControl.plantillaEntity.formatoNumeracionLiteral = item.literal;
            plantillaControl.plantillaEntity.formatoNumeracionNumero = item.numeracion;
            plantillaControl.plantillaEntity.formaPago = arrayFormaPago;
            plantillaControl.plantillaEntity.leyenda = item.leyenda;
            plantillaControl.plantillaEntity.listaConceptosAsociadosConfig = item.detallesDTO;

            angular.forEach(item.detallesDTO, function (value, key) {
                for (var i = 0; i < plantillaControl.plantillaEntity.listaConceptosAsociados.length; i++) {
                    if (value.nombreConceptoAsociado === plantillaControl.plantillaEntity.listaConceptosAsociados[i].nombre) {
                        plantillaControl.plantillaEntity.listaConceptosAsociados.splice(i, 1);

                    }
                }
            });

            localStorageService.set('plantilla', plantillaControl.plantillaEntity);
            localStorageService.set('status', plantillaControl.plantillaVisor);
        };

        plantillaControl.onClickToDelete = function (item) {
            plantillaControl.report.selected.length = null;
            swal({
                title: appGenericConstant.PREG_ELIMINAR_PLANTILLA,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                plantillaEntitiesService.eliminarPlantilla(item).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            swal(
                                appGenericConstant.PLANTILLA_ELIMINADA,
                                appGenericConstant.PLANTILLA_ELIMINADA_SATIS,
                                appGenericConstant.SUCCESS
                            );
                            onConsultarPlantilla();
                            onConsultarConceptosFacturacion();
                            break;
                        case 409:
                            swal(
                                appGenericConstant.HUBO_PROBLEMA,
                                appGenericConstant.PLANTILLA_NO_ELIMINADA,
                                appGenericConstant.WARNING
                            );
                            break;
                    }
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    return
                }
            });
        };

        onConsultarPlantilla();
        onConsultarFormasPago();
        onConsultarConceptosFacturacion();
        onConsultarTipoPlantillas();
    }
})();


