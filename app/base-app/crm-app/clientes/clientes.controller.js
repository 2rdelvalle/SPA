(function () {
    'use strict';
    angular.module('mytodoApp').controller('ClientesCtrl', ClientesCtrl);

    ClientesCtrl.$inject = ['clientesService', 'appConstant', '$location', 'growl', 'ValidationService', 'localStorageService', 'utilServices', '$scope', 'appGenericConstant', 'appConstantValueList'];
    function ClientesCtrl(clientesService, appConstant, $location, growl, ValidationService, localStorageService, utilServices, $scope, appGenericConstant, appConstantValueList) {

        var gestionClientes = this;
        var periodoxDefecto;
        var config = {disableCountDown: true, ttl: 5000};
        gestionClientes.listadoClientes = [];
        gestionClientes.listadoClientesMatriculados = [];
        gestionClientes.listadoPeriodos = [];
        gestionClientes.listadoNivelesAcademicos = [];
        gestionClientes.listadoModalidad = [];
        gestionClientes.listadoEtapasRegistro = [];
        gestionClientes.listaNivelesFormacion = [];
        gestionClientes.clientesEntity = clientesService.entidad;
        gestionClientes.clientesBusqueda = clientesService.entidadPrincipal;
        gestionClientes.clientesEntityAuxiliar = clientesService.entidadAuxiliar;
        gestionClientes.options = appConstant.FILTRO_TABLAS;
        gestionClientes.report = {
            selected: null
        };
        gestionClientes.selectedOption = gestionClientes.options[0];
        gestionClientes.selectTodos = false;
        gestionClientes.disabledCampos = false;

        if (localStorageService.get('clientesBusqueda') !== null) {
            periodoxDefecto = localStorageService.get('clientesBusqueda').periodoSeleccionado;
            gestionClientes.clientesBusqueda.periodoSeleccionado = localStorageService.get('clientesBusqueda').periodoSeleccionado;
            //gestionClientes.clientesEntity = clientes;
        }

//        if (localStorageService.get('listadoClientes') !== null) {
//            gestionClientes.listadoClientes = localStorageService.get('listadoClientes');
//            //gestionClientes.clientesEntity = clientes;
//        }

        /*Metodo para seleccionar todos los datos de la tabla al clistadoClientesheckear*/
        gestionClientes.onSelectTodos = function () {
            if (gestionClientes.selectTodos === true) {
                gestionClientes.report.selected = gestionClientes.filtrados.slice();
            } else {
                gestionClientes.report.selected.length = null;
            }
        };

        /*Metodo para al presionar un tr se checkee o se descheckee el checkbox */
        gestionClientes.onSelectSeparate = function () {
            gestionClientes.report.selected.length = null;
            gestionClientes.selectTodos = false;
        };

        gestionClientes.onSelectTodosTable = function (clase, item) {
            if (gestionClientes.report.selected.length === gestionClientes.filtrados.length
                    && gestionClientes.selectTodos === true) {
                gestionClientes.selectTodos = false;
            } else {
                if (!clase) {
                    if (gestionClientes.report.selected.length + appGenericConstant.UNO === gestionClientes.filtrados.length
                            && gestionClientes.selectTodos === false) {
                        gestionClientes.selectTodos = true;
                    }
                } else {
                    gestionClientes.selectTodos = false;
                }
            }
        };

        gestionClientes.onLimpiar = function () {
            localStorageService.remove('clientesBusqueda');
        };
        if($location.path() === '/clientes'){
             localStorageService.remove('clientesBusqueda');
            
        }

        gestionClientes.onChange = function () {
            localStorageService.set('clientesBusqueda', gestionClientes.clientesBusqueda);
        };

        function onBuscarNivelesAcademicos() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_NIVEL_ACADEMICO, appGenericConstant.MICRO_SERVICIO_CRM).then(function (data) {
                gestionClientes.listadoNivelesAcademicos = data;
            });
        }

        function onBuscarModalidades() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_AREA_MODALIDAD, appGenericConstant.MICRO_SERVICIO_CRM).then(function (data) {
                gestionClientes.listadoModalidad = data;
            });
        }
        
        function onBuscarNivelesformacion() {
            clientesService.listaNivelesFormacion().then(function (data) {
                gestionClientes.listaNivelesFormacion = data;
                gestionClientes.clientesBusqueda.nivelFormacion = data[0].id;
            });
        }

        function onBuscarEtapasRegistro() {
            utilServices.buscarListaValorByCategoria(appConstantValueList.LV_ETAPA_REGISTRO, appGenericConstant.MICRO_SERVICIO_CRM).then(function (data) {
                gestionClientes.listadoEtapasRegistro = data;
            });
        }

        function cargarClientess() {
            appConstant.MSG_LOADING('Cargando datos, espera un momento...');
            appConstant.CARGANDO();
            clientesService.consultarListado().then(function (data) {
                if (data.length === 0 || data === undefined || data === null) {
                    gestionClientes.clientesEntityAuxiliar.mostrarTabla = false;
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NO_ENCONTRARON_COINCIDENCIAS);
                    appConstant.CERRAR_SWAL();
                    return;
                } else {
                    appConstant.CERRAR_SWAL();
                    angular.forEach(data, function (value) {
                        gestionClientes.clientesEntidad = {
                            identificacion: value.identificacion,
                            nombre: value.nombre + ' ' + value.apellido,
                            programa: value.programa,
                            horario: value.horario,
                            telefono: value.telefono
                        };
                        gestionClientes.listadoClientes.push(gestionClientes.clientesEntidad);
                        gestionClientes.clientesEntityAuxiliar.mostrarTabla = true;
                    });
                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }

        function onBuscarPeriodos() {
            clientesService.buscarPeriodoAcademicoByEstado().then(function (data) {
                gestionClientes.listadoPeriodos = data;
                clientesService.buscarPeriodoAcademicoActual().then(function (datas) {
                    if (localStorageService.get('clientesBusqueda') === null || localStorageService.get('clientesBusqueda') === undefined) {
                        gestionClientes.clientesBusqueda.periodoSeleccionado = periodoxDefecto = datas[0].id;
                    }
                    else {
                        gestionClientes.clientesBusqueda.periodoSeleccionado = periodoxDefecto = localStorageService.get('clientesBusqueda').periodoSeleccionado;
                    }
                });
            });
        }

        onBuscarPeriodos();
        onBuscarNivelesAcademicos();
        onBuscarModalidades();
        onBuscarEtapasRegistro();
        onBuscarNivelesformacion();
        
        gestionClientes.onConsultarClientes = function () {
            if ($location.path() === '/clientes') {
                if (new ValidationService().checkFormValidity($scope.formConsultaCliente)) {
                    gestionClientes.listadoClientes = [];
                    gestionClientes.listadoClientesMatriculados = [];
                    var periodoAcademico = null;
                    var etapaRegistro = null;
                    var nivelAcademicos = null;
                    var modalidad = null;
                    var nivelFormacion = null;
                    var fechaInicio = null;
                    var fechaFin = null;
                    if (gestionClientes.clientesBusqueda.periodoSeleccionado !== null && gestionClientes.clientesBusqueda.periodoSeleccionado !== undefined && gestionClientes.clientesBusqueda.periodoSeleccionado !== "") {
                        periodoAcademico = gestionClientes.clientesBusqueda.periodoSeleccionado;//gestionClientes.clientesBusqueda.periodoSeleccionado;
                    } else {
                        onBuscarPeriodos();
                        periodoAcademico = periodoxDefecto;//gestionClientes.clientesBusqueda.periodoSeleccionado;
                    }
                    if (gestionClientes.etapaRegistro !== null && gestionClientes.etapaRegistro !== undefined && gestionClientes.etapaRegistro !== "") {
                        etapaRegistro = gestionClientes.clientesBusqueda.etapaRegistro;
                    } else {
                        etapaRegistro = '0';
                    }
                    if (gestionClientes.nivelAcademicos !== null && gestionClientes.nivelAcademicos !== undefined && gestionClientes.nivelAcademicos !== "") {
                        nivelAcademicos = gestionClientes.clientesBusqueda.nivelAcademicos;
                    } else {
                        nivelAcademicos = 0;
                    }
                    if (gestionClientes.modalidad !== null && gestionClientes.modalidad !== undefined && gestionClientes.modalidad !== "") {
                        modalidad = gestionClientes.clientesBusqueda.modalidad;
                    } else {
                        modalidad = 0;
                    }
                    if (gestionClientes.fechainicio !== null && gestionClientes.fechainicio !== undefined && gestionClientes.fechainicio !== "") {
                        fechaInicio = gestionClientes.clientesBusqueda.fechainicio;
                    } else {
                        fechaInicio = new Date('1900-01-01');
                    }
                    if (gestionClientes.fechafin !== null && gestionClientes.fechafin !== undefined && gestionClientes.fechafin !== "") {
                        fechaFin = gestionClientes.clientesBusqueda.fechafin;
                    } else {
                        fechaFin = new Date('1900-01-01');
                        periodoAcademico = gestionClientes.clientesBusqueda.periodoSeleccionado;
                    }
                    if (gestionClientes.clientesBusqueda.etapaRegistro !== null && gestionClientes.clientesBusqueda.etapaRegistro !== undefined && gestionClientes.clientesBusqueda.etapaRegistro !== "") {
                        etapaRegistro = gestionClientes.clientesBusqueda.etapaRegistro;
                    } else {
                        etapaRegistro = '0';
                    }
                    if (gestionClientes.clientesBusqueda.nivelAcademicos !== null && gestionClientes.clientesBusqueda.nivelAcademicos !== undefined && gestionClientes.clientesBusqueda.nivelAcademicos !== "") {
                        nivelAcademicos = gestionClientes.clientesBusqueda.nivelAcademicos;
                    } else {
                        nivelAcademicos = 0;
                    }
                    if (gestionClientes.clientesBusqueda.modalidad !== null && gestionClientes.clientesBusqueda.modalidad !== undefined && gestionClientes.clientesBusqueda.modalidad !== "") {
                        modalidad = gestionClientes.clientesBusqueda.modalidad;
                    } else {
                        modalidad = 0;
                    }
                    if (gestionClientes.clientesBusqueda.nivelFormacion !== null && gestionClientes.clientesBusqueda.nivelFormacion !== undefined && gestionClientes.clientesBusqueda.nivelFormacion !== "") {
                        nivelFormacion = gestionClientes.clientesBusqueda.nivelFormacion;
                    } else {
                        nivelFormacion = 0;
                    }
                    if (gestionClientes.clientesBusqueda.fechainicio !== null && gestionClientes.clientesBusqueda.fechainicio !== undefined && gestionClientes.clientesBusqueda.fechainicio !== "") {
                        var strDate = gestionClientes.clientesBusqueda.fechainicio;
                        var datePartInicio = strDate.split("/");
                        fechaInicio = new Date(datePartInicio[2], (datePartInicio[1] - 1), datePartInicio[0]);
                    } else {
                        fechaInicio = new Date('1900-01-01 00:00:00');
                    }
                    if (gestionClientes.clientesBusqueda.fechafin !== null && gestionClientes.clientesBusqueda.fechafin !== undefined && gestionClientes.clientesBusqueda.fechafin !== "") {
                        var strDateFin = gestionClientes.clientesBusqueda.fechafin;
                        var dateFin = strDateFin.split("/");
                        fechaFin = new Date(dateFin[2], (dateFin[1] - 1), dateFin[0], '23', '59', '59');
                    } else {
                        fechaFin = new Date('1900-01-01 00:00:00');
                    }
                    onListarClientes(periodoAcademico, etapaRegistro, nivelAcademicos, modalidad,nivelFormacion, fechaInicio, fechaFin);
                }
            }
        };

        function onListarClientes(periodoAcademico, etapaRegistro, nivelAcademicos, modalidad, nivelFormacion,fechaInicio, fechaFin) {
            if ($location.path() === '/clientes') {
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
            }
            clientesService.busquedaClientes(periodoAcademico, etapaRegistro, nivelAcademicos, modalidad, nivelFormacion,fechaInicio, fechaFin).then(function (data) {
                if (data.length === 0 || data === undefined || data === null) {
                    gestionClientes.clientesEntityAuxiliar.mostrarTabla = false;
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NO_ENCONTRARON_COINCIDENCIAS);
                    return;
                } else {
                    appConstant.CERRAR_SWAL();
                    angular.forEach(data, function (value) {
                        gestionClientes.clientesEntidad = {
                            identificacion: value.identificacion,
                            nombre: value.nombre + ' ' + value.apellido,
                            programa: value.nombrePrograma,
                            horario: value.nombreHorario,
                            telefono: value.telefono,
                            email: value.email,
                            styleLabel: value.estadoInscripcion === "PRE_INSCRITO" ? "PRE INSCRITO" : value.estadoInscripcion,
                            style: labelNotificacion(value.estadoInscripcion),
                            estado: value.estadoInscripcion.replace('_', ' '),
                            periodoAcademico: value.idPeriodoAcademico,
                            direccion: value.direccion,
                            semestre: value.semestre === null ? "Sin iniciar" : value.semestre,
                            idModalidad: value.idModalidad,
                            estadoLiquidacion: value.estadoLiquidacion !== null ? value.estadoLiquidacion : null,
                            estadoCartera: value.estadoCartera !== null ? value.estadoCartera : null
                        };
                        if(gestionClientes.clientesEntidad.styleLabel==='MATRICULADO'){
                            gestionClientes.listadoClientesMatriculados.push(gestionClientes.clientesEntidad);
                        }else{
                            gestionClientes.listadoClientes.push(gestionClientes.clientesEntidad);
                        }
                        gestionClientes.clientesEntityAuxiliar.mostrarTabla = true;
                    });
//                    localStorageService.set('listadoClientes', gestionClientes.listadoClientes);
                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        }


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

        // gestionClientes.onConsultarClientes();

        gestionClientes.onVerDetalle = function (item) {
            gestionClientes.clientesEntity.identificacion = item.identificacion;
            gestionClientes.clientesEntity.nombre = item.nombre;
            gestionClientes.clientesEntity.programa = item.programa;
            gestionClientes.clientesEntity.etapa = item.estado;
            gestionClientes.clientesEntity.periodo = item.periodoAcademico;
            gestionClientes.clientesEntity.modalidadDetalle = item.idModalidad;
            gestionClientes.clientesEntity.semestre = item.semestre;
            gestionClientes.clientesEntity.direccion = item.direccion === null || item.direccion === "" ? "SIN DATOS" : item.direccion;
            gestionClientes.clientesEntity.telefono = item.telefono === "" || item.telefono === null ? "SIN DATOS" : item.telefono;
            gestionClientes.clientesEntity.email = item.email;

            gestionClientes.clientesEntity.numeroRef = item.nReferencia;
            gestionClientes.clientesEntity.concepto = item.concepto;
            gestionClientes.clientesEntity.periodo = item.periodoAcademico;
            gestionClientes.clientesEntity.valor = item.valor;
            gestionClientes.clientesEntity.estado = item.estado;
            gestionClientes.clientesEntity.fechaVencimiento = item.fechaVencimiento;
            localStorageService.set('clientes', gestionClientes.clientesEntity);
            $location.path('/clientes-gestion');

        };

        gestionClientes.onEnviarNotificacion = function (item) {
            var notificacionCliente = {
                cliente: item.cliente,
                periodoAcademico: item.periodoAcademico,
                codigoEstudiante: item.codigoEstudiante,
                email: item.email,
                telefono: item.telefono,
                nombreConcepto: item.concepto,
                valorClientes: item.valor,
                fechaVencimiento: Date.parse(item.fechaVencimiento),
                estado: item.estado,
                estadoClientes: item.styleLable,
                programa: item.programa,
                semestre: item.semestre,
                direccion: item.direccion
            };
            clientesService.sendNotificacion(notificacionCliente).then(function (data) {
                appConstant.MSG_LOADING(appGenericConstant.ENVIANDO_MENSAJE_ESPERE);
                appConstant.CARGANDO();
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    growl.success("<div><table><tr><td><i class='glyphicon glyphicon-ok' style='padding-left: 15px;font-size: 20px;'></i></td>&nbsp;&nbsp;<td  style='padding-left: 16px;'><span><strong>BIEN HECHO</strong><BR><span>Se ha enviado un mensaje al cliente asociado</span></span></td></tr><table></div>", config);
                }
            });
        };

        gestionClientes.onNotificar = function () {
            var listaNotificados = [];
            var list = gestionClientes.report.selected;
            angular.forEach(list, function (value, key) {
                var cliente = {
                    numeroReferencia: value.nReferencia,
                    cliente: value.cliente,
                    periodoAcademico: value.periodoAcademico,
                    codigoEstudiante: value.codigoEstudiante,
                    email: value.email,
                    telefono: value.telefono,
                    nombreConcepto: value.concepto,
                    valorClientes: value.valor,
                    fechaVencimiento: Date.parse(value.fechaVencimiento),
                    estado: value.estado,
                    estadoClientes: value.styleLable,
                    programa: value.programa,
                    semestre: value.semestre,
                    direccion: value.direccion
                };
                listaNotificados.push(cliente);
            });
            clientesService.notificacionMasiva(listaNotificados).then(function (data) {
                switch (data.tipo) {
                    case 200:
                        gestionClientes.onCloseModal();
                        gestionClientes.selectTodos = false;
                        gestionClientes.report.selected.length = null;
                        appConstant.MSG_GROWL_OK(appGenericConstant.ASPIRANTES_ADMITIDOS);
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

        gestionClientes.onOpenModalMasivo = function () {
            gestionClientes.disabledCampos = true;
            gestionClientes.admitirMasivo = true;
            $("input.separate").addClass('disabled');
            $("th.sortable").addClass('disabled');
            $("#modalNotificacionMasivo").show();
        };

        gestionClientes.onCloseModal = function () {
            gestionClientes.report.selected.length = null;
            gestionClientes.disabledCampos = false;
            $("input.separate").removeClass('disabled');
            $("th.sortable").removeClass('disabled');
            //            $("#modalNotificacion").hide();
            $("#modalNotificacionMasivo").hide();
        };

        window.onload = function () {
            localStorageService.remove('clientesBusqueda');
        };
    }
})();


