(function () {
    'use strict';
    angular.module('mytodoApp').controller('RecursoEducativoCtrl', RecursoEducativoCtrl);
    RecursoEducativoCtrl.$inject = ['$scope', 'recursoEducativosServices', '$location', 'growl', 'ValidationService', 'localStorageService', 'utilServices', 'appConstant', '$interval', 'appGenericConstant'];
    function RecursoEducativoCtrl($scope, recursoEducativosServices, $location, growl, ValidationService, localStorageService, utilServices, appConstant, $interval, appGenericConstant) {

        var gestionRecursosEducativos = this;
        var filtro = 'estadoLogico=A';
        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        gestionRecursosEducativos.recursos = [];
        gestionRecursosEducativos.tiposRecursos = [];
        gestionRecursosEducativos.listEstados = [];
        gestionRecursosEducativos.sedes = [];
        gestionRecursosEducativos.display;
        gestionRecursosEducativos.recursoEdu = recursoEducativosServices.recursoEducativo;
        gestionRecursosEducativos.recursoEduAuxiliar = recursoEducativosServices.entidadAuxiliar;
        gestionRecursosEducativos.options = appConstant.FILTRO_TABLAS;
        gestionRecursosEducativos.selectedOption = gestionRecursosEducativos.options[0];
        gestionRecursosEducativos.report = {
            selected: null
        };
        gestionRecursosEducativos.counter = 0;
        if (localStorageService.get('recursoEdu') !== null) {
            gestionRecursosEducativos.recursoEdu = localStorageService.get('recursoEdu');
        }
        if (localStorageService.get('recursoEduAuxiliar') !== null) {
            gestionRecursosEducativos.recursoEduAuxiliar = localStorageService.get('recursoEduAuxiliar');
        }


        /*Consultar Recursos Educativos*/
        function onBuscarRecursosEducativos(filtro) {
            gestionRecursosEducativos.recursos = [];
            gestionRecursosEducativos.counter = 0;
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            recursoEducativosServices.buscarRecursosEdu(filtro).then(function (data) {
                angular.forEach(data, function (value, key) {
                    var recursoE = {
                        id: value.id,
                        codigo: value.codigo,
                        nombre: value.nombre,
                        tipo: value.idTipoRecurso,
                        tipoNombre: value.nombreTipoRecurso,
                        sede: value.idSede,
                        ubicacion: value.ubicacion,
                        descripcion: value.descripcion,
                        capacidad: value.capacidad,
                        estado: value.estado
                    };
                    gestionRecursosEducativos.recursos.push(recursoE);
                });
                appConstant.CERRAR_SWAL();
            });
        }

        var refreshTabla = function counter(filtro) {
            gestionRecursosEducativos.counter = gestionRecursosEducativos.counter + 1;
            if (gestionRecursosEducativos.counter === 10) {
                recursoEducativosServices.buscarRecursosEdu(filtro).then(function (data) {
                    gestionRecursosEducativos.recursos = [];
                    angular.forEach(data, function (value, key) {
                        var recursoE = {
                            id: value.id,
                            codigo: value.codigo,
                            nombre: value.nombre,
                            tipo: value.idTipoRecurso,
                            tipoNombre: value.nombreTipoRecurso,
                            sede: value.idSede,
                            ubicacion: value.ubicacion,
                            descripcion: value.descripcion,
                            capacidad: value.capacidad,
                            estado: value.estado
                        };
                        gestionRecursosEducativos.recursos.push(recursoE);
                    });
                    gestionRecursosEducativos.counter = 0;
                });
            }
        };

        //

        gestionRecursosEducativos.cancelarInterval = function () {
            //
        };

        /*Limpiar Entidad Recursos Educativos*/
        function onLimpiar() {
            gestionRecursosEducativos.recursoEdu.id = null;
            gestionRecursosEducativos.recursoEdu.codigo = '';
            gestionRecursosEducativos.recursoEdu.nombre = '';
            gestionRecursosEducativos.recursoEdu.tipo = null;
            gestionRecursosEducativos.recursoEdu.sede = null;
            gestionRecursosEducativos.recursoEdu.ubicacion = '';
            gestionRecursosEducativos.recursoEdu.descripcion = '';
            gestionRecursosEducativos.recursoEdu.capacidad = null;
            gestionRecursosEducativos.recursoEdu.estado = null;
        }

        /*Consulta La Lista De Tipos De Recursos Educativos Y De Sedes*/
        function onCargarListas() {
            utilServices.buscarListaValorByCategoria('TIPO_RECURSO', 'admisiones').then(function (data) {
                gestionRecursosEducativos.tiposRecursos = data;
            });
            recursoEducativosServices.buscarSedes().then(function (data) {
                gestionRecursosEducativos.sedes = data;
            });
            
            gestionRecursosEducativos.listEstados =[{'codigo':'ACTIVO','valor':'ACTIVO' }, {'codigo':'INACTIVO', 'valor':'INACTIVO'}];

        }

        /*Metodo Para Limpiar La Entidad Desde La Vista*/
        gestionRecursosEducativos.onClickToAddRecursoEdu = function () {
            onLimpiar();
            gestionRecursosEducativos.recursoEduAuxiliar.disableVerDetalle = false;
            gestionRecursosEducativos.recursoEduAuxiliar.disableCodigo = false;
            gestionRecursosEducativos.recursoEduAuxiliar.titulo = appGenericConstant.AGREGAR_RECURSO_EDUCATIVO;

            localStorageService.set('recursoEduAuxiliar', gestionRecursosEducativos.recursoEduAuxiliar);
            localStorageService.set('recursoEdu', {});
            $location.path('/recurso-educativo-registrar');
            new ValidationService().resetForm($scope.formRegistrarRecursoEdu);
        };

        /*Acción Para Validar Y Guargar Recursos Educativos*/
        gestionRecursosEducativos.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formRegistrarRecursoEdu)) {
                if (gestionRecursosEducativos.recursoEdu.id === null || typeof gestionRecursosEducativos.recursoEdu.id === 'undefined') {
                    gestionRecursosEducativos.onAddRecursoEdu();
                } else {
                    gestionRecursosEducativos.onUpdateRecursoEdu();
                }
                new ValidationService().resetForm($scope.formRegistrarRecursoEdu);
            }
        };

        gestionRecursosEducativos.onAddRecursoEdu = function () {
            var recursoE = {
                codigo: gestionRecursosEducativos.recursoEdu.codigo.toUpperCase(),
                nombre: gestionRecursosEducativos.recursoEdu.nombre.toUpperCase(),
                idTipoRecurso: gestionRecursosEducativos.recursoEdu.tipo,
                idSede: gestionRecursosEducativos.recursoEdu.sede,
                ubicacion: gestionRecursosEducativos.recursoEdu.ubicacion,
                descripcion: gestionRecursosEducativos.recursoEdu.descripcion,
                capacidad: parseInt(gestionRecursosEducativos.recursoEdu.capacidad),
                estado: gestionRecursosEducativos.recursoEdu.estado,
            };
            recursoEducativosServices.agregarRecursoEdu(recursoE).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                    onLimpiar();
                } else if (data.tipo === 409) {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);

                } else {
                    MSG_GROWL_ERROR();

                }
            }).catch(function (e) {
                return;
            });
        };

        /*Método Para Obtener El  Recurso Educativo A Editar*/
        gestionRecursosEducativos.onClickToUpdateRecursoEdu = function (item) {
            onLimpiar();
            gestionRecursosEducativos.recursoEduAuxiliar.disableVerDetalle = false;
            gestionRecursosEducativos.recursoEduAuxiliar.disableCodigo = true;
            gestionRecursosEducativos.recursoEduAuxiliar.titulo = appGenericConstant.MODIFICAR_RECURSO_EDUCATIVO;
            gestionRecursosEducativos.recursoEdu.id = item.id;
            gestionRecursosEducativos.recursoEdu.codigo = item.codigo;
            gestionRecursosEducativos.recursoEdu.nombre = item.nombre;
            gestionRecursosEducativos.recursoEdu.tipo = item.tipo;
            gestionRecursosEducativos.recursoEdu.sede = item.sede;
            gestionRecursosEducativos.recursoEdu.ubicacion = item.ubicacion;
            gestionRecursosEducativos.recursoEdu.descripcion = item.descripcion;
            gestionRecursosEducativos.recursoEdu.capacidad = item.capacidad;
            gestionRecursosEducativos.recursoEdu.estado = item.estado;

            localStorageService.set('recursoEduAuxiliar', gestionRecursosEducativos.recursoEduAuxiliar);
            localStorageService.set('recursoEdu', gestionRecursosEducativos.recursoEdu);
            $location.path('/recurso-educativo-registrar');
        };

        /*Acción Para Validar Y Modificar Recursos Educativos*/
        gestionRecursosEducativos.onSubmitUpdateForm = function () {
            if (new ValidationService().checkFormValidity($scope.formEditarRecursoEdu)) {
                gestionRecursosEducativos.onUpdateRecursoEdu();
            }
        };

        /*Acción Para Validar Y Modificar Recursos Educativos*/
        gestionRecursosEducativos.onUpdateRecursoEdu = function () {
            var recursoE = {
                id: gestionRecursosEducativos.recursoEdu.id,
                codigo: gestionRecursosEducativos.recursoEdu.codigo.toUpperCase(),
                nombre: gestionRecursosEducativos.recursoEdu.nombre.toUpperCase(),
                idTipoRecurso: gestionRecursosEducativos.recursoEdu.tipo,
                idSede: gestionRecursosEducativos.recursoEdu.sede,
                ubicacion: gestionRecursosEducativos.recursoEdu.ubicacion,
                descripcion: gestionRecursosEducativos.recursoEdu.descripcion,
                capacidad: parseInt(gestionRecursosEducativos.recursoEdu.capacidad),
                estado: gestionRecursosEducativos.recursoEdu.estado
            };
            recursoEducativosServices.actualizarRecursoEdu(recursoE).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                    localStorageService.set('recursoEdu', gestionRecursosEducativos.recursoEdu);
                } else if (data.tipo === 409) {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);

                } else {
                    MSG_GROWL_ERROR();

                }
            }).catch(function (e) {
                MSG_GROWL_ERROR();
                return;
            });
        };

        gestionRecursosEducativos.onClickToVerMasRecursoEdu = function (item) {
            onLimpiar();

            gestionRecursosEducativos.recursoEduAuxiliar.disableVerDetalle = true;
            gestionRecursosEducativos.recursoEduAuxiliar.disableCodigo = false;
            gestionRecursosEducativos.recursoEduAuxiliar.titulo = appGenericConstant.DETALLE_RECURSO_EDUCATIVO;
            gestionRecursosEducativos.recursoEdu.id = item.id;
            gestionRecursosEducativos.recursoEdu.codigo = item.codigo;
            gestionRecursosEducativos.recursoEdu.nombre = item.nombre;
            gestionRecursosEducativos.recursoEdu.tipo = item.tipo;
            gestionRecursosEducativos.recursoEdu.sede = item.sede;
            gestionRecursosEducativos.recursoEdu.ubicacion = item.ubicacion;
            gestionRecursosEducativos.recursoEdu.descripcion = item.descripcion;
            gestionRecursosEducativos.recursoEdu.capacidad = item.capacidad;
            gestionRecursosEducativos.recursoEdu.estado = item.estado;

            localStorageService.set('recursoEduAuxiliar', gestionRecursosEducativos.recursoEduAuxiliar);
            localStorageService.set('recursoEdu', gestionRecursosEducativos.recursoEdu);
            $location.path('/recurso-educativo-registrar');
        };

        /*Acción Para Eliminar Un Recurso Educativo*/
        gestionRecursosEducativos.onDeleteRecursoEdu = function (item) {
            gestionRecursosEducativos.report.selected.length = null;
            swal({
                title: appGenericConstant.PREG_ELIMINAR_RECURSO_EDUCATIVO,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                recursoEducativosServices.eliminarRecursoEdu(item).then(function (response) {
                    switch (response.tipo) {
                        case 200:
                            swal(appGenericConstant.RECURSO_ELIMINADO,
                                    appGenericConstant.RECURSO_ELIMINADO_SATIS,
                                    appGenericConstant.SUCCESS);
                            onBuscarRecursosEducativos();
                            break;
                        case 500:
                            swal(appGenericConstant.HUBO_PROBLEMA,
                                    appGenericConstant.ERROR_INTERNO_SISTEMA,
                                    'error');
                            break;
                        default:
                            swal(appGenericConstant.HUBO_PROBLEMA,
                                    appGenericConstant.RECURSO_NO_ELIMINADO,
                                    appGenericConstant.WARNING);
                            break;
                    }
                    gestionRecursosEducativos.report.selected.length = null;
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    gestionRecursosEducativos.report.selected.length = null;
                }
            });
        };

        /*Acción Para Eliminar  Recursos Educativos De Forma Masivo*/
        gestionRecursosEducativos.onDeleteMasivoRecursoEdu = function () {
            var listaElementosEliminar = [];
            swal({
                title: appGenericConstant.PREG_ELIMINAR_RECURSOS_EDUCATIVOS,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                closeOnConfirm: false,
                allowOutsideClick: false
            }).then(function (isConfirm) {
                if (isConfirm) {
                    angular.forEach(gestionRecursosEducativos.report.selected, function (value, key) {
                        listaElementosEliminar.push(value.id);
                    });
                    recursoEducativosServices.eliminarRecursoEduMasivo(listaElementosEliminar).then(function (response) {
                        switch (response.tipo) {
                            case 200:
                                swal(appGenericConstant.RECURSOS_ELIMINADOS,
                                        appGenericConstant.RECURSOS_NO_ELIMINADOS,
                                        appGenericConstant.SUCCESS);
                                onBuscarRecursosEducativos();
                                break;
                            case 500:
                                swal(appGenericConstant.HUBO_PROBLEMA,
                                        appGenericConstant.ERROR_INTERNO_SISTEMA,
                                        'error');
                                break;
                            default:
                                swal(appGenericConstant.HUBO_PROBLEMA,
                                        appGenericConstant.ALGUNOS_RECURSOS,
                                        appGenericConstant.WARNING);
                                break;
                        }
                    });
                } else {

                    gestionRecursosEducativos.report.selected.length = null;

                }
            });

        };
        onBuscarRecursosEducativos(filtro);
        onCargarListas();
    }
})();