(function () {
    'use strict';
    angular.module('mytodoApp').controller('categoriaActividadesCtrl', categoriaActividadesCtrl);
    categoriaActividadesCtrl.$inject = ['$scope','$location', 'categoriaActividadesEntitiesService', 'growl', 'ValidationService', 'localStorageService','appGenericConstant'];
    function categoriaActividadesCtrl($scope,$location, categoriaActividadesEntitiesService, growl, ValidationService, localStorageService, appGenericConstant ) {
        var categoriaActividadesControl = this;
        categoriaActividadesControl.categoriaActividadesEntity = categoriaActividadesEntitiesService.categoriaActividades;
        categoriaActividadesControl.categoriaActividadesVisor = categoriaActividadesEntitiesService.categoriaActividadesAux;
        categoriaActividadesControl.lista = [];
        categoriaActividadesControl.listaActividades = [];
        var noSave = appGenericConstant.CERO;
        var config = {};
        if (localStorageService.get('categoria') !== null && localStorageService.get('status') !== null) {
            var categoria = localStorageService.get('categoria');
            var status = localStorageService.get('status');
            categoriaActividadesControl.categoriaActividadesEntity = categoria;
            categoriaActividadesControl.categoriaActividadesVisor = status;
        }

        if (localStorageService.get('actividades') !== null) {
            categoriaActividadesControl.listaActividades = localStorageService.get('actividades');
        }

        categoriaActividadesControl.options = [{
            name: '5',
            value: '5'
        }, {
                name: '10',
                value: '10'
            }, {
                name: '30',
                value: '30'
            }, {
                name: '50',
                value: '50'
            }, {
                name: '100',
                value: '100'
            }, {
                name: '150',
                value: '150'
            }];

        categoriaActividadesControl.selectedOption = categoriaActividadesControl.options[0];

        categoriaActividadesControl.report = {
            selected: null
        };

        function onConsultarCategoria() {
            categoriaActividadesEntitiesService.buscarcategoriaActividades().then(function (data) {
                categoriaActividadesControl.lista = data;
            });
        }

        categoriaActividadesControl.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formAgregarCategoria)) {
                categoriaActividadesControl.onNewRegistryCategoria();
                new ValidationService().resetForm($scope.formAgregarCategoria);
            }
        };

        categoriaActividadesControl.onLimpiarRegistro = function () {
            categoriaActividadesControl.categoriaActividadesEntity.id = null;
            categoriaActividadesControl.categoriaActividadesVisor.onDeshabilitar = false;
            categoriaActividadesControl.categoriaActividadesVisor.onDeshabilitarTabla = true;
            categoriaActividadesControl.categoriaActividadesVisor.titulo = appGenericConstant.AGREGAR_CATEGORIA_ACTIVIDADES;
            categoriaActividadesControl.categoriaActividadesEntity.codigo = '';
            categoriaActividadesControl.categoriaActividadesVisor.onDeshabilitarCodigo = false;
            categoriaActividadesControl.categoriaActividadesEntity.nombreCat = '';
            categoriaActividadesControl.categoriaActividadesEntity.estado = null;
            categoriaActividadesControl.categoriaActividadesEntity.estadoLogico = 'A';
            localStorageService.remove('categoria');
            localStorageService.remove('status');
            $location.path("/categorias-actividades-gestion");
        };


        categoriaActividadesControl.onNewRegistryCategoria = function () {
            categoriaActividadesEntitiesService.comprobarCodigo(categoriaActividadesControl.categoriaActividadesEntity).then(function (data) {
                if (data.length === 0 && typeof data === "object") {
                    if (categoriaActividadesControl.categoriaActividadesEntity.id === null || categoriaActividadesControl.categoriaActividadesEntity.id === undefined) {
                        var newCategoria =
                            {
                                codigo: categoriaActividadesControl.categoriaActividadesEntity.codigo,
                                nombre: categoriaActividadesControl.categoriaActividadesEntity.nombreCat,
                                estado: categoriaActividadesControl.categoriaActividadesEntity.estado,
                                estadoLogico: 'A'
                            };
                        categoriaActividadesEntitiesService.agregarcategoriaActividades(newCategoria).then(function (data) {
                            growl.success("<div><i class='glyphicon glyphicon-ok' style='padding-left: 15px;font-size: 20px;'></i>&nbsp;&nbsp;<span><strong>OK!   </strong>  La categoria ha sido creada satisfactoriamente </div>");
                            categoriaActividadesControl.onLimpiarRegistro();
                        });
                    }
                }
                else {
                    var temp = localStorageService.get('categoria');
                    if (temp === null && typeof temp === "object") {
                        growl.warning("<div><i class='glyphicon glyphicon-warning-sign' style='padding-left: 15px;font-size: 20px;'></i>&nbsp;&nbsp;<span><strong>Advertencia   </strong>  Ya existe una categoría con este codigo </div>");
                    }
                    else {
                        var updateCategoria =
                            {
                                id: categoriaActividadesControl.categoriaActividadesEntity.id,
                                codigo: categoriaActividadesControl.categoriaActividadesEntity.codigo,
                                nombre: categoriaActividadesControl.categoriaActividadesEntity.nombreCat,
                                estado: categoriaActividadesControl.categoriaActividadesEntity.estado,
                                estadoLogico: 'A'
                            };
                        categoriaActividadesEntitiesService.actualizarcategoriaActividades(updateCategoria).then(function (data) {
                            growl.success("<div><i class='glyphicon glyphicon-ok' style='padding-left: 15px;font-size: 20px;'></i>&nbsp;&nbsp;<span><strong>OK!   </strong>  La categoria ha sido actualizada satisfactoriamente </div>");
                        });

                    }
                }
            });
        };

        categoriaActividadesControl.onClickToView = function (item) {
            categoriaActividadesControl.categoriaActividadesVisor.onDeshabilitar = true;
            categoriaActividadesControl.categoriaActividadesVisor.onDeshabilitarTabla = false;
            categoriaActividadesControl.categoriaActividadesVisor.onDeshabilitarOpciones = true;
            categoriaActividadesControl.categoriaActividadesVisor.titulo = appGenericConstant.VER_DETALLES_CATEGORIA_ACT;
            categoriaActividadesControl.categoriaActividadesEntity.id = item.id;
            categoriaActividadesControl.categoriaActividadesEntity.nombreCat = item.nombre;
            categoriaActividadesControl.categoriaActividadesEntity.codigo = item.codigo;
            categoriaActividadesControl.categoriaActividadesEntity.estado = item.estado;
            localStorageService.set('categoria', categoriaActividadesControl.categoriaActividadesEntity);
            localStorageService.set('status', categoriaActividadesControl.categoriaActividadesVisor);
            localStorageService.set("actividades", null);
            onConsultarActividades(item);
        };

        categoriaActividadesControl.onClickToEditar = function (item) {
            categoriaActividadesControl.categoriaActividadesVisor.onDeshabilitar = false;
            categoriaActividadesControl.categoriaActividadesVisor.onDeshabilitarCodigo = true;
            categoriaActividadesControl.categoriaActividadesVisor.onDeshabilitarTabla = false;
            categoriaActividadesControl.categoriaActividadesVisor.onDeshabilitarOpciones = false;
            categoriaActividadesControl.categoriaActividadesVisor.titulo = appGenericConstant.MODIFICAR_CATEGORIA_ACTIVIDADES;
            categoriaActividadesControl.categoriaActividadesEntity.id = item.id;
            categoriaActividadesControl.categoriaActividadesEntity.nombreCat = item.nombre;
            categoriaActividadesControl.categoriaActividadesEntity.codigo = item.codigo;
            categoriaActividadesControl.categoriaActividadesEntity.estado = item.estado;
            localStorageService.set('categoria', categoriaActividadesControl.categoriaActividadesEntity);
            localStorageService.set('status', categoriaActividadesControl.categoriaActividadesVisor);
            localStorageService.set("actividades", null);
            onConsultarActividades(item);
        };

        categoriaActividadesControl.onClickToDelete = function (item) {
            swal({
                title: appGenericConstant.ELIMINAR_REGISTRO,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.WARNING,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                closeOnConfirm: false,
                allowOutsideClick: false
            }).then(function (isConfirm) {
                if (isConfirm) {

                    appConstant.CERRAR_SWAL();
                    setTimeout(function () {
                        swal(
                            appGenericConstant.TITLE_CATEGORIA_ELIMINADA,
                            appGenericConstant.MSG_CATEGORIA_ELIMINADA,
                            appGenericConstant.SUCCESS
                        );
                    }, 500);
                    item.estadoLogico = 'I';
                    categoriaActividadesEntitiesService.eliminarcategoriaActividades(item).then(function (data) {
                        categoriaActividadesControl.report.selected.length = null;
                        onConsultarCategoria();
                    });
                }
            });
        };

        categoriaActividadesControl.onClickToDeleteMasivo = function () {
            swal({
                title: appGenericConstant.ELIMINAR_REGISTROS,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.WARNING,
                showCancelButton: true,
                confirmButtonText:  appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                closeOnConfirm: false,
                allowOutsideClick: false
            }).then(function (isConfirm) {
                if (isConfirm) {
                    appConstant.CERRAR_SWAL();
                    setTimeout(function () {
                        swal(
                            appGenericConstant.TITLE_CATEGORIAS_ELIMINADAS,
                            appGenericConstant.MSG_CATEGORIAS_ELIMINADAS,
                            appGenericConstant.SUCCESS
                        );
                    }, 1000);
                    angular.forEach(categoriaActividadesControl.report.selected, function (value, key) {
                        var eliminadoMasv = {
                            id: value.id,
                            nombre: value.nombreCat,
                            codigo: value.codigo,
                            estado: value.estado,
                            estadoLogico: 'I'
                        };
                        categoriaActividadesEntitiesService.eliminarcategoriaActividades(eliminadoMasv).then(function (data) {
                            categoriaActividadesControl.report.selected.length = null;
                            onConsultarCategoria();
                        });
                    });
                }
            });
        };

        onConsultarCategoria();

        /*------------------- Sección Actividades -------------------*/
        function onConsultarActividades(item) {
            categoriaActividadesEntitiesService.listarActividades(item).then(function (data) {
                categoriaActividadesControl.listaActividades = data;
                localStorageService.set("actividades", categoriaActividadesControl.listaActividades);
                $location.path('/categorias-actividades-gestion');
            });
        }

        categoriaActividadesControl.filasSeleccionadas = [];
        categoriaActividadesControl.onSelect = function (item, index) {
            if (!item.selected) {
                item.selected = !item.selected;
                categoriaActividadesControl.filasSeleccionadas.push(item);
            }
            else {
                item.selected = !item.selected;
                angular.forEach(categoriaActividadesControl.filasSeleccionadas, function (value, key) {
                    while (item.codigo === value.codigo) {
                        var newIndex = categoriaActividadesControl.filasSeleccionadas.indexOf(value);
                        categoriaActividadesControl.filasSeleccionadas.splice(newIndex, 1);
                        return;
                    }
                });
            }
        };

        categoriaActividadesControl.onComprobarActividad = function (data) {
            while (data === '') {
                noSave = 0;
                return "Campo Requerido";
            }

            if (data !== '') {
                noSave += 1;
            }

            if (noSave === 2) {
                noSave = 0;
            }
        };

        categoriaActividadesControl.onCancelarGuardadoActividad = function (index) {
            if (localStorageService.get("actividades").length < index) {
                categoriaActividadesControl.listaActividades.splice(index - 1, 1);
            }
        };

        categoriaActividadesControl.onAgregarActividad = function () {
            categoriaActividadesControl.nuevaActividad = {
                id: categoriaActividadesControl.listaActividades.length + 1,
                codigo: '',
                nombre: '',
                estadoLogico: "A"
            },
                categoriaActividadesControl.initialConfigActividad = {
                    initial: 'inserted===actividades.nombre'
                };
            categoriaActividadesControl.listaActividades.push(categoriaActividadesControl.nuevaActividad);
        };

        categoriaActividadesControl.onGuardarActividad = function (data, index) {
            if (index > localStorageService.get("actividades").length) {
                var nuevaActividad = {
                    codigo: data.codigo,
                    nombre: data.nombre,
                    categoria: categoriaActividadesControl.categoriaActividadesEntity.codigo,
                    estadoLogico: "A"

                };
                categoriaActividadesEntitiesService.agregarActividades(nuevaActividad).then(function (data) {
                    localStorageService.set("actividades", categoriaActividadesControl.listaActividades);
                    growl.success("<div><i class='glyphicon glyphicon-ok' style='padding-left: 15px;font-size: 20px;'></i>&nbsp;&nbsp;<span><strong>¡Bien Hecho!   </strong>  La actividad ha sido creada satisfactoriamente </div>");
                });
            }
            else {
                var updateActividad =
                    {
                        id: categoriaActividadesControl.listaActividades[index - 1].id,
                        codigo: data.codigo,
                        nombre: data.nombre,
                        categoria: categoriaActividadesControl.categoriaActividadesEntity.codigo,
                        estadoLogico: 'A'
                    };
                categoriaActividadesEntitiesService.actualizarActividades(updateActividad).then(function (data) {
                    localStorageService.set("actividades", categoriaActividadesControl.listaActividades);
                    growl.success("<div><i class='glyphicon glyphicon-ok' style='padding-left: 15px;font-size: 20px;'></i>&nbsp;&nbsp;<span><strong>¡Bien Hecho!   </strong>  La actividad ha sido actualizada satisfactoriamente </div>");
                });

            }
        };

        categoriaActividadesControl.onEliminarActividad = function (index) {
            var elemento = categoriaActividadesControl.listaActividades[index];
            elemento.estadoLogico = 'I';
            categoriaActividadesEntitiesService.eliminarActividades(elemento).then(function (data) {
                categoriaActividadesControl.listaActividades.splice(index, 1);
                localStorageService.set("actividades", categoriaActividadesControl.listaActividades);
                growl.success("<div><i class='glyphicon glyphicon-ok' style='padding-left: 15px;font-size: 20px;'></i>&nbsp;&nbsp;<span><strong>¡Bien Hecho!   </strong>  La actividad ha sido eliminada satisfactoriamente </div>");
            });
        };

        categoriaActividadesControl.onEliminarActividadMasivo = function () {
            angular.forEach(categoriaActividadesControl.filasSeleccionadas, function (value, key) {
                var eliminadoMasv = {
                    id: value.id,
                    nombre: value.nombre,
                    codigo: value.codigo,
                    categoria: value.categoria,
                    estadoLogico: 'I'
                };

                angular.forEach(categoriaActividadesControl.listaActividades, function (value, key) {
                    if (value.codigo === eliminadoMasv.codigo) {
                        var newIndex = categoriaActividadesControl.listaActividades.indexOf(value);
                        categoriaActividadesEntitiesService.eliminarActividades(eliminadoMasv).then(function (data) {
                            categoriaActividadesControl.listaActividades.splice(newIndex, 1);
                            localStorageService.set("actividades", categoriaActividadesControl.listaActividades);
                            growl.success("<div><i class='glyphicon glyphicon-ok' style='padding-left: 15px;font-size: 20px;'></i>&nbsp;&nbsp;<span><strong>¡Bien Hecho!   </strong>  La actividades han sido eliminadas satisfactoriamente </div>");
                        });
                        return;
                    }
                });

            });
        };
    }

})();

