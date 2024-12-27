(function () {
    'use strict';
    angular.module('mytodoApp').controller('seccionalesCtrl', seccionalesCtrl);
    seccionalesCtrl.$inject = ['$scope', 'seccionalesServices', '$location', 'growl', 'ValidationService', 'localStorageService', 'NgTableParams', 'utilServices', 'appConstant' , 'appGenericConstant', 'appConstantValueList'];
    function seccionalesCtrl($scope, seccionalesServices, $location, growl, ValidationService, localStorageService, NgTableParams, utilServices, appConstant, appGenericConstant, appConstantValueList) {


        angular.module('mytodoApp').controller('groupCtrl', function ($scope) {

            $scope.group.$hideRows = true;
        });
        var gestionSeccionales = this;
        gestionSeccionales.filasSeleccionadas = [];
        //tabla de facultades programas    

        gestionSeccionales.cols = [{
            title: "Facultad",
            show: true,
            groupable: "nombreFacultad"
        }, {
                field: "codigoPrograma",
                title: "Cód. Programa",
                show: true

            }, {
                field: "nombrePrograma",
                title: "Programa",
                show: true

            }, {
                field: "nombreJornada",
                title: "Jornada",
                show: true
            }];
        gestionSeccionales.tableParams = new NgTableParams({
            group: {
                nombreFacultad: "desc"
            }
        }, {
                dataset: gestionSeccionales.programas,
                groupOptions: {
                    isExpanded: false
                }
            });
        gestionSeccionales.onSelect = function (item, index) {
            if (!item.selected) {
                item.selected = !item.selected;
                gestionSeccionales.filasSeleccionadas.push(item);


            } else {
                item.selected = !item.selected;
                angular.forEach(gestionSeccionales.filasSeleccionadas, function (value, key) {
                    while (item.codigoPrograma === value.codigoPrograma) {
                        var newIndex = gestionSeccionales.filasSeleccionadas.indexOf(value);
                        gestionSeccionales.filasSeleccionadas.splice(newIndex, 1);

                        return;
                    }
                });
            }
            if (gestionSeccionales.programas.length === gestionSeccionales.filasSeleccionadas.length) {
                gestionSeccionales.select = false;
                gestionSeccionales.noselect = true;
                gestionSeccionales.mselect = true;

            } else if (gestionSeccionales.filasSeleccionadas.length === 0) {
                gestionSeccionales.select = true;
                gestionSeccionales.noselect = false;
                gestionSeccionales.mselect = true;

            } else {
                gestionSeccionales.select = true;
                gestionSeccionales.noselect = true;
                gestionSeccionales.mselect = false;

            }
        };
        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        gestionSeccionales.seccionales = [];
        gestionSeccionales.display;
        gestionSeccionales.programasSelect = [];
        gestionSeccionales.programas = [];
        gestionSeccionales.estados = [];
        gestionSeccionales.acordionsClose = true;
        gestionSeccionales.select = true;
        gestionSeccionales.noselect = false;
        gestionSeccionales.mselect = true;
        gestionSeccionales.seccional = seccionalesServices.seccional;
        gestionSeccionales.seccionalAuxiliar = seccionalesServices.seccionalAuxiliar;
        gestionSeccionales.options = appConstant.FILTRO_TABLAS;
        gestionSeccionales.selectedOption = gestionSeccionales.options[0];
        gestionSeccionales.report = {
            selected: null
        };
        if (localStorageService.get('seccional') !== null) {
            gestionSeccionales.seccional = localStorageService.get('seccional');
        }
        if (localStorageService.get('seccionalAuxiliar') !== null) {
            gestionSeccionales.seccionalAuxiliar = localStorageService.get('seccionalAuxiliar');
        }

        function onBuscarSeccionales() {
            seccionalesServices.buscarSeccional().then(function (data) {
                gestionSeccionales.seccionales = data;
            });
        }


        function onBuscarProgramas() {
            seccionalesServices.buscarPrograma().then(function (data) {
                gestionSeccionales.programas = data;
                for (var i = 0; i < gestionSeccionales.seccional.programa.length; i++) {
                    for (var e = 0; e < gestionSeccionales.programas.length; e++) {
                        if (gestionSeccionales.seccional.programa[i].codigoPrograma === gestionSeccionales.programas[e].codigoPrograma) {
                            gestionSeccionales.programas[e].selected = true;
                            gestionSeccionales.filasSeleccionadas.push(gestionSeccionales.programas[e]);
                        }
                    }
                }

                if (gestionSeccionales.programas.length === gestionSeccionales.filasSeleccionadas.length) {
                    gestionSeccionales.select = false;
                    gestionSeccionales.noselect = true;
                    gestionSeccionales.mselect = true;

                } else if (gestionSeccionales.filasSeleccionadas.length === 0) {
                    gestionSeccionales.select = true;
                    gestionSeccionales.noselect = false;
                    gestionSeccionales.mselect = true;

                } else {
                    gestionSeccionales.select = true;
                    gestionSeccionales.noselect = true;
                    gestionSeccionales.mselect = false;

                }
            });

        }
        function onBuscarEstados() {
            var listaEstados = [];
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_ESTADO,'configeneral').then(function (data) {
                angular.forEach(data, function (value, key) {
                    listaEstados.push(value.valor);
                });
                gestionSeccionales.estados = listaEstados;
            });
        }

        gestionSeccionales.SelectAll = function () {

            if (gestionSeccionales.programas.length !== gestionSeccionales.filasSeleccionadas.length) {

                for (var i = 0; i < gestionSeccionales.programas.length; i++) {
                    if (gestionSeccionales.programas[i].selected !== true) {
                        gestionSeccionales.programas[i].selected = true;
                        gestionSeccionales.filasSeleccionadas.push(gestionSeccionales.programas[i]);
                    }
                }
                gestionSeccionales.select = false;
                gestionSeccionales.noselect = true;
                gestionSeccionales.mselect = true;


            } else {
                for (var i = 0; i < gestionSeccionales.programas.length; i++) {
                    gestionSeccionales.programas[i].selected = false;
                    gestionSeccionales.filasSeleccionadas.splice(gestionSeccionales.programas[i]);
                }
                gestionSeccionales.select = true;
                gestionSeccionales.noselect = false;
                gestionSeccionales.mselect = true;

            }

        };

        function onLimpiar() {
            seccionalesServices.seccional = {};
            gestionSeccionales.seccional.id = null;
            gestionSeccionales.seccional.codigo = null;
            gestionSeccionales.seccional.nombre = null;
            gestionSeccionales.seccional.estado = null;
            gestionSeccionales.seccional.programas = null;
            for (var i = 0; i < gestionSeccionales.programas.length; i++) {
                gestionSeccionales.programas[i].selected = false;
                gestionSeccionales.filasSeleccionadas.splice(gestionSeccionales.programas[i]);
            }
        }

        gestionSeccionales.onClickToAddSeccional = function () {
            onLimpiar();
            gestionSeccionales.seccionalAuxiliar.disableVerDetalle = false;
            gestionSeccionales.seccionalAuxiliar.disabletabla = true;
            gestionSeccionales.seccionalAuxiliar.disableEstado = true;
            gestionSeccionales.seccionalAuxiliar.disableCodigo = false;
            gestionSeccionales.seccionalAuxiliar.titulo = appGenericConstant.AGREGAR_SECCIONAL;
            localStorageService.set('seccional', null);
            localStorageService.set('seccionalAuxiliar', gestionSeccionales.seccionalAuxiliar);
        };
        gestionSeccionales.onSubmitForm = function () {

            if (new ValidationService().checkFormValidity($scope.formCudSeccional)) {
                if (gestionSeccionales.seccional.id === null || gestionSeccionales.seccional.id === undefined) {

                    gestionSeccionales.onAddSeccional();
                    new ValidationService().resetForm($scope.formCudSeccional);
                } else {
                    gestionSeccionales.onUpdateSeccional();
                }
            }
        };
        gestionSeccionales.onAddSeccional = function () {

            var seccional = {
                id: gestionSeccionales.seccional.id,
                codigoSeccional: gestionSeccionales.seccional.codigo.toUpperCase(),
                nombreSeccional: gestionSeccionales.seccional.nombre.toUpperCase(),
                estado: 'ACTIVO',
                programasSeccional: gestionSeccionales.seccional.programa = gestionSeccionales.filasSeleccionadas
            };
            seccionalesServices.agregarSeccional(seccional).then(function (data) {
                if (data.tipo === 400) {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.EXISTE_CODIGO_INGRESADO);

                } else if (data.tipo === 200) {
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                    onLimpiar();
                } else {
                    appConstant.MSG_GROWL_ERROR();
                }
            });
        };

        gestionSeccionales.onClickToUpdateSeccional = function (item) {
            onLimpiar();
            gestionSeccionales.seccionalAuxiliar.disableVerDetalle = false;
            gestionSeccionales.seccionalAuxiliar.disableCodigo = true;
            gestionSeccionales.seccionalAuxiliar.disabletabla = true;
            gestionSeccionales.seccionalAuxiliar.disableEstado = false;
            gestionSeccionales.seccionalAuxiliar.titulo = appGenericConstant.MODIFICAR_SECCIONAL;
            gestionSeccionales.seccional.id = item.id;
            gestionSeccionales.seccional.codigo = item.codigoSeccional;
            gestionSeccionales.seccional.nombre = item.nombreSeccional;
            gestionSeccionales.seccional.estado = item.estadoSeccional;
            gestionSeccionales.seccional.programa = item.programasSeccional;
            $location.path('/cud-seccionales');
            localStorageService.set('seccional', gestionSeccionales.seccional);
            localStorageService.set('seccionalAuxiliar', gestionSeccionales.seccionalAuxiliar);
        };

        gestionSeccionales.onUpdateSeccional = function () {
            var seccional = {
                codigoSeccional: gestionSeccionales.seccional.codigo.toUpperCase(),
                nombreSeccional: gestionSeccionales.seccional.nombre.toUpperCase(),
                estado: gestionSeccionales.seccional.estado.toUpperCase(),
                programasSeccional: gestionSeccionales.seccional.programa = gestionSeccionales.filasSeleccionadas
            };
            seccionalesServices.actualizarSeccional(seccional).then(function (data) {
                if (data.tipo === 200) {
                    localStorageService.set('seccional', gestionSeccionales.seccional);
                    localStorageService.set('seccionalAuxiliar', gestionSeccionales.seccionalAuxiliar);
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                } else {
                    appConstant.MSG_GROWL_ERROR();
                }
            });
        };

        gestionSeccionales.onClickToVerDetalleSeccional = function (item) {
            onLimpiar();
            gestionSeccionales.seccionalAuxiliar.disableVerDetalle = true;
            gestionSeccionales.seccionalAuxiliar.disableCodigo = true;
            gestionSeccionales.seccionalAuxiliar.disabletabla = false;
            gestionSeccionales.seccionalAuxiliar.disableEstado = false;
            gestionSeccionales.seccionalAuxiliar.titulo = appGenericConstant.DETALLE_SECCIONAL;
            gestionSeccionales.seccional.id = item.id;
            gestionSeccionales.seccional.codigo = item.codigoSeccional;
            gestionSeccionales.seccional.nombre = item.nombreSeccional;
            gestionSeccionales.seccional.estado = item.estadoSeccional;
            gestionSeccionales.seccional.programa = item.programasSeccional;
            $location.path('/cud-seccionales');
            localStorageService.set('seccional', gestionSeccionales.seccional);
            localStorageService.set('seccionalAuxiliar', gestionSeccionales.seccionalAuxiliar);
        };

        function consultarSeccionales() {
            seccionalesServices.buscarSeccional().then(function (data) {
                gestionSeccionales.listaAuxiliarseccional = [];
                gestionSeccionales.lista = [];
                var nombrefacultad;
                var nombrefacultades = "";
                for (var e = 0; e < data.length; e++) {
                    for (var i = 0; i < data[e].programasSeccional.length; i++) {
                        nombrefacultad = data[e].programasSeccional[i].nombreFacultad;
                        if (!nombrefacultades.includes(nombrefacultad)) {
                            nombrefacultades = nombrefacultad + "," + nombrefacultades;
                        }
                    }
                    gestionSeccionales.listaAuxiliarseccional = {
                        codigoSeccional: data[e].codigoSeccional,
                        nombreSeccional: data[e].nombreSeccional,
                        programasSeccional: data[e].programasSeccional,
                        estadoSeccional: data[e].estado,
                        estadoLogico: data[e].estadoLogico,
                        id: data[e].id,
                        nombreFacultad: nombrefacultades

                    };
                    gestionSeccionales.lista.push(gestionSeccionales.listaAuxiliarseccional);
                    nombrefacultades = "";
                }

            });
        }

        onBuscarSeccionales();
        onBuscarEstados();
        onBuscarProgramas();
        consultarSeccionales();
    }
})();