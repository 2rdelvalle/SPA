(function () {
    'use strict';
    angular.module('mytodoApp').controller('colegioCtrl', colegioCtrl);
    colegioCtrl.$inject = ['$scope', '$timeout', 'colegioEntityServices', 'Upload', '$location',  'ValidationService', 'localStorageService', 'utilServices', 'appConstant','appGenericConstant', 'appConstantValueList'];

    function colegioCtrl($scope, $timeout, colegioEntityServices, Upload, $location, ValidationService, localStorageService, utilServices, appConstant,appGenericConstant, appConstantValueList) {

        var gestionColegio = this;
        var idPaisColombia = appGenericConstant.PAIS_DEFECTO;
        gestionColegio.colegios = [];
        gestionColegio.listPais = [];
        gestionColegio.listDepartamento = [];
        gestionColegio.listMunicipio = [];
        gestionColegio.listEstado = [];
        gestionColegio.sector = [];
        gestionColegio.paisTemporal = colegioEntityServices.paisAuxiliar;
        gestionColegio.auxiliarListas = {};
        gestionColegio.nuevoColegio = colegioEntityServices.entidad;
        gestionColegio.colegioAux = colegioEntityServices.colegioAuxiliar;
        gestionColegio.config = {
            disableCountDown: true,
            ttl: 5000
        };
        gestionColegio.options = appConstant.FILTRO_TABLAS;

        gestionColegio.uploadPic = function (file) {
            file.upload = Upload.upload({
                url: 'https://angular-file-upload-cors-srv.appspot.com/upload'
                        //                data: {username: $scope.username, file: file},
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                // Math.min is to fix IE which reports 200% sometimes
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

                $(".progress-bar").animate({
                    width: file.progress * 14 + 14
                }, 1000);

            });
        };

        if (localStorageService.get('nuevoColegio') !== null) {
            gestionColegio.nuevoColegio = localStorageService.get('nuevoColegio');
        }

        if (localStorageService.get('auxiliarListas') !== null) {
            gestionColegio.auxiliarListas = localStorageService.get('auxiliarListas');
        }

        if (localStorageService.get('colegioAuxiliar') !== null) {
            gestionColegio.colegioAux = localStorageService.get('colegioAuxiliar');
        }

        if (gestionColegio.listDepartamento.length === 0 && localStorageService.get('listadeparatemento') !== null) {
            gestionColegio.listDepartamento = localStorageService.get('listadeparatemento');
        }

        if (gestionColegio.listMunicipio.length === 0 && localStorageService.get('listamunicipio') !== null) {
            gestionColegio.listMunicipio = localStorageService.get('listamunicipio');
        }

        gestionColegio.report = {
            selected: null
        };

        gestionColegio.onVolver = function () {
            localStorageService.remove('nuevoColegio');
        };

        gestionColegio.onLimpiar = function () {
            gestionColegio.limpiar();
            new ValidationService().resetForm($scope.formRegistrarColegios);
        };

        gestionColegio.limpiar = function () {
            gestionColegio.nuevoColegio.id = null;
            gestionColegio.nuevoColegio.codigoInstitucionAcademica = null;
            gestionColegio.nuevoColegio.nombreInstitucionAcademica = null;
            gestionColegio.nuevoColegio.idPais = null;
            gestionColegio.nuevoColegio.idDepartamento = null;
            gestionColegio.nuevoColegio.idMunicipio = null;
            gestionColegio.nuevoColegio.sectorAcademicoLV = null;
            gestionColegio.nuevoColegio.estadoLV = null;
            gestionColegio.nuevoColegio.caracterAcademicoLV = null;
            gestionColegio.nuevoColegio.prueba = null;
            $("#inputPDM").val("");
            gestionColegio.listDepartamento = [];
            gestionColegio.listMunicipio = [];
            localStorageService.remove('nuevoColegio');
        };

        gestionColegio.onAgregar = function () {
            gestionColegio.limpiar();
            gestionColegio.colegioAux.disabled = false;
            gestionColegio.colegioAux.disabledCodeField = false;
            gestionColegio.colegioAux.showEditBtn = true;
            gestionColegio.colegioAux.showClearBtn = true;
            gestionColegio.colegioAux.titleWindow = appGenericConstant.AGREGAR_INSTITUCION;
            gestionColegio.colegioAux.showeEditBtn2 = true;
            gestionColegio.colegioAux.contador = 1;
            gestionColegio.auxiliarListas.disbaledDepartamento = true;
            gestionColegio.auxiliarListas.disbaledMunicipio = true;
            gestionColegio.auxiliarListas.disabledPais = true;
            gestionColegio.auxiliarListas.errorLugar = false;

            localStorageService.set('auxiliarListas', gestionColegio.auxiliarListas);
            localStorageService.set('colegioAuxiliar', gestionColegio.colegioAux);

        };

        gestionColegio.onEdit = function (item) {
            gestionColegio.nuevoColegio.id = item.id;
            gestionColegio.nuevoColegio.codigoInstitucionAcademica = item.codigoInstitucionAcademica;
            gestionColegio.nuevoColegio.nombreInstitucionAcademica = item.nombreInstitucionAcademica;
            gestionColegio.nuevoColegio.idPais = item.idPais;
            gestionColegio.nuevoColegio.idDepartamento = item.idDepartamento;
            gestionColegio.nuevoColegio.idMunicipio = item.idMunicipio;
            gestionColegio.nuevoColegio.sectorAcademicoLV = item.sectorAcademicoLV;
            gestionColegio.nuevoColegio.estadoLV = item.estadoLV;
            gestionColegio.nuevoColegio.caracterAcademicoLV = item.caracterAcademicoLV;
            if (gestionColegio.nuevoColegio.idPais !== idPaisColombia) {
                gestionColegio.nuevoColegio.prueba = item.nombrePais;
            } else {
                gestionColegio.nuevoColegio.prueba = item.nombrePais + " - " + item.nombreDepartamento + " - " + item.nombreMunicipio;
            }
            gestionColegio.colegioAux.disabled = false;
            gestionColegio.colegioAux.disabledCodeField = true;
            gestionColegio.colegioAux.titleWindow = appGenericConstant.MODIFICAR_INSTITUCION;
            gestionColegio.colegioAux.showEditBtn = true;
            gestionColegio.colegioAux.showClearBtn = false;

            gestionColegio.auxiliarListas.disbaledDepartamento = false;
            gestionColegio.auxiliarListas.disbaledMunicipio = false;
            gestionColegio.colegioAux.disabledPais = true;
            gestionColegio.colegioAux.showeEditBtn2 = false;
            localStorageService.set('auxiliarListas', gestionColegio.auxiliarListas);
            localStorageService.set('nuevoColegio', gestionColegio.nuevoColegio);
            localStorageService.set('colegioAuxiliar', gestionColegio.colegioAux);
        };

        gestionColegio.onValidarCampoPaisDepratamentoMunicipio = function () {
            if (new ValidationService().checkFormValidity($scope.formPais)) {
                new ValidationService().resetForm($scope.formRegistrarColegios);
                var nombrePais;
                var nombreDepartamento;
                var nombreMunicipio;

                for (var i = 0; i < gestionColegio.listPais.length; i++) {
                    if (gestionColegio.listPais[i].id === gestionColegio.nuevoColegio.idPais) {
                        nombrePais = gestionColegio.listPais[i].nombrePais;
                        break;
                    }
                }
                for (var i = 0; i < gestionColegio.listDepartamento.length; i++) {
                    if (gestionColegio.listDepartamento[i].id === gestionColegio.nuevoColegio.idDepartamento) {
                        nombreDepartamento = gestionColegio.listDepartamento[i].nombreDepartamento;
                        break;
                    }
                }
                for (var i = 0; i < gestionColegio.listMunicipio.length; i++) {
                    if (gestionColegio.listMunicipio[i].id === gestionColegio.nuevoColegio.idMunicipio) {
                        nombreMunicipio = gestionColegio.listMunicipio[i].nombreMunicipio;
                        break;
                    }
                }

                if (nombrePais !== "" && nombreDepartamento !== "" && nombreMunicipio !== "") {
                    gestionColegio.auxiliarListas.errorLugar = false;
                    gestionColegio.colegioAux.disabled = false;

                    if (typeof gestionColegio.nuevoColegio.codigoInstitucionAcademica === "undefined") {
                        gestionColegio.nuevoColegio.codigoInstitucionAcademica = document.getElementById("codigo").value;
                    }

                    nombrePais = nombrePais === undefined || nombrePais === null ? '' : nombrePais;
                    nombreDepartamento = nombreDepartamento === undefined || nombreDepartamento === null ? '' : nombreDepartamento;
                    nombreMunicipio = nombreMunicipio === undefined || nombreMunicipio === null ? '' : nombreMunicipio;

                    if (gestionColegio.nuevoColegio.idPais === idPaisColombia) {
                        $("#inputPDM").val(nombrePais + " - " + nombreDepartamento + " - " + nombreMunicipio);
                        gestionColegio.nuevoColegio.prueba = nombrePais + " - " + nombreDepartamento + " - " + nombreMunicipio;
                    } else {
                        $("#inputPDM").val(nombrePais);
                        gestionColegio.nuevoColegio.prueba = nombrePais;
                    }
                    $("#inputPDM").focus();
                    $("button").focus();
                    $("#modalPais").hide();
                }
            }
        };

        gestionColegio.activarPais = function () {
            gestionColegio.auxiliarListas.disabledPais = gestionColegio.nuevoColegio.sectorAcademicoLV === null;

        };

        gestionColegio.activarCampos = function () {
            gestionColegio.colegioAux.disabled = true;
            if (gestionColegio.nuevoColegio.id === null || gestionColegio.nuevoColegio.id === undefined) {
                gestionColegio.nuevoColegio.idPais = gestionColegio.nuevoColegio.idPais !== null ? gestionColegio.nuevoColegio.idPais : null;
                gestionColegio.nuevoColegio.idDepartamento = gestionColegio.nuevoColegio.idDepartamento !== null ? gestionColegio.nuevoColegio.idDepartamento : null;
                gestionColegio.nuevoColegio.idMunicipio = gestionColegio.nuevoColegio.idMunicipio !== null ? gestionColegio.nuevoColegio.idMunicipio : null;
            } else {
                gestionColegio.consultarDepartamentosPorPais(gestionColegio.nuevoColegio.idPais);
                gestionColegio.consultarMunicipioPorDepartamento(gestionColegio.nuevoColegio.idDepartamento);
            }
            new ValidationService().resetForm($scope.formPais);
            $("#modalPais").show();
        };

        gestionColegio.onGuardar = function () {
            if (new ValidationService().checkFormValidity($scope.formRegistrarColegios)) {
                var item = document.getElementById('inputPDM').value;
                if (gestionColegio.nuevoColegio.idPais === null || gestionColegio.nuevoColegio.idDepartamento === null || gestionColegio.nuevoColegio.idMunicipio === null) {
                    gestionColegio.auxiliarListas.errorLugar = true;
                } else {
                    gestionColegio.auxiliarListas.errorLugar = false;
                }
                if (gestionColegio.nuevoColegio.id === null || gestionColegio.nuevoColegio.id === undefined) {
                    gestionColegio.onAgregarColegio();
                } else {
                    gestionColegio.onUpdateColegio();
                }
            }
        };

        gestionColegio.onAgregarColegio = function () {
            var idEstadoActivo = 48;
            var colegio = {
                codigoInstitucionAcademica: appConstant.VALIDAR_STRING(gestionColegio.nuevoColegio.codigoInstitucionAcademica),
                nombreInstitucionAcademica: appConstant.VALIDAR_STRING(gestionColegio.nuevoColegio.nombreInstitucionAcademica),
                idPais: gestionColegio.nuevoColegio.idPais,
                idDepartamento: gestionColegio.nuevoColegio.idDepartamento,
                idMunicipio: gestionColegio.nuevoColegio.idMunicipio,
                sectorAcademicoLV: gestionColegio.nuevoColegio.sectorAcademicoLV,
                estadoLV: idEstadoActivo,
                caracterAcademicoLV: gestionColegio.nuevoColegio.caracterAcademicoLV
            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            colegioEntityServices.registrarColegio(colegio).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                    gestionColegio.onLimpiar();
                    gestionColegio.auxiliarListas.disbaledDepartamento = true;
                    gestionColegio.auxiliarListas.disbaledMunicipio = true;
                } else if (data.tipo === 500) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                } else if (data.tipo === 409) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
            });
        };

        gestionColegio.onUpdateColegio = function () {
            if (gestionColegio.validarCambios(gestionColegio.nuevoColegio)) {
                appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
                appConstant.CARGANDO();
                var colegio = {
                    id: gestionColegio.nuevoColegio.id,
                    codigoInstitucionAcademica: appConstant.VALIDAR_STRING(gestionColegio.nuevoColegio.codigoInstitucionAcademica),
                    nombreInstitucionAcademica: appConstant.VALIDAR_STRING(gestionColegio.nuevoColegio.nombreInstitucionAcademica),
                    idPais: gestionColegio.nuevoColegio.idPais,
                    idDepartamento: gestionColegio.nuevoColegio.idDepartamento,
                    idMunicipio: gestionColegio.nuevoColegio.idMunicipio,
                    sectorAcademicoLV: gestionColegio.nuevoColegio.sectorAcademicoLV,
                    estadoLV: gestionColegio.nuevoColegio.estadoLV,
                    caracterAcademicoLV: gestionColegio.nuevoColegio.caracterAcademicoLV
                };
                colegioEntityServices.modificarColegio(colegio).then(function (data) {
                    if (data.tipo === 200) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                        localStorageService.set('nuevoColegio', gestionColegio.nuevoColegio);
                        localStorageService.set('colegioAux', gestionColegio.colegioAux);
                    } else if (data.tipo === 500) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                    } else if (data.tipo === 409) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                    } else {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    }
                }).catch(function (e) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();

                });
            }
        };

        gestionColegio.onEliminarColegio = function (item) {
            gestionColegio.report.selected.length = [];
            swal({
                title: appGenericConstant.PREG_ELIMINAR_INSTITUCION,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                var entidadColegio = {
                    id: item.id
                };
                colegioEntityServices.eliminarColegio(entidadColegio.id).then(function (data) {
                    if (data.tipo === 200) {
                        swal(appGenericConstant.INSTITUCION_ELIMINADA,
                                appGenericConstant.INSTITUCION_ELIMINADA_SATIS,
                                appGenericConstant.SUCCESS);
                        gestionColegio.limpiar();
                        gestionColegio.report.selected.length = null;
                        gestionColegio.ejecutarConsultarColegios();
                    } else if (data.tipo === 409) {
                        swal(appGenericConstant.ALTO_AHI,
                                appGenericConstant.INSTITUCION_NO_ELIMINADA,
                                appGenericConstant.WARNING);
                    } else {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                    }
                }).catch(function (e) {
                    appConstant.MSG_GROWL_ERROR();

                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    gestionColegio.report.selected = [];
                }
            });
        };


        gestionColegio.onEliminarMasivo = function () {
            swal({
                title: appGenericConstant.PREG_ELIMINAR_INSTITUCIONES,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                angular.forEach(gestionColegio.report.selected, function (value, key) {
                    var entidadColegio = {
                        codigo: value.codigo,
                        nombre: value.nombre,
                        pais: value.pais,
                        departamento: value.departamento,
                        municipio: value.municipio,
                        sector: value.sector,
                        estado: value.estado,
                        id: value.id
                    };
                    colegioEntityServices.eliminarColegio(entidadColegio).then(function (data) {
                        swal(appGenericConstant.INSTITUCIONES_ELIMINADAS,
                                appGenericConstant.INSTITUCIONES_ELIMINADAS_SATIS,
                                appGenericConstant.SUCCESS);
                        gestionColegio.ejecutarConsultarColegios();
                    });
                });
                gestionColegio.report.selected.length = null;
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    return;
                }
            });
        };

        gestionColegio.onVerColegio = function (item) {
            gestionColegio.nuevoColegio.id = item.id;
            gestionColegio.nuevoColegio.codigoInstitucionAcademica = item.codigoInstitucionAcademica;
            gestionColegio.nuevoColegio.nombreInstitucionAcademica = item.nombreInstitucionAcademica;
            gestionColegio.nuevoColegio.idPais = item.idPais;
            gestionColegio.nuevoColegio.idDepartamento = item.idDepartamento;
            gestionColegio.nuevoColegio.idMunicipio = item.idMunicipio;
            gestionColegio.nuevoColegio.sectorAcademicoLV = item.sectorAcademicoLV;
            gestionColegio.nuevoColegio.estadoLV = item.estadoLV;
            gestionColegio.nuevoColegio.caracterAcademicoLV = item.caracterAcademicoLV;
            if (gestionColegio.nuevoColegio.idPais !== idPaisColombia) {
                gestionColegio.nuevoColegio.prueba = item.nombrePais;
            } else {
                gestionColegio.nuevoColegio.prueba = item.nombrePais + " - " + item.nombreDepartamento + " - " + item.nombreMunicipio;
            }
            gestionColegio.colegioAux.showeEditBtn2 = true;
            gestionColegio.colegioAux.disabled = true;
            gestionColegio.colegioAux.disabledCodeField = true;
            gestionColegio.colegioAux.titleWindow = appGenericConstant.DETALLE_INSTITUCION;
            gestionColegio.colegioAux.showEditBtn = false;
            gestionColegio.colegioAux.showClearBtn = false;
            $location.path('/gestionar-institucion');
            localStorageService.set('colegioAuxiliar', gestionColegio.colegioAux);
            localStorageService.set('nuevoColegio', gestionColegio.nuevoColegio);
        };

        gestionColegio.ejecutarConsultarColegios = function () {
            if ($location.path() === '/institucion') {
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
            }
            colegioEntityServices.buscarColegio().then(function (data) {
                var colegio = {};
                gestionColegio.colegios = [];
                angular.forEach(data, function (value, key) {
                    if (value.nombreInstitucionAcademica !== appGenericConstant.OTRO) {
                        colegio = {
                            id: value.id,
                            codigoInstitucionAcademica: value.codigoInstitucionAcademica,
                            nombreInstitucionAcademica: value.nombreInstitucionAcademica,
                            idPais: value.idPais,
                            idDepartamento: value.idDepartamento,
                            idMunicipio: value.idMunicipio,
                            nombrePais: value.nombrePais,
                            nombreDepartamento: value.nombreDepartamento,
                            nombreMunicipio: value.nombreMunicipio,
                            sectorAcademicoLV: value.sectorAcademicoLV,
                            estadoLV: value.estadoLV,
                            caracterAcademicoLV: value.caracterAcademicoLV,
                            nombreSector: value.nombreSector,
                            nombreEstado: value.nombreEstado,
                            nombreCaracterAcademico: value.nombreCaracterAcademico,
                            colegioOtro: value.codigoInstitucionAcademica === appGenericConstant.OTRO_CODE
                        };
                        gestionColegio.colegios.push(colegio);
                    }
                });
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                return;
            });

        };

        gestionColegio.ejecutarConsultarPais = function () {
            colegioEntityServices.buscarPais().then(function (data) {
                var pais = {};
                gestionColegio.listPais = [];
                angular.forEach(data, function (value, key) {
                    pais = {
                        id: value.id,
                        codigoPais: value.codigoPais.codigoPais,
                        nombrePais: value.nombrePais.nombrePais
                    };
                    gestionColegio.listPais.push(pais);
                });
            }).catch(function (e) {
                return;
            });
        };

        gestionColegio.ejecutarListadoEstados = function () {
            gestionColegio.listEstado = [];
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_ESTADO, 'configeneral').then(function (data) {
                var estado = {};
                angular.forEach(data, function (value, key) {
                    estado = {
                        codigo: value.codigo,
                        categoria: value.categoria,
                        valor: value.valor
                    };
                    gestionColegio.listEstado.push(estado);
                });
            }).catch(function (e) {
                return;
            });
        };

        gestionColegio.ejecutarListadoSectores = function () {
            gestionColegio.sector = [];
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_SECTOR_COLEGIO, 'configeneral').then(function (data) {
                var sector = {};
                angular.forEach(data, function (value, key) {
                    sector = {
                        codigo: value.codigo,
                        categoria: value.categoria,
                        valor: value.valor
                    };
                    gestionColegio.sector.push(sector);
                });
            }).catch(function (e) {
                return;
            });
        };

        gestionColegio.ejecutarListadoCaracterAcademico = function () {
            gestionColegio.listCaracterAcademico = [];
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_CARACTER_ACADEMICO, 'configeneral').then(function (data) {
                var caracterAcademico = {};
                angular.forEach(data, function (value, key) {
                    caracterAcademico = {
                        codigo: value.codigo,
                        categoria: value.categoria,
                        valor: value.valor
                    };
                    gestionColegio.listCaracterAcademico.push(caracterAcademico);
                });
            }).catch(function (e) {
                return;
            });
        };

        gestionColegio.modalCerrar = function () {
            gestionColegio.colegioAux.disabled = false;
            gestionColegio.auxiliarListas.disbaledDepartamento = true;
            gestionColegio.auxiliarListas.disbaledMunicipio = true;
            if (localStorageService.get('nuevoColegio') !== null) {
                gestionColegio.nuevoColegio.idPais = localStorageService.get('nuevoColegio').idPais;
                gestionColegio.nuevoColegio.idDepartamento = localStorageService.get('nuevoColegio').idDepartamento;
                gestionColegio.nuevoColegio.idMunicipio = localStorageService.get('nuevoColegio').idMunicipio;

                var nombrePais;
                var nombreDepartamento;
                var nombreMunicipio;

                for (var i = 0; i < gestionColegio.listPais.length; i++) {
                    if (gestionColegio.listPais[i].id === gestionColegio.nuevoColegio.idPais) {
                        nombrePais = gestionColegio.listPais[i].nombrePais;
                        break;
                    }
                }
                for (var i = 0; i < gestionColegio.listDepartamento.length; i++) {
                    if (gestionColegio.listDepartamento[i].id === gestionColegio.nuevoColegio.idDepartamento) {
                        nombreDepartamento = gestionColegio.listDepartamento[i].nombreDepartamento;
                        break;
                    }
                }
                for (var i = 0; i < gestionColegio.listMunicipio.length; i++) {
                    if (gestionColegio.listMunicipio[i].id === gestionColegio.nuevoColegio.idMunicipio) {
                        nombreMunicipio = gestionColegio.listMunicipio[i].nombreMunicipio;
                        break;
                    }
                }

                if (nombrePais !== "" && nombreDepartamento !== "" && nombreMunicipio !== "") {
                    gestionColegio.auxiliarListas.errorLugar = false;
                    gestionColegio.colegioAux.disabled = false;

                    if (typeof gestionColegio.nuevoColegio.codigoInstitucionAcademica === "undefined") {
                        gestionColegio.nuevoColegio.codigoInstitucionAcademica = document.getElementById("codigo").value;
                    }
                    nombrePais = nombrePais === undefined || nombrePais === null ? '' : nombrePais;
                    nombreDepartamento = nombreDepartamento === undefined || nombreDepartamento === null ? '' : nombreDepartamento;
                    nombreMunicipio = nombreMunicipio === undefined || nombreMunicipio === null ? '' : nombreMunicipio;

                    if (gestionColegio.nuevoColegio.idPais === idPaisColombia) {
                        $("#inputPDM").val(nombrePais + " - " + nombreDepartamento + " - " + nombreMunicipio);
                        gestionColegio.nuevoColegio.prueba = nombrePais + " - " + nombreDepartamento + " - " + nombreMunicipio;
                    } else {
                        $("#inputPDM").val(nombrePais);
                        gestionColegio.nuevoColegio.prueba = nombrePais;
                    }
                    $("#inputPDM").focus();
                    $("button").focus();
                }
            }
            $("#modalPais").hide();
        };

        gestionColegio.onLimpiarModal = function () {
            gestionColegio.auxiliarListas.disbaledDepartamento = true;
            gestionColegio.auxiliarListas.disbaledMunicipio = true;
            gestionColegio.nuevoColegio.idPais = null;
            gestionColegio.nuevoColegio.idDepartamento = null;
            gestionColegio.nuevoColegio.idMunicipio = null;
            localStorageService.remove('listadeparatemento');
            localStorageService.remove('listamunicipio');
            gestionColegio.listDepartamento = [];
            gestionColegio.listMunicipio = [];
        };

        gestionColegio.consultarDepartamentosPorPais = function (item) {
            if (item === null || item !== idPaisColombia) {
                gestionColegio.auxiliarListas.disbaledDepartamento = true;
                gestionColegio.auxiliarListas.disbaledMunicipio = true;
                gestionColegio.listDepartamento = [];
                return;
            }
            colegioEntityServices.buscarDepartamentoByIdPais(item).then(function (data) {
                var departamento = {};
                gestionColegio.listDepartamento = [];
                angular.forEach(data, function (value, key) {
                    departamento = {
                        id: value.id,
                        codigoDepartamento: value.codigoDepartamento,
                        nombreDepartamento: value.nombreDepartamento,
                        idPais: value.idPais
                    };
                    gestionColegio.listDepartamento.push(departamento);
                    if (localStorageService.get('colegioAuxiliar').contador === 1) {

                    }
                });
                gestionColegio.auxiliarListas.disbaledDepartamento = false;
            }).catch(function (e) {
                return;
            });
        };

        gestionColegio.consultarMunicipioPorDepartamento = function (item) {
            if (item === null) {
                gestionColegio.auxiliarListas.disbaledMunicipio = true;
                gestionColegio.listMunicipio = [];
                return;
            }
            colegioEntityServices.buscarMunicipioByIdDepartamento(item).then(function (data) {
                var municipio = {};
                gestionColegio.listMunicipio = [];
                angular.forEach(data, function (value, key) {
                    municipio = {
                        id: value.id,
                        codigoMunicipio: value.codigoMunicipio,
                        nombreMunicipio: value.nombreMunicipio,
                        idDepartamento: value.idDepartamento
                    };
                    gestionColegio.listMunicipio.push(municipio);
                });
                gestionColegio.auxiliarListas.disbaledMunicipio = false;
            }).catch(function (e) {
                return;
            });
        };

        gestionColegio.validarCambios = function (entidadColegio) {

            var accionEditar = false;

            if (localStorageService.get('nuevoColegio').id !== entidadColegio.id) {
                accionEditar = true;
            }

            if (localStorageService.get('nuevoColegio').codigoInstitucionAcademica !== entidadColegio.codigoInstitucionAcademica) {
                accionEditar = true;
            }

            if (localStorageService.get('nuevoColegio').nombreInstitucionAcademica !== entidadColegio.nombreInstitucionAcademica) {
                accionEditar = true;
            }

            if (localStorageService.get('nuevoColegio').idPais !== entidadColegio.idPais) {
                accionEditar = true;
            }

            if (localStorageService.get('nuevoColegio').idDepartamento !== entidadColegio.idDepartamento) {
                accionEditar = true;
            }

            if (localStorageService.get('nuevoColegio').idMunicipio !== entidadColegio.idMunicipio) {
                accionEditar = true;
            }

            if (localStorageService.get('nuevoColegio').sectorAcademicoLV !== entidadColegio.sectorAcademicoLV) {
                accionEditar = true;
            }

            if (localStorageService.get('nuevoColegio').estadoLV !== entidadColegio.estadoLV) {
                accionEditar = true;
            }

            if (localStorageService.get('nuevoColegio').caracterAcademicoLV !== entidadColegio.caracterAcademicoLV) {
                accionEditar = true;
            }
            return accionEditar;
        };

        if (gestionColegio.listDepartamento.length === 0 && localStorageService.get('listadeparatemento') !== null) {
            gestionColegio.listDepartamento = localStorageService.get('listadeparatemento');
        }

        if (gestionColegio.listMunicipio.length === 0 && localStorageService.get('listamunicipio') !== null) {
            gestionColegio.listMunicipio = localStorageService.get('listamunicipio');
        }


        gestionColegio.ejecutarConsultarPais();
        gestionColegio.ejecutarConsultarColegios();
        gestionColegio.ejecutarListadoEstados();
        gestionColegio.ejecutarListadoSectores();
        gestionColegio.ejecutarListadoCaracterAcademico();

    }
})();


