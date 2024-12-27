(function () {
    'use strict';
    angular.module('mytodoApp').controller('FranquiciaCtrl', FranquiciaCtrl);
    FranquiciaCtrl.$inject = ['$scope', 'franquiciaService', 'appConstant', '$location', 'growl', 'ValidationService', 'localStorageService', 'utilServices', '$interval', 'appGenericConstant'];
    function FranquiciaCtrl($scope, franquiciaService, appConstant, $location, growl, ValidationService, localStorageService, utilServices, $interval, appGenericConstant) {
        var gestionFranquicia = this;
        var config = {};
        gestionFranquicia.date = new Date();
        gestionFranquicia.lista = [];
        gestionFranquicia.listaFranquiciasActivas = [];
        gestionFranquicia.options = appConstant.FILTRO_TABLAS;
        gestionFranquicia.selectedOption = gestionFranquicia.options[0];
        gestionFranquicia.id;
        gestionFranquicia.franquiciaEntity = franquiciaService.franquicia;
        gestionFranquicia.franquiciaEntityConvenio = franquiciaService.franquiciaConvenio;
        gestionFranquicia.report = { selected: null };
        gestionFranquicia.franquiciaVisor = franquiciaService.franquiciaAuxiliar;
        gestionFranquicia.listaFranquicias = [];
        gestionFranquicia.listaBancos = [];
        gestionFranquicia.listEstados = [];
        gestionFranquicia.datapickerDT;
        gestionFranquicia.mensajeValidacion = true;
        gestionFranquicia.fechaActual = new Date();
        var fecha;
        gestionFranquicia.counter = 0;

        gestionFranquicia.open1 = function () {
            gestionFranquicia.popup1.opened = true;
        };

        gestionFranquicia.popup1 = {
            opened: false
        };

        gestionFranquicia.regex = "[a-zA-Z0-9]+";
        gestionFranquicia.regex2 = "[0-9]+";

        gestionFranquicia.clickToVolver = function () {
            gestionFranquicia.franquiciaVisor.onDeshabilitar = false;
            gestionFranquicia.franquiciaVisor.onDeshabilitarCodigo = false;
            gestionFranquicia.franquiciaVisor.showNewInput = false;
            consultarConvenios();
            limpiar();
            new ValidationService().checkFormValidity($scope.formRegitroFranquicia);
        };

        if (localStorageService.get('franquicia') !== null) {
            gestionFranquicia.franquiciaEntity = localStorageService.get('franquicia');
        }

        if (localStorageService.get('franquiciaAux') !== null) {
            var evento = localStorageService.get('franquiciaAux');
            gestionFranquicia.franquiciaVisor = evento;
        }

        gestionFranquicia.crearFranquiciante = function () {
            gestionFranquicia.franquiciaVisor.onDeshabilitar = true;
            gestionFranquicia.franquiciaVisor.onDeshabilitarCodigo = true;
            gestionFranquicia.franquiciaVisor.showNewInput = true;
            gestionFranquicia.franquiciaVisor.disabledButton = true;
            gestionFranquicia.franquiciaVisor.hideButton = false;
            gestionFranquicia.franquiciaEntityConvenio = {};
        };

        gestionFranquicia.CancelarcrearFranquiciante = function () {
            gestionFranquicia.franquiciaVisor.onDeshabilitar = false;
            gestionFranquicia.franquiciaVisor.onDeshabilitarCodigo = false;
            gestionFranquicia.franquiciaVisor.showNewInput = false;
            gestionFranquicia.franquiciaVisor.disabledButton = false;
            gestionFranquicia.franquiciaVisor.hideButton = false;
            gestionFranquicia.franquiciaEntity.franquiciante = '';
        };


        gestionFranquicia.clickToUpdate = function () {
            if (gestionFranquicia.report.selected.length !== 0) {
                if (gestionFranquicia.report.selected.length === 1) {
                    ngDialog.open({ template: 'base-app/financiero-app/financiero/financiero/franquicias/gestionFranquicia.html', className: 'ngdialog-theme-default', closeByDocument: false });
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.HA_SELECCIONADO_ELEMENTOS);
                }
            } else {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.HA_SELECCIONADO_ELEMENTOS);
            }
        };

        function limpiar() {
            gestionFranquicia.franquiciaEntity.codigoFranquicia = "";
            gestionFranquicia.franquiciaEntity.descuentoFranquicia = "";
            gestionFranquicia.franquiciaEntity.fechaInicioFranquicia = null;
            gestionFranquicia.franquiciaEntity.fechaFinFranquicia = null;
            gestionFranquicia.franquiciaEntity.idConvenio = "";
            gestionFranquicia.franquiciaEntity.idBanco = "";
            gestionFranquicia.franquiciaEntity.estadoFranquicia = "";
            localStorageService.set('franquicia', {});
            localStorageService.set('franquiciaAux', {});
        }

        gestionFranquicia.editarFranquicia = function (item) {
            gestionFranquicia.franquiciaVisor.onDeshabilitar = false;
            gestionFranquicia.franquiciaVisor.onDeshabilitarCodigo = true;
            gestionFranquicia.franquiciaVisor.hideButton = false;
            gestionFranquicia.franquiciaEntity.codigoFranquicia = item.codigoFranquicia;
            gestionFranquicia.franquiciaEntity.descuentoFranquicia = item.descuentoFranquicia;
            gestionFranquicia.franquiciaEntity.estadoFranquicia = item.estadoFranquicia;
            gestionFranquicia.franquiciaEntity.idEstado = item.idEstado;
            gestionFranquicia.franquiciaEntity.fechaInicioFranquicia = formattedDate(item.fechaInicioFranquicia);
            gestionFranquicia.franquiciaEntity.fechaFinFranquicia = formattedDate(item.fechaFinFranquicia);
            gestionFranquicia.franquiciaEntity.idConvenio = item.idConvenio;
            gestionFranquicia.franquiciaEntity.idBanco = item.idBanco;
            gestionFranquicia.franquiciaEntity.id = item.id;
            gestionFranquicia.franquiciaVisor.titulo = "Modificar";
            localStorageService.set('franquicia', gestionFranquicia.franquiciaEntity);
            localStorageService.set('franquiciaAux', gestionFranquicia.franquiciaVisor);
            $location.path('/registrofranquicia');
        };

        gestionFranquicia.verDatelleFranquicia = function (item) {
            gestionFranquicia.franquiciaVisor.onDeshabilitar = true;
            gestionFranquicia.franquiciaVisor.hideButton = true;
            gestionFranquicia.franquiciaVisor.onDeshabilitarCodigo = true;
            gestionFranquicia.franquiciaEntity.codigoFranquicia = item.codigoFranquicia;
            gestionFranquicia.franquiciaEntity.descuentoFranquicia = item.descuentoFranquicia;
            gestionFranquicia.franquiciaEntity.idEstado = item.idEstado;
            gestionFranquicia.franquiciaEntity.fechaInicioFranquicia = formattedDate(item.fechaInicioFranquicia);
            gestionFranquicia.franquiciaEntity.estadoFranquicia = item.estadoFranquicia;
            gestionFranquicia.franquiciaEntity.fechaFinFranquicia = formattedDate(item.fechaFinFranquicia);
            gestionFranquicia.franquiciaEntity.idConvenio = item.idConvenio;
            gestionFranquicia.franquiciaEntity.idBanco = item.idBanco;
            gestionFranquicia.franquiciaEntity.id = item.id;
            gestionFranquicia.franquiciaVisor.titulo = "Detalle";

            localStorageService.set('franquicia', gestionFranquicia.franquiciaEntity);
            localStorageService.set('franquiciaAux', gestionFranquicia.franquiciaVisor);
            $location.path('/registrofranquicia');
        };

        function onListarConveniosAuxiliar() {
            gestionFranquicia.listaFranquiciasActivas = [];
            angular.forEach(gestionFranquicia.lista, function (value, key) {
                var franquiciaActiva = {
                    id: value.id,
                    codigoFranquicia: value.codigoFranquicia,
                    convenio: value.franquiciante.nombre,
                    banco: value.banco.nombre,
                    descuentoFranquicia: value.descuentoFranquicia,
                    estadoFranquicia: value.estadoFranquicia,
                    fechaInicioFranquicia: value.fechaInicioFranquicia,
                    fechaFinFranquicia: value.fechaFinFranquicia
                };
                gestionFranquicia.listaFranquiciasActivas.push(franquiciaActiva);
            });
        }

        function consultarEstados() {
            utilServices.buscarListaValorByCategoria('ESTADO', 'financiero').then(function (data) {
                gestionFranquicia.listEstados = data;
            });
        }

        function consultarConvenios() {
            gestionFranquicia.counter = 0;
            franquiciaService.consultar().then(function (data) {
                gestionFranquicia.listaAuxiliarfranquicia = [];
                gestionFranquicia.lista = [];
                angular.forEach(data, function (value) {
                    gestionFranquicia.listaAuxiliarfranquicia = {
                        codigoFranquicia: value.codigoFranquicia,
                        idConvenio: value.idConvenio,
                        idBanco: value.idBanco,
                        nombreConvenio: value.nombreConvenio,
                        nombreBanco: value.nombreBanco,
                        idEstado: value.idEstado,
                        descuentoFranquicia: value.descuentoFranquicia,
                        estadoFranquicia: value.estadoFranquicia,
                        fechaInicioFranquicia: value.fechaInicioFranquicia,
                        fechaFinFranquicia: value.fechaFinFranquicia,
                        id: value.id
                    };
                    gestionFranquicia.lista.push(gestionFranquicia.listaAuxiliarfranquicia);
                });
            });
        }

        var refreshTabla = function counter() {
            gestionFranquicia.counter = gestionFranquicia.counter + 1;
            if (gestionFranquicia.counter === 10) {
                franquiciaService.consultar().then(function (data) {
                    gestionFranquicia.listaAuxiliarfranquicia = [];
                    gestionFranquicia.lista = [];
                    angular.forEach(data, function (value) {
                        gestionFranquicia.listaAuxiliarfranquicia = {
                            codigoFranquicia: value.codigoFranquicia,
                            idConvenio: value.idConvenio,
                            idBanco: value.idBanco,
                            nombreConvenio: value.nombreConvenio,
                            nombreBanco: value.nombreBanco,
                            idEstado: value.idEstado,
                            descuentoFranquicia: value.descuentoFranquicia,
                            estadoFranquicia: value.estadoFranquicia,
                            fechaInicioFranquicia: value.fechaInicioFranquicia,
                            fechaFinFranquicia: value.fechaFinFranquicia,
                            id: value.id
                        };
                        gestionFranquicia.lista.push(gestionFranquicia.listaAuxiliarfranquicia);
                    });
                });
                gestionFranquicia.counter = 0;
            }
        }

        //

        gestionFranquicia.cancelarInterval = function () {
            //
        }

        gestionFranquicia.onGuardar = function () {
            if (new ValidationService().checkFormValidity($scope.formRegitroFranquicia)) {
                if (!gestionFranquicia.validarCambios(gestionFranquicia.franquiciaEntity)) {
                    gestionFranquicia.regitrarFranquicia();
                    new ValidationService().resetForm($scope.formRegitroFranquicia);
                }
            }
        };

        gestionFranquicia.regitrarFranquicia = function () {
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            if (gestionFranquicia.franquiciaEntity.id === null || gestionFranquicia.franquiciaEntity.id === undefined) {
                var newFranquicia = {
                    codigoFranquicia: appConstant.VALIDAR_STRING(gestionFranquicia.franquiciaEntity.codigoFranquicia),
                    idConvenio: gestionFranquicia.franquiciaEntity.idConvenio,
                    idBanco: gestionFranquicia.franquiciaEntity.idBanco,
                    descuentoFranquicia: gestionFranquicia.franquiciaEntity.descuentoFranquicia,
                    idEstado: 48,
                    fechaInicioFranquicia: toDate(gestionFranquicia.franquiciaEntity.fechaInicioFranquicia),
                    fechaFinFranquicia: toDate(gestionFranquicia.franquiciaEntity.fechaFinFranquicia)
                };
                franquiciaService.registrar(newFranquicia).then(function (data) {
                    if (data.tipo === 200) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                        limpiar();
                    } else if (data.tipo === 409) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    } else {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                    }
                });
            } else {
                var editarFranquicia = {
                    codigoFranquicia: appConstant.VALIDAR_STRING(gestionFranquicia.franquiciaEntity.codigoFranquicia),
                    idConvenio: gestionFranquicia.franquiciaEntity.idConvenio,
                    idBanco: gestionFranquicia.franquiciaEntity.idBanco,
                    descuentoFranquicia: gestionFranquicia.franquiciaEntity.descuentoFranquicia,
                    idEstado: gestionFranquicia.franquiciaEntity.idEstado,
                    fechaInicioFranquicia: toDate(gestionFranquicia.franquiciaEntity.fechaInicioFranquicia),
                    fechaFinFranquicia: toDate(gestionFranquicia.franquiciaEntity.fechaFinFranquicia),
                    id: gestionFranquicia.franquiciaEntity.id
                };
                franquiciaService.modificar(editarFranquicia).then(function (data) {
                    if (data.tipo === 200) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                        localStorageService.set('franquicia', gestionFranquicia.franquiciaEntity);
                        localStorageService.set('franquiciaAux', gestionFranquicia.franquiciaVisor);
                    } else if (data.tipo === 500) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                    } else {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    }
                });
            }
        };

        gestionFranquicia.eliminarFranquicia = function (item) {
            swal({
                title: appGenericConstant.PREG_ELIMINAR_FRANQUICIA,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                setTimeout(function () {
                    var deleteFranquicia = {
                        id: item.id,
                        codigo: item.codigo,
                        convenio: item.convenio,
                        banco: item.banco,
                        descuento: item.descuento,
                        fechaInicio: item.fechaInicio,
                        fechaFin: item.fechaFin
                    };
                    franquiciaService.eliminar(deleteFranquicia).then(function (data) {
                        if (data) {
                            swal(appGenericConstant.FRANQUICIA_ELIMINADA,
                                appGenericConstant.FRANQUICIA_ELIMINADA_SATIS,
                                appGenericConstant.SUCCESS);
                            limpiar();
                            gestionFranquicia.report.selected.length = null;
                            consultarConvenios();
                        } else if (data.tipo === 400) {
                            swal(appGenericConstant.ALTO_AHI,
                                appGenericConstant.FRANQUICIA_NO_ELIMINADA,
                                appGenericConstant.WARNING);
                        } else {
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ERROR();
                        }
                    });

                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    return;
                }
            });
            gestionFranquicia.report.selected.length = null;
        };

        function consultarBancos() {
            franquiciaService.consultarBancos().then(function (data) {
                gestionFranquicia.listaBancos = data;
            });
        }

        function consultarFranquicias() {
            franquiciaService.consultarConvenios().then(function (data) {
                gestionFranquicia.listaFranquicias = data;
            });
        }

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

        gestionFranquicia.convertirFechas = function (dateString) {
            if (dateString !== null && dateString !== undefined && dateString !== "") {
                return toDate(dateString);
            }
        };

        function toDate(dateStr) {
            var parts = [];
            if (dateStr.match('/')) {
                parts = dateStr.split('/');
            } else {
                parts = dateStr.split('-');
            }
            var fecha = new Date(parts[2], parts[1] - 1, parts[0]);
            return fecha;
        }

        gestionFranquicia.onRegitrarFranquiciante = function () {
            var newFranquiciante = {
                codigoConvenio: appConstant.VALIDAR_STRING(gestionFranquicia.franquiciaEntityConvenio.codigoConvenio),
                nombreConvenio: gestionFranquicia.franquiciaEntityConvenio.nombreConvenio.toUpperCase()
            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            franquiciaService.registarFranquiciante(newFranquiciante).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(appGenericConstant.CONVENIO_AGREGADO);
                    consultarFranquicias();
                    gestionFranquicia.franquiciaEntityConvenio = {};
                    gestionFranquicia.franquiciaVisor.onDeshabilitar = false;
                    gestionFranquicia.franquiciaVisor.onDeshabilitarCodigo = false;
                    gestionFranquicia.franquiciaVisor.showNewInput = false;
                    gestionFranquicia.franquiciaVisor.disabledButton = false;
                    gestionFranquicia.franquiciaVisor.hideButton = false;
                } else if (data.tipo === 500) {
                    appConstant.MSG_GROWL_ERROR();
                    appConstant.CERRAR_SWAL();
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.EXISTE_CODIGO_INGRESADO);
                    appConstant.CERRAR_SWAL();
                }

            });
        };

        gestionFranquicia.onUpdateEstado = function () {
            consultarFranquicias();
        };

        gestionFranquicia.onRefrescar = function () {
            limpiar();
            localStorageService.set('franquicia', {});
            localStorageService.set('franquiciaAux', {});
            gestionFranquicia.franquiciaVisor.onDeshabilitar = false;
            gestionFranquicia.franquiciaVisor.onDeshabilitarCodigo = false;
            gestionFranquicia.franquiciaVisor.showNewInput = false;
            gestionFranquicia.franquiciaVisor.disabledButton = false;
            gestionFranquicia.franquiciaVisor.hideButton = false;
            gestionFranquicia.franquiciaVisor.titulo = appGenericConstant.AGREGAR;

            localStorageService.set('franquiciaAux', gestionFranquicia.franquiciaVisor);
            $location.path('/registrofranquicia');
        };

        function compararFechas(fechaInicial, fechaFinal) {
            if (fechaInicial <= fechaFinal) {
                return true;
            } else {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.FECHA_INICIO_MAYO_FINAL);
                return false;
            }
        }

        gestionFranquicia.validateConvenio = function () {
            var isValid = false;
            if ((typeof gestionFranquicia.franquiciaEntityConvenio.nombreConvenio !== "undefined"
                && typeof gestionFranquicia.franquiciaEntityConvenio.codigoConvenio !== "undefined") &&
                (gestionFranquicia.franquiciaEntityConvenio.codigoConvenio !== ""
                    && gestionFranquicia.franquiciaEntityConvenio.nombreConvenio !== "") &&
                (gestionFranquicia.franquiciaEntityConvenio.codigoConvenio !== null
                    && gestionFranquicia.franquiciaEntityConvenio.nombreConvenio !== null)) {
                isValid = true;
            }
            return isValid;
        };


        gestionFranquicia.onGuardarFranquiciante = function () {
            if (new ValidationService().checkFormValidity($scope.formRegitroFranquicia)) {
                if (gestionFranquicia.validateConvenio() === true) {
                    franquiciaService.consultarFranquiciante(gestionFranquicia.franquiciaEntityConvenio.nombreConvenio).then(function (data) {
                        if (typeof data === 'object' && data.length === 0) {
                            gestionFranquicia.validarFranquiciasPorCodigo();
                        } else {
                            appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.EXISTE_CONVENIO_NOMBRE);
                        }
                    });
                }
            }
        };

        gestionFranquicia.validarFranquiciasPorCodigo = function () {
            franquiciaService.consultarFranquicianteCodigo(gestionFranquicia.franquiciaEntityConvenio.codigoConvenio).then(function (data) {
                if (typeof data === 'object' && data.length === 0) {
                    gestionFranquicia.onRegitrarFranquiciante();
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.EXISTE_CONVENIO_CODIGO);
                }
            });
        };

        gestionFranquicia.onEliminarFranquiciasMasivo = function () {
            gestionFranquicia.listNoEliminados = [];
            swal({
                title: appGenericConstant.PREG_ELIMINAR_FRANQUICIAS,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                setTimeout(function () {
                    angular.forEach(gestionFranquicia.report.selected, function (value, key) {
                        var eliminarFranquiciaMasivo = {
                            id: value.id,
                            codigo: value.codigo,
                            convenio: value.convenio,
                            banco: value.banco,
                            descuento: value.descuento,
                            fechaInicio: value.fechaInicio,
                            fechaFin: value.fechaFin
                        };
                        franquiciaService.eliminar(eliminarFranquiciaMasivo).then(function (data) {
                            if (data) {
                                gestionFranquicia.lista.splice(eliminarFranquiciaMasivo, 1);
                                swal(appGenericConstant.FRANQUICIAS_ELIMINADAS,
                                    appGenericConstant.FRANQUICIAS_ELIMINADAS_SATIS,
                                    appGenericConstant.SUCCESS);
                            } else if (data.tipo === 400) {
                                swal(appGenericConstant.ALGUNOS_REGISTROS,
                                    '',
                                    appGenericConstant.WARNIGN);
                                gestionFranquicia.mensajeValidacion = true;
                                gestionFranquicia.listNoEliminados = data.objectoList;
                                consultarConvenios();
                                gestionFranquicia.report.selected.length = null;
                            } else {
                                appConstant.CERRAR_SWAL();
                                appConstant.MSG_GROWL_ERROR();
                            }
                        });
                    });
                    consultarConvenios();
                    gestionFranquicia.report.selected.length = null;
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    return;
                }
            });
        };
        gestionFranquicia.onFocus = function (idCampo) {
            fecha = $(idCampo).val();

        };

        gestionFranquicia.onBlur = function (idCampo) {
            $(idCampo).val(fecha);
        };
        gestionFranquicia.validarCambios = function (entidadFranquicia) {
            var accionGuardar = false;
            accionGuardar = entidadFranquicia.codigoFranquicia !== ""
                || typeof entidadFranquicia.codigoFranquicia !== "undefined"
                || entidadFranquicia.codigoFranquicia !== null
                || entidadFranquicia.idConvenio !== ""
                || typeof entidadFranquicia.idConvenio !== "undefined"
                || entidadFranquicia.idConvenio !== null
                || entidadFranquicia.idBanco !== ""
                || typeof entidadFranquicia.idBanco !== "undefined"
                || entidadFranquicia.idBanco !== null
                || entidadFranquicia.descuentoFranquicia !== ""
                || typeof entidadFranquicia.descuentoFranquicia !== "undefined"
                || entidadFranquicia.descuentoFranquicia !== null
                || entidadFranquicia.estadoFranquicia !== ""
                || typeof entidadFranquicia.estadoFranquicia !== "undefined"
                || entidadFranquicia.estadoFranquicia !== null
                || entidadFranquicia.fechaInicioFranquicia !== ""
                || typeof entidadFranquicia.fechaInicioFranquicia !== "undefined"
                || entidadFranquicia.fechaInicioFranquicia !== null
                || entidadFranquicia.fechaFinFranquicia !== ""
                || typeof entidadFranquicia.fechaFinFranquicia !== "undefined"
                || entidadFranquicia.fechaFinFranquicia !== null ? false : true;

            return accionGuardar;
        };

        consultarConvenios();
        onListarConveniosAuxiliar();
        consultarBancos();
        consultarFranquicias();
        consultarEstados();

    }
})();
