(function () {
    'use strict';
    angular.module('mytodoApp').controller('CarteraCtrl', CarteraCtrl);
    CarteraCtrl.$inject = ['carteraService', 'historialLiquidacionServices', '$location', 'growl', 'localStorageService', '$filter', '$http', '$window', 'utilServices', 'appConstant', 'appGenericConstant'];
    function CarteraCtrl(carteraService, historialLiquidacionServices, $location, growl, localStorageService, $filter, $http, $window, utilServices, appConstant, appGenericConstant) {

        var gestionCartera = this;
        var config = { disableCountDown: true, ttl: 5000 };
        gestionCartera.listadoCartera = [];
        gestionCartera.listadoEstados = [];
        gestionCartera.listadoConceptos = [{ id: 1, nombre: "Multa Biblioteca" }, { id: 2, nombre: "Abono" }];
        gestionCartera.carteraEntity = carteraService.entidad;
        gestionCartera.carteraEntityAuxiliar = carteraService.entidadAuxiliar;
        gestionCartera.options = appConstant.FILTRO_TABLAS;
        gestionCartera.report = {
            selected: null
        };
        gestionCartera.selectedOption = gestionCartera.options[0];
        gestionCartera.selectTodos = false;
        gestionCartera.disabledCampos = false;
        gestionCartera.filtrados = [];

        if (localStorageService.get('cartera') !== null) {
            var cartera = localStorageService.get('cartera');
            gestionCartera.carteraEntity = cartera;
        }

        /*Metodo para seleccionar todos los datos de la tabla al clistadoCarteraheckear*/
        gestionCartera.onSelectTodos = function () {
            if (gestionCartera.selectTodos === true) {
                gestionCartera.report.selected = gestionCartera.filtrados.slice();
            } else {
                gestionCartera.report.selected.length = null;
            }
        };

        /*Metodo para al presionar un tr se checkee o se descheckee el checkbox */
        gestionCartera.onSelectSeparate = function () {
            gestionCartera.report.selected.length = null;
            gestionCartera.selectTodos = false;
        };

        gestionCartera.onSelectTodosTable = function (clase, item) {
            if (gestionCartera.report.selected.length === gestionCartera.filtrados.length
                && gestionCartera.selectTodos === true) {
                gestionCartera.selectTodos = false;
            } else {
                if (!clase) {
                    if (gestionCartera.report.selected.length + 1 === gestionCartera.filtrados.length
                        && gestionCartera.selectTodos === false) {
                        gestionCartera.selectTodos = true;
                    }
                } else {
                    gestionCartera.selectTodos = false;
                }
            }
        };

        function onValidarFechas() {
            var rpt = false;
            if (gestionCartera.carteraEntity === null || gestionCartera.carteraEntity === undefined) {
                return true;
            }
            if (gestionCartera.carteraEntity.fechainicio === null || gestionCartera.carteraEntity.fechainicio === undefined || gestionCartera.carteraEntity.fechainicio === '') {
                rpt = true;
            }
            if (gestionCartera.carteraEntity.fechafin === null || gestionCartera.carteraEntity.fechafin === undefined || gestionCartera.carteraEntity.fechafin === '') {
                rpt = true;
            }
            return rpt;
        }

        function onValidarFechasNulas() {
            var rpt = true;
            var rptInicio = false;
            var rptFin = false;
            if (gestionCartera.carteraEntity === null || gestionCartera.carteraEntity === undefined) {
                return rpt = false;
            }
            if (gestionCartera.carteraEntity.fechainicio === null || gestionCartera.carteraEntity.fechainicio === undefined || gestionCartera.carteraEntity.fechainicio === '') {
                rptInicio = true;
            }
            if (gestionCartera.carteraEntity.fechafin === null || gestionCartera.carteraEntity.fechafin === undefined || gestionCartera.carteraEntity.fechafin === '') {
                rptFin = true;
            }
            if (rptInicio && rptFin) {
                return rpt = false;
            }
            if (!rptInicio && !rptFin) {
                return rpt = false;
            }
            return rpt;
        }

        gestionCartera.getTotalValor = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].valor);
            }
            return Math.round(totalNumber);
        };

        gestionCartera.getTotalValorSeguimiento = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].totalLiquidado);
            }
            return Math.round(totalNumber);
        };
        gestionCartera.getTotalAbonado = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].saldoAbonado);
            }
            return Math.round(totalNumber);
        };
        gestionCartera.getTotalAbonadoSeguimiento = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].totalAbonado);
            }
            return Math.round(totalNumber);
        };
        gestionCartera.getTotalPendiente = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].saldoPendiente);
            }
            return Math.round(totalNumber);
        };
        gestionCartera.getTotalPendienteSeguimiento = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].totalPendiente);
            }
            return Math.round(totalNumber);
        };


        gestionCartera.onConsultarListado = function () {
            appConstant.MSG_LOADING('Cargando datos, espera un momento...');
            appConstant.CARGANDO();
            if (onValidarFechasNulas()) {
                gestionCartera.carteraEntityAuxiliar.mostrarTabla = false;
                gestionCartera.listadoCartera = [];
                appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.SELECCIONAR_RANGO);
                return;
            }

            if (onValidarFechas()) {
                //                cargarCarteras();
            } else {
                carteraService.consultarBetweenFechas(toDate(gestionCartera.carteraEntity.fechainicio), toDate(gestionCartera.carteraEntity.fechafin)).then(function (data) {
                    if (data.length === 0 || data === undefined || data === null) {
                        gestionCartera.carteraEntityAuxiliar.mostrarTabla = false;
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NO_ENCONTRARON_COINCIDENCIAS);
                        appConstant.CERRAR_SWAL();
                        return;
                    }
                    gestionCartera.listadoCartera = [];
                    angular.forEach(data, function (value) {

                        if (value.fechaVencimiento < new Date().getTime()) {
                            value.estadoCartera = "VENCIDA";
                        }

                        gestionCartera.carteraEntidad = {
                            id: value.id,
                            nReferencia: value.numeroReferencia,
                            cliente: value.cliente,
                            periodoAcademico: value.periodoAcademico,
                            codigoEstudiante: value.codigoEstudiante,
                            tipoDocumento: value.tipoDocumento,
                            email: value.email,
                            telefono: value.telefono,
                            celular: value.celular,
                            identificacion: value.tipoDocumento === null ? value.codigoEstudiante : value.tipoDocumento + ' ' + value.codigoEstudiante,
                            concepto: value.nombreConcepto,
                            valor: value.valorCartera,
                            fechaVencimiento: $filter('date')(value.fechaVencimiento, 'dd/MM/yyyy'),
                            estado: value.estado,
                            styleLable: value.estadoCartera === "POR_VENCER" ? "POR VENCER" : value.estadoCartera,
                            style: labelNotificacion(value.estadoCartera),
                            programa: value.programa,
                            modalidad: value.modalidad,
                            semestre: value.semestre,
                            direccion: value.direccion,
                            saldoAbonado: value.saldoAbonado,
                            saldoPendiente: value.saldoPendiente
                        };
                        gestionCartera.listadoCartera.push(gestionCartera.carteraEntidad);
                        gestionCartera.carteraEntityAuxiliar.mostrarTabla = true;
                    });
                    appConstant.CERRAR_SWAL();
                }).catch(function (e) {
                    appConstant.MSG_GROWL_ERROR();
                    appConstant.CERRAR_SWAL();
                    return;
                });
            }
        };

        gestionCartera.onConsultarListadoSeguimiento = function () {
            appConstant.MSG_LOADING('Cargando datos, espera un momento...');
            appConstant.CARGANDO();
            carteraService.consultarBetweenFechasSeguimiento(toDate("10/10/2010"), toDate("10/10/2010")).then(function (data) {
                if (data.length === 0 || data === undefined || data === null) {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NO_ENCONTRARON_COINCIDENCIAS);
                    appConstant.CERRAR_SWAL();
                    return;
                }

                gestionCartera.listadoCarteraSeguimiento = data;
                //                gestionCartera.listadoCarteraSeguimientoFiltrado = data;
                //
                //                gestionCartera.listHorarioFiltro = [];
                //                gestionCartera.listPrograma = [];
                //
                //                gestionCartera.listHorarioFiltro = jQuery.map(gestionCartera.listadoCarteraSeguimiento, function (obj) {
                //                    return  obj.horario;
                //                });
                //                gestionCartera.horarioFiltro = gestionCartera.listHorarioFiltro[0];
                //
                //                gestionCartera.listPrograma = jQuery.map(gestionCartera.listadoCarteraSeguimiento, function (obj) {
                //                    return  obj.nombrePrograma;
                //                });
                //                gestionCartera.programaFiltro = gestionCartera.listPrograma[0];
                //
                //                gestionCartera.listadoCarteraSeguimientoFiltrado = jQuery.map(gestionCartera.listadoCarteraSeguimiento, function (obj) {
                //                    if (obj.nombrePrograma === gestionCartera.programaFiltro && obj.horarioFiltro === gestionCartera.horarioFiltro) {
                //                        return  obj.nombrePrograma;
                //                    }
                //                });

                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                appConstant.CERRAR_SWAL();
                return;
            });
        };

        gestionCartera.onConsultarListadoSeguimientoEC = function () {
            appConstant.MSG_LOADING('Cargando datos, espera un momento...');
            appConstant.CARGANDO();
            carteraService.consultarBetweenFechasSeguimientoEC(toDate("10/10/2010"), toDate("10/10/2010")).then(function (data) {
                if (data.length === 0 || data === undefined || data === null) {
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NO_ENCONTRARON_COINCIDENCIAS);
                    appConstant.CERRAR_SWAL();
                    return;
                }

                gestionCartera.listadoCarteraSeguimientoEC = data;

                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                appConstant.CERRAR_SWAL();
                return;
            });
        };

        //        gestionCartera.onChangeListados = function () {
        //            gestionCartera.listadoCarteraSeguimientoFiltrado
        //        }

        gestionCartera.onCambiarEstado = function (codigo, estado, item) {
            item.estado = estado;
            appConstant.MSG_LOADING('Cargando datos, espera un momento...');
            appConstant.CARGANDO();
            carteraService.onActivarInactivarEstudiante(codigo, estado).then(function (data) {

                if (data === 1) {
                    appConstant.MSG_GROWL_OK("Proceso Realizado");
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA("Ha ocurrido un error inesperado");
                }

                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                appConstant.CERRAR_SWAL();
                return;
            });
        };

        gestionCartera.onCambiarEstadoConvenio = function (codigo, estado, item) {
            item.estadoCredito = estado;
            appConstant.MSG_LOADING('Cargando datos, espera un momento...');
            appConstant.CARGANDO();
            carteraService.onConvenio(codigo, estado).then(function (data) {

                if (data === 1) {
                    appConstant.MSG_GROWL_OK("Proceso Realizado");
                } else {
                    appConstant.MSG_GROWL_ADVERTENCIA("Ha ocurrido un error inesperado");
                }

                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                appConstant.CERRAR_SWAL();
                return;
            });
        };

        gestionCartera.onBuscarEstados = function () {
            carteraService.consultarEstados(gestionCartera.carteraEntity).then(function (data) {
                angular.forEach(data, function (value) {
                    var carteraEstado = {
                        id: value.id,
                        nombre: value.nombre
                    };
                    gestionCartera.listadoEstados.push(carteraEstado);
                });
            });
        };
        gestionCartera.onBuscarConceptos = function () {
            carteraService.consultarConceptos(gestionCartera.carteraEntity).then(function (data) {
                angular.forEach(data, function (value) {
                    var conceptos = {
                        id: value.id,
                        codigo: value.codigo,
                        nombre: value.nombre
                    };
                    gestionCartera.listadoConceptos.push(conceptos);
                });
            });
        };

        gestionCartera.onAbrirPopupSeguimientoLlamadas = function (item) {
            gestionCartera.listaSeguimientosLlamadasContacto = [];
            $('#modalSeguimientoLlamadas').modal({ backdrop: 'static', keyboard: false });
            $("#modalSeguimientoLlamadas").modal("show");
            //            gestionCartera.onConsultarSeguimientoLlamadasPorPublico(item);
        };

        gestionCartera.onVerDetalle = function (item) {
            gestionCartera.carteraEntity = {};
            gestionCartera.carteraEntity.codigo = item.codigoEstudiante;
            gestionCartera.carteraEntity.nombre = item.cliente;
            gestionCartera.carteraEntity.programa = item.programa;
            gestionCartera.carteraEntity.modalidad = item.modalidad;
            gestionCartera.carteraEntity.semestre = item.semestre;
            gestionCartera.carteraEntity.direccion = item.direccion;
            gestionCartera.carteraEntity.telefono = item.telefono;
            gestionCartera.carteraEntity.celular = item.celular;
            gestionCartera.carteraEntity.email = item.email;

            gestionCartera.carteraEntity.numeroRef = item.nReferencia;
            gestionCartera.carteraEntity.concepto = item.concepto;
            gestionCartera.carteraEntity.periodo = item.periodoAcademico;
            gestionCartera.carteraEntity.valor = item.valor;
            gestionCartera.carteraEntity.abonado = item.saldoAbonado;
            gestionCartera.carteraEntity.pendiente = item.saldoPendiente;
            gestionCartera.carteraEntity.estado = item.estado;
            gestionCartera.carteraEntity.fechaVencimiento = item.fechaVencimiento;
            gestionCartera.carteraEntity.estadoCartera = item.styleLable;

            $('#modalDatos').modal({ backdrop: 'static', keyboard: false });
            $("#modalDatos").modal("show");

            //            $location.path('/cartera-gestion');
            //            localStorageService.set('cartera', gestionCartera.carteraEntity);
        };

        gestionCartera.onEnviarNotificacion = function (item) {
            var notificacionClientea = {
                numeroReferencia: item.nReferencia,
                cliente: item.cliente,
                periodoAcademico: item.periodoAcademico,
                codigoEstudiante: item.codigoEstudiante,
                email: item.email,
                telefono: item.telefono,
                nombreConcepto: item.concepto,
                valorCartera: item.valor,
                fechaVencimiento: toDate(item.fechaVencimiento),
                estado: item.estado,
                estadoCartera: item.styleLable,
                programa: item.programa,
                semestre: item.semestre,
                direccion: item.direccion
            };
            carteraService.sendNotificacion(notificacionClientea).then(function (data) {
                swal('Enviando mensaje...');
                appConstant.CERRAR_SWAL();
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(appGenericConstant.MENSAJE_ENVIADO_CLIENTE_SELE);
                }
            });
        };

        gestionCartera.onNotificar = function () {
            var listaNotificados = [];
            var list = gestionCartera.report.selected;
            angular.forEach(list, function (value, key) {
                var cliente = {
                    numeroReferencia: value.nReferencia,
                    cliente: value.cliente,
                    periodoAcademico: value.periodoAcademico,
                    codigoEstudiante: value.codigoEstudiante,
                    email: value.email,
                    telefono: value.telefono,
                    nombreConcepto: value.concepto,
                    valorCartera: value.valor,
                    fechaVencimiento: toDate(value.fechaVencimiento),
                    estado: value.estado,
                    estadoCartera: value.styleLable,
                    programa: value.programa,
                    semestre: value.semestre,
                    direccion: value.direccion
                };
                listaNotificados.push(cliente);
            });
            carteraService.notificacionMasiva(listaNotificados).then(function (data) {
                switch (data.tipo) {
                    case 200:
                        gestionCartera.onCloseModal();
                        gestionCartera.selectTodos = false;
                        gestionCartera.report.selected.length = null;
                        appConstant.MSG_GROWL_OK(appGenericConstant.MENSAJE_ENVIADO_CLIENTES_SELE);
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

        function labelNotificacion(estado) {
            var style;
            if (estado === "VIGENTE") {
                style = "bs-label label-primary";
            } else if (estado === "VENCIDA") {
                style = "bs-label label-danger";
            } else if (estado === "POR_VENCER") {
                style = "bs-label label-warning";
            } else {
                style = "bs-label label-success";
            }
            return style;
        }

        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [year, month, day].join('-');
        }

        function toDate(dateStr) {
            var dateStrLong;
            if (typeof dateStr === 'undefined' || typeof dateStr === null) {
                dateStr = null;
                return dateStr;
            } else {
                var parts = [];
                if (dateStr.match('/')) {
                    parts = dateStr.split('/');
                } else {
                    parts = dateStr.split('-');
                }
                dateStr = new Date(parts[2], parts[1] - 1, parts[0]);
                dateStrLong = Date.parse(dateStr);
                return dateStrLong;
            }
        }

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

        gestionCartera.onOpenModalMasivo = function () {
            gestionCartera.disabledCampos = true;
            gestionCartera.admitirMasivo = true;
            $("input.separate").addClass('disabled');
            $("th.sortable").addClass('disabled');
            $("#modalNotificacionMasivo").show();


        };

        gestionCartera.onCloseModal = function () {
            gestionCartera.report.selected.length = null;
            gestionCartera.disabledCampos = false;
            $("input.separate").removeClass('disabled');
            $("th.sortable").removeClass('disabled');
            //            $("#modalNotificacion").hide();
            $("#modalNotificacionMasivo").hide();
        };

        gestionCartera.onGenerarReporte = function () {
            appConstant.MSG_REPORTE();
            appConstant.CARGANDO();
            gestionCartera.item = [];
            var ocultarFechas = onValidarFechas();

            var cart = {
                ocultarFechas: !ocultarFechas,
                fechaInicio: gestionCartera.carteraEntity.fechainicio === undefined || gestionCartera.carteraEntity.fechainicio === '' ? null : gestionCartera.carteraEntity.fechainicio,
                fechaFin: gestionCartera.carteraEntity.fechafin === undefined || gestionCartera.carteraEntity.fechafin === '' ? null : gestionCartera.carteraEntity.fechafin,
                listaCartera: gestionCartera.filtrados.sort(function (a, b) {
                    if (a.cliente.toLowerCase() < b.cliente.toLowerCase())
                        return -1;
                    if (a.cliente.toLowerCase() > b.cliente.toLowerCase())
                        return 1;
                    return 0;
                })
            };
            var headers = { 
                Authorization: localStorageService.get('autorizacion').token,
                Campus : localStorageService.get('autorizacion').objectResponse.idUniversidad
            };
            var objReportCartera = {
                Cartera: cart
            };
            var jsonString = JSON.stringify(objReportCartera);
            jsonString = "1" + jsonString;
            var urlRequest = '/api/crm/report/crearReport/';
            $http.post(urlRequest, jsonString, headers).then(function (data) {
                if (data.status === 200) {
                    gestionCartera.item.push(data.data.message);
                    gestionCartera.download(gestionCartera.item[0]);
                } else {
                    appConstant.MSG_REPORTE_ERROR();
                }
            }).catch(function (e) {
                appConstant.MSG_REPORTE_ERROR();
                appConstant.CERRAR_SWAL();
            });
        };

        gestionCartera.download = function (itemArc) {
            var file = utilServices.downloadArchivo(itemArc, appGenericConstant.MICRO_SERVICIO_CRM);
            if (file !== null && itemArc !== null && itemArc !== undefined) {
                utilServices.downloadReporte(file, itemArc);
                appConstant.CERRAR_SWAL();
            } else {
                appConstant.MSG_REPORTE_ERROR();
                appConstant.CERRAR_SWAL();
            }
        };

        gestionCartera.onVerDetalleLiquidaciones = function (codigo) {
            //método para consultar el historial de liquidaciones por estudiante
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            historialLiquidacionServices.buscarHIstorialEstudianteByCodigo(codigo).then(function (data) {
                if (data.objectResponse === null || data.objectResponse === undefined || data.objectResponse.length === 0) {
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    $('#divNombre,#divIdentificacion,#divPAcademico,#divProgramaAcademico,#divSemestre,#btnConsultarHistoral').hide();
                    gestionCartera.liquidacionEstudiante = [];
                    gestionCartera.liquidacionEstudianteAnuladas = [];
                    gestionCartera.liquidacionEstudianteAuxiliar = [];
                    appConstant.CERRAR_SWAL();
                    return;
                } else {
                    gestionCartera.estudiante = {};
                    gestionCartera.liquidacionEstudiante = [];
                    gestionCartera.liquidacionEstudianteAnuladas = [];
                    gestionCartera.liquidacionEstudianteAuxiliar = [];
                    gestionCartera.estudiante.identificacion = data.objectResponse[0].liquidacionReporteDTO.tipoDocumento + " " + data.objectResponse[0].liquidacionReporteDTO.estudianteIdentificacion;
                    gestionCartera.estudiante.nombre = data.objectResponse[0].nombreEstudiante;
                    angular.forEach(data.objectResponse, function (value, key) {
                        var liquidacion = {
                            id: value.id,
                            idPeriodo: value.idPeriodo,
                            idEstudiante: value.idEstudiante,
                            referencia: value.referencia,
                            fechaLiquidacion: value.fechaLiquidacion,
                            fechaLimitePago: value.fechaLimitePago,
                            valorLiquidado: value.valorLiquidado,
                            estadoLiquidacion: value.estadoLiquidacion,
                            estadoAbono: value.estadoAbono,
                            idPlantilla: value.idPlantilla,
                            tipoPlantilla: value.tipoPlantilla,
                            numeracion: value.numeracion,
                            idCredito: value.idCredito,
                            liquidacionConceptoDetalleDTO: value.liquidacionConceptoDetalleDTO,
                            nombrePrograma: value.nombrePrograma,
                            nombreConcepto: value.nombreConcepto + " " + (value.liquidacionConceptoDetalleDTO[0].modulo === null ? "" : value.liquidacionConceptoDetalleDTO[0].modulo),
                            nombrePeriodo: value.nombrePeriodo,
                            liquidacionReporteDTO: value.liquidacionReporteDTO,
                            reciboPagoLiquidacionDTO: value.reciboPagoLiquidacionDTO,
                            reimprimir: value.reciboPagoLiquidacionDTO === null,
                            reimrpimirEstado: value.estadoLiquidacion === 'PAGADA',
                            motivoAnulacion: value.motivoAnulacion,
                            usuarioAnulacion: value.userNameAnulacion,
                            fechaAnulacion: value.fechaAnulacion,
                            saldoPendiente: value.saldoPendiente,
                            saldoAbonado: value.saldoAbonado
                        };

                        //                            if (value.reciboPagoLiquidacionDTO !== null && value.reciboPagoLiquidacionDTO !== undefined && value.reciboPagoLiquidacionDTO !== "") {
                        //                                liquidacion.fechaPago = appConstant.TO_LONG_DATE_FORMATO_DDMMYYYY(value.reciboPagoLiquidacionDTO.fechaPago);
                        //                                liquidacion.numeroPago = value.reciboPagoLiquidacionDTO.numero;
                        //                            } else {
                        //                                liquidacion.fechaPago = null;
                        //                            }
                        liquidacion.referenciaNumero = parseInt(liquidacion.referencia.replace("MAT-", "").replace("MTS-", ""));
                        gestionCartera.liquidacionEstudianteAuxiliar.push(liquidacion);
                    });
                    angular.forEach(gestionCartera.liquidacionEstudianteAuxiliar, function (liquidacion, key) {
                        if (liquidacion.estadoLiquidacion !== 'ANULADA') {
                            gestionCartera.liquidacionEstudiante.push(liquidacion);
                        } else {
                            gestionCartera.liquidacionEstudianteAnuladas.push(liquidacion);
                        }
                    });
                    appConstant.CERRAR_SWAL();
                    if (gestionCartera.liquidacionEstudiante.length === 0) {
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.ESTUDIANTE_NO_SOLICITUDES);
                        return;
                    }
                    $('#btnConsultarHistoral').show();
                    $(function () {
                        $('#divNombre,#divIdentificacion').show();
                    });
                }
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });

            $('#myModal').modal({ backdrop: 'static', keyboard: false });
            $("#myModal").modal("show");
        };


        gestionCartera.onLimpiarListaEC = function () {
            gestionCartera.listadoCarteraSeguimiento = [];
        };
        gestionCartera.onLimpiarListaTC = function () {
            gestionCartera.listadoCarteraSeguimientoEC = [];
        };

        //        cargarCarteras();
        // gestionCartera.onConsultarListadoSeguimiento();
    }
})();


