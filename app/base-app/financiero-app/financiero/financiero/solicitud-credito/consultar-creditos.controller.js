(function () {
    'use strict';
    angular.module('mytodoApp').controller('ConsultarCreditosCtrl', ConsultarCreditosCtrl);
    ConsultarCreditosCtrl.$inject = ['$scope', 'solicitudCreditoFinancieroServices', '$location', 'ValidationService', 'localStorageService', 'appConstant', '$interval', 'appGenericConstant','usuarioRolesService'];
    function ConsultarCreditosCtrl($scope, solicitudCreditoFinancieroServices, $location, ValidationService, localStorageService, appConstant, $interval, appGenericConstant,usuarioRolesService) {

        var gestionConsultarCredito = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        gestionConsultarCredito.consultarCredito = solicitudCreditoFinancieroServices.consultarCredito;
        gestionConsultarCredito.consultarCreditoAuxiliar = solicitudCreditoFinancieroServices.consultarCreditoAuxiliar;
        gestionConsultarCredito.consultarCredito.numeroCuotas;
        gestionConsultarCredito.consultarCreditoAuxiliar.disablingCamposConsulta = false;
        gestionConsultarCredito.consultarCreditoAuxiliar.camposNuevaSolicitud = true;
        gestionConsultarCredito.consultarCreditoAuxiliar.mensajeError = true;
        gestionConsultarCredito.consultarCreditoAuxiliar.mensajeExiste = true;
        gestionConsultarCredito.listaSolicitudes = [];
        gestionConsultarCredito.options = appConstant.FILTRO_TABLAS;
        gestionConsultarCredito.selectedOption = gestionConsultarCredito.options[appGenericConstant.CERO];
        gestionConsultarCredito.report = {
            selected: null
        };
        gestionConsultarCredito.counter = appGenericConstant.CERO;
        function onListarSolicitudes() {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            gestionConsultarCredito.counter = appGenericConstant.CERO;
            solicitudCreditoFinancieroServices.buscarSolicitudes().then(function (data) {
                angular.forEach(data, function (value) {
                    var solicitud = {
                        id: value.id,
                        idEstudiante: value.idEstudiante,
                        idPrograma: value.idPrograma,
                        nombreprogramaAcademico: value.nombrePrograma,
                        idModalidad: value.idModalidad,
                        modalidad: value.nombreModalidad,
                        codigoEstudiante: value.codigoEstudiante,
                        semestre: value.semestre,
                        nombreCompleto: value.nombreCompletoEstudiante,
                        identificacion: value.identificacion,
                        tipoDocumento: value.tipoDocumento,
                        linea: value.idLineaCredito,
                        nombreLineaCredito: value.nombreLineaCredito,
                        numeroSolicitud: value.numeroSolicitud,
                        estadoSolicitud: value.estadoSolicitud,
                        fechaSolicitud: value.fechaSolicitud,
                        numeroCuotas: value.numeroCuotas,
                        esCodeudor: value.esCodeudor,
                        valorFinanciar: value.valorFinanciar,
                        tablaAmortizacion: value.tablaAmortizacionConvenioDTO,
                        tablaModulos: value.moduloSolicitudConvenio,
                        esPeriodoActual: value.esPeriodoActual,
                        cartera: value.tablaAmortizacionConvenioVencidaDTO,
                        user : value.idUsuario
                    };
                    
                    usuarioRolesService.buscarUsuario(value.idUsuario).then(function (data){
                        solicitud.user=data;
                    });
                    gestionConsultarCredito.listaSolicitudes.push(solicitud);
                });
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                appConstant.CERRAR_SWAL();
                return;
            });
        }

        function onFormatearFechasByLista(lista) {
            var listAux = [];
            angular.forEach(lista, function (value) {
                var fechaFor = {
                    amortizacion: value.amortizacion,
                    cuota: value.cuota,
                    cuotaFija: value.cuotaFija,
                    estadoAmortizacion: value.estadoAmortizacion,
                    fecha: onFormattedDate(value.fecha),
                    id: value.id,
                    idSolicitudCredito: value.idSolicitudCredito,
                    interes: value.interes,
                    prestamo: value.prestamo,
                    saldoRestante: value.saldoRestante
                };
                listAux.push(fechaFor);
            });
            return listAux;
        }

        function onFormattedDate(date) {
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


        gestionConsultarCredito.onEstadoEstilo = function (estado) {
            var style;
            if (estado === "PAGADA") {
                style = "bs-label label-success";
            } else if (estado === "DESEMBOLSADO") {
                style = "bs-label label-warning";
            } else {
                style = "";
            }
            return style;
        };

        onListarSolicitudes();
    }
})();