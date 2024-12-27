(function () {
    'use strict';
    angular.module('mytodoApp').controller('AdmisionesCtrl', AdmisionesCtrl);
    AdmisionesCtrl.$inject = ['admisionesServices', 'inscripcionService', 'usuarioRolesService', '$location', 'localStorageService', 'utilServices', '$window', '$http', 'appConstant', 'appGenericConstant', 'appConstantValueList'];
    function AdmisionesCtrl(admisionesServices, inscripcionService, usuarioRolesService, $location, localStorageService, utilServices, $window, $http, appConstant, appGenericConstant, appConstantValueList) {
        
        var gestionAdmision = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        gestionAdmision.inscritos = [];
        gestionAdmision.nivelesFormacion = [];
        gestionAdmision.programasAcademicos = [];
        gestionAdmision.jornadas = [];
        gestionAdmision.admitidos = [];
        gestionAdmision.admitirMasivo = false;
        gestionAdmision.selectTodos = false;
        gestionAdmision.disabledCampos = false;
        gestionAdmision.disabledOnAdmitir = false;
        gestionAdmision.filtrados = [];
        gestionAdmision.admitido = inscripcionService.inscripcion;
        gestionAdmision.admision = admisionesServices.admision;
        gestionAdmision.display;
        gestionAdmision.options = appConstant.FILTRO_TABLAS;
        gestionAdmision.semestre = [{nombreNivel: 1, value: 1}, {nombreNivel: 2, value: 2}, {nombreNivel: 3, value: 3}, {nombreNivel: 4, value: 4}];
        gestionAdmision.selectedOption = gestionAdmision.options[appGenericConstant.CERO];
        gestionAdmision.report = {
            selected: null
        };
        gestionAdmision.reporteJsonData;
        gestionAdmision.validarSemestre = admisionesServices.semestreValido;
        if (localStorageService.get('inscritos') !== null) {
            gestionAdmision.inscritos = localStorageService.get('inscritos');
        }

        gestionAdmision.onLimpiar = function () {
            localStorageService.remove('inscritos');
            localStorageService.remove('admision');
        };
        if ($location.path() === '/admisiones') {
            localStorageService.remove('inscritos');
            localStorageService.remove('admision');
        }

        /*Metodo para seleccionar todos los datos de la tabla al checkear*/
        gestionAdmision.onSelectTodos = function () {
            if (gestionAdmision.selectTodos === true) {
                gestionAdmision.report.selected = gestionAdmision.filtrados.slice();
            } else {
                gestionAdmision.report.selected.length = null;
            }
        };
        /*Metodo para al presionar un tr se checkee o se descheckee el checkbox */
        gestionAdmision.onSelectSeparate = function () {
            gestionAdmision.report.selected.length = null;
            gestionAdmision.selectTodos = false;
        };
        gestionAdmision.onSelectTodosTable = function (clase, item) {
            if (gestionAdmision.report.selected.length === gestionAdmision.filtrados.length
                    && gestionAdmision.selectTodos === true) {
                gestionAdmision.selectTodos = false;
            } else {
                if (!clase) {
                    if (gestionAdmision.report.selected.length + appGenericConstant.UNO === gestionAdmision.filtrados.length
                            && gestionAdmision.selectTodos === false) {
                        gestionAdmision.selectTodos = true;
                    }
                } else {
                    gestionAdmision.selectTodos = false;
                }
            }
        };
        function onBuscarNivelesFormacion() {
            admisionesServices.buscarNivelesFormacion().then(function (data) {
                gestionAdmision.nivelesFormacion = data;
            });
        }
        function onBuscarPeriodoAcademico() {
            admisionesServices.buscarPeriodosAcademicos().then(function (data) {
                gestionAdmision.periodoAcademico = data;
                for (var i = appGenericConstant.CERO; i < gestionAdmision.periodoAcademico; i++) {
                    if (gestionAdmision.admision.periodoAcademico[i] === appGenericConstant.VACIO) {
                        gestionAdmision.admision.periodoAcademico = data[appGenericConstant.CERO].id;
                    }
                }
                if (localStorageService.get('admision') !== null) {
                    gestionAdmision.admision.periodoAcademico = localStorageService.get('admision').periodoAcademico;
                }
            });
        }
        function onConsultarListaModalidades() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_AREA_MODALIDAD, appGenericConstant.MICRO_SERVICIO_ADMISIONES).then(function (data) {
                gestionAdmision.listaModalidades = data;
            });
        }

        gestionAdmision.onBuscarJornadas = function () {
            if (gestionAdmision.admision.programa === null || gestionAdmision.admision.programa === undefined) {
                gestionAdmision.jornadas = [];
                return;
            }
            admisionesServices.buscarJornadasProgramas(gestionAdmision.admision.programa).then(function (data) {
                gestionAdmision.jornadas = data;
            });
        };
        gestionAdmision.onBuscarProgramasAcademicos = function () {
            if (gestionAdmision.admision.nivelFormacion === null || gestionAdmision.admision.nivelFormacion === undefined) {
                gestionAdmision.programasAcademicos = [];
                return;
            }
            admisionesServices.buscarProgramasAcademicos(gestionAdmision.admision.nivelFormacion).then(function (data) {
                gestionAdmision.programasAcademicos = data;
            });
        };
        gestionAdmision.onConsultarInscritos = function () {
            gestionAdmision.inscritos = [];
            gestionAdmision.admitidos = [];
            var nivel;
            var periodo;
            var modalidad;
            if ((gestionAdmision.admision.periodoAcademico === null || typeof gestionAdmision.admision.periodoAcademico === appGenericConstant.INDEFINIDO) &&
                    (gestionAdmision.admision.nivelFormacion === null || typeof gestionAdmision.admision.nivelFormacion === appGenericConstant.INDEFINIDO) &&
                    (gestionAdmision.admision.modalidad === null || typeof gestionAdmision.admision.modalidad === appGenericConstant.INDEFINIDO)) {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.CRITERIOS_DE_BUSQUEDA);
                gestionAdmision.inscritos = [];
                return;
            }
            if (gestionAdmision.admision.nivelFormacion !== null && gestionAdmision.admision.nivelFormacion !== undefined) {
                nivel = gestionAdmision.admision.nivelFormacion;
            } else {
                nivel = appGenericConstant.CERO;
            }
            if (gestionAdmision.admision.periodoAcademico !== null && gestionAdmision.admision.periodoAcademico !== undefined) {
                periodo = gestionAdmision.admision.periodoAcademico;
            } else {
                periodo = appGenericConstant.CERO;
            }
            if (gestionAdmision.admision.modalidad !== null && gestionAdmision.admision.modalidad !== undefined) {
                modalidad = gestionAdmision.admision.modalidad;
            } else {
                modalidad = appGenericConstant.CERO;
            }
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            admisionesServices.buscarInscritos(periodo, nivel, modalidad).then(function (data) {
                angular.forEach(data, function (value, key) {
                    var inscrito = {
                        id: value.id,
                        nombres: value.aspirante.nombre,
                        apellidos: value.aspirante.apellido,
                        nombreCompleto: value.aspirante.nombre + appGenericConstant.ESPACIO + value.aspirante.apellido,
                        tipodocumento: value.aspirante.identificacionAspirante.nombreTipoIdentificacion,
                        identificacion: value.aspirante.identificacionAspirante.identificacion,
                        identificacionfull: value.aspirante.identificacionAspirante.nombreTipoIdentificacion + ' ' + value.aspirante.identificacionAspirante.identificacion,
                        nombrePrograma: value.nombrePrograma,
                        estado: value.estadoInscripcion,
                        periodo: value.nombrePeriodoAcademico,
                        seccional: value.idSeccional,
                        nivelformacionId: value.idNivelFormacion,
                        nivelFormacion: value.nombreNivelFormacion,
                        programa: value.idPrograma,
                        requisitos: requisitosAspirante(value.requisitoAspirante),
                        jornada: value.idJornada,
                        nombrejornada: value.nombrejornada,
                        periodoAcademico: value.idPeriodoAcademico,
                        aspirante: value.idAspirante,
                        convenio: value.idTipoConvenio,
                        modalidad: value.idModalidad,
                        nombreModalidad: value.nombreModalidad,
                        horario: value.idHorario,
                        nombreHorario: value.nombreHorario,
                        aspiranteAdmitir: value.aspirante,
                    };
                    gestionAdmision.inscritos.push(inscrito);
                    //<editor-fold defaultstate="collapsed" desc="ver admitidos y rechazados en la misma vista">
                    //                    if (inscrito.estado === 'ADMITIDO' || inscrito.estado === 'RECHAZADO') {
                    //                        gestionAdmision.admitidos.push(inscrito);
                    //                    } else {
                    //                        gestionAdmision.inscritos.push(inscrito);
                    //                    }
                    //</editor-fold>
                });
                var temp = {
                    n: nivel, p: periodo, j: modalidad
                };
                localStorageService.set('inscritos', gestionAdmision.inscritos);
                $location.path('/admisiones');
                nivel = periodo = modalidad = null;
                if (gestionAdmision.inscritos.length === appGenericConstant.CERO) {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.CRITERIOS_DE_BUSQUEDA);
                }
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });
        };
        gestionAdmision.setPeriodo = function () {
            localStorageService.set('admision', gestionAdmision.admision);
        };
        gestionAdmision.onOpenModal = function (item) {
            gestionAdmision.report.selected.length = null;
            gestionAdmision.admitido = item;
            gestionAdmision.admitirMasivo = false;
            $("#myModal").modal("show");
        };
        gestionAdmision.onOpenModalMasivo = function () {
            gestionAdmision.disabledCampos = true;
            gestionAdmision.admitirMasivo = true;
            $("#myModal2").modal("show");
        };
        gestionAdmision.onCloseModal = function () {
            gestionAdmision.report.selected.length = null;
            gestionAdmision.disabledCampos = false;
            $("input.separate").removeClass('disabled');
            $("th.sortable").removeClass('disabled');
            $("#modalAdmisiones").hide();
            $("#modalAdmisionesMasivo").hide();
            $("#myModal").modal("hide");
            $("#myModal2").modal("hide");
            $("#myModalEntrevista").modal("hide");
        };
        gestionAdmision.onRechazar = function () {
            var rechazado = {
                id: gestionAdmision.admitido.id,
                idAspirante: gestionAdmision.admitido.aspirante,
                idSeccional: gestionAdmision.admitido.seccional,
                idTipoConvenio: gestionAdmision.admitido.convenio,
                idNivelFormacion: gestionAdmision.admitido.nivelformacionId,
                estadoInscripcion: appGenericConstant.RECHAZADO, // gestionAdmision.admitido.estado,
                idPrograma: gestionAdmision.admitido.programa,
                idPeriodoAcademico: gestionAdmision.admitido.periodoAcademico,
                idModalidad: gestionAdmision.admitido.modalidad,
                idHorario: gestionAdmision.admitido.horario,
                aspirante: gestionAdmision.admitido.aspiranteAdmitir,
                nombrePrograma: gestionAdmision.admitido.nombrePrograma,
                nombrePeriodoAcademico: gestionAdmision.admitido.periodo,
                kUsuario: gestionAdmision.usuario.id,
                userName: gestionAdmision.usuario.username
            };
            admisionesServices.actualizarAdmision(rechazado).then(function (data) {
                switch (data.tipo) {
                    case 200:
                        gestionAdmision.onCloseModal();
                        gestionAdmision.report.selected.length = null;
                        gestionAdmision.selectTodos = false;
                        appConstant.MSG_GROWL_OK(appGenericConstant.ASPIRANTE_RECHAZADO);
                        for (var i = 0; i < gestionAdmision.inscritos.length; i++) {
                            if (gestionAdmision.inscritos[i].aspirante === rechazado.idAspirante) {
                                gestionAdmision.inscritos.splice(i, appGenericConstant.UNO);
                                localStorageService.set('inscritos', gestionAdmision.inscritos);
                                return;
                            }
                        }
                        gestionAdmision.onConsultarInscritos();
                        break;
                    case 409:
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        break;
                    case 400:
                        appConstant.MSG_GROWL_ERROR();
                        gestionAdmision.onCloseModal();
                        break;
                    case 500:
                        appConstant.MSG_GROWL_ERROR();
                        gestionAdmision.onCloseModal();
                        break;
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                gestionAdmision.onCloseModal();
                throw e;
            });
        };
        if (localStorageService.get('usuario') !== null) {
            var usuario = localStorageService.get('usuario');
            gestionAdmision.usuario = usuario;
        }
        gestionAdmision.onAdmitir = function () {
            gestionAdmision.disabledOnAdmitir = true;
            if (gestionAdmision.admitido.semestre !== null && gestionAdmision.admitido.semestre !== undefined) {
                if (!gestionAdmision.admitirMasivo) {
                    admisionesServices.maximoNivelPrograma(gestionAdmision.admitido.programa).then(function (data) {
                        if (gestionAdmision.admitido.semestre <= data) {
                            var admitido = {
                                id: gestionAdmision.admitido.id,
                                idAspirante: gestionAdmision.admitido.aspirante,
                                idSeccional: gestionAdmision.admitido.seccional,
                                idTipoConvenio: gestionAdmision.admitido.convenio,
                                idNivelFormacion: gestionAdmision.admitido.nivelformacionId,
                                estadoInscripcion: appGenericConstant.ADMITIDO,
                                idPrograma: gestionAdmision.admitido.programa,
                                idPeriodoAcademico: gestionAdmision.admitido.periodoAcademico,
                                idModalidad: gestionAdmision.admitido.modalidad,
                                idHorario: gestionAdmision.admitido.horario,
                                aspirante: gestionAdmision.admitido.aspiranteAdmitir,
                                semestre: gestionAdmision.admitido.semestre,
                                nombrePrograma: gestionAdmision.admitido.nombrePrograma,
                                nombrePeriodoAcademico: gestionAdmision.admitido.periodo,
                                pkUsuario: gestionAdmision.usuario.id,
                                userName: gestionAdmision.usuario.username
                            };
                            $("#myModal").modal("hide");
                            $("#myModal2").modal("hide");
                            appConstant.MSG_REPORTE();
                            appConstant.CARGANDO();
                            admisionesServices.actualizarAdmision(admitido).then(function (data) {
                                switch (data.tipo) {
                                    case 200:
                                        appConstant.CERRAR_SWAL();
                                        gestionAdmision.onCloseModal();
                                        gestionAdmision.report.selected.length = null;
                                        gestionAdmision.selectTodos = false;
                                        gestionAdmision.reporteJsonData = data.objectResponse;
                                        gestionAdmision.disabledOnAdmitir = false;
                                        if (data.configure) {
                                            appConstant.CERRAR_SWAL();
                                            if (admitido.idNivelFormacion !== 3) {
                                                // gestionAdmision.onGenerarReporte(gestionAdmision.reporteJsonData);
                                            }
                                        } else {
                                            swal({
                                                text: appGenericConstant.NO_LIQUIDACION,
                                                type: "error",
                                                allowOutsideClick: false,
                                                allowEscapeKey: false
                                            });
                                        }

                                        for (var i = 0; i < gestionAdmision.inscritos.length; i++) {
                                            if (gestionAdmision.inscritos[i].aspirante === admitido.idAspirante) {
                                                gestionAdmision.inscritos.splice(i, appGenericConstant.UNO);
                                                localStorageService.set('inscritos', gestionAdmision.inscritos);
                                                return;
                                            }
                                        }
                                        appConstant.MSG_GROWL_OK("se ha procesado al estudiante");
                                        break;
                                    case 400:
                                        appConstant.CERRAR_SWAL();
                                        appConstant.MSG_GROWL_ERROR();
                                        gestionAdmision.onCloseModal();
                                        gestionAdmision.disabledOnAdmitir = false;
                                        break;
                                    case 409:
                                        appConstant.CERRAR_SWAL();
                                        gestionAdmision.disabledOnAdmitir = false;
                                        appConstant.MSG_ERROR(data.message);
                                        break;
                                    case 500:
                                        appConstant.CERRAR_SWAL();
                                        appConstant.MSG_GROWL_ERROR();
                                        gestionAdmision.onCloseModal();
                                        gestionAdmision.disabledOnAdmitir = false;
                                        break;
                                }
                            }).catch(function (e) {
                                appConstant.CERRAR_SWAL();
                                appConstant.MSG_GROWL_ERROR();
                                gestionAdmision.onCloseModal();
                                gestionAdmision.disabledOnAdmitir = false;
                                throw e;
                            });
                        } else {
                            appConstant.CERRAR_SWAL();
                            gestionAdmision.disabledOnAdmitir = false;
                            appConstant.MSG_GROWL_ADVERTENCIA("El programa de este estudiante solo tiene " + data + " semestre(s)");
                        }
                    });
                } else {
                    var listaAdmitidos = [];
                    var list = gestionAdmision.report.selected;
                    angular.forEach(list, function (value, key) {
                        var admitido = {
                            id: value.id,
                            idAspirante: value.aspirante,
                            idSeccional: value.seccional,
                            idTipoConvenio: value.convenio,
                            idNivelFormacion: value.nivelformacionId,
                            estadoInscripcion: appGenericConstant.ADMITIDO,
                            idPrograma: value.programa,
                            idPeriodoAcademico: value.periodoAcademico,
                            idModalidad: value.modalidad,
                            idHorario: value.horario,
                            semestre: value.semestre
                        };
                        listaAdmitidos.push(admitido);
                    });
                    admisionesServices.actualizarAdmisionesMasiva(listaAdmitidos).then(function (data) {
                        switch (data.tipo) {
                            case 200:
                                gestionAdmision.onCloseModal();
                                gestionAdmision.selectTodos = false;
                                gestionAdmision.report.selected.length = null;
                                appConstant.MSG_GROWL_OK(appGenericConstant.ASPIRANTES_ADMITIDOS);
                                angular.forEach(listaAdmitidos, function (value, key) {
                                    var admitido = {
                                        id: value.id,
                                        idAspirante: value.aspirante,
                                        idSeccional: value.seccional,
                                        idTipoConvenio: value.convenio,
                                        idNivelFormacion: value.nivelformacionId,
                                        estadoInscripcion: value.estado,
                                        idPrograma: value.programa,
                                        idPeriodoAcademico: value.periodoAcademico,
                                        idModalidad: value.modalidad,
                                        idHorario: value.horario,
                                        semestre: value.semestre
                                    };
                                    gestionAdmision.inscritos.splice(admitido, appGenericConstant.UNO);
                                    localStorageService.set('inscritos', gestionAdmision.inscritos);
                                });
                                break;
                            case 409:
                                appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                                break;
                            case 400:
                                appConstant.MSG_GROWL_ERROR();
                                gestionAdmision.onCloseModal();
                                break;
                            case 500:
                                appConstant.MSG_GROWL_ERROR();
                                gestionAdmision.onCloseModal();
                                break;
                        }
                    }).catch(function (e) {
                        appConstant.MSG_GROWL_ERROR();
                        gestionAdmision.onCloseModal();
                        throw e;
                    });
                }
            } else {
                gestionAdmision.selectSemestre();
            }
        };
        gestionAdmision.selectSemestre = function () {
            if (gestionAdmision.admitido.semestre !== null && gestionAdmision.admitido.semestre !== undefined) {
                gestionAdmision.validarSemestre = true;
            } else {
                gestionAdmision.validarSemestre = false;
            }

        };
        if (localStorageService.get('admision') !== null) {
            gestionAdmision.admision = localStorageService.get('admision');
            if (gestionAdmision.admision.nivelFormacion !== null || gestionAdmision.admision.nivelFormacion !== undefined) {
                gestionAdmision.onBuscarProgramasAcademicos();
            }
            if (gestionAdmision.admision.programa !== null || gestionAdmision.admision.programa !== undefined) {
                gestionAdmision.onBuscarJornadas();
            }
        }
        onBuscarNivelesFormacion();
        onBuscarPeriodoAcademico();
        onConsultarListaModalidades();
        $(document).ready(function () {
            //            if (gestionAdmision.admision !== undefined || gestionAdmision.admision !== null) {
            //                gestionAdmision.onBuscarProgramasAcademicos();
            //            }

        });
        $(window).load(function () {
            $("input.separate").keyup(function (e) {
                e.preventDefault();
                gestionAdmision.onSelectSeparate();
            });
            localStorageService.remove('admision');
            localStorageService.remove('inscrito');
        });
        //Verificar Requisitos
        gestionAdmision.verificarRequisitos = {};
        if (localStorageService.get('requisito') !== null) {
            gestionAdmision.verificarRequisitos = localStorageService.get('requisito');
        }
        function requisitosAspirante(listRequisitosAspirante) {
            var requisitos = [];
            angular.forEach(listRequisitosAspirante, function (value, key) {
                var requisito = {
                    id: value.id,
                    idSolicitudInscripcion: value.idSolicitudInscripcion,
                    idRequisito: value.idRequisito,
                    cumple: value.cumple,
                    requisito: value.requisitoDTO.nombreRequesito,
                    tiporequisito: value.requisitoDTO.nombreTipoRequisito,
                    resultado: value.resultado,
                    observacion: value.observacion,
                    archivo: value.idDocumento,
                    nombreArchivo: value.nombreArchivo,
                    caracteristica: value.requisitoDTO.nombreCaracteristica
                };
                requisitos.push(requisito);
            });
            return requisitos;
        }

        gestionAdmision.uploadPic = function (file, item) {
            item.nombreArchivo = file.name;
            var urlRequest = admisionesServices.subirarchivos();
            var fd = new FormData();
            fd.append('file', file);
            $http.post(urlRequest, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function (response) {
                item.archivo = response.message;
            }).error(function () {
            });
        };
        gestionAdmision.downloadPic = function (item) {
            var file = admisionesServices.downloadArchivo(item);
            if (file !== null && item !== null && item !== undefined) {
                $window.location.href = file;
            }
        };
        gestionAdmision.verificarAuxiliar = {};
        gestionAdmision.obsAux = "";
        gestionAdmision.nivelesFormacion = [];
        gestionAdmision.programasAcademicos = [];
        gestionAdmision.jornadas = [];
        gestionAdmision.selectTodos = false;
        gestionAdmision.filtrados = [];
        gestionAdmision.display;
        gestionAdmision.options = appConstant.FILTRO_TABLAS;
        gestionAdmision.selectedOption = gestionAdmision.options[appGenericConstant.CERO];
        gestionAdmision.report = {
            selected: null
        };
        /*Metodo para seleccionar todos los datos de la tabla al checkear*/
        gestionAdmision.onSelectTodos = function () {
            if (gestionAdmision.selectTodos === true) {
                gestionAdmision.report.selected = gestionAdmision.filtrados.slice();
            } else {
                gestionAdmision.report.selected.length = null;
            }
        };
        /*Metodo para al presionar un tr se checkee o se descheckee el checkbox */
        gestionAdmision.onSelectTodosTable = function (clase) {
            if (gestionAdmision.report.selected.length === gestionAdmision.filtrados.length
                    && gestionAdmision.selectTodos === true) {
                gestionAdmision.selectTodos = false;
            } else {
                if (!clase) {
                    if (gestionAdmision.report.selected.length + appGenericConstant.UNO === gestionAdmision.filtrados.length
                            && gestionAdmision.selectTodos === false) {
                        gestionAdmision.selectTodos = true;
                    }
                } else {
                    gestionAdmision.selectTodos = false;
                }
            }
        };
        gestionAdmision.guardarRequisitos = function (item) {
            var requisitos = [];
            angular.forEach(item, function (value, key) {
                var requisito = {
                    id: value.id,
                    idSolicitudInscripcion: value.idSolicitudInscripcion,
                    idRequisito: value.idRequisito,
                    cumple: value.cumple,
                    resultado: value.resultado,
                    observacion: value.observacion,
                    idDocumento: value.archivo,
                    nombreArchivo: value.nombreArchivo
                };
                requisitos.push(requisito);
            });
            admisionesServices.verificarRequisitos(requisitos).then(function (response) {
                switch (response.tipo) {
                    case 200:
                        appConstant.MSG_GROWL_OK(appGenericConstant.VERIFICACION_REQUISITO);
                        localStorageService.set('requisito', gestionAdmision.verificarRequisitos);
                        break;
                    case 409:
                        appConstant.MSG_GROWL_ADVERTENCIA(response.message);
                        break;
                    case 400:
                        appConstant.MSG_GROWL_ERROR();
                        break;
                    case 500:
                        appConstant.MSG_GROWL_ERROR();
                        break;
                }
            });
        };
        gestionAdmision.mostrarCampo = function (item) {
            $("#inputHid" + item).prop("disabled", false);
            $('#inputHid' + item).focus();
            $("#btnComd" + item).hide();
            $("#btnCheck" + item).show();
        };
        gestionAdmision.ocultarCampo = function (item) {
            $("#inputHid" + item).prop("disabled", true);
            $("#btnComd" + item).show();
            $("#btnCheck" + item).hide();
        };
        gestionAdmision.mostrarCampoText = function (item) {
            $("#textAreaHid" + item).prop("disabled", false);
            $('#textAreaHid' + item).focus();
            $("#btnComd2" + item).hide();
            $("#btnCheck2" + item).show();
        };
        gestionAdmision.ocultarCampoText = function (item) {
            $("#textAreaHid" + item).prop("disabled", true);
            $("#btnComd2" + item).show();
            $("#btnCheck2" + item).hide();
        };
        gestionAdmision.eliminarArchivo = function (item) {
            item.archivo = null;
            item.nombreArchivo = null;
        };
        gestionAdmision.onGestionarRequisito = function (item) {
            gestionAdmision.verificarRequisitos.identificacion = item.identificacion;
            gestionAdmision.verificarRequisitos.nombre = item.nombres + " " + item.apellidos;
            gestionAdmision.verificarRequisitos.nivelFormacion = item.nivelFormacion;
            gestionAdmision.verificarRequisitos.programaAcademico = item.nombrePrograma;
            gestionAdmision.verificarRequisitos.jornada = item.nombreHorario;
            gestionAdmision.verificarRequisitos.requisitos = item.requisitos;
            gestionAdmision.verificarRequisitos.identificacionfull = item.identificacionfull;
            localStorageService.set('requisito', gestionAdmision.verificarRequisitos);
        };
        gestionAdmision.focusCampo = function (item) {
            $('#inputHid' + item).focus(function () {
            });
            $('#inputHid' + item).blur(function () {
                $("#inputHid" + item).prop("disabled", true);
                $("#btnComd" + item).show();
                $("#btnCheck" + item).hide();
            });
        };
        gestionAdmision.focusCampoTextArea = function (item) {

            $('#textAreaHid' + item).focus(function () {
            });
            $('#textAreaHid' + item).blur(function () {
                $("#textAreaHid" + item).prop("disabled", true);
                $("#btnComd2" + item).show();
                $("#btnCheck2" + item).hide();
            });
        };
        gestionAdmision.clickShowPopover = function (item) {
            $('#btnComd3' + item.id).popover({title: "Observación", content: item.observacion, placement: "top", trigger: "manual"}).popover('show');
        };
        gestionAdmision.clickHidePopover = function (item) {
            $('#btnComd3' + item.id).popover('destroy').popover('hide');
        };
        //------------------Reporte-------------------------------------
        // crear metodo de generar reporte en s3

        //--------------------- ENTREVISTA -------------------------------------
        gestionAdmision.onOpenModalEntrevista = function (item) {

            $('#fechaexpedicionInforPersonal').datepicker({
                format: "dd/mm/yyyy",
                language: "es",
                autoclose: true,
                clearBtn: true,
                startDate: new Date("01/01/1900"),
                endDate: new Date(),
                beforeShowYear: function (date) {
                    if (date.getFullYear() < 1900) {
                        return false;
                    }
                }, beforeShowMonth: function (date) {
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

            gestionAdmision.report.selected.length = null;
            gestionAdmision.admitidoEntrevista = {};
            gestionAdmision.admitidoEntrevista.nombreEstudiante = item.nombreCompleto;
            gestionAdmision.admitidoEntrevista.idAspirante = item.aspirante;
            gestionAdmision.admitirMasivo = false;
            $("#myModalEntrevista").modal("show");
        };

        gestionAdmision.usuarioRol = [];
        function onBuscarUsuarioRoles() {
            usuarioRolesService.buscarUsuarioRoles().then(function (data) {
                angular.forEach(data, function (value, key) {
                    gestionAdmision.usuarioRol.push(value);
                });
            });
        }

        gestionAdmision.onAdmitirEntrevista = function () {
            admisionesServices.onPostEntrevista(gestionAdmision.admitidoEntrevista).then(function (data) {
                switch (data.tipo) {
                    case 200:
                        gestionAdmision.onCloseModal();
                        appConstant.MSG_GROWL_OK(data.message);
                        break;
                    case 409:
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                        break;
                    case 400:
                        appConstant.MSG_GROWL_ERROR();
                        gestionAdmision.onCloseModal();
                        break;
                    case 500:
                        appConstant.MSG_GROWL_ERROR();
                        gestionAdmision.onCloseModal();
                        break;
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                gestionAdmision.onCloseModal();
                throw e;
            });

        };

        onBuscarUsuarioRoles();
    }

})();

