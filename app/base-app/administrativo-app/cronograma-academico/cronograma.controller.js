(function () {
    'use strict';
    angular.module('mytodoApp').controller('cronogramaCtrl', cronogramaCtrl);

    cronogramaCtrl.$inject = ['$scope',  'cronogramaService', 'ValidationService', 'growl', '$location', 'localStorageService','appConstant','appGenericConstant'];

    function cronogramaCtrl($scope,  cronogramaService, ValidationService, growl, $location, localStorageService,appConstant,appGenericConstant) {

        var cronogramaControl = this;
        var config = {};

        cronogramaControl.cronogramas = [];
        cronogramaControl.periodos = [];
        cronogramaControl.estadoscronograma = [];

        cronogramaControl.cronograma = cronogramaService.cronograma;
        cronogramaControl.esvisible = cronogramaService.visible;

        cronogramaControl.options = appConstant.FILTRO_TABLAS;
        cronogramaControl.selectedOption = cronogramaControl.options[0];

        cronogramaControl.onlimpiarObjetos = function () {
            cronogramaControl.cronograma = {};
            localStorageService.set('cronograma', cronogramaControl.nuevoEvento);
        };


        cronogramaControl.onGuardar = function () {
            if (new ValidationService().checkFormValidity($scope.formregistrarevento)) {
                cronogramaControl.agregarEventos();
            }
        };

        cronogramaControl.onEditar = function () {
            if (new ValidationService().checkFormValidity($scope.formeditarevento)) {

                if (localStorageService.get('evento').nombre !== cronogramaControl.nuevoEvento.nombre.trim()
                    || JSON.stringify(localStorageService.get('evento').publico) !== JSON.stringify(cronogramaControl.nuevoEvento.publico)
                    || formattedDate(localStorageService.get('evento').fechaini) !== formattedDate(cronogramaControl.nuevoEvento.fechaini)
                    || formattedDate(localStorageService.get('evento').fechafin) !== formattedDate(cronogramaControl.nuevoEvento.fechafin)
                    || localStorageService.get('evento').presupuesto !== cronogramaControl.nuevoEvento.presupuesto
                    || localStorageService.get('evento').responsable !== cronogramaControl.nuevoEvento.responsable.trim()
                    || localStorageService.get('evento').estado !== cronogramaControl.nuevoEvento.estado
                    || localStorageService.get('evento').descripcion !== cronogramaControl.nuevoEvento.descripcion.trim()) {
                    cronogramaControl.actualizarEvento();
                } else {
                    growl.info(appGenericConstant.INFORMACION, { title: appGenericConstant.ADVERTENCIA_CRONOGRAMA });
                }

            }
        };

        cronogramaControl.onEliminarUno = function (item) {
            cronogramaControl.eliminarEventos(item);
        };

        cronogramaControl.onEliminarMasivo = function () {
            cronogramaControl.eliminarEventosMasivo();
        };

        cronogramaControl.onLimpiarRegistrar = function () {
            new ValidationService().resetForm($scope.formregistrarevento);
            cronogramaControl.nuevoEvento.fechaini = new Date();
        };

        cronogramaControl.onLimpiarEditar = function () {
            new ValidationService().resetForm($scope.formeditarevento);
            cronogramaControl.nuevoEvento.fechaini = new Date();
        };

        cronogramaControl.ejecutarconsultarEventos = function () {
            cronogramaService.consultarEventos().then(function (data) {
                cronogramaControl.cronogramas = data;

            });
        };

        cronogramaControl.ejecutarListaValor = function () {
            cronogramaService.consultarlistValor().then(function (data) {
                cronogramaControl.lstEstadoEventos = data;

            });
        };

        cronogramaControl.ejecutarconsultarPublicos = function () {
            cronogramaService.consultarPublicos().then(function (data) {
                cronogramaControl.lstPublicos = data;

            });
        };

        cronogramaControl.onIrRegistrar = function () {
            cronogramaControl.cronograma = {};
            cronogramaControl.esvisible.titulo = appGenericConstant.REGISTRAR_CRONOGRAMA_ACADEMICO;
            $location.path('/cronograma-academico-cud');
            localStorageService.set('evento', cronogramaControl.nuevoEvento);
        };

        cronogramaControl.onIrVerDetalle = function (item) {
            cronogramaControl.nuevoEvento.id = item.id;
            cronogramaControl.nuevoEvento.codigo = item.codigo;
            cronogramaControl.nuevoEvento.nombre = item.nombre;
            cronogramaControl.nuevoEvento.publico = item.publicoObjetivo;
            cronogramaControl.nuevoEvento.fechaini = toDate(item.fechaInicio);
            cronogramaControl.nuevoEvento.fechafin = toDate(item.fechaFin);
            cronogramaControl.nuevoEvento.presupuesto = item.presupuesto;
            cronogramaControl.nuevoEvento.responsable = item.responsable;
            cronogramaControl.nuevoEvento.estado = item.estado;
            cronogramaControl.nuevoEvento.descripcion = item.descripcion;
            cronogramaControl.nuevoEvento.estadologico = item.estadologico;
            $location.path('/crm-mercadeo-gestion-evento-ver');
            localStorageService.set('evento', cronogramaControl.nuevoEvento);
        };

        cronogramaControl.onIrEditarEvento = function (item) {
            cronogramaControl.nuevoEvento.id = item.id;
            cronogramaControl.nuevoEvento.codigo = item.codigo;
            cronogramaControl.nuevoEvento.nombre = item.nombre;
            cronogramaControl.nuevoEvento.publico = item.publicoObjetivo;
            cronogramaControl.nuevoEvento.fechaini = toDate(item.fechaInicio);
            cronogramaControl.nuevoEvento.fechafin = toDate(item.fechaFin);
            cronogramaControl.nuevoEvento.presupuesto = item.presupuesto;
            cronogramaControl.nuevoEvento.responsable = item.responsable;
            cronogramaControl.nuevoEvento.estado = item.estado;
            cronogramaControl.nuevoEvento.descripcion = item.descripcion;
            cronogramaControl.nuevoEvento.estadologico = item.estadologico;
            $location.path('/crm-mercadeo-gestion-evento-editar');
            localStorageService.set('evento', cronogramaControl.nuevoEvento);

        };

        cronogramaControl.agregarEventos = function () {
            //cronogramaControl.onlimpiarObjetos();
            if (cronogramaControl.nuevoEvento.fechaini > cronogramaControl.nuevoEvento.fechafin) {
                alert(appGenericConstant.FECHA_INICIO_MAYO_FINAL);
                return;
            }

            var evento = {
                codigo: cronogramaControl.nuevoEvento.codigo,
                nombre: cronogramaControl.nuevoEvento.nombre,
                publicoObjetivo: JSON.parse(cronogramaControl.nuevoEvento.publico),
                fechaInicio: formattedDate(cronogramaControl.nuevoEvento.fechaini),
                fechaFin: formattedDate(cronogramaControl.nuevoEvento.fechafin),
                presupuesto: cronogramaControl.nuevoEvento.presupuesto,
                responsable: cronogramaControl.nuevoEvento.responsable,
                estado: cronogramaControl.nuevoEvento.estadoEvento,
                descripcion: cronogramaControl.nuevoEvento.descripcion,
                estadologico: 'A'
            };

            cronogramaService.registrarEventos(evento).then(function (data) {
                growl.success(appGenericConstant.REGISTRO_EXITOSO, config);
            }).catch(function (e) {
                throw e;
                return;
            });
            cronogramaControl.nuevoEvento = {};
            cronogramaControl.nuevoEvento.estadoEvento = 1;
            cronogramaControl.nuevoEvento.publico = "0";
        };

        cronogramaControl.actualizarEvento = function () {

            if (cronogramaControl.nuevoEvento.fechaini > cronogramaControl.nuevoEvento.fechafin) {
                alert(appGenericConstant.FECHA_INICIO_MAYO_FINAL);
                return;
            }

            var evento = {
                id: cronogramaControl.nuevoEvento.id,
                codigo: cronogramaControl.nuevoEvento.codigo,
                nombre: cronogramaControl.nuevoEvento.nombre,
                publicoObjetivo: cronogramaControl.nuevoEvento.publico,
                fechaInicio: formattedDate(cronogramaControl.nuevoEvento.fechaini.toString()),
                fechaFin: formattedDate(cronogramaControl.nuevoEvento.fechafin.toString()),
                presupuesto: cronogramaControl.nuevoEvento.presupuesto,
                responsable: cronogramaControl.nuevoEvento.responsable,
                estado: cronogramaControl.nuevoEvento.estado,
                descripcion: cronogramaControl.nuevoEvento.descripcion,
                estadologico: cronogramaControl.nuevoEvento.estadologico
            };

            cronogramaService.actualizaEventos(evento).then(function (data) {
                growl.success(appGenericConstant.ACTUALIZACION_EXITOSO, config);
                var event = data;

                var fini = toDate(event.fechaInicio);
                var ffin = toDate(event.fechaFin);
                event.fechaini = fini;
                event.fechafin = ffin;
                event.publicoObjetivo = {
                    codigo: event.publicoObjetivo.codigo,
                    nombre: event.publicoObjetivo.nombre,
                    listaContactos: {
                        tipoDocumento: event.publicoObjetivo.listaContactos.tipoDocumento,
                        numeroDocumento: event.publicoObjetivo.listaContactos.numeroDocumento,
                        nombre: event.publicoObjetivo.listaContactos.nombre,
                        apellido: event.publicoObjetivo.listaContactos.apellido
                    },
                    descripcion: event.publicoObjetivo.descripcion
                };
                localStorageService.set('evento', event);
            }).catch(function (e) {
                throw e;
                return;
            });
        };

        cronogramaControl.eliminarEventos = function (item) {


            var eventormv = {
                id: item.id,
                codigo: item.codigo,
                nombre: item.nombre,
                publicoObjetivo: item.publicoObjetivo,
                fechaInicio: item.fechaInicio,
                fechaFin: item.fechaFin,
                presupuesto: item.presupuesto,
                responsable: item.responsable,
                estado: item.estado,
                descripcion: item.descripcion,
                estadologico: 'I'
            };


            cronogramaService.eliminarEventos(eventormv).then(function (data) {
                growl.success(appGenericConstant.ELIMINACION_EXITOSO, config);
                cronogramaControl.onlimpiarObjetos();
                cronogramaControl.ejecutarconsultarEventos();
            }).catch(function (e) {
                throw e;
                return;
            });

        };

        cronogramaControl.eliminarEventosMasivo = function () {
            swal({
                title: appGenericConstant.ELIMINAR_REGISTRO,
                type: appGenericConstant.WARNING,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CERRAR_SWAL();
                setTimeout(function () {
                    swal(appGenericConstant.EVENTO_ELIMINADO);
                }, 2000);
                angular.forEach(cronogramaControl.report.selected, function (value, key) {
                    var eventormv = {
                        id: value.id,
                        codigo: value.codigo,
                        nombre: value.nombre,
                        publicoObjetivo: value.publicoObjetivo,
                        fechaInicio: value.fechaInicio,
                        fechaFin: value.fechaFin,
                        presupuesto: value.presupuesto,
                        responsable: value.responsable,
                        estado: value.estado,
                        descripcion: value.descripcion,
                        estadologico: 'I'
                    };
                    cronogramaService.eliminarEventos(eventormv).then(function (data) {
                        cronogramaControl.onlimpiarObjetos();
                        //cronogramaControl.report.selected.length = null;
                        cronogramaControl.ejecutarconsultarEventos();
                    }).catch(function (e) {
                        //window.localStorage.removeItem("token");
                        //location.reload();
                        return;
                    });
                });
                cronogramaControl.report.selected.length = null;
                growl.success(appGenericConstant.ELIMINACION_SATIS, config);
            }, function (dismiss) {
                if (dismiss === 'cancel') {
                    return;
                }
            });
        };


        cronogramaControl.consultarCronogramasAcademicos = function () {
            cronogramaService.consultarCronograma().then(function (data) {
                cronogramaControl.cronogramas = [];
                angular.forEach(data, function (value) {
                    var cronograma = {
                        id: value.id,
                        codigo: value.codigo,
                        nombre: value.nombre,
                        estado: value.estado,
                        resolucion: value.resolucion,
                        periodo: value.periodo,
                        periodocompleto: value.periodo.nombre,
                        estadocompleto: value.estado.valor
                    };
                    cronogramaControl.cronogramas.push(cronograma);
                });

            }).catch(function (e) {
                throw e;
                return;
            });
        };

        cronogramaControl.consultarPeriodosAcademicos = function () {
            cronogramaService.consultarPeriodoAcademico().then(function (data) {
                cronogramaControl.periodos = [];
                cronogramaControl.periodos = data;
            });
        };

        cronogramaControl.consultarEstadosCronogramaAcademicos = function () {
            cronogramaService.consultarEstadosCronograma().then(function (data) {
                cronogramaControl.estadoscronograma = [];
                cronogramaControl.estadoscronograma = data;

            });
        };


        cronogramaControl.consultarCronogramasAcademicos();
        cronogramaControl.consultarPeriodosAcademicos();
        cronogramaControl.consultarEstadosCronogramaAcademicos();

    }

})();

