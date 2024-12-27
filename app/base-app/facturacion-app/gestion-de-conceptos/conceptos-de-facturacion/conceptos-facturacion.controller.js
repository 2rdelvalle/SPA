(function () {
    'use strict';
    angular.module('mytodoApp').controller('ConcepFacturacionCtrl', ConcepFacturacionCtrl);
    ConcepFacturacionCtrl.$inject = ['$scope', 'concepFacturacionServices', '$location', 'growl', 'ValidationService', 'localStorageService', 'utilServices', 'appConstant', '$interval', 'appGenericConstant', 'appConstantValueList'];
    function ConcepFacturacionCtrl($scope, concepFacturacionServices, $location, growl, ValidationService, localStorageService, utilServices, appConstant, $interval, appGenericConstant, appConstantValueList) {
        var gestionConcepFacturacion = this;
        gestionConcepFacturacion.restringirEliminar = false;
        var noContinue = 0;
        gestionConcepFacturacion.conceptoFacturacion = [];
        gestionConcepFacturacion.tipoConceptoFacturacion = [];
        gestionConcepFacturacion.display;
        gestionConcepFacturacion.cuentas = [];
        gestionConcepFacturacion.concepFacturacion = concepFacturacionServices.concepFacturacion;
        gestionConcepFacturacion.concepFacturacionAuxiliar = concepFacturacionServices.concepFacturacionAuxiliar;
        gestionConcepFacturacion.options = appConstant.FILTRO_TABLAS;
        gestionConcepFacturacion.counter = 0;
        gestionConcepFacturacion.selectedOption = gestionConcepFacturacion.options[0];
        gestionConcepFacturacion.report = {
            selected: null
        };
        if (localStorageService.get('concepFacturacion') !== null) {
            gestionConcepFacturacion.concepFacturacion = localStorageService.get('concepFacturacion');

        }
        if (localStorageService.get('concepFacturacionAuxiliar') !== null) {
            gestionConcepFacturacion.concepFacturacionAuxiliar = localStorageService.get('concepFacturacionAuxiliar');
        }
        function onBuscarListaEstados() {
            var categoria = appConstantValueList.LV_ESTADO;
            utilServices.buscarListaValorByCategoria(categoria, appGenericConstant.MICRO_SERVICIO_FINANCIERO).then(function (data) {
                gestionConcepFacturacion.listaEstados = data;
            });
        }

        /*Consultar concepto de facturacion*/
        function onBuscarConcepFacturacion() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            gestionConcepFacturacion.counter = 0;
            concepFacturacionServices.buscarConcepFacturacionByEstado().then(function (data) {
                gestionConcepFacturacion.conceptoFacturacion = [];
                angular.forEach(data, function (value, key) {
                    var objeto = {
                        id: value.id,
                        codigo: value.codigo,
                        nombre: value.nombre,
                        abreviatura: value.abreviatura,
                        idCuenta: value.idCuenta,
                        clase: value.clase,
                        descripcion: value.descripcion,
                        estado: value.estado,
                        generaCertificado: value.generaCertificado
                    };
                    gestionConcepFacturacion.conceptoFacturacion.push(objeto);
                });
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }
        //<editor-fold defaultstate="collapsed" desc="Método para refrescar las tablas  cada 10 segundos">


//        var refreshTabla = function counter() {
//            gestionConcepFacturacion.counter = gestionConcepFacturacion.counter + 1;
//            if (gestionConcepFacturacion.counter === 10) {
//                concepFacturacionServices.buscarConcepFacturacionByEstado().then(function (data) {
//                    gestionConcepFacturacion.conceptoFacturacion = [];
//                    angular.forEach(data, function (value, key) {
//                        var objeto = {
//                            id: value.id,
//                            codigo: value.codigo,
//                            nombre: value.nombre,
//                            abreviatura: value.abreviatura,
//                            idCuenta: value.idCuenta,
//                            clase: value.clase,
//                            descripcion: value.descripcion,
//                            estado: value.estado
//                        };
//                        gestionConcepFacturacion.conceptoFacturacion.push(objeto);
//                    });
//                    gestionConcepFacturacion.counter = 0;
//                });
//            }
//        };
//        //

        //</editor-fold>
        gestionConcepFacturacion.cancelarInterval = function () {
//            //
        };

        /*Consultar Cuentas*/
        function onBuscarCuentas() {
            concepFacturacionServices.cuentasContables().then(function (data) {
                gestionConcepFacturacion.cuentas = data;
            });
        }
        function onBuscarTiposConceptos() {
            var categoria = appConstantValueList.LV_TIPO_CONCEPTO;
            utilServices.buscarListaValorByCategoria(categoria, appGenericConstant.MICRO_SERVICIO_FINANCIERO).then(function (data) {
                gestionConcepFacturacion.tipoConceptoFacturacion = data;
            });
        }

        /*Limpiar Entidad concepto de facturacion*/
        gestionConcepFacturacion.onLimpiar = function () {
            gestionConcepFacturacion.concepFacturacion.id = null;
            gestionConcepFacturacion.concepFacturacion.codigoConceptoFacturacion = null;
            gestionConcepFacturacion.concepFacturacion.nombreConceptoFacturacion = null;
            gestionConcepFacturacion.concepFacturacion.abreviaturaConceptoFacturacion = null;
            gestionConcepFacturacion.concepFacturacion.cuentaConceptoFacturacion = null;
            gestionConcepFacturacion.concepFacturacion.descripcionConceptoFacturacion = null;
            gestionConcepFacturacion.concepFacturacion.tipoConceptoFacturacion = null;
            gestionConcepFacturacion.concepFacturacion.generaCertificado = appGenericConstant.NO_MAYUS;
            gestionConcepFacturacion.concepFacturacion.estado = gestionConcepFacturacion.listaEstados[0].valor;
            gestionConcepFacturacion.concepFacturacionAuxiliar.disableVerDetalle = false;
            gestionConcepFacturacion.concepFacturacionAuxiliar.disableCodigo = false;
            gestionConcepFacturacion.concepFacturacionAuxiliar.titulo = appGenericConstant.AGREGAR_CONCEPTO_FACTURACION;
            gestionConcepFacturacion.concepFacturacionAuxiliar.inputenabled = "";
            localStorageService.set('concepFacturacion', null);
            localStorageService.set('concepFacturacionAuxiliar', gestionConcepFacturacion.concepFacturacionAuxiliar);
            $location.path('/crud-conceptos-de-facturacion');
        };

        /*Acción Para Validar, Guargar o Editar concepto de facturacion*/
        gestionConcepFacturacion.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formCrudPeriodoAcademico)) {
                if (gestionConcepFacturacion.concepFacturacion.id === null || gestionConcepFacturacion.concepFacturacion.id === undefined) {
                    gestionConcepFacturacion.onAddConceptoFactura();
                    new ValidationService().resetForm($scope.formCrudPeriodoAcademico);
                } else {
                    gestionConcepFacturacion.onUpdateConceptoFactura();
                }
            }
        };

        gestionConcepFacturacion.onAddConceptoFactura = function () {
            var concepFactura = {
                id: gestionConcepFacturacion.concepFacturacion.id,
                codigo: appConstant.VALIDAR_STRING(gestionConcepFacturacion.concepFacturacion.codigoConceptoFacturacion),
                nombre: appConstant.VALIDAR_STRING(gestionConcepFacturacion.concepFacturacion.nombreConceptoFacturacion),
                abreviatura: appConstant.VALIDAR_STRING(gestionConcepFacturacion.concepFacturacion.abreviaturaConceptoFacturacion),
                descripcion: gestionConcepFacturacion.concepFacturacion.descripcionConceptoFacturacion,
                idCuenta: gestionConcepFacturacion.concepFacturacion.cuentaConceptoFacturacion,
                clase: gestionConcepFacturacion.concepFacturacion.tipoConceptoFacturacion,
                estado: gestionConcepFacturacion.concepFacturacion.estado,
                generaCertificado: gestionConcepFacturacion.concepFacturacion.generaCertificado
            };
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            concepFacturacionServices.agregarConcepto(concepFactura).then(function (response) {
                appConstant.CERRAR_SWAL();
                switch (response.tipo) {
                    case 200:
                        appConstant.MSG_GROWL_OK(response.message);
                        onLimpiar();
                        break;
                    case 409:
                        appConstant.MSG_GROWL_ADVERTENCIA(response.message);
                        break;
                }
            });
        };

        /*Método Para Obtener El  concepto de facturacion A Editar*/
        gestionConcepFacturacion.onClickToUpdateConcepFacturacion = function (item) {
            gestionConcepFacturacion.concepFacturacionAuxiliar.disableVerDetalle = false;
            gestionConcepFacturacion.concepFacturacionAuxiliar.disableCodigo = true;
            gestionConcepFacturacion.concepFacturacionAuxiliar.inputenabled = "";
            gestionConcepFacturacion.concepFacturacionAuxiliar.titulo = appGenericConstant.MODIFICAR_CONCEPTO_FACTURACION;
            gestionConcepFacturacion.concepFacturacion.id = item.id;
            gestionConcepFacturacion.concepFacturacion.codigoConceptoFacturacion = item.codigo;
            gestionConcepFacturacion.concepFacturacion.nombreConceptoFacturacion = item.nombre;
            gestionConcepFacturacion.concepFacturacion.abreviaturaConceptoFacturacion = item.abreviatura;
            gestionConcepFacturacion.concepFacturacion.descripcionConceptoFacturacion = item.descripcion;
            gestionConcepFacturacion.concepFacturacion.cuentaConceptoFacturacion = item.idCuenta;
            gestionConcepFacturacion.concepFacturacion.tipoConceptoFacturacion = item.clase;
            gestionConcepFacturacion.concepFacturacion.estado = item.estado;
            gestionConcepFacturacion.concepFacturacion.generaCertificado = item.generaCertificado;
            $location.path('/crud-conceptos-de-facturacion');
            localStorageService.set('concepFacturacion', gestionConcepFacturacion.concepFacturacion);
            localStorageService.set('concepFacturacionAuxiliar', gestionConcepFacturacion.concepFacturacionAuxiliar);
        };

        /*Acción Para Validar Y Modificar concepto de facturacion*/
        gestionConcepFacturacion.onUpdateConceptoFactura = function () {
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            var concepFactura = {
                id: gestionConcepFacturacion.concepFacturacion.id,
                codigo: gestionConcepFacturacion.concepFacturacion.codigoConceptoFacturacion,
                nombre: appConstant.VALIDAR_STRING(gestionConcepFacturacion.concepFacturacion.nombreConceptoFacturacion),
                abreviatura: appConstant.VALIDAR_STRING(gestionConcepFacturacion.concepFacturacion.abreviaturaConceptoFacturacion),
                descripcion: gestionConcepFacturacion.concepFacturacion.descripcionConceptoFacturacion,
                idCuenta: gestionConcepFacturacion.concepFacturacion.cuentaConceptoFacturacion,
                clase: gestionConcepFacturacion.concepFacturacion.tipoConceptoFacturacion,
                estado: gestionConcepFacturacion.concepFacturacion.estado
            };
            concepFacturacionServices.actualizarConcepto(concepFactura).then(function (response) {
                switch (response.tipo) {
                    case 200:
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_OK(response.message);
                        break;
                    case 409:
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ADVERTENCIA(response.message);
                        break;
                }

            });
        };

        /*Método Para Obtener El  concepto de facturacion A Ver Detalle*/
        gestionConcepFacturacion.onClickToVerDetalleConcepFactura = function (item) {
            gestionConcepFacturacion.concepFacturacionAuxiliar.disableVerDetalle = true;
            gestionConcepFacturacion.concepFacturacionAuxiliar.disableCodigo = true;
            gestionConcepFacturacion.concepFacturacionAuxiliar.inputenabled = "disabled";
            gestionConcepFacturacion.concepFacturacionAuxiliar.titulo = appGenericConstant.DETALLE_CONCEPTO_FACTURACION;
            gestionConcepFacturacion.concepFacturacion.id = item.id;
            gestionConcepFacturacion.concepFacturacion.codigoConceptoFacturacion = item.codigo;
            gestionConcepFacturacion.concepFacturacion.nombreConceptoFacturacion = item.nombre;
            gestionConcepFacturacion.concepFacturacion.abreviaturaConceptoFacturacion = item.abreviatura;
            gestionConcepFacturacion.concepFacturacion.descripcionConceptoFacturacion = item.descripcion;
            gestionConcepFacturacion.concepFacturacion.cuentaConceptoFacturacion = item.idCuenta;
            gestionConcepFacturacion.concepFacturacion.tipoConceptoFacturacion = item.clase;
            gestionConcepFacturacion.concepFacturacion.estado = item.estado;
            gestionConcepFacturacion.concepFacturacion.generaCertificado = item.generaCertificado;
            $location.path('/crud-conceptos-de-facturacion');
            localStorageService.set('concepFacturacion', gestionConcepFacturacion.concepFacturacion);
            localStorageService.set('concepFacturacionAuxiliar', gestionConcepFacturacion.concepFacturacionAuxiliar);
        };

        onBuscarConcepFacturacion();
        onBuscarCuentas();
        onBuscarTiposConceptos();
        onBuscarListaEstados();
    }
})();