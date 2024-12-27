(function () {
    'use strict';
    angular.module('mytodoApp').controller('campaniaCtrl', campaniaCtrl);
    campaniaCtrl.$inject = ['$scope', 'inscripcionService', 'usuarioRolesService', 'asistenciaServices', 'campaniaService', 'candidatoServices', 'ValidationService', 'eventoService', 'growl', '$location', 'localStorageService', 'utilServices', '$filter', 'appConstant', 'appGenericConstant'];
    function campaniaCtrl($scope, inscripcionService, usuarioRolesService, asistenciaServices, campaniaService, candidatoServices, ValidationService, eventoService, growl, $location, localStorageService, utilServices, $filter, appConstant, appGenericConstant) {

        var campaniaControl = this;
        var config = {};
        campaniaControl.publicoObjetivo = [];
        campaniaControl.campanias = [];
        campaniaControl.actividades = [];
        campaniaControl.eventos = eventoService.eventos;
        campaniaControl.eventosremoves = [];
        campaniaControl.lsttipocampanias = [];
        campaniaControl.lsttipoactividades = [];
        campaniaControl.listavalor = [];
        campaniaControl.lstpublicosobjetivos = [];
        campaniaControl.listaEstadoActividad = [];
        campaniaControl.listaSeguimientos = [];
        campaniaControl.mensajeValidacion = true;
        campaniaControl.mensajeValidacionActividad = true;
        campaniaControl.nuevaCampania = campaniaService.campania;
        campaniaControl.nuevaActividad = campaniaService.actividad;
        campaniaControl.nuevoSeguimiento = campaniaService.seguimientoLlamada;
        campaniaControl.notificarContacto = eventoService.notificarContacto;
        campaniaControl.esvisible = campaniaService.visible;
        campaniaControl.esvisibleevento = eventoService.visible;
        campaniaControl.esvisible.rendered = true;
        campaniaControl.campodisable = false;
        campaniaControl.nuevaActividad.listaSeguimientos = [];
        campaniaControl.nuevaActividad.listaSeguimientosLlamadasContacto = [];
        campaniaControl.report = {
            selected: null
        };
        campaniaControl.report = {
            selectedActividad: null
        };
        campaniaControl.options = appConstant.FILTRO_TABLAS;
        campaniaControl.selectedOption = campaniaControl.options[0];

        campaniaControl.usuario = "";
        if (localStorageService.get('usuario') !== null) {
            var usuario = localStorageService.get('usuario');
            campaniaControl.usuario = usuario;
            campaniaControl.isDirector = (usuario.rol.codigo === 'DIRECTOR_MERCADEO' || usuario.rol.codigo === 'SUPER_ADMINISTRADOR' 
                    || usuario.rol.codigo === 'auditor') ? 1 : 0;
        }

        if (localStorageService.get('campania') !== null) {
            campaniaControl.nuevaCampania = localStorageService.get('campania');

//            localStorageService.get('listUsuarios');
//
//            angular.forEach(localStorageService.get('listUsuarios'), function (value, key) {
//
//                if (value.usuario === campaniaControl.nuevaCampania.responsable) {
//                    campaniaControl.nuevaCampania.responsable = value.usuario
//                }
//
//            });

//            var index = campaniaControl.usuarioRol.indexOf(campaniaControl.nuevaCampania.responsable.toLowerCase());
//            if (index > -1) {
//                campaniaControl.nuevaCampania.responsable = campaniaControl.usuarioRol[index];
//            }
////            onEjecutarconsultarActividadesDentroCampanias(campaniaControl.nuevaCampania);
        }
        if (localStorageService.get('vistaestados') !== null) {
            var estadoseventos = localStorageService.get('vistaestados');
            campaniaControl.esvisible.titulo = estadoseventos.titulo;
            campaniaControl.esvisible.eseditable = estadoseventos.eseditable;
            campaniaControl.esvisible.rendered = estadoseventos.rendered;
            campaniaControl.esvisible.renderedbutton = estadoseventos.renderedbutton;
            campaniaControl.esvisible.renderedbuttonregistrar = estadoseventos.renderedbutton;
            campaniaControl.esvisible.estadoFinalizada = estadoseventos.estadoFinalizada;
        }

        if (localStorageService.get('actividadesCampania') !== null) {
            campaniaControl.actividades = localStorageService.get('actividadesCampania');
        }

        if (localStorageService.get('actividad') !== null) {
            campaniaControl.nuevaActividad = localStorageService.get('actividad');
        }
        if (localStorageService.get('listaPublicoObjetivo') !== null) {
            campaniaControl.lstpublicosobjetivos = localStorageService.get('listaPublicoObjetivo');
        }

        campaniaControl.candidatos = {};
        if (localStorageService.get('idCandidato') !== null) {
            campaniaControl.idCandidatoR = 0;
            campaniaControl.idCandidatoR = localStorageService.get('idCandidato');
            campaniaControl.candidatos.listaDetalleCandidatos = [];
            campaniaControl.candidatos.listaDetalleCandidatosPendiente = [];
            campaniaControl.candidatos.listaDetalleCandidatosPendienteConLlamada = [];
            campaniaControl.candidatos.listaDetalleCandidatosOtro = [];
            onConsultarCandidatoGestionLS(campaniaControl.idCandidatoR);
        }

        if (localStorageService.get('listaDetalleCandidatos') !== null) {

        }

        if (localStorageService.get('listaDetalleCandidatosDia') !== null) {
            campaniaControl.candidatos.listaDetalleCandidatosAgenda = [];
            campaniaControl.candidatos.listaDetalleCandidatosAgenda = localStorageService.get('listaDetalleCandidatosDia');
        }

        if (localStorageService.get('vistaestadoseventos') !== null) {
            var estados = localStorageService.get('vistaestadoseventos');
            campaniaControl.esvisibleevento.titulo = estados.titulo;
            campaniaControl.esvisibleevento.botoneditarevento = estados.botoneditarevento;
            campaniaControl.esvisibleevento.campodisable = estados.campodisable;
            campaniaControl.esvisibleevento.disabledDetalle = estados.disabledDetalle;
            campaniaControl.esvisibleevento.disabledFechas = estados.disabledFechas;
        }


        /* CONSULTAS */
        campaniaControl.onIrRegistrar = function () {

            campaniaControl.esvisible.titulo = appGenericConstant.AGREGAR_CAMPAÑA;
            campaniaControl.esvisibleevento.titulo = appGenericConstant.AGREGAR_ACTIVIDAD;
            campaniaControl.esvisibleevento.botoneditarevento = true;
            campaniaControl.esvisible.eseditable = false;
            campaniaControl.esvisible.rendered = true;
            campaniaControl.esvisible.renderedbutton = true;
            campaniaControl.nuevaCampania = campaniaService.campania;
            campaniaControl.nuevaActividad = campaniaService.actividad;
            campaniaControl.actividades = [];
            $location.path('/crm-mercadeo-gestion-campania-cud');
            localStorageService.set('campania', campaniaService.campania);
            localStorageService.set('actividad', campaniaService.actividad);
            localStorageService.set('actividadesCampania', campaniaControl.actividades);
            localStorageService.set('vistaestados', campaniaControl.esvisible);
            localStorageService.set('vistaestadoseventos', campaniaControl.esvisibleevento);
        };
        campaniaControl.onIrVerDetalle = function (item) {
            campaniaControl.esvisible.titulo = appGenericConstant.DETALLE_CAMPAÑA;
            campaniaControl.esvisibleevento.titulo = appGenericConstant.DETALLE_ACTIVIDAD;
            campaniaControl.esvisible.eseditable = true;
            campaniaControl.esvisible.rendered = false;
            campaniaControl.esvisible.renderedbutton = false;
            campaniaControl.mostrarVentana = false;
            campaniaControl.esvisibleevento.botoneditarevento = true;
            campaniaControl.nuevaCampania.id = item.id;
            campaniaControl.nuevaCampania.nombre = item.nombre;
            campaniaControl.nuevaCampania.descripcion = item.descripcion;
            campaniaControl.nuevaCampania.tipo = item.idtipocampania;
            campaniaControl.nuevaCampania.estado = item.idestadocampania;
            campaniaControl.nuevaCampania.fechainicio = item.fechainicio;
            campaniaControl.nuevaCampania.fechafin = item.fechafin;
            campaniaControl.nuevaCampania.presupuesto = item.presupuesto;
            campaniaControl.nuevaCampania.responsable = item.responsable;
            campaniaControl.nuevaCampania.candidato = item.idCandidato;
            //            campaniaControl.ejecutarconsultarActividadesDentroCampanias(item);
            $location.path('/crm-mercadeo-gestion-campania-cud');
            localStorageService.set('campania', campaniaControl.nuevaCampania);
            localStorageService.set('vistaestados', campaniaControl.esvisible);
            localStorageService.set('vistaestadoseventos', campaniaControl.esvisibleevento);
        };
        campaniaControl.onIrEditar = function (item) {

            campaniaControl.esvisible.titulo = appGenericConstant.MODIFICAR_CAMPAÑA;
            campaniaControl.esvisibleevento.titulo = appGenericConstant.MODIFICAR_ACTIVIDAD;
            campaniaControl.esvisible.eseditable = false;
            campaniaControl.esvisible.rendered = false;
            campaniaControl.esvisible.renderedbutton = true;
            campaniaControl.esvisible.renderedbuttonregistrar = true;
            campaniaControl.esvisibleevento.botoneditarevento = false;
            campaniaControl.nuevaCampania.id = item.id;
            campaniaControl.nuevaCampania.nombre = item.nombre;
            campaniaControl.nuevaCampania.descripcion = item.descripcion;
            campaniaControl.nuevaCampania.tipo = item.idtipocampania;
            campaniaControl.nuevaCampania.estado = item.idestadocampania;
            campaniaControl.nuevaCampania.fechainicio = item.fechainicio;
            campaniaControl.nuevaCampania.fechafin = item.fechafin;
            campaniaControl.nuevaCampania.presupuesto = item.presupuesto;
            campaniaControl.nuevaCampania.responsable = item.responsable;
            campaniaControl.nuevaCampania.candidato = item.idCandidato;
            //            campaniaControl.ejecutarconsultarActividadesDentroCampanias(item);
            $location.path('/crm-mercadeo-gestion-campania-cud-e');
            localStorageService.set('campania', campaniaControl.nuevaCampania);
            localStorageService.set('vistaestados', campaniaControl.esvisible);
            localStorageService.set('vistaestadoseventos', campaniaControl.esvisibleevento);
        };

        campaniaControl.onIrRegistrarActividad = function () {
            campaniaControl.esvisibleevento.titulo = appGenericConstant.AGREGAR;
            campaniaControl.esvisibleevento.campodisable = false;
            campaniaControl.esvisibleevento.disabledDetalle = false;
            campaniaControl.esvisibleevento.disabledFechas = false;
            campaniaControl.esvisible.estadoFinalizada = false;
            campaniaControl.esvisibleevento.publico = true;
            campaniaControl.nuevaActividad = campaniaService.actividad;
            campaniaControl.nuevaActividad.listaSeguimientos = [];
            localStorageService.remove('listaPublicoObjetivo');
            campaniaControl.lstpublicosobjetivos = [];
            campaniaControl.nuevaActividad.listaSeguimientosLlamadasContacto = [];
            localStorageService.set('actividad', campaniaControl.nuevaActividad);
            $location.path('/crm-mercadeo-gestion-actividad-cud');
            localStorageService.set('vistaestados', campaniaControl.esvisible);
            localStorageService.set('vistaestadoseventos', campaniaControl.esvisibleevento);
            localStorageService.remove('listaDetalleCandidatos');

        };
        campaniaControl.onIrEditarActividad = function (item) {
            campaniaControl.esvisibleevento.titulo = appGenericConstant.MODIFICAR;
            campaniaControl.esvisibleevento.campodisable = false;
            campaniaControl.esvisibleevento.disabledDetalle = false;
            campaniaControl.esvisibleevento.disabledFechas = true;
            campaniaControl.esvisible.estadoFinalizada = false;
            campaniaControl.esvisibleevento.publico = false;
            campaniaControl.nuevaActividad.id = item.id;
            campaniaControl.nuevaActividad.nombreActividad = item.nombreActividad;
            campaniaControl.nuevaActividad.publicoObjetivo = item.publicoObjetivo;
            campaniaControl.nuevaActividad.tipoActividad = item.tipoActividad;
            campaniaControl.nuevaActividad.fechaInicioActividad = item.fechaInicioActividad;
            campaniaControl.nuevaActividad.fechaFinActividad = item.fechaFinActividad;
            campaniaControl.nuevaActividad.tratamientoActividad = item.tratamientoActividad;
            campaniaControl.nuevaActividad.responsableActividad = item.responsableActividad;
            campaniaControl.nuevaActividad.estadoActividad = item.estadoActividad;
            campaniaControl.nuevaActividad.descripcionActividad = item.descripcionActividad;
            campaniaControl.nuevaActividad.nombreEncuesta = item.nombreEncuesta;
            campaniaControl.nuevaActividad.seguimientos = item.seguimientos;
            campaniaControl.nuevaActividad.campania = item.campania;
            campaniaControl.nuevaActividad.listaSeguimientos = item.listaSeguimientos;
            campaniaControl.ejecutarconsultarPublicosObjetivo(item.publicoObjetivo);
            localStorageService.set('actividad', campaniaControl.nuevaActividad);
            localStorageService.set('vistaestados', campaniaControl.esvisible);
            localStorageService.set('vistaestadoseventos', campaniaControl.esvisibleevento);
            $location.path('/crm-mercadeo-gestion-actividad-cud');
        };
        campaniaControl.onGestionarCandidatos = function (item) {
            campaniaControl.onChangeCandidatoGestion(item.id);
        };

        campaniaControl.onIrVerDetalleActividad = function (item) {
            campaniaControl.esvisibleevento.titulo = appGenericConstant.DETALLE;
            campaniaControl.esvisibleevento.campodisable = true;
            campaniaControl.esvisibleevento.disabledDetalle = true;
            campaniaControl.esvisibleevento.disabledFechas = true;
            campaniaControl.esvisible.estadoFinalizada = false;
            campaniaControl.esvisibleevento.publico = false;
            campaniaControl.nuevaActividad.id = item.id;
            campaniaControl.nuevaActividad.nombreActividad = item.nombreActividad;
            campaniaControl.nuevaActividad.publicoObjetivo = item.publicoObjetivo;
            campaniaControl.nuevaActividad.tipoActividad = item.tipoActividad;
            campaniaControl.nuevaActividad.fechaInicioActividad = item.fechaInicioActividad;
            campaniaControl.nuevaActividad.fechaFinActividad = item.fechaFinActividad;
            campaniaControl.nuevaActividad.tratamientoActividad = item.tratamientoActividad;
            campaniaControl.nuevaActividad.responsableActividad = item.responsableActividad;
            campaniaControl.nuevaActividad.estadoActividad = item.estadoActividad;
            campaniaControl.nuevaActividad.descripcionActividad = item.descripcionActividad;
            campaniaControl.nuevaActividad.nombreEncuesta = item.nombreEncuesta;
            campaniaControl.nuevaActividad.seguimientos = item.seguimientos;
            campaniaControl.nuevaActividad.campania = item.campania;
            campaniaControl.nuevaActividad.listaSeguimientos = item.listaSeguimientos;
            campaniaControl.ejecutarconsultarPublicosObjetivo(item.publicoObjetivo);
            localStorageService.set('actividad', campaniaControl.nuevaActividad);
            localStorageService.set('vistaestados', campaniaControl.esvisible);
            localStorageService.set('vistaestadoseventos', campaniaControl.esvisibleevento);
            $location.path('/crm-mercadeo-gestion-actividad-cud');
        };

        campaniaControl.onGuardar = function () {
            if (!new ValidationService().checkFormValidity($scope.formgeneralcampania)) {
                return;
            }
            if (campaniaControl.nuevaCampania.id === undefined || campaniaControl.nuevaCampania.id === null) {
                campaniaControl.agregarCampania();
                new ValidationService().resetForm($scope.formgeneralcampania);
            } else {
                if (localStorageService.get('campania').id !== campaniaControl.nuevaCampania.id
                        || localStorageService.get('campania').nombre !== campaniaControl.nuevaCampania.nombre
                        || JSON.stringify(localStorageService.get('campania').tipo) !== JSON.stringify(campaniaControl.nuevaCampania.tipo)
                        || localStorageService.get('campania').fechainicio !== campaniaControl.nuevaCampania.fechainicio
                        || localStorageService.get('campania').fechafin !== campaniaControl.nuevaCampania.fechafin
                        || localStorageService.get('campania').presupuesto !== campaniaControl.nuevaCampania.presupuesto
                        || localStorageService.get('campania').responsable !== campaniaControl.nuevaCampania.responsable
                        || JSON.stringify(localStorageService.get('campania').estado) !== JSON.stringify(campaniaControl.nuevaCampania.estado)
                        || localStorageService.get('campania').descripcion !== campaniaControl.nuevaCampania.descripcion) {
                    campaniaControl.actualizarCampania();
                }
            }
        };
        campaniaControl.onGuardarActividad = function () {
            if (!new ValidationService().checkFormValidity($scope.formCudActividad)) {
                return;
            }
            if (campaniaControl.nuevaActividad.id === undefined || campaniaControl.nuevaActividad.id === null) {
                campaniaControl.onAgregarActividad();
                new ValidationService().resetForm($scope.formCudActividad);
            } else {
                if (localStorageService.get('actividad').id !== campaniaControl.nuevaActividad.id
                        || localStorageService.get('actividad').nombreActividad !== appConstant.VALIDAR_STRING(campaniaControl.nuevaActividad.nombreActividad)
                        || JSON.stringify(localStorageService.get('actividad').publicoObjetivo) !== JSON.stringify(campaniaControl.nuevaActividad.publicoObjetivo)
                        || JSON.stringify(localStorageService.get('actividad').tipoActividad) !== JSON.stringify(campaniaControl.nuevaActividad.tipoActividad)
                        || localStorageService.get('actividad').fechaInicioActividad !== campaniaControl.nuevaActividad.fechaInicioActividad
                        || localStorageService.get('actividad').fechaFinActividad !== campaniaControl.nuevaActividad.fechaFinActividad
                        || localStorageService.get('actividad').responsableActividad !== appConstant.VALIDAR_STRING(campaniaControl.nuevaActividad.responsableActividad)
                        || localStorageService.get('actividad').tratamientoActividad !== campaniaControl.nuevaActividad.tratamientoActividad
                        || JSON.stringify(localStorageService.get('actividad').estadoActividad) !== JSON.stringify(campaniaControl.nuevaActividad.estadoActividad)
                        || localStorageService.get('actividad').descripcionActividad !== campaniaControl.nuevaActividad.descripcionActividad
                        || localStorageService.get('actividad').nombreEncuesta !== campaniaControl.nuevaActividad.nombreEncuesta
                        || onValidarTipoUndefineLista(localStorageService.get('actividad').listaSeguimientos) !== onValidarTipoUndefineLista(campaniaControl.nuevaActividad.listaSeguimientos)
                        || JSON.stringify(localStorageService.get('actividad').campania) !== JSON.stringify(campaniaControl.nuevaActividad.campania)
                        ) {
                    campaniaControl.onActualizarActividad();
                }
            }
        };
        campaniaControl.onLimpiarCampania = function () {
            campaniaControl.esvisible.eseditable = false;
            campaniaService.campania = {};
            campaniaControl.nuevaCampania = campaniaService.campania;
            localStorageService.set('campania', campaniaControl.nuevaCampania);
            //            campaniaControl.eventos = [];
            campaniaControl.onLimpiarActividad();
            campaniaControl.actividades = [];
            localStorageService.set('actividadesCampania', campaniaControl.actividades);
        };
        campaniaControl.onLimpiarActividad = function () {
            campaniaControl.esvisible.eseditable = false;
            campaniaService.actividad = {};
            campaniaControl.nuevaActividad = campaniaService.actividad;
            localStorageService.set('actividad', campaniaControl.nuevaActividad);
            campaniaControl.actividades = [];
            localStorageService.set('actividadesCampania', campaniaControl.actividades);
        };
        campaniaControl.onEliminarMasivoActividades = function () {
            campaniaControl.eliminarActividadesMasivo();
        };
        campaniaControl.onEliminarMasivoCampania = function () {
            campaniaControl.eliminarCampaniaMasivo();
        };
        campaniaControl.agregarCampania = function () {
            if (toDate(campaniaControl.nuevaCampania.fechainicio) > toDate(campaniaControl.nuevaCampania.fechafin)) {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.FECHA_INICIO_MAYO_FINAL);
                return;
            }
            var campania = {
                id: null,
                nombreCampanha: appConstant.VALIDAR_STRING(campaniaControl.nuevaCampania.nombre),
                descripcion: campaniaControl.nuevaCampania.descripcion,
                idTipoCampanha: campaniaControl.nuevaCampania.tipo,
                idEstadoCampanha: campaniaControl.nuevaCampania.estado,
                fechaInicio: toDate(campaniaControl.nuevaCampania.fechainicio),
                fechaFin: toDate(campaniaControl.nuevaCampania.fechafin),
                presupuesto: campaniaControl.nuevaCampania.presupuesto,
                responsable: appConstant.VALIDAR_STRING(campaniaControl.nuevaCampania.responsable),
                idCandidato: campaniaControl.nuevaCampania.candidato,
                listDetalleCamapania: campaniaControl.listaDetalleCandidatosAux
            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_CAMPAÑA_ESPERE);
            appConstant.CARGANDO();
            campaniaService.consultarCampaniaByNombreTipoCampania(campania).then(function (dataValidacion) {
                if (typeof dataValidacion === 'object' && dataValidacion.length === 0) {
                    campaniaService.registrarCampania(campania).then(function (data) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                        campaniaControl.nuevaCampania = data;
                        localStorageService.set('campania', campaniaControl.nuevaCampania);
                        $location.path('/crm-mercadeo-gestion-campania');
                    }).catch(function (e) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                        return;
                    });
                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.EXISTE_REGISTRO_CAMPAÑA);
                }
            });
        };
        campaniaControl.actualizarCampania = function () {
            if (toDate(campaniaControl.nuevaCampania.fechainicio) > toDate(campaniaControl.nuevaCampania.fechafin)) {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.FECHA_INICIO_MAYO_FINAL);
                return;
            }
            var campania = {
                id: campaniaControl.nuevaCampania.id,
                nombreCampanha: appConstant.VALIDAR_STRING(campaniaControl.nuevaCampania.nombre),
                descripcion: campaniaControl.nuevaCampania.descripcion,
                idTipoCampanha: campaniaControl.nuevaCampania.tipo,
                idEstadoCampanha: campaniaControl.nuevaCampania.estado,
                fechaInicio: toDate(campaniaControl.nuevaCampania.fechainicio),
                fechaFin: toDate(campaniaControl.nuevaCampania.fechafin),
                presupuesto: campaniaControl.nuevaCampania.presupuesto,
                responsable: appConstant.VALIDAR_STRING(campaniaControl.nuevaCampania.responsable)
            };
            if (campania.idEstadoCampanha === 8) {
                var list = [];
                list = localStorageService.get('actividadesCampania');
                for (var i = 0; i < list.length; i++) {
                    if (list[i].estadoActividad === 96) {
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NO_PUEDE_CERRAR_CAMPAÑA);
                        return;
                    }
                }
            }
            var campaniaLocal = localStorageService.get('campania');
            campaniaService.consultarCampaniaByNombreTipoCampania(campania).then(function (dataValidacion) {
                if (campaniaLocal.nombre === campania.nombreCampanha && campaniaLocal.tipo === campania.idTipoCampanha) {
                    dataValidacion = [];
                }
                if (typeof dataValidacion === 'object' && dataValidacion.length === 0) {
                    campaniaService.actualizaCampania(campania).then(function (data) {
                        appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                        campaniaControl.nuevaCampania.id = campania.id;
                        campaniaControl.nuevaCampania.nombre = campania.nombreCampanha;
                        campaniaControl.nuevaCampania.descripcion = campania.descripcion;
                        campaniaControl.nuevaCampania.tipo = campania.idTipoCampanha;
                        campaniaControl.nuevaCampania.estado = campania.idEstadoCampanha;
                        campaniaControl.nuevaCampania.fechainicio = formattedDate(campania.fechaInicio);
                        campaniaControl.nuevaCampania.fechafin = formattedDate(campania.fechaFin);
                        campaniaControl.nuevaCampania.presupuesto = campania.presupuesto;
                        campaniaControl.nuevaCampania.responsable = campania.responsable;
                        localStorageService.set('campania', campaniaControl.nuevaCampania);
                        localStorageService.set('vistaestados', campaniaControl.esvisible);
                    }).catch(function (e) {
                        appConstant.MSG_GROWL_ERROR();
                        return;
                    });
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.EXISTE_REGISTRO_CAMPAÑA);
                }
            });
        };
        campaniaControl.onEliminarUnaCampania = function (item) {
            campaniaControl.report.selected.length = null;
            var listaAux = [];
            swal({
                title: appGenericConstant.PREG_ELIMINAR_CAMPAÑA,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_CAMPAÑA_ESPERE);
                appConstant.CARGANDO();
                setTimeout(function () {
                    if (item.idestadocampania === 8 || item.idestadocampania === 7) {
                        swal(appGenericConstant.ALTO_AHI,
                                appGenericConstant.CAMPAÑA_NO_POSIBLE_ELIMINADA,
                                appGenericConstant.WARNING);
                        return;
                    }
                    campaniaService.consultarActividadesByCampania(item.id).then(function (dataValidacion) {
                        if (typeof dataValidacion === 'object' && dataValidacion.length === 0) {
                            campaniaService.eliminarCampania(item).then(function (data) {
                                if (data.tipo === 200) {
                                    swal(appGenericConstant.CAMPAÑA_ELIMINADA,
                                            appGenericConstant.CAMPAÑA_ELIMINADA_SATIS,
                                            appGenericConstant.SUCCESS);
                                    campaniaControl.report.selected.length = null;
                                    campaniaControl.ejecutarConsultarCampanias();
                                } else if (data.tipo === 409) {
                                    swal(appGenericConstant.ALTO_AHI,
                                            appGenericConstant.CAMPAÑA_NO_POSIBLE_ELIMINADA,
                                            appGenericConstant.WARNING);
                                } else {
                                    appConstant.CERRAR_SWAL();
                                    appConstant.MSG_GROWL_ERROR();
                                }
                            }).catch(function (e) {
                                appConstant.CERRAR_SWAL();
                                appConstant.MSG_GROWL_ERROR();
                                return;
                            });
                        } else {
                            swal(appGenericConstant.ALTO_AHI,
                                    appGenericConstant.CAMPAÑA_NO_POSIBLE_ELIMINADA,
                                    appGenericConstant.WARNING);
                            return;
                        }
                    });
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    return;
                }
            });
        };

        campaniaControl.eliminarCampaniaMasivo = function () {
            campaniaControl.listNoEliminados = [];
            var listaAux = [];
            swal({
                title: appGenericConstant.PREG_CAMPAÑAS_ELIMINADAS,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(function (isConfirm) {
                if (isConfirm) {
                    appConstant.CERRAR_SWAL();
                    setTimeout(function () {
                        angular.forEach(campaniaControl.report.selected, function (value, key) {
                            if (value.idestadocampania !== 8 && value.idestadocampania !== 7) {
                                campaniaService.eliminarCampania(value).then(function (data) {
                                    campaniaControl.campanias.splice(value, 1);
                                    campaniaControl.ejecutarConsultarCampanias();
                                });
                            } else {
                                campaniaControl.listNoEliminados.push(value);
                            }
                        });
                        if (campaniaControl.listNoEliminados.length === 0) {
                            swal(appGenericConstant.CAMPAÑAS_ELIMINADAS,
                                    appGenericConstant.CAMPAÑAS_ELIMINADAS_SATIS,
                                    appGenericConstant.SUCCESS);
                            campaniaControl.report.selected.length = null;
                        } else if (campaniaControl.listNoEliminados.length > 0) {
                            swal(appGenericConstant.ALGUNAS_CAMPAÑAS,
                                    '',
                                    appGenericConstant.WARNING);
                            campaniaControl.mensajeValidacion = false;
                            campaniaControl.ejecutarConsultarCampanias();
                            campaniaControl.report.selected.length = null;
                        } else {
                            appConstant.CERRAR_SWAL();
                            campaniaControl.report.selected.length = null;
                            appConstant.MSG_GROWL_ERROR();
                        }
                    });
                } else {
                    campaniaControl.report.selected.length = null;
                    campaniaControl.ejecutarConsultarCampanias();
                }
            });
        };
        // ---------------------------------------ACTIVIDADES POR CAMPAÑA--------------------------------------------------------------
        campaniaControl.onAgregarActividad = function () {
            campaniaControl.esvisible.renderedbuttonregistrar = false;
            if (toDate(campaniaControl.nuevaActividad.fechaFinActividad) < toDate(campaniaControl.nuevaActividad.fechaInicioActividad)) {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.FECHA_FIN_ACTIVIDADES);
                return;
            }

            var campaniaLocal = localStorageService.get('campania');
            if (toDate(campaniaLocal.fechainicio) > toDate(campaniaControl.nuevaActividad.fechaInicioActividad)
                    || toDate(campaniaLocal.fechafin) < toDate(campaniaControl.nuevaActividad.fechaFinActividad)) {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.RANGO_FECHA_ACTIVIDAD);
                return;
            }
            var listaAux = [];
            angular.forEach(campaniaControl.nuevaActividad.listaSeguimientos, function (val, key) {
                var seguimiento = {
                    id: val.id,
                    descripcion: val.descripcion,
                    nombreUsuario: val.nombreUsuario,
                    idUsuario: val.idUsuario,
                    fechaString: val.fechaString
                };
                listaAux.push(seguimiento);
            });
            campaniaControl.nuevaActividad.listaSeguimientos = listaAux;


            var actividad = {
                id: null,
                nombreActividad: appConstant.VALIDAR_STRING(campaniaControl.nuevaActividad.nombreActividad),
                publicoObjetivo: campaniaControl.nuevaActividad.publicoObjetivo !== null ? campaniaControl.nuevaActividad.publicoObjetivo : null,
                idTipoActividad: campaniaControl.nuevaActividad.tipoActividad,
                fechaInicio: toDate(campaniaControl.nuevaActividad.fechaInicioActividad),
                fechaFin: toDate(campaniaControl.nuevaActividad.fechaFinActividad),
                responsable: appConstant.VALIDAR_STRING(campaniaControl.nuevaActividad.responsableActividad),
                tratamientoActividad: campaniaControl.nuevaActividad.tratamientoActividad,
                idEstadoActividad: campaniaControl.nuevaActividad.estadoActividad,
                descripcion: campaniaControl.nuevaActividad.descripcionActividad,
                nombreEncuesta: (campaniaControl.nuevaActividad.nombreEncuesta !== null || campaniaControl.nuevaActividad.nombreEncuesta !== undefined) ? campaniaControl.nuevaActividad.nombreEncuesta : null,
                listaSeguimientos: campaniaControl.nuevaActividad.listaSeguimientos,
                idCampanha: localStorageService.get('campania').id
            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_ACTIVIDAD);
            appConstant.CARGANDO();
            campaniaService.consultarActividadeByNombre(actividad).then(function (dataValidacion) {
                if (typeof dataValidacion === 'object' && dataValidacion.length === 0) {
                    campaniaService.registrarActividad(actividad).then(function (data) {
                        campaniaControl.onLimpiarActividad();
                        appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                        appConstant.CERRAR_SWAL();
                    }).catch(function (e) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                        return;
                    });
                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NOMBRE_REGISTRO_EXISTE);
                }
            });
        };
        campaniaControl.onActualizarActividad = function () {
            campaniaControl.esvisible.renderedbuttonregistrar = false;
            if (toDate(campaniaControl.nuevaActividad.fechaFinActividad) < toDate(campaniaControl.nuevaActividad.fechaInicioActividad)) {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.FECHA_FIN_ACTIVIDADES);
                return;
            }

            var campaniaLocal = localStorageService.get('campania');
            if (toDate(campaniaLocal.fechainicio) > toDate(campaniaControl.nuevaActividad.fechaInicioActividad)
                    || toDate(campaniaLocal.fechafin) < toDate(campaniaControl.nuevaActividad.fechaFinActividad)) {
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.RANGO_ACTIVIDAD_CAMPAÑA);
                ;
                return;
            }

            var listaAux = [];
            angular.forEach(campaniaControl.nuevaActividad.listaSeguimientos, function (val, key) {
                var seguimiento = {
                    id: val.id,
                    descripcion: val.descripcion,
                    nombreUsuario: val.nombreUsuario,
                    idUsuario: val.idUsuario,
                    fechaString: val.fechaString
                };
                listaAux.push(seguimiento);
            });
            campaniaControl.nuevaActividad.listaSeguimientos = listaAux;

            var actividad = {
                id: campaniaControl.nuevaActividad.id,
                nombreActividad: appConstant.VALIDAR_STRING(campaniaControl.nuevaActividad.nombreActividad),
                publicoObjetivo: campaniaControl.nuevaActividad.publicoObjetivo !== null ? campaniaControl.nuevaActividad.publicoObjetivo : null,
                idTipoActividad: campaniaControl.nuevaActividad.tipoActividad,
                fechaInicio: toDate(campaniaControl.nuevaActividad.fechaInicioActividad),
                fechaFin: toDate(campaniaControl.nuevaActividad.fechaFinActividad),
                responsable: appConstant.VALIDAR_STRING(campaniaControl.nuevaActividad.responsableActividad),
                tratamientoActividad: campaniaControl.nuevaActividad.tratamientoActividad,
                idEstadoActividad: campaniaControl.nuevaActividad.estadoActividad,
                descripcion: campaniaControl.nuevaActividad.descripcionActividad,
                nombreEncuesta: campaniaControl.nuevaActividad.nombreEncuesta,
                listaSeguimientos: campaniaControl.nuevaActividad.listaSeguimientos,
                idCampanha: localStorageService.get('campania').id
            };
            var actividadLocal = localStorageService.get('actividad');
            appConstant.MSG_LOADING(appGenericConstant.ACTUALIZANDO_ACTIVIDAD);
            appConstant.CARGANDO();
            campaniaService.consultarActividadeByNombre(actividad).then(function (dataValidacion) {
                if (actividadLocal.nombreActividad === actividad.nombreActividad) {
                    dataValidacion = [];
                }
                if (typeof dataValidacion === 'object' && dataValidacion.length === 0) {
                    campaniaService.actualizaActividad(actividad).then(function (data) {
                        campaniaControl.nuevaActividad.id = actividad.id;
                        campaniaControl.nuevaActividad.nombreActividad = actividad.nombreActividad;
                        campaniaControl.nuevaActividad.publicoObjetivo = actividad.publicoObjetivo;
                        campaniaControl.nuevaActividad.tipoActividad = actividad.idTipoActividad;
                        campaniaControl.nuevaActividad.fechaInicioActividad = formattedDate(actividad.fechaInicio);
                        campaniaControl.nuevaActividad.fechaFinActividad = formattedDate(actividad.fechaFin);
                        campaniaControl.nuevaActividad.tratamientoActividad = actividad.tratamientoActividad;
                        campaniaControl.nuevaActividad.responsableActividad = actividad.responsable;
                        campaniaControl.nuevaActividad.estadoActividad = actividad.idEstadoActividad;
                        campaniaControl.nuevaActividad.descripcionActividad = actividad.descripcion;
                        campaniaControl.nuevaActividad.nombreEncuesta = actividad.nombreEncuesta;
                        campaniaControl.nuevaActividad.campania = actividad.idCampanha;

                        //                        campaniaControl.nuevaActividad = data;
                        if (campaniaControl.nuevaActividad.estadoActividad === 97) {
                            campaniaControl.esvisible.estadoFinalizada = true;
                        }
                        localStorageService.set('actividad', campaniaControl.nuevaActividad);
                        localStorageService.set('vistaestados', campaniaControl.esvisible);
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                    }).catch(function (e) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                        return;
                    });
                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NOMBRE_REGISTRO_EXISTE);
                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };
        campaniaControl.onEliminarUnaActividad = function (item) {
            campaniaControl.report.selectedActividad.length = null;
            swal({
                title: appGenericConstant.PREG_ELIMINAR_ACTIVIDAD,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(function (isConfirm) {
                if (isConfirm) {
                    appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_ACTIVIDAD_ESPERE);
                    appConstant.CARGANDO();
                    setTimeout(function () {
                        if (item.estadoActividad === 96 || item.estadoActividad === 97) {
                            swal(appGenericConstant.ALTO_AHI,
                                    appGenericConstant.REGISTRO_POSIBLE_ELIMINAR,
                                    appGenericConstant.WARNING);
                            return;
                        }
                        campaniaService.eliminarActividad(item).then(function (data) {
                            if (data.tipo === 200) {
                                onEjecutarconsultarActividadesDentroCampanias(localStorageService.get('campania'));
                                swal(appGenericConstant.ACTIVIDAD_ELIMINADA,
                                        appGenericConstant.ACTIVIDAD_ELIMINADA_SATIS,
                                        appGenericConstant.SUCCESS);
                                //                                campaniaControl.report.selected.length = null;
                            } else if (data.tipo === 409) {
                                swal(appGenericConstant.ALTO_AHI,
                                        appGenericConstant.ACTIVIDAD_NO_ELIMINAR,
                                        appGenericConstant.WARNING);
                            } else {
                                appConstant.CERRAR_SWAL();
                                appConstant.MSG_GROWL_ERROR();
                            }
                        }).catch(function (e) {
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ERROR();

                            return;
                        });
                    });
                }
            });
        };
        campaniaControl.onEliminarActividadMasivo = function () {
            campaniaControl.listNoEliminadosActividades = [];
            swal({
                title: appGenericConstant.PREG_ELIMINAR_ACTIVIDADES,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(function (isConfirm) {
                if (isConfirm) {
                    appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_ACTIVIDAD_ESPERE);
                    appConstant.CARGANDO();
                    setTimeout(function () {
                        localStorageService.remove('actividadesCampania');
                        angular.forEach(campaniaControl.report.selectedActividad, function (value, key) {
                            if (value.estadoActividad === 96 || value.estadoActividad === 97) {
                                campaniaService.eliminarActividad(value).then(function (data) {
                                    campaniaControl.actividades.splice(value, 1);
                                });
                            } else {
                                campaniaControl.listNoEliminadosActividades.push(value);
                            }
                        });
                        if (campaniaControl.listNoEliminadosActividades.length === 0) {
                            swal(appGenericConstant.ACTIVIDADES_ELIMINADAS,
                                    appGenericConstant.ACTIVIDADES_ELIMINADAS_SATIS,
                                    appGenericConstant.SUCCESS);
                            //                            campaniaControl.report.selectedActividad.length = null;
                            localStorageService.set('actividadesCampania', campaniaControl.actividades);
                        } else if (campaniaControl.listNoEliminadosActividades.length > 0) {
                            campaniaControl.mensajeValidacionActividad = false;
                            campaniaControl.report.selectedActividad.length = null;
                            localStorageService.set('actividadesCampania', campaniaControl.actividades);
                            swal(appGenericConstant.ALGUNAS_ACTIVIDADES,
                                    '',
                                    appGenericConstant.WARNING);
                            $('input.separate').focus();
                        } else {
                            appConstant.CERRAR_SWAL();
                            campaniaControl.report.selectedActividad.length = null;
                            appConstant.MSG_GROWL_ERROR();
                            localStorageService.set('actividadesCampania', campaniaControl.actividades);
                        }

                    });
                } else {
                    campaniaControl.report.selectedActividad.length = null;
                    onEjecutarconsultarActividadesDentroCampanias(localStorageService.get('campania'));
                }
            });
        };

        //<editor-fold defaultstate="collapsed" desc="seguimientos de actividades y llamamdas a tipo de actividad (llamadas)">
        campaniaControl.onAbrirPopupSeguimiento = function () {
            $('#modalSeguimiento').modal({backdrop: 'static', keyboard: false});
            $("#modalSeguimiento").modal("show");
            campaniaControl.campodisable = false;
            campaniaControl.tituloModal = 'Ingresar';
        };

        campaniaControl.onAbrirPopupSeguimientoLlamadas = function (item) {
            campaniaControl.nuevaActividad = {};
            campaniaControl.nuevaActividad.listaSeguimientosLlamadasContacto = [];
            $('#modalSeguimientoLlamadas').modal({backdrop: 'static', keyboard: false});
            $("#modalSeguimientoLlamadas").modal("show");
            campaniaControl.campodisable = false;
            campaniaControl.tituloModal = 'Ingresar';
            campaniaControl.nuevoSeguimiento = item;
            campaniaControl.candidatoEditar = item;
            $('#fechaCampana.input-daterange').datepicker({
                format: "dd/mm/yyyy",
                language: "es",
                autoclose: true,
                clearBtn: true,
                beforeShowYear: function (date) {
                    if (date.getFullYear() < 1900) {
                        return false;
                    }
                },
                beforeShowMonth: function (date) {
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

            campaniaControl.onConsultarSeguimientoLlamadasPorPublico(item);
        };

        campaniaControl.onCerrarPopupSeguimiento = function () {
            campaniaControl.nuevaActividad.seguimiento = null;
            new ValidationService().resetForm($scope.formAgregarSeguimiento);
        };
        campaniaControl.onCerrarPopupSeguimientoLlamadas = function () {
            campaniaControl.nuevaActividad.seguimientoLlamada = null;
            new ValidationService().resetForm($scope.formAgregarSeguimientoLlamada);
        };

        campaniaControl.onGuardarSeguimiento = function () {
            if (campaniaControl.nuevaActividad.listaSeguimientos === null || campaniaControl.nuevaActividad.listaSeguimientos === undefined) {
                campaniaControl.nuevaActividad.listaSeguimientos = [];
            }
            if (new ValidationService().checkFormValidity($scope.formAgregarSeguimiento)) {
                var nombreUsuario = localStorageService.get('autorizacion').objectResponse.userDto.nombres + ' ' + localStorageService.get('autorizacion').objectResponse.userDto.apellidos;
                var idUsuario = localStorageService.get('autorizacion').objectResponse.userDto.id;
                var seguimiento = {
                    id: null,
                    descripcion: campaniaControl.nuevaActividad.seguimiento,
                    nombreUsuario: nombreUsuario,
                    idUsuario: idUsuario,
                    fechaString: $filter('date')(new Date(), 'dd/MM/yyyy hh:mm:ss')
                };
                campaniaControl.nuevaActividad.listaSeguimientos.push(seguimiento);
                campaniaControl.onCerrarPopupSeguimiento();
                $("#modalSeguimiento").modal("hide");
            }
        };

        campaniaControl.onGuardarSeguimientoLlamada = function () {
            if (campaniaControl.nuevaActividad.listaSeguimientosLlamadasContacto === null || campaniaControl.nuevaActividad.listaSeguimientosLlamadasContacto === undefined) {
                campaniaControl.nuevaActividad.listaSeguimientosLlamadasContacto = [];
            }
            if (new ValidationService().checkFormValidity($scope.formAgregarSeguimientoLlamada)) {
                var nombreUsuario = localStorageService.get('autorizacion').objectResponse.userDto.nombres + ' ' + localStorageService.get('autorizacion').objectResponse.userDto.apellidos;
                var idUsuario = localStorageService.get('autorizacion').objectResponse.userDto.id;
                var seguimientoLlamada = {
                    id: null,
                    idActividad: 1,
                    idPublico: campaniaControl.nuevoSeguimiento.id,
                    idContacto: campaniaControl.nuevoSeguimiento.id,
                    descripcion: campaniaControl.nuevaActividad.seguimientoLlamada,
                    nombreUsuario: nombreUsuario,
                    idUsuario: idUsuario,
                    idCandidatoDetalle: campaniaControl.nuevoSeguimiento.id,
                    fechaString: $filter('date')(new Date(), 'dd/MM/yyyy hh:mm:ss'),
                    estado: campaniaControl.nuevaActividad.estadoCandidato,
                    otraInstitucion: campaniaControl.nuevaActividad.otraInstitucion,
                    fechaStringProxLLamadaString: campaniaControl.nuevaActividad.proximaLlamada + " 00:00:00",
                    motivoDesinteres: campaniaControl.nuevaActividad.noLeInteresa,
                    motivoPendiente: campaniaControl.nuevaActividad.motivoPendiente
                };

                if (seguimientoLlamada.estado === 'Pendiente') {
                    campaniaControl.onAplicarCambioEstadoCandidato(campaniaControl.candidatoEditar);
                }

                eventoService.registrarSeguimientoLlamada(seguimientoLlamada).then(function (data) {
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                    campaniaControl.onChangeCandidatoGestion(campaniaControl.idCandidatoR);
                    $("#modalSeguimientoLlamadas").modal("hide");
                });
                campaniaControl.nuevaActividad.listaSeguimientosLlamadasContacto.push(seguimientoLlamada);
                campaniaControl.onCerrarPopupSeguimientoLlamadas();
            }
        };

        campaniaControl.onVerDetalleSeguimiento = function (item) {
            campaniaControl.onAbrirPopupSeguimiento();
            campaniaControl.nuevaActividad.seguimiento = item.descripcion;
            campaniaControl.campodisable = true;
            campaniaControl.tituloModal = 'Detalle';
        };

        campaniaControl.onVerDetalleSeguimientoLlamadas = function (item) {
            campaniaControl.nuevaActividad.seguimientoLlamada = item.descripcion;
            campaniaControl.campodisable = false;
            campaniaControl.tituloModal = 'Detalle';
        };

        campaniaControl.onConsultarSeguimientoLlamadasPorPublico = function (item) {
            var json = {
                idActividad: 1,
                idPublico: item.id,
                id: item.id
            };

            eventoService.consultarSeguimientoLlamadasPorPublicoAndContacto(json).then(function (data) {
                angular.forEach(data, function (value, key) {
                    var seguimientoLlamada = {
                        id: value.id,
                        idActividad: value.idActividad,
                        idPublico: value.idPublico,
                        idContacto: value.idContacto,
                        descripcion: value.descripcion,
                        nombreUsuario: value.nombreUsuario,
                        idUsuario: value.idUsuario,
                        fechaString: $filter('date')(value.fecha, 'dd/MM/yyyy hh:mm:ss'),
                        estado: value.estado,
                        otraInstitucion: value.otraInstitucion,
                        idCandidatoDetalle: value.idCandidatoDetalle
                    };
                    campaniaControl.nuevaActividad.listaSeguimientosLlamadasContacto.push(seguimientoLlamada);
                });
            }).catch(function (e) {
                return;
            });
        };
        //</editor-fold>
        //<editor-fold defaultstate="collapsed" desc="seguimiento de actividad por tipo email, individual y grupal">
        //<editor-fold defaultstate="collapsed" desc="envio de notificación individual">
        campaniaControl.onAbrirPopupSeguimientoEmail = function (item) {
            $('#modalEmailIndividual').modal({backdrop: 'static', keyboard: false});
            $("#modalEmailIndividual").modal("show");
            campaniaControl.campodisable = false;
            campaniaControl.tituloModal = appGenericConstant.ENVIO_INDIVIDUAL_CORREO;
            campaniaControl.notificarContacto = item;
        };
        campaniaControl.onNotificarIndividual = function () {
            campaniaControl.onEnviarNotificacion(campaniaControl.notificarContacto);
            campaniaControl.notificarContacto = eventoService.notificarContacto;
            campaniaControl.onCloseModalEmailIndividual();

        };
        campaniaControl.onCloseModalEmailIndividual = function () {
            new ValidationService().resetForm($scope.formNotificarContactoIndividual);
            $("#modalEmailIndividual").modal("hide");
        };
        campaniaControl.onEnviarNotificacion = function (item) {
            var nombreUsuario = localStorageService.get('autorizacion').objectResponse.userDto.nombres + ' ' + localStorageService.get('autorizacion').objectResponse.userDto.apellidos;
            var idUsuario = localStorageService.get('autorizacion').objectResponse.userDto.id;
            var notificacionContacto = {
                id: null,
                idActividad: item.idActividad,
                idPublico: item.idPublico,
                idContacto: item.id,
                descripcion: item.seguimientoLlamada,
                nombreUsuario: nombreUsuario,
                idUsuario: idUsuario,
                fechaString: $filter('date')(new Date(), 'dd/MM/yyyy hh:mm:ss')
            };
            eventoService.enviarNotificacionActividad(notificacionContacto).then(function (data) {
                swal('Enviando mensaje...');
                appConstant.CERRAR_SWAL();
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(appGenericConstant.MENSAJE_CONTACTO_SELECCIONADO);
                }
            });
        };
        //</editor-fold>
        //<editor-fold defaultstate="collapsed" desc="envio de notificación masiva">
        campaniaControl.onOpenModalEmailMasivo = function () {
            $('#modalNotificacionMasivo').modal({backdrop: 'static', keyboard: false});
            $("#modalNotificacionMasivo").modal("show");
            campaniaControl.campodisable = false;
            campaniaControl.tituloModal = appGenericConstant.ENVIO_MASIVO_CORREO;
        };

        campaniaControl.onNotificarMasivo = function () {
            campaniaControl.onEnviarNotificarMasivo();
            campaniaControl.onCloseModalEmailMasivo();
        };

        campaniaControl.onEnviarNotificarMasivo = function () {
            var listaNotificados = [];
            var list = campaniaControl.lstpublicosobjetivos;
            var nombreUsuario = localStorageService.get('autorizacion').objectResponse.userDto.nombres + ' ' + localStorageService.get('autorizacion').objectResponse.userDto.apellidos;
            var idUsuario = localStorageService.get('autorizacion').objectResponse.userDto.id;
            angular.forEach(list, function (value, key) {
                var cliente = {
                    id: null,
                    idActividad: value.idActividad,
                    idPublico: value.idPublico,
                    idContacto: value.id,
                    descripcion: value.seguimientoLlamada,
                    nombreUsuario: nombreUsuario,
                    idUsuario: idUsuario,
                    fechaString: $filter('date')(new Date(), 'dd/MM/yyyy hh:mm:ss')
                };
                listaNotificados.push(cliente);
            });
            eventoService.enviarNotificacionActividadMasiva(listaNotificados).then(function (data) {
                switch (data.tipo) {
                    case 200:
                        campaniaControl.onCloseModalEmailMasivo();
                        campaniaControl.selectTodos = false;
                        campaniaControl.report.selected.length = null;
                        appConstant.MSG_GROWL_OK(appGenericConstant.MENSAJE_CONTACTOS_SELECCIONADO);
                        break;
                    case 409:
                        appConstant.MSG_GROWL_ADVERTENCIA(data.message);
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
        campaniaControl.onCloseModalEmailMasivo = function () {
            new ValidationService().resetForm($scope.formNotificarContactoMasivo);
            $("#modalNotificacionMasivo").modal("hide");
        };
        //</editor-fold>
        //</editor-fold>



        campaniaControl.ejecutarConsultarCampanias = function () {
            campaniaService.consultarCampanias().then(function (data) {
                var campania = {};
                campaniaControl.campanias = [];

                if (campaniaControl.isDirector === 1) {
                    angular.forEach(data, function (value, key) {
                        campania = {
                            id: value.id,
                            codigo: null,
                            nombre: value.nombreCampanha,
                            descripcion: value.descripcion,
                            tipo: value.tipo,
                            estado: value.estado,
                            fechainicio: formattedDate(value.fechaInicio),
                            fechafin: formattedDate(value.fechaFin),
                            presupuesto: value.presupuesto,
                            responsable: value.responsable,
                            idtipocampania: value.idTipoCampanha,
                            tipocampania: value.nombreTipoCampanha,
                            idestadocampania: value.idEstadoCampanha,
                            estadocampania: value.nombreEstadoCampanha,
                            idCandidato: value.idCandidato
                        };
                        campaniaControl.campanias.push(campania);
                    });
                } else {

                    angular.forEach(data, function (value, key) {
                        if (value.responsable.toUpperCase() === campaniaControl.usuario.username.toUpperCase()) {
                            campania = {
                                id: value.id,
                                codigo: null,
                                nombre: value.nombreCampanha,
                                descripcion: value.descripcion,
                                tipo: value.tipo,
                                estado: value.estado,
                                fechainicio: formattedDate(value.fechaInicio),
                                fechafin: formattedDate(value.fechaFin),
                                presupuesto: value.presupuesto,
                                responsable: value.responsable,
                                idtipocampania: value.idTipoCampanha,
                                tipocampania: value.nombreTipoCampanha,
                                idestadocampania: value.idEstadoCampanha,
                                estadocampania: value.nombreEstadoCampanha,
                                idCandidato: value.idCandidato
                            };
                            campaniaControl.campanias.push(campania);
                        }
                    });
                }
            }).catch(function (e) {
                return;
            });
        };
        campaniaControl.ejecutarConsultarTiposCampanias = function () {
            campaniaService.consultarTipoCampanias().then(function (data) {
                campaniaControl.lsttipocampanias = data;
            }).catch(function (e) {
                return;
            });
        };
        campaniaControl.ejecutarConsultarEstadosCampanias = function () {
            var categoria = 'ESTADO_CAMPANIA';
            utilServices.buscarListaValorByCategoria(categoria, 'crm').then(function (data) {
                campaniaControl.listavalor = data;
            }).catch(function (e) {
                return;
            });
        };
        campaniaControl.ejecutarConsultarTiposActividades = function () {
            var categoria = 'TIPO_ACTIVIDAD';
            utilServices.buscarListaValorByCategoria(categoria, 'crm').then(function (data) {
                campaniaControl.lsttipoactividades = data;
            }).catch(function (e) {
                return;
            });
        };
        campaniaControl.ejecutarConsultarEstadosActividades = function () {
            var categoria = 'ESTADO_ACTIVIDAD';
            utilServices.buscarListaValorByCategoria(categoria, 'crm').then(function (data) {
                campaniaControl.listaEstadoActividad = data;
            }).catch(function (e) {
                return;
            });
        };
        campaniaControl.ejecutarconsultarPublicosActividades = function () {
            eventoService.consultarPublicos().then(function (data) {
                campaniaControl.publicoObjetivo = data;
            }).catch(function (e) {
                return;
            });
        };

        campaniaControl.ejecutarconsultarPublicosObjetivo = function (item) {
            localStorageService.remove('listaPublicoObjetivo');
            campaniaControl.lstpublicosobjetivos = [];
            angular.forEach(campaniaControl.publicoObjetivo, function (publico, key) {
                if (publico.id === item) {
                    angular.forEach(publico.listaContactos, function (value, key) {
                        var contacto = {
                            id: value.id,
                            idActividad: campaniaControl.nuevaActividad.id,
                            idPublico: publico.id,
                            tipoDocumento: value.aspirante.idTipoIdentificacion,
                            numeroDocumento: value.aspirante.identificacion,
                            email: value.aspirante.email,
                            nombrecompleto: value.aspirante.nombre + ' ' + value.aspirante.apellido,
                            telefono: value.aspirante.telefono,
                            celular: value.aspirante.celular,
                            programa: value.aspirante.nombrePrograma,
                            periodo: value.aspirante.periodoAcademico,
                            estado: value.aspirante.estadoInscripcion === "PRE_INSCRITO" ? "PRE INSCRITO" : value.aspirante.estadoInscripcion,
                            style: labelNotificacion(value.aspirante.estadoInscripcion)
                        };
                        campaniaControl.lstpublicosobjetivos.push(contacto);
                    });
                }
            });

            localStorageService.set('listaPublicoObjetivo', campaniaControl.lstpublicosobjetivos);
        };

        function labelNotificacion(estado) {
            var style;
            if (estado === "INSCRITO") {
                style = "bs-label label-primary";
            } else if (estado === "PRE_INSCRITO") {
                style = "bs-label label-danger";
            } else if (estado === "MATRICULADO") {
                style = "bs-label label-warning";
            } else {
                style = "bs-label label-success";
            }
            return style;
        }

        function onEjecutarconsultarActividadesDentroCampanias(item) {
            campaniaControl.actividades = [];
            if (item.id === null || item.id === undefined) {
                return;
            }
            localStorageService.remove('actividadesCampania');
            campaniaService.consultarActividadesByCampania(item.id).then(function (data) {
                angular.forEach(data, function (value, key) {
                    var listaAux = [];
                    var actividad = {
                        id: value.id,
                        nombreActividad: value.nombreActividad,
                        publicoObjetivo: value.publicoObjetivo,
                        publicoObjetivoNombre: value.nombrePublicoObjetivo,
                        tipoActividad: value.idTipoActividad,
                        tipoActividadNombre: value.nombreTipoActividad,
                        fechaInicioActividad: formattedDate(value.fechaInicio),
                        fechaFinActividad: formattedDate(value.fechaFin),
                        estadoActividad: value.idEstadoActividad,
                        estadoActividadNombre: value.estadoActividad,
                        responsableActividad: value.responsable,
                        tratamientoActividad: value.tratamientoActividad,
                        descripcionActividad: value.descripcion,
                        nombreEncuesta: value.nombreEncuesta,
                        listaSeguimientos: value.listaSeguimientos,
                        campania: value.idCampanha
                    };
                    angular.forEach(actividad.listaSeguimientos, function (val, key) {
                        var seguimiento = {
                            id: val.id,
                            descripcion: val.descripcion,
                            nombreUsuario: val.nombreUsuario,
                            idUsuario: val.idusuario,
                            fechaString: $filter('date')(val.fecha, 'dd/MM/yyyy hh:mm:ss')
                        };
                        listaAux.push(seguimiento);
                    });
                    actividad.listaSeguimientos = listaAux;
                    campaniaControl.actividades.push(actividad);
                });
                localStorageService.set('actividadesCampania', campaniaControl.actividades);
            }).catch(function (e) {
                return;
            });
        }

        function existeActividadesDentroCampanias(item) {
            campaniaControl.actividadesByCampanias = [];
            campaniaService.consultarActividadesByCampania(item).then(function (data) {
                campaniaControl.actividadesByCampanias = data;
                return campaniaControl.actividadesByCampanias;
            });
        }

        function onValidarTipoUndefineLista(list) {
            if (list === undefined || list === null) {
                return 0;
            }
            return list.length;
        }

        campaniaControl.ejecutarConsultarEstadosCampanias();
        campaniaControl.ejecutarConsultarTiposCampanias();
        campaniaControl.ejecutarConsultarTiposActividades();
        campaniaControl.ejecutarConsultarCampanias();
        campaniaControl.ejecutarConsultarEstadosActividades();
        campaniaControl.ejecutarconsultarPublicosActividades();
        /*Formateo fecha*/
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

        function onFormattedHour(date) {
            var d = new Date(date),
                    hora = '' + (d.getHours()),
                    minutos = '' + d.getMinutes(),
                    segundos = d.getSeconds();
            return [hora, minutos, segundos].join(':');
        }

        function toDate(dateStr) {
            var parts = [];
            if (dateStr.match('/')) {
                parts = dateStr.split('/');
            } else {
                parts = dateStr.split('-');
            }
            return new Date(parts[2], parts[1] - 1, parts[0]);
        }

        function toDateString(dateStr) {
            var parts = [];
            if (dateStr.match('/')) {
                parts = dateStr.split('/');
            } else {
                parts = dateStr.split('-');
            }
            return [parts[0], parts[1] - 1, parts[2]].join('/');
        }

        $('#fechaCampaña.input-daterange').datepicker({
            format: "dd/mm/yyyy",
            language: "es",
            autoclose: true,
            clearBtn: true,
            beforeShowYear: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            },
            beforeShowMonth: function (date) {
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
        $('#fechaActividad.input-daterange').datepicker({
            format: "dd/mm/yyyy",
            language: "es",
            autoclose: true,
            clearBtn: true,
            beforeShowYear: function (date) {
                if (date.getFullYear() < 1900) {
                    return false;
                }
            },
            beforeShowMonth: function (date) {
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

        if (campaniaControl.nuevaActividad.fechaInicioActividad !== null
                && campaniaControl.nuevaActividad.fechaInicioActividad !== undefined
                && campaniaControl.nuevaActividad.fechaInicioActividad !== '') {
            $("#fechainicioevento").val(campaniaControl.nuevaActividad.fechaInicioActividad);
            $('#fechainicioevento').datepicker('update');
        }
        if (campaniaControl.nuevaActividad.fechaFinActividad !== null
                && campaniaControl.nuevaActividad.fechaFinActividad !== undefined
                && campaniaControl.nuevaActividad.fechaFinActividad !== '') {
            $("#fechafinevento").val(campaniaControl.nuevaActividad.fechaFinActividad);
            $('#fechafinevento').datepicker('update');
        }


        if (campaniaControl.nuevaCampania.fechainicio !== null
                && campaniaControl.nuevaCampania.fechainicio !== undefined
                && campaniaControl.nuevaCampania.fechainicio !== '') {
            $("#fechainicio").val(campaniaControl.nuevaCampania.fechainicio);
            $('#fechainicio').datepicker('update');
        }
        if (campaniaControl.nuevaCampania.fechafin !== null
                && campaniaControl.nuevaCampania.fechafin !== undefined
                && campaniaControl.nuevaCampania.fechafin !== '') {
            $("#fechafin").val(campaniaControl.nuevaCampania.fechafin);
            $('#fechafin').datepicker('update');
        }

        function BuscarCandidatos() {
            campaniaControl.listaCandidatos = [];
            candidatoServices.buscarCandidato().then(function (data) {
                angular.forEach(data, function (value, key) {
                    var dto = {
                        id: value.id,
                        nombre: value.descripcion
                    };
                    campaniaControl.listaCandidatos.push(dto);
                });
            }).catch(function (e) {
                return;
            });
        }

        campaniaControl.onChangeCandidato = function (item) {
            if (item === null) {
                return;
            }
            localStorageService.remove('listaDetalleCandidatos');
            campaniaControl.candidatos = {};
            campaniaControl.candidatos.listaDetalleCandidatos = [];
            appConstant.MSG_LOADING("Cargando Datos");
            appConstant.CARGANDO();
            candidatoServices.consultarDetalleCandidatoNoAsignado(item).then(function (data) {
                campaniaControl.candidatos.listaDetalleCandidatos = [];
                campaniaControl.candidatos.listaDetalleCandidatos = data;
                localStorageService.set('listaDetalleCandidatos', data);

                if (data === "") {
                    appConstant.MSG_GROWL_ADVERTENCIA("No hay candidatos por registrar");
                    appConstant.CERRAR_SWAL();
                    return;
                }

                var UniqueNames = $.unique(data.map(function (d) {
                    return d.programasInteres;
                }));

                campaniaControl.programasAux = [];
                angular.forEach(UniqueNames, function (value, key) {
                    if (!campaniaControl.programasAux.includes(value)) {
                        campaniaControl.programasAux.push(value);
                    }
                });

                campaniaControl.programas = [];
                angular.forEach(campaniaControl.programasAux, function (value, key) {
                    var dto = {
                        nombrePrograma: value
                    };
                    campaniaControl.programas.push(dto);
                });

                appConstant.CERRAR_SWAL();

            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                return;
            });
        };

        function onConsultarCandidatoGestionLS(id) {

            localStorageService.remove('listaDetalleCandidatos');
            campaniaControl.candidatos = {};
            campaniaControl.candidatos.listaDetalleCandidatos = [];


            campaniaService.BuscarDetalleByIdCampania(id).then(function (data) {
                localStorageService.set('listaDetalleCandidatos', data);

                campaniaControl.candidatos.listaDetalleCandidatos = [];
                campaniaControl.candidatos.listaDetalleCandidatosPendiente = [];
                campaniaControl.candidatos.listaDetalleCandidatosPendienteConLlamada = [];
                campaniaControl.candidatos.listaDetalleCandidatosOtro = [];
                campaniaControl.candidatos.listaDetalleCandidatosAux = localStorageService.get('listaDetalleCandidatos');

                angular.forEach(campaniaControl.candidatos.listaDetalleCandidatosAux, function (value, key) {
                    if (value.estado1 === "Candidato") {
                        campaniaControl.candidatos.listaDetalleCandidatos.push(value);
                    } else if (value.estado1 === "Pendiente") {
                        campaniaControl.candidatos.listaDetalleCandidatosPendiente.push(value);
                    } else {
                        campaniaControl.candidatos.listaDetalleCandidatosOtro.push(value);
                    }

                    if (value.tieneLLamadaHoy > 0) {
                        campaniaControl.candidatos.listaDetalleCandidatosPendienteConLlamada.push(value);
                    }

                });
            }).catch(function (e) {
                return;
            });

            localStorageService.remove('listaDetalleCandidatosDia');
            campaniaService.BuscarDetalleDiaByIdCampania(id).then(function (data) {
                campaniaControl.candidatos.listaDetalleCandidatosAgenda = [];
                campaniaControl.candidatos.listaDetalleCandidatosAgenda = data;
                localStorageService.set('listaDetalleCandidatosDia', data);

            }).catch(function (e) {
                return;
            });

        }
        ;

        campaniaControl.onChangeCandidatoGestion = function (item) {
            if (item === null) {
                return;
            }

            onConsultarCandidatoGestionLS(item);
            localStorageService.set('idCandidato', item);
            $location.path('/crm-mercadeo-gestion-actividad-cud');
        };

        campaniaControl.onAplicarCambioEstadoCandidato = function (item) {
            campaniaControl.candidatos.listaDetalleCandidatosPendiente.push(item);
            campaniaControl.candidatos.listaDetalleCandidatosPendienteConLlamada.push(item);
            var index = campaniaControl.candidatos.listaDetalleCandidatos.indexOf(item);
            campaniaControl.candidatos.listaDetalleCandidatos.splice(index, appGenericConstant.UNO);
        };

        campaniaControl.usuarioRol = [];
        function onBuscarUsuarioRoles() {
            usuarioRolesService.buscarUsuarioRoles().then(function (data) {

                angular.forEach(data, function (value, key) {
                    if (value.rol === 'INSCRIPCION' || value.rol === 'ASISTENTE DE INSCRIPCION') {
                        campaniaControl.usuarioRol.push(value);
                    }
                });
                localStorageService.set('listUsuarios', campaniaControl.usuarioRol);

//                if (campaniaControl.nuevaCampania. !== null && campaniaControl.nuevaCampania !== undefined && campaniaControl.nuevaCampania !== "") {
//                    var index = campaniaControl.usuarioRol.indexOf(campaniaControl.nuevaCampania.responsable.toLowerCase());
//                    if (index > -1) {
//                        campaniaControl.nuevaCampania.responsable = campaniaControl.usuarioRol[index];
//                    }
//                }
            });
        }


        campaniaControl.listaOrigen = [
            {id: 1,
                nombre: 'Candidato'
            }
        ];


        campaniaControl.listInstituciones = [];
        campaniaControl.ejecutarConsultarInstituciones = function () {
            inscripcionService.consultarColegio().then(function (data) {
                campaniaControl.listInstituciones = [];
                campaniaControl.listInstituciones = data;
            }).catch(function (e) {
                return;
            });
        };

        campaniaControl.listEstadosCandidato = [
            {id: 1,
                nombre: 'Pendiente'
            },
            {
                id: 2,
                nombre: 'Matriculado'
            },
            {
                id: 3,
                nombre: 'Otra Institucion'
            },
            {
                id: 4,
                nombre: 'No le interesa'
            }
        ];
        campaniaControl.listEstadosNoLeInteresa = [
            {id: 1,
                nombre: 'NO TIENEN DINERO'
            },
            {
                id: 2,
                nombre: 'PERDIERON EL AÑO'
            },
            {
                id: 3,
                nombre: 'CAMBIO DE CIUDAD'
            },
            {
                id: 4,
                nombre: 'NO LE INTERESA'
            },
            {
                id: 4,
                nombre: 'TRABAJO - TIEMPO'
            }
        ];
        campaniaControl.listPendiente = [
            {id: 1,
                nombre: 'APAGADO'
            },
            {
                id: 2,
                nombre: 'NO CONTESTA'
            },
            {
                id: 3,
                nombre: 'OCUPADOS'
            },
            {
                id: 4,
                nombre: 'INTERESADO'
            },
            {
                id: 4,
                nombre: 'CONTESTO FAMILIAR'
            },
            {
                id: 4,
                nombre: 'FUERA DE SERVICIO'
            },
            {
                id: 4,
                nombre: 'SIN SEÑAL'
            },
            {
                id: 4,
                nombre: 'PROXIMO SEMESTRE'
            },
            {
                id: 4,
                nombre: 'COLGÓ'
            },
            {
                id: 4,
                nombre: 'SIN TELEFONO'
            },
            {
                id: 4,
                nombre: 'VIAJE'
            },
            {
                id: 4,
                nombre: 'EQUIVOCADO'
            }
        ];

        campaniaControl.nuevaCampania.origen = campaniaControl.listaOrigen[0].id;
        campaniaControl.mostrarVentana = true;

        campaniaControl.onChangeOrigenDato = function () {
            if (campaniaControl.nuevaCampania.origen === 1) {
                campaniaControl.mostrarVentana = true;
            } else if (campaniaControl.nuevaCampania.origen === 2) {
                campaniaControl.mostrarVentana = false;
            }
        };

        campaniaControl.onOpenModalDashboardSeguiemineto = function (idCandidato) {
            campaniaControl.listDashPendiente = [];
            campaniaControl.listDashNoInteresa = [];
            campaniaControl.listDashOtroInstituto = [];
            campaniaControl.listDashMatriculado = [];

            //Es id Campania por cambio de forma en la consulta. 
            campaniaService.onBuscarDashboardCampana(1, idCandidato, 0).then(function (data) {
                campaniaControl.listDashPendiente = data;
            });

            campaniaService.onBuscarDashboardCampana(2, idCandidato, 0).then(function (data) {
                campaniaControl.listDashOtroInstituto = data;
            });

            campaniaService.onBuscarDashboardCampana(3, idCandidato, 0).then(function (data) {
                campaniaControl.listDashNoInteresa = data;
            });

            campaniaService.onBuscarDashboardCampana(4, idCandidato, 0).then(function (data) {
                campaniaControl.listDashMatriculado = data;
            });

            campaniaService.onBuscarDashboardCampana(6, idCandidato, 0).then(function (data) {
                campaniaControl.listDashLLamadasRealizadas = data;
            });

            $('#modalDashboard').modal({backdrop: 'static', keyboard: false});
            $("#modalDashboard").modal("show");

        };

        campaniaControl.getTotalDashPendiente = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].cantidad);
            }
            return Math.round(totalNumber);
        };
        campaniaControl.getTotalDashNoLeInteresa = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].cantidad);
            }
            return Math.round(totalNumber);
        };
        campaniaControl.getTotalDashOtraInsti = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].cantidad);
            }
            return Math.round(totalNumber);
        };
        campaniaControl.getTotalDashMatriculado = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].cantidad);
            }
            return Math.round(totalNumber);
        };

        campaniaControl.listDashCantidadConvenios = [];
        campaniaControl.onChangePeriodoAcademico = function () {
            campaniaControl.listDashCantidadConvenios = [];
            appConstant.MSG_LOADING("Cargando Datos");
            appConstant.CARGANDO();
            campaniaService.onBuscarDashboardCampana(5, 0, campaniaControl.idPeriodo.id).then(function (data) {
                campaniaControl.listDashCantidadConvenios = data;
                appConstant.CERRAR_SWAL();
            });
        };

        campaniaControl.onModalAgregarCandidatos = function (item) {

            campaniaControl.nuevaCampania.candidato = {};
            campaniaControl.programasInteres = {};
            campaniaControl.conteoLista = 0;
            campaniaControl.listaDetalleCandidatosAux = [];
            campaniaControl.listaDetalleCandidatosAuxConteo = [];
            campaniaControl.listaProgramadasAgregadosCampana = [];

            campaniaControl.nuevaCampania.id = item.id;
            campaniaControl.nuevaCampania.nombre = item.nombre;
            campaniaControl.nuevaCampania.descripcion = item.descripcion;
            campaniaControl.nuevaCampania.tipo = item.idtipocampania;
            campaniaControl.nuevaCampania.estado = item.idestadocampania;
            campaniaControl.nuevaCampania.fechainicio = item.fechainicio;
            campaniaControl.nuevaCampania.fechafin = item.fechafin;
            campaniaControl.nuevaCampania.presupuesto = item.presupuesto;
            campaniaControl.nuevaCampania.responsable = item.responsable;
            campaniaControl.nuevaCampania.candidato = item.idCandidato;

            $('#modalEditarCandidatoDetalle').modal({backdrop: 'static', keyboard: false});
            $("#modalEditarCandidatoDetalle").modal("show");
        };

        campaniaControl.listaDetalleCandidatosAux = [];
        campaniaControl.listaDetalleCandidatosAuxConteo = [];
        campaniaControl.conteoLista = 0;

        campaniaControl.onChangeProgramaInteres = function () {
            campaniaControl.conteoLista = 0;
            campaniaControl.listaDetalleCandidatosAuxConteo = [];

            angular.forEach(campaniaControl.candidatos.listaDetalleCandidatos, function (value, key) {
                if (campaniaControl.programasInteres.nombrePrograma.includes(value.programasInteres)) {
                    var dto = {
                        idDetalleCandidato: value.id,
                        nombreEstudiante: value.nombreEstudiante,
                        programasInteres: value.programasInteres,
                        celularEstudiante: value.celularEstudiante,
                        direccion: value.direccion,
                        email: value.email
                    };
                    campaniaControl.listaDetalleCandidatosAuxConteo.push(dto);
                }
            });

            campaniaControl.conteoLista = campaniaControl.listaDetalleCandidatosAuxConteo.length;

        };

        campaniaControl.listaProgramadasAgregadosCampana = [];
        campaniaControl.onAgregarCampaniaDetalle = function () {

            if (campaniaControl.programasInteres === "" || campaniaControl.programasInteres === undefined ||
                    campaniaControl.programasInteres === null) {
                appConstant.MSG_GROWL_ADVERTENCIA("Debe Seleccionar programa candidato");
                return;
            }

            if (campaniaControl.listaProgramadasAgregadosCampana.includes(campaniaControl.programasInteres.nombrePrograma)) {

                angular.forEach(campaniaControl.programas, function (value, key) {
                    if (value.nombrePrograma === campaniaControl.programasInteres.nombrePrograma) {
                        value.select = '1';
                    }
                });

                appConstant.MSG_GROWL_ADVERTENCIA("Este Bloque de Candidatos ya fue agregado");
                return;
            }

            angular.forEach(campaniaControl.candidatos.listaDetalleCandidatos, function (value, key) {
                if (campaniaControl.programasInteres.nombrePrograma.includes(value.programasInteres)) {
                    var dto = {
                        idDetalleCandidato: value.id,
                        nombreEstudiante: value.nombreEstudiante,
                        programasInteres: value.programasInteres,
                        celularEstudiante: value.celularEstudiante,
                        direccion: value.direccion,
                        email: value.email
                    };
                    campaniaControl.listaDetalleCandidatosAux.push(dto);
                }
            });

            var index = campaniaControl.programas.indexOf(campaniaControl.programasInteres);
            if (index > -1) {
                campaniaControl.programas[index].select = '1';
            }

            campaniaControl.listaProgramadasAgregadosCampana.push(campaniaControl.programasInteres.nombrePrograma);
            campaniaControl.programasInteres = null;
            campaniaControl.conteoLista = 0;
        };

        function onConsultarPeriodos() {
            campaniaControl.listadoPeriodos = [];
            asistenciaServices.getPeriodosAcademicosAll().then(function (data) {
                angular.forEach(data, function (value, key) {
                    var periodo = {
                        id: value.id,
                        nombre: value.nombrePeriodoAcademico
                    };
                    campaniaControl.listadoPeriodos.push(periodo);
                });
            });
        }

        campaniaControl.onFiltrarProgramaPorNivelFormacion = function () {
            appConstant.MSG_LOADING('Cargando datos. Espera un momento...');
            appConstant.CARGANDO();
            inscripcionService.consultarProgramaNivelFormacion(2, 10006).then(function (data) {
                campaniaControl.programas = [];
                if (data !== null && data.tipo !== 500) {
                    angular.forEach(data, function (value) {
                        var programa = {
                            id: value.id,
                            nombrePrograma: value.nombrePrograma
                        };
                        campaniaControl.programas.push(programa);
                    });
                }
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                campaniaControl.programas = [];
                //throw e;
                return;
            });
        };

        campaniaControl.guardarCandidatoDetalleCamapana = function () {
            var campania = {
                id: campaniaControl.nuevaCampania.id,
                nombreCampanha: appConstant.VALIDAR_STRING(campaniaControl.nuevaCampania.nombre),
                descripcion: campaniaControl.nuevaCampania.descripcion,
                idTipoCampanha: campaniaControl.nuevaCampania.tipo,
                idEstadoCampanha: campaniaControl.nuevaCampania.estado,
                fechaInicio: toDate(campaniaControl.nuevaCampania.fechainicio),
                fechaFin: toDate(campaniaControl.nuevaCampania.fechafin),
                presupuesto: campaniaControl.nuevaCampania.presupuesto,
                responsable: appConstant.VALIDAR_STRING(campaniaControl.nuevaCampania.responsable),
                idCandidato: campaniaControl.nuevaCampania.candidato,
                listDetalleCamapania: campaniaControl.listaDetalleCandidatosAux
            };
            appConstant.MSG_LOADING("Guardando Candidatos Campaña");
            appConstant.CARGANDO();
            campaniaService.registrarCampania(campania).then(function (data) {
                $("#modalEditarCandidatoDetalle").modal("hide");
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);

            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };


        onConsultarPeriodos();
        BuscarCandidatos();
        onBuscarUsuarioRoles();
        campaniaControl.ejecutarConsultarInstituciones();
//        campaniaControl.onFiltrarProgramaPorNivelFormacion();
    }
})();
