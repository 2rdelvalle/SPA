(function () {
    'use strict';
    angular.module('mytodoApp').controller('RolCtrller', RolCtrller);
    RolCtrller.$inject = ['$scope', 'rolesServices', 'appConstant', '$location', 'ValidationService', 'localStorageService', 'utilServices', 'appGenericConstant'];
    function RolCtrller($scope, rolesServices, appConstant, $location, ValidationService, localStorageService, utilServices, appGenericConstant) {
        var gestionRol = this;
        gestionRol.Rol = [];
        gestionRol.Modulos = [];
        gestionRol.seleccionados = [];
        gestionRol.rolEntity = rolesServices.rol;
        gestionRol.rolAuxiliar = rolesServices.rolAuxiliar;
        gestionRol.config = {globalTimeToLive: 3000, disableCountDown: true};
        gestionRol.options = [{name: '7', value: '7'}, {name: '14', value: '14'}];
        gestionRol.report = {selected: null};
        gestionRol.report2 = {selected: null};
        gestionRol.selectedOption = gestionRol.options[0];
        gestionRol.rolAuxiliar.validaModulo = false;
        gestionRol.bag = [];
        gestionRol.bagAyudas = [];
        gestionRol.bagAtajos = [];
        gestionRol.mostarBtnAgregarModulo = false;
        gestionRol.mostrarInputModuloNuevo = false;
        gestionRol.mostrarInputClase = false;
        gestionRol.mostrarNivel2 = false;
        gestionRol.idClase;
        gestionRol.idOpcion;
        gestionRol.idNivel1;
        gestionRol.idNivel2;
        gestionRol.idNivel3;
        gestionRol.idNivel4;
        gestionRol.label = "";
        gestionRol.claseMuestra = "";
        gestionRol.btnBooleanMostrar = false;
        gestionRol.opcionesAregarModulo = [
            {id: 1,
                opcion: 'Menú',
                opcionGuardar: 'menu'},
            {id: 2,
                opcion: 'Submenú',
                opcionGuardar: 'submenu'}
        ];

        gestionRol.opcionesClase = [
            {id: 1,
                opcion: 'glyph-icon icon-dashboard'},
            {id: 2,
                opcion: 'glyph-icon icon-cogs'}
        ];

        gestionRol.opcionesClaseModulo = [
            {id: 1,
                opcion: 'glyph-icon icon-linecons-globe text-center'},
            {id: 2,
                opcion: 'glyph-icon icon-linecons-money text-center'},
            {id: 3,
                opcion: 'glyph-icon icon-linecons-desktop text-center'},
            {id: 4,
                opcion: ' glyph-icon icon-linecons-wallet text-center'},
            {id: 5,
                opcion: 'glyph-icon icon-linecons-params text-center'},
            {id: 6,
                opcion: 'glyph-icon icon-linecons-comment text-center'},
            {id: 7,
                opcion: 'glyph-icon icon-linecons-lock text-center'},
            {id: 8,
                opcion: 'glyph-icon icon-linecons-tag text-center'},
            {id: 9,
                opcion: 'glyph-icon icon-linecons-user text-center'},
            {id: 10,
                opcion: 'glyph-icon icon-linecons-t-shirt text-center'},
            {id: 11,
                opcion: 'glyph-icon icon-linecons-doc text-center'},
            {id: 12,
                opcion: 'glyph-icon icon-linecons-attach text-center'},
            {id: 13,
                opcion: 'glyph-icon icon-linecons-desktop text-center'},
            {id: 14,
                opcion: 'glyph-icon icon-linecons-note text-center'}
        ];

        gestionRol.subMenuAgregar_1 = [];
        gestionRol.subMenuAgregar_2 = [];
        gestionRol.subMenuAgregar_3 = [];
        gestionRol.subMenuAgregar_4 = [];

        function onBuscarRol() {
            rolesServices.buscarRoles().then(function (data) {
                if (data !== null && data.tipo !== 500) {
                    angular.forEach(data, function (value) {
                        var rol = {
                            id: value.id,
                            nombre: value.nombre,
                            estado: value.estado,
                            codigo: value.codigo,
                            modulos: value.modulos,
                            atajos: value.atajos,
                            ayudas: value.ayudas
                        };
                        gestionRol.Rol.push(rol);
                    });
                }
            });
        }



        function onListarModulos() {
            rolesServices.modulos().then(function (data) {
                gestionRol.Modulos = data;
            });
        }

        gestionRol.onLimpiar = function () {
            rolesServices.rol = {};
            gestionRol.rolEntity.codigo = null;
            gestionRol.rolEntity.nombre = null;
            gestionRol.rolAuxiliar.validaModulo = false;
            gestionRol.rolEntity.modulos = [];
            localStorageService.remove('rol');
        };
        gestionRol.onClickToAddRol = function () {
            rolesServices.buscarRolCodigo("DEFAULT").then(function (data) {
                gestionRol.onLimpiar();
                gestionRol.rolAuxiliar.disableVerDetalle = false;
                gestionRol.rolAuxiliar.disableCodigo = false;
                gestionRol.rolAuxiliar.onDeshabilitarCampoEstado = true;
                gestionRol.rolAuxiliar.titulo = appGenericConstant.AGREGAR_ROL;
                localStorageService.set('rol', null);
                localStorageService.set('rolAuxiliar', gestionRol.rolAuxiliar);

                gestionRol.bag = data[appGenericConstant.CERO].modulos;
                gestionRol.bagAyudas = JSON.parse(data[appGenericConstant.CERO].ayudas);
                gestionRol.bagAtajos = JSON.parse(data[appGenericConstant.CERO].atajos);

                localStorageService.set('bag', gestionRol.bag);
                localStorageService.set('bagAyudas', gestionRol.bagAyudas);
                localStorageService.set('bagAtajos', gestionRol.bagAtajos);

                $location.path('/cud-roles');
            });
        };
        function onConsultarListaEstados() {
            utilServices.buscarListaValorByCategoria('ESTADO', 'auth').then(function (data) {
                gestionRol.listaEstados = data;
            });
        }

        gestionRol.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formRegistrarRol)) {
                if (gestionRol.rolEntity.id === null || gestionRol.rolEntity.id === undefined) {
                    gestionRol.onRegistrarRol();
                    new ValidationService().resetForm($scope.formRegistrarRol);
                } else {
                    gestionRol.onActulizarRol();
                }
            } else {
                gestionRol.rolAuxiliar.validaModulo = true;
            }
        };
        gestionRol.onRegistrarRol = function () {
            gestionRol.onVerificarArrayModulo();
            var stringModulo = unescape(JSON.stringify(gestionRol.bag));
            var stringAyudas = unescape(JSON.stringify(gestionRol.bagAyudas));
            var stringAtajos = unescape(JSON.stringify(gestionRol.bagAtajos));
            try {
                var newRol = {
                    codigo: gestionRol.rolEntity.codigoRol,
                    nombre: gestionRol.rolEntity.nombreRol.toUpperCase(),
                    modulos: stringModulo,
                    estado: "ACTIVO",
                    ayudas: stringAyudas,
                    atajos: stringAtajos

                };
                appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
                appConstant.CARGANDO();
                rolesServices.registrarRol(newRol).then(function (data) {
                    if (data.tipo === 409) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.EXISTE_CODIGO_INGRESADO);
                    } else if (data.tipo === 200) {
                        gestionRol.onLimpiar();
                        onBuscarRol();
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                    } else {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                    }
                });
            } catch (e) {
                gestionRol.rolAuxiliar.validaModulo = true;
            }
        };
        gestionRol.onBlurModulo = function () {
            if (gestionRol.rolEntity.modulos !== null || gestionRol.rolEntity.modulos !== undefined) {
                gestionRol.rolAuxiliar.validaModulo = false;
            }
        };

        gestionRol.onEliminarRol = function (item) {
            swal({
                title: appGenericConstant.PREG_ELIMINAR_CARGO,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                rolesServices.deleteRol(item).then(function (data) {
                    if (data.tipo === 200) {
                        setTimeout(function () {
                            swal(appGenericConstant.ROL_ELIMINADO,
                                    appGenericConstant.CARGO_ELIMINADO_SATIS,
                                    appGenericConstant.SUCCESS);
                        }, 1);
                    } else if (data.tipo === 400) {
                        setTimeout(function () {
                            swal(appGenericConstant.ALTO_AHI,
                                    appGenericConstant.CARGO_NO_ELIMINADO,
                                    appGenericConstant.WARNING);
                        }, 1);
                    } else {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                    }
                    gestionRol.report.selected.length = null;
                    onBuscarRol();
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    gestionRol.report.selected.length = null;
                }
            });
        };
        if (localStorageService.get('bag') !== null) {
            var event = localStorageService.get('bag');
            gestionRol.bag = event;
        }
        if (localStorageService.get('bagAtajos') !== null) {
            gestionRol.bagAtajos = localStorageService.get('bagAtajos');
        }
        if (localStorageService.get('bagAyudas') !== null) {
            gestionRol.bagAyudas = localStorageService.get('bagAyudas');
        }
        if (localStorageService.get('rol') !== null) {
            var event = localStorageService.get('rol');
            gestionRol.rolEntity = event;
        }
        if (localStorageService.get('rolAuxiliar') !== null) {
            gestionRol.rolAuxiliar = localStorageService.get('rolAuxiliar');
        }
        if (localStorageService.get('rolSelect') !== null) {
            gestionRol.seleccionados = localStorageService.get('rolSelect');
        }
        if (localStorageService.get('JsonModulo') !== null) {
            gestionRol.bag = localStorageService.get('JsonModulo');
        }
        ;
        gestionRol.onEdit = function (item) {
            gestionRol.bag = [];
            gestionRol.rolAuxiliar.disableVerDetalle = false;
            gestionRol.rolAuxiliar.disableCodigo = true;
            gestionRol.rolAuxiliar.onDeshabilitarCampoEstado = false;
            gestionRol.rolAuxiliar.titulo = appGenericConstant.MODIFICAR_ROL;
            gestionRol.rolEntity.codigoRol = item.codigo;
            gestionRol.rolEntity.nombreRol = item.nombre;
            gestionRol.rolEntity.estado = item.estado;
            gestionRol.bagAyudas = JSON.parse(item.ayudas);
            gestionRol.bagAtajos = JSON.parse(item.atajos);
            //Convertir String de la consulta a JSON
            gestionRol.bag = item.modulos;
            gestionRol.rolEntity.id = item.id;
            localStorageService.set('rol', gestionRol.rolEntity);
            localStorageService.set('bag', item.modulos);
            localStorageService.set('bagAyudas', gestionRol.bagAyudas);
            localStorageService.set('bagAtajos', gestionRol.bagAtajos);
            localStorageService.set('rolAuxiliar', gestionRol.rolAuxiliar);
            $location.path('/cud-roles');

        };

        function obtenerSeleccionados(modulos) {
            try {
                var listaModulos = modulos.split(',');
                var lista = [];
                angular.forEach(listaModulos, function (value, key) {
                    lista.push(parseInt(value));
                });
                return lista;
            } catch (e) {
                return;
            }

        }

        gestionRol.onActulizarRol = function () {
            gestionRol.onVerificarArrayModulo();
            //Convertir JSON a String
            var stringModulo = unescape(JSON.stringify(gestionRol.bag));
            var stringAyudas = unescape(JSON.stringify(gestionRol.bagAyudas));
            var stringAtajos = unescape(JSON.stringify(gestionRol.bagAtajos));
            var aux = localStorageService.get('usuario');
            if (aux.rol.codigo === gestionRol.rolEntity.codigoRol) {
                swal({
                    title: appGenericConstant.NECESARIO_CERRAR_SESION,
                    text: appGenericConstant.ROL_HA_GUARDAR,
                    type: appGenericConstant.INFO,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: 'default',
                    confirmButtonText: appGenericConstant.CERRAR_SESION,
                    cancelButtonText: appGenericConstant.CANCELAR
                }).then(function () {
                    try {
                        var newRol = {
                            codigo: gestionRol.rolEntity.codigoRol,
                            nombre: gestionRol.rolEntity.nombreRol.toUpperCase(),
                            estado: gestionRol.rolEntity.estado,
                            id: gestionRol.rolEntity.id,
                            modulos: stringModulo,
                            ayudas: stringAyudas,
                            atajos: stringAtajos

                        };
                        appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
                        appConstant.CARGANDO();
                        rolesServices.actulizarRol(newRol).then(function (data) {
                            if (data.tipo === 200) {
                                appConstant.CERRAR_SWAL();
                                appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                                $location.path("/");
                                location.reload();
                                localStorageService.clearAll();
                                angular.element('#page-header').addClass('hidden');
                                angular.element('#page-sidebar').addClass('hidden');
                                angular.element('#page-content').addClass('hidden');
                                angular.element('body > div.fixed-sidebar.fixed-header').css('height', $(window).height());
                                angular.element('body > div.fixed-sidebar.fixed-header').css('background', '#0096D4');
                                angular.element('body > div.fixed-sidebar.fixed-header').css('background-image', 'url(\'styles/assets/images/background/Fondo-Login-Yinn.jpg\')');

                            } else {
                                appConstant.CERRAR_SWAL();
                                appConstant.MSG_GROWL_ERROR();
                            }
                        });
                        gestionRol.report.selected = null;
                    } catch (e) {
                        gestionRol.rolAuxiliar.validaModulo = true;
                    }
                });
            } else {
                try {
                    var newRol = {
                        codigo: gestionRol.rolEntity.codigoRol,
                        nombre: gestionRol.rolEntity.nombreRol.toUpperCase(),
                        estado: gestionRol.rolEntity.estado,
                        id: gestionRol.rolEntity.id,
                        modulos: stringModulo,
                        ayudas: stringAyudas,
                        atajos: stringAtajos
                    };
                    appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
                    appConstant.CARGANDO();
                    rolesServices.actulizarRol(newRol).then(function (data) {
                        if (data.tipo === 200) {
                            appConstant.CERRAR_SWAL();
                            localStorageService.set('rol', gestionRol.rolEntity);
                            appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                            localStorageService.set('bag', gestionRol.bag);
                        } else {
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ERROR();
                        }
                    });
                    gestionRol.report.selected = null;
                } catch (e) {
                    gestionRol.rolAuxiliar.validaModulo = true;
                }
            }
        };

        gestionRol.onVerificarArrayModulo = function () {

            for (var i = 0; i < gestionRol.bag.length; i++) {

                if (gestionRol.bag[i].selected === false) {

                    if (gestionRol.bag[i].children.length > 0) {

                        for (var j = 0; j < gestionRol.bag[i].children.length; j++) {

                            if (gestionRol.bag[i].children[j].selected === false) {

                                if (gestionRol.bag[i].children[j].children.length > 0) {

                                    for (var k = 0; k < gestionRol.bag[i].children[j].children.length; k++) {

                                        if (gestionRol.bag[i].children[j].children[k].selected === true) {

                                            gestionRol.bag[i].children[j].selected = true;

                                            gestionRol.bag[i].selected = true;

                                        }
                                    }
                                }
                            } else {
                                gestionRol.bag[i].selected = true;
                            }
                        }
                    }
                }
            }
        };

        gestionRol.onShowMenu = function () {
            if (gestionRol.modulo === undefined || gestionRol.modulo === "" || gestionRol.modulo === null) {
                gestionRol.mostarBtnAgregarModulo = false;
                return;
            }
            gestionRol.moduloList = [];

            for (var i = 0; i < gestionRol.bag.length; i++) {
                if (gestionRol.modulo.codigo === gestionRol.bag[i].codigo) {
                    gestionRol.moduloList = gestionRol.bag[i];
                }
            }
            gestionRol.mostarBtnAgregarModulo = true;
        };

        gestionRol.onAgregarModulo = function (item) {
            gestionRol.label = "";
            gestionRol.ruta = "";
            gestionRol.idClase = "";
            gestionRol.idOpcion = undefined;
            gestionRol.mostrarInputModuloNuevo = false;

            gestionRol.subMenuAgregar_1 = [];
            gestionRol.subMenuAgregar_2 = [];
            gestionRol.subMenuAgregar_3 = [];
            gestionRol.idNivel1 = null;
            gestionRol.idNivel2 = null;
            gestionRol.idNivel3 = null;
            gestionRol.mostrarNivel2 = false;
            gestionRol.btnBooleanMostrar = false;

            gestionRol.subMenuAgregar_1.push(gestionRol.moduloList);
            gestionRol.onMostrarModal(item);
        };

        gestionRol.onMostrarModal = function (item) {
            $('#' + item).modal({backdrop: 'static', keyboard: false});
            $("#" + item).modal("show");
        };

        gestionRol.onChangeOpcion = function () {
            if (gestionRol.idOpcion === undefined || gestionRol.idOpcion === "" || gestionRol.idOpcion === null) {
                gestionRol.mostrarInputModuloNuevo = false;
                gestionRol.label = "";
                gestionRol.ruta = "";
                gestionRol.idClase = "";
                return;
            }
            gestionRol.mostrarInputModuloNuevo = true;
        };

        gestionRol.onChangeClase = function () {
            if (gestionRol.idClase === undefined || gestionRol.idClase === "" || gestionRol.idClase === null) {
                gestionRol.mostrarInputClase = false;
                gestionRol.claseMuestra = "";
                return;
            }
            gestionRol.mostrarInputClase = true;
        };

        gestionRol.onChangeNivel1 = function () {
            if (gestionRol.idNivel1 === undefined || gestionRol.idNivel1 === "" || gestionRol.idNivel1 === null) {
                gestionRol.mostrarNivel2 = false;
                gestionRol.subMenuAgregar_2 = [];
                return;
            }
            gestionRol.subMenuAgregar_2 = [];
            gestionRol.mostrarNivel2 = true;
            angular.forEach(gestionRol.idNivel1.children, function (value) {
                if (value.tipo === 'submenu') {
                    gestionRol.subMenuAgregar_2.push(value);
                }
            });

        };

        gestionRol.onChangeNivel2 = function () {
            if (gestionRol.idNivel2 === undefined || gestionRol.idNivel2 === "" || gestionRol.idNivel2 === null) {
                gestionRol.subMenuAgregar_3 = [];

                gestionRol.opcionesAregarModulo = [
                    {id: 1,
                        opcion: 'Menú',
                        opcionGuardar: 'menu'},
                    {id: 2,
                        opcion: 'Submenú',
                        opcionGuardar: 'submenu'}
                ];

                return;
            }

            gestionRol.subMenuAgregar_3 = [];
            angular.forEach(gestionRol.idNivel2.children, function (value) {
                if (value.tipo === 'submenu') {
                    gestionRol.subMenuAgregar_3.push(value);
                }
            });

            gestionRol.opcionesAregarModulo = [
                {id: 1,
                    opcion: 'Menú',
                    opcionGuardar: 'menu'}
            ];
        };

        gestionRol.onChangeNivel3 = function () {
            if (gestionRol.idNivel3 === undefined || gestionRol.idNivel3 === "" || gestionRol.idNivel3 === null) {
                gestionRol.opcionesAregarModulo = [
                    {id: 1,
                        opcion: 'Menú',
                        opcionGuardar: 'menu'},
                    {id: 2,
                        opcion: 'Submenú',
                        opcionGuardar: 'submenu'}
                ];
                return;
            }

            gestionRol.opcionesAregarModulo = [
                {id: 1,
                    opcion: 'Menú',
                    opcionGuardar: 'menu'}
            ];

        };

        gestionRol.onGuardar = function () {
            gestionRol.moduloListEditRoles = [];
            gestionRol.moduloEditRoles = [];
            gestionRol.moduloEditRoles_2 = [];
            gestionRol.moduloEditRoles_3 = [];

            angular.forEach(gestionRol.Rol, function (value) {
                gestionRol.moduloListEditRoles.push(value.modulos);
            });

            if ((gestionRol.idNivel1 !== undefined && gestionRol.idNivel1 !== "" && gestionRol.idNivel1 !== null)
                    && (gestionRol.idNivel2 !== undefined && gestionRol.idNivel2 !== "" && gestionRol.idNivel2 !== null)
                    && (gestionRol.idNivel3 !== undefined && gestionRol.idNivel3 !== "" && gestionRol.idNivel3 !== null)) {

                gestionRol.onGuardarModulo(gestionRol.moduloListEditRoles);
                return;
            }

            if (gestionRol.idNivel1 !== undefined && gestionRol.idNivel1 !== "" && gestionRol.idNivel1 !== null) {
                for (var i = 0; i < gestionRol.moduloListEditRoles.length; i++) {
                    for (var j = 0; j < gestionRol.moduloListEditRoles[i].length; j++) {
                        if (gestionRol.idNivel1.ruta === gestionRol.moduloListEditRoles[i][j].ruta) {
                            gestionRol.moduloEditRoles.push(gestionRol.moduloListEditRoles[i][j]);
                            break;
                        }
                    }
                }
            }

            if (gestionRol.idNivel2 !== undefined && gestionRol.idNivel2 !== "" && gestionRol.idNivel2 !== null) {
                for (var k = 0; k < gestionRol.moduloEditRoles.length; k++) {
                    for (var l = 0; l < gestionRol.moduloEditRoles[k].children.length; l++) {
                        if (gestionRol.idNivel2.ruta === gestionRol.moduloEditRoles[k].children[l].ruta) {
                            gestionRol.moduloEditRoles_2.push(gestionRol.moduloEditRoles[k].children[l]);
                            break;
                        }
                    }
                }
                gestionRol.moduloEditRoles = gestionRol.moduloEditRoles_2;
            }

            if (gestionRol.idNivel3 !== undefined && gestionRol.idNivel3 !== "" && gestionRol.idNivel3 !== null) {
                for (var m = 0; m < gestionRol.moduloEditRoles.length; m++) {
                    for (var n = 0; n < gestionRol.moduloEditRoles[m].children.length; n++) {
                        if (gestionRol.idNivel3.ruta === gestionRol.moduloEditRoles[m].children[n].ruta) {
                            gestionRol.moduloEditRoles_3.push(gestionRol.moduloEditRoles[m].children[n]);
                            break;
                        }
                    }
                }
                gestionRol.moduloEditRoles = gestionRol.moduloEditRoles_3;
            }

            gestionRol.moduloListString = [];
            gestionRol.contador = 0;

            angular.forEach(gestionRol.moduloEditRoles, function (value) {
                gestionRol.listString = {stringSinModificar: unescape(JSON.stringify(value))};
                gestionRol.objeto = {
                    label: gestionRol.label,
                    ruta: "/#/" + gestionRol.ruta,
                    clase: gestionRol.idClase,
                    selected: false,
                    tipo: gestionRol.idOpcion.opcionGuardar,
                    id: "0",
                    value: "0",
                    children: [],
                    __ivhTreeviewExpanded: false,
                    __ivhTreeviewIndeterminate: false
                };

                value.children.push(gestionRol.objeto);
                gestionRol.listString.stringModificado = unescape(JSON.stringify(value));
                gestionRol.listString.idRol = gestionRol.Rol[gestionRol.contador].id;
                gestionRol.moduloListString.push(gestionRol.listString);
                gestionRol.contador++;
            });
            gestionRol.onContinuarGuardarMenu(gestionRol.moduloListString);

        };

        gestionRol.onContinuarGuardarMenu = function (objeto) {
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            rolesServices.agregarMenu(objeto).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                    $location.path("/");
                    location.reload();
                    localStorageService.clearAll();
                    angular.element('#page-header').addClass('hidden');
                    angular.element('#page-sidebar').addClass('hidden');
                    angular.element('#page-content').addClass('hidden');
                    angular.element('body > div.fixed-sidebar.fixed-header').css('height', $(window).height());
                    angular.element('body > div.fixed-sidebar.fixed-header').css('background', '#0096D4');
                    angular.element('body > div.fixed-sidebar.fixed-header').css('background-image', 'url(\'styles/assets/images/background/Fondo-Login-Yinn.jpg\')');

                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                }
            });
        };

        gestionRol.onValidarCampos = function () {

            var idOpcionBoolean = gestionRol.idOpcion !== undefined && gestionRol.idOpcion !== "" && gestionRol.idOpcion !== null;
            var labelBoolean = gestionRol.label !== undefined && gestionRol.label !== "" && gestionRol.label !== null;
            var rutaBoolean = gestionRol.ruta !== undefined && gestionRol.ruta !== "" && gestionRol.ruta !== null;
            var idClaseBoolean = gestionRol.idClase !== undefined && gestionRol.idClase !== "" && gestionRol.idClase !== null;

            gestionRol.btnBooleanMostrar = idOpcionBoolean && labelBoolean && rutaBoolean && idClaseBoolean;
        };

        gestionRol.onAgregarModuloMenu = function (item) {
            gestionRol.label = "";
            gestionRol.ruta = "";
            gestionRol.idClase = "";
            gestionRol.idOpcion = undefined;
            gestionRol.mostrarInputModuloNuevo = false;
            gestionRol.btnBooleanMostrar = false;
            gestionRol.onMostrarModal(item);
        };

        gestionRol.onGuardarModulo = function () {

            var moduloDTO = {
                codigo: gestionRol.label,
                nombre: gestionRol.label,
                ruta: "/#/" + gestionRol.ruta,
                clase: gestionRol.idClase
            };

            rolesServices.agregarModulo(moduloDTO).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);

                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                }
            });

