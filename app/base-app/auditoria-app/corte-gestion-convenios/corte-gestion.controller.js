'use strict';
angular.module('mytodoApp').controller('CorteGestionCtrl', ['localStorageService', '$scope', 'ValidationService', 'corteService', 'utilServices', 'appConstant', 'appConstantValueList', 'appGenericConstant', '$filter',
    function (localStorageService, $scope, ValidationService, corteService, utilServices, appConstant, appConstantValueList, appGenericConstant, $filter) {
        var reportes = this;
        reportes.nuevaActividad = {};
        reportes.nuevaActividad.listaSeguimientos = [];
        reportes.nuevaActividad.listaSeguimientosLlamadasContacto = [];
        reportes.diasVencidos = "1";

        if (localStorageService.get("usuario") !== null) {
            var usuario = localStorageService.get('usuario');
            reportes.user = usuario;
            reportes.isDirector = (usuario.rol.codigo === 'auditor'
                    || usuario.rol.codigo === 'SUPER_ADMINISTRADOR' || usuario.rol.codigo === 'COORDINADOR_SISTEMAS' 
                    || usuario.rol.codigo === 'coordcartera'|| usuario.rol.codigo === 'director_financiero') ? 1 : 0;
        }

        reportes.fechaBusqueda = $filter('date')(new Date().getTime(), 'dd/MM/yyyy');
        reportes.fechaBusqueda2 = $filter('date')(new Date().getTime(), 'dd/MM/yyyy');

        reportes.onChangeFechasCorte = function () {
            var fechaLong1 = appConstant.TO_DATE_LONG(reportes.fechaBusqueda);
            var fechaLong2 = appConstant.TO_DATE_LONG(reportes.fechaBusqueda2);
            onConusltarCorte(fechaLong1, fechaLong2);
            onConusltarCorteGeneral(fechaLong1, fechaLong2);
        };

        reportes.onChangeInputDiasVencidos = function () {
            if (reportes.diasVencidos === "") {
                reportes.diasVencidos = "1";
            }
        };

        $('#fechaCampanha.input-daterange').datepicker({
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

        reportes.onVerDetalleSeguimientoLlamadas = function (item) {
            reportes.nuevaActividad.seguimientoLlamada = item.descripcion;
        };

        reportes.onAbrirPopupSeguimientoLlamadas = function (item) {
            reportes.nuevaActividad = {};
            reportes.nuevaActividad.listaSeguimientosLlamadasContacto = [];
            reportes.nuevaActividad.proximaLlamada = $filter('date')(new Date().getTime(), 'dd/MM/yyyy');
            reportes.listadoReferenciasEstudiante = [];

            reportes.listadoReferenciasEstudiante = jQuery.map(reportes.listadoCorteGeneralExportar, function (obj) {
                if (obj.codigoEstudiante === item.codigoEstudiante) {
                    return  obj;
                }
            });

            angular.forEach(reportes.listadoReferenciasEstudiante, function (value, key) {
                value.estadoLiquidacion = value.totalPendiente > 0 ? 'ABIERTA' : 'PAGADA';
            });

            $('#modalSeguimientoLlamadas').modal({backdrop: 'static', keyboard: false});
            $("#modalSeguimientoLlamadas").modal("show");
            reportes.campodisable = false;
            reportes.tituloModal = 'Ingresar';
            reportes.nuevoSeguimiento = item;

            var fechaApertura = sumarDias(new Date(), -1);
            $('#fechaSeguimiento').datepicker({
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
            reportes.onConsultarSeguimientoLlamadasPorPublico(item);
        };

        reportes.onConsultarSeguimientoLlamadasPorPublico = function (item) {
            var json = {
                idActividad: 1,
                idAspirante: item.idAspirante
            };

            corteService.onConsultarSeguimientoCarteraPorActividadAndAspirante(json).then(function (data) {
                angular.forEach(data, function (value, key) {
                    var seguimientoLlamada = {
                        id: value.id,
                        idActividad: value.idActividad,
                        descripcion: value.descripcion,
                        nombreUsuario: value.nombreUsuario,
                        idUsuario: value.idUsuario,
                        fechaString: $filter('date')(value.fecha, 'dd/MM/yyyy hh:mm:ss'),
                        estado: value.estado
                    };
                    reportes.nuevaActividad.listaSeguimientosLlamadasContacto.push(seguimientoLlamada);
                });
            }).catch(function (e) {
                return;
            });
        };

        function sumarDias(fecha, dias) {
            fecha.setDate(fecha.getDate() + dias);
            return fecha;
        }

        reportes.getTotalValorSeguimiento = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].totalLiquidado);
            }
            return Math.round(totalNumber);
        };

        reportes.getTotalAbonadoSeguimiento = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].totalAbonado);
            }
            return Math.round(totalNumber);
        };

        reportes.getTotalPendienteSeguimiento = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].totalPendiente);
            }
            return Math.round(totalNumber);
        };

        function onConusltarCorte(fechaLong1, fechaLong2) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            corteService.onConsultarCorteLiquidacionesConvenios(fechaLong1, fechaLong2).then(function (data) {
                reportes.listadoCorte = data;
                appConstant.CERRAR_SWAL();
            });
        }

        function onConusltarCorteGeneral(fechaLong1, fechaLong2) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            corteService.onConsultarCorteLiquidacionesConveniosGeneral(fechaLong1, fechaLong2).then(function (data) {
                reportes.listadoCorteGeneral = [];
                reportes.listadoCorteGeneralExportar = data;
                reportes.listadoCorteGeneralDiasVencidoExportar = [];

                reportes.listadoCorteGeneralDiasVencidoExportar = jQuery.map(data, function (obj) {
                    if (obj.diasVencidos > 0) {
                        return  obj;
                    }
                });
                
                var dupes = {};
                angular.forEach(data, function (value, key) {
                    if (!dupes[value.codigoEstudiante]) {
                        dupes[value.codigoEstudiante] = true;
                        reportes.listadoCorteGeneral.push(value);
                    }
                });
                appConstant.CERRAR_SWAL();
            });
        }

        reportes.onGuardarSeguimientoLlamada = function () {
            if (reportes.nuevaActividad.listaSeguimientosLlamadasContacto === null || reportes.nuevaActividad.listaSeguimientosLlamadasContacto === undefined) {
                reportes.nuevaActividad.listaSeguimientosLlamadasContacto = [];
            }
            if (new ValidationService().checkFormValidity($scope.formAgregarSeguimientoLlamada)) {
                var nombreUsuario = localStorageService.get('autorizacion').objectResponse.userDto.nombres + ' ' + localStorageService.get('autorizacion').objectResponse.userDto.apellidos;
                var idUsuario = localStorageService.get('autorizacion').objectResponse.userDto.id;
                var seguimientoLlamada = {
                    id: null,
                    idActividad: 1,
                    idAspirante: reportes.nuevoSeguimiento.idAspirante,
                    idEstudiante: reportes.nuevoSeguimiento.idEstudiante,
                    descripcion: reportes.nuevaActividad.seguimientoLlamada,
                    nombreUsuario: nombreUsuario,
                    idUsuario: idUsuario,
                    fechaString: $filter('date')(new Date(), 'dd/MM/yyyy hh:mm:ss'),
                    fechaStringProxLLamadaString: reportes.nuevaActividad.proximaLlamada + " 00:00:00",
                    estado: reportes.nuevaActividad.estadoCandidato,
                    estadoPendiente: reportes.nuevaActividad.motivoPendiente
                };

                corteService.registrarSeguimientoCartera(seguimientoLlamada).then(function (data) {
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                    $("#modalSeguimientoLlamadas").modal("hide");
                });
                reportes.onCerrarPopupSeguimientoLlamadas();
            }
        };

        reportes.onCerrarPopupSeguimientoLlamadas = function () {
            reportes.nuevaActividad.seguimientoLlamada = null;
            new ValidationService().resetForm($scope.formAgregarSeguimientoLlamada);
        };

        function cargarEstadisticaLlamadas() {
            corteService.onConsultarEstadisticaLlamadaCartera(1).then(function (data) {
                reportes.listDashLLamadasRealizadas = [];
                reportes.listDashLLamadasRealizadas = data;
            });
        }

        function cargarListadoSeguimientoLlamada() {
            corteService.onConsultarEstadisticaLlamadaCartera(2).then(function (data) {
                reportes.listadoSeguimientoLlamadaDelDia = [];
                reportes.listadoSeguimientoLlamadaDelDia = data;
            });
        }

        function cargarEstadisticaLlamadasMuestra() {
            corteService.onConsultarEstadisticaLlamadaCartera(3).then(function (data) {
                reportes.listadoEstadisticaSeguimientoCartera = [];
                reportes.listadoEstadisticaSeguimientoCartera = data;
            });
        }

        function cargarListadoMotivosPendiente() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_MOTIVO_PENDIENTE, appGenericConstant.MICRO_SERVICIO_CRM).then(function (data) {
                reportes.listPendiente = [];
                angular.forEach(data, function (value, key) {
                    var dto = {
                        id: value.codigo,
                        nombre: value.valor
                    };
                    reportes.listPendiente.push(dto);
                });
            }).catch(function (e) {
                return;
            });
        }

        function cargarListadoEstadoCandidato() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.ESTADO_CANDIDATO_CARTERA, appGenericConstant.MICRO_SERVICIO_CRM).then(function (data) {
                reportes.listEstadosCandidato = [];
                angular.forEach(data, function (value, key) {
                    var dto = {
                        id: value.codigo,
                        nombre: value.valor
                    };
                    reportes.listEstadosCandidato.push(dto);
                });
            }).catch(function (e) {
                return;
            });
        }

        cargarListadoEstadoCandidato();
        cargarListadoMotivosPendiente();
        cargarEstadisticaLlamadasMuestra();
        cargarListadoSeguimientoLlamada();
        cargarEstadisticaLlamadas();

    }]);