//            angular.forEach(gestionRol.Rol, function (value) {
//                gestionRol.moduloListString = [];
//                gestionRol.listString = {stringSinModificar: unescape(JSON.stringify(value.modulos))};
//                gestionRol.objeto = {
//                    label: gestionRol.label,
//                    ruta: "/#/" + gestionRol.ruta,
//                    clase: gestionRol.idClase,
//                    selected: false,
//                    tipo: 'submenu',
//                    id: "0",
//                    value: "0",
//                    children: [],
//                    __ivhTreeviewExpanded: false,
//                    __ivhTreeviewIndeterminate: false
//                };
//
//                value.modulos.push(gestionRol.objeto);
//                gestionRol.listString.stringModificado = unescape(JSON.stringify(value.modulos));
//                gestionRol.listString.idRol = value.id;
//                gestionRol.moduloListString.push(gestionRol.listString);
//                gestionRol.contador++;
//                gestionRol.onContinuarGuardarMenu(gestionRol.moduloListString);
//            });


        };

        gestionRol.onEliminarMenu = function () {
            var ModuloEliminarDTO = {
                ruta1: gestionRol.idNivel1.ruta,
                ruta2: gestionRol.idNivel2.ruta,
                ruta3: gestionRol.idNivel3.ruta,
                id: gestionRol.rolEntity.id
            };

            rolesServices.eliminarMenu(ModuloEliminarDTO).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);

                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                }
            });
        };

        gestionRol.awesomeCallback = function (node, tree) {
            // Do something with node or tree 
        };
        gestionRol.otherAwesomeCallback = function (node, isSelected, tree) {
            // Do soemthing with node or tree based on isSelected 
        };

        gestionRol.onEliminarModulo = function (item) {

            gestionRol.subMenuAgregar_1 = [];
            gestionRol.subMenuAgregar_2 = [];
            gestionRol.subMenuAgregar_3 = [];
            gestionRol.idNivel1 = null;
            gestionRol.idNivel2 = null;
            gestionRol.idNivel3 = null;
            gestionRol.btnBooleanMostrar = false;

            gestionRol.subMenuAgregar_1.push(gestionRol.moduloList);
            gestionRol.idNivel1 = gestionRol.subMenuAgregar_1[0];

            gestionRol.subMenuAgregar_2 = [];
            angular.forEach(gestionRol.idNivel1.children, function (value) {
                gestionRol.subMenuAgregar_2.push(value);
            });

            gestionRol.onMostrarModal(item);

        };


        gestionRol.onChangeNivel1Eliminar = function () {
            if (gestionRol.idNivel1 === undefined || gestionRol.idNivel1 === "" || gestionRol.idNivel1 === null) {
                gestionRol.subMenuAgregar_2 = [];
                return;
            }
            gestionRol.subMenuAgregar_2 = [];
            angular.forEach(gestionRol.idNivel1.children, function (value) {
                if ((value.tipo === 'submenu' || value.tipo === 'menu') && (value.children.length === 0 || value.children === undefined)) {
                    gestionRol.subMenuAgregar_2.push(value);
                }
            });

        };

        gestionRol.onChangeNivel2Eliminar = function () {
            if (gestionRol.idNivel2 === undefined || gestionRol.idNivel2 === "" || gestionRol.idNivel2 === null) {
                gestionRol.subMenuAgregar_3 = [];
                return;
            }

            gestionRol.subMenuAgregar_3 = [];
            angular.forEach(gestionRol.idNivel2.children, function (value) {
//                if ((value.tipo === 'submenu' || value.tipo === 'menu') && (value.children.length === 0 || value.children === undefined)) {
                gestionRol.subMenuAgregar_3.push(value);
//                }
            });
        };


        gestionRol.onChangeNivel3Eliminar = function () {
            if (gestionRol.idNivel3 === undefined || gestionRol.idNivel3 === "" || gestionRol.idNivel3 === null) {
                gestionRol.subMenuAgregar_4 = [];
                return;
            }

            angular.forEach(gestionRol.idNivel3.children, function (value) {
//                if ((value.tipo === 'submenu' || value.tipo === 'menu') && (value.children.length === 0 || value.children === undefined)) {
                gestionRol.subMenuAgregar_4.push(value);
//                }
            });
        };


        onBuscarRol();
        onListarModulos();
        onConsultarListaEstados();
    }
})();




