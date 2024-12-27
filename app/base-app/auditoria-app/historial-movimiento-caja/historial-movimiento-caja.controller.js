(function () {
    'use strict';
    angular.module('mytodoApp').controller('movCajaCtrl', movCajaCtrl);
    movCajaCtrl.$inject = ['$http','movCajaService', 'ValidationService', '$filter', '$scope', 'utilServices', 'appConstant', 'appGenericConstant','localStorageService'];
    function movCajaCtrl($http,movCajaService, ValidationService, $filter, $scope, utilServices, appConstant, appGenericConstant,localStorageService) {

        var gestionMovCaja = this;
        gestionMovCaja.listadoMovCaja = [];
        gestionMovCaja.listadoMovCajaAux = [];
        gestionMovCaja.filtrados = [];
        gestionMovCaja.movCajaEntity = {};
        gestionMovCaja.movCajaEntityBus = {};
        gestionMovCaja.movCajaEntityAuxiliar = {};
        gestionMovCaja.cajero = "";
        gestionMovCaja.options = appConstant.FILTRO_TABLAS;

        gestionMovCaja.movCajaEntityBus.fechaBusqueda = $filter('date')(new Date().getTime(), 'dd/MM/yyyy');
        gestionMovCaja.movCajaEntityBus.fechaBusqueda2 = $filter('date')(new Date().getTime(), 'dd/MM/yyyy');

        gestionMovCaja.onClickToView = function (item) {
          gestionMovCaja.movCajaEntity.idRecibo = item.id;
            movCajaService.consultarDetalle(item.id).then(function (data) {

                if (data === null || data === "") {
                    appConstant.MSG_GROWL_ADVERTENCIA("Ha ocurrido un error inesperado");
                    return;
                }

                var item = data[0];
                gestionMovCaja.movCajaEntity.caja = item.nombreCaja;
                gestionMovCaja.movCajaEntity.ubicacion = item.ubicacionCaja;
                gestionMovCaja.movCajaEntity.cajero = item.nombreCajero;
                gestionMovCaja.movCajaEntity.idCajero = item.nombreTipoIdentificacion + ' ' + item.identificacionCajero;
                gestionMovCaja.movCajaEntity.fechaPago = item.fechaPago;
                gestionMovCaja.movCajaEntity.fechaLiquidacion = item.fechaLiquidacion;
                gestionMovCaja.movCajaEntity.consecutivo = item.consecutivo;
                gestionMovCaja.movCajaEntity.reciboPago = item.numero;
                gestionMovCaja.movCajaEntity.concepto = item.nombreConceptoFact;
                gestionMovCaja.movCajaEntity.claseConcepto = item.claseConceptoFact;
                gestionMovCaja.movCajaEntity.referenciaLiquidacion = item.referenciaLiquidacion;
                gestionMovCaja.movCajaEntity.plantilla = item.descripcionPlantilla;
                gestionMovCaja.movCajaEntity.valor = item.valorPagado;
                gestionMovCaja.movCajaEntity.estadoRecibo = item.estadoRecibo;
                gestionMovCaja.movCajaEntity.estadoLiquidacion = item.estadoLiquidacion;
                gestionMovCaja.movCajaEntity.nombreEstudiante = item.nombreEstudiante;
                gestionMovCaja.movCajaEntity.idEstudiante = item.identificacion;
                gestionMovCaja.movCajaEntity.codigoEstudiante = item.codigoEstudiante;
                gestionMovCaja.movCajaEntity.periodo = item.nombrePeriodo;
                gestionMovCaja.movCajaEntity.programa = item.nombrePrograma;
                gestionMovCaja.movCajaEntity.nombreReporte = item.nombreReporte;


                $('#modalDatos').modal({backdrop: 'static', keyboard: false});
                $("#modalDatos").modal("show");
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        gestionMovCaja.onExportarListado = function () {
            var total = 0;
            angular.forEach(gestionMovCaja.filtrados, function (value) {
                total = total + value.valorPagado;
            });
            var dato = {
                fechaPago: 'TOTAL',
                valorPagado: total
            };
            gestionMovCaja.filtrados.push(dato);
            $("#btnExportar").trigger("click");
            var index = gestionMovCaja.filtrados.indexOf(dato);
            if (index !== -1)
                gestionMovCaja.filtrados.splice(index, 1);
        };

        gestionMovCaja.getTotalPagado = function (data) {
            if (!data || !data.length)
                return;
            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].valorPagado);
            }
            return Math.round(totalNumber);
        };

        gestionMovCaja.cargarMovCajas = function () {
            if (new ValidationService().checkFormValidity($scope.formFechaBusqueda)) {
                movCajaService.consultarListado(appConstant.TO_DATE_LONG(gestionMovCaja.movCajaEntityBus.fechaBusqueda),
                        appConstant.TO_DATE_LONG(gestionMovCaja.movCajaEntityBus.fechaBusqueda2)).then(function (data) {
                    if (data.length > 0) {
                        gestionMovCaja.listadoMovCaja = [];
                        angular.forEach(data, function (value) {
                            var dto = {
                                id: value.id,
                                numero: value.numero,
                                nombreConceptoFact: value.nombreConceptoFact,
                                valorPagado: value.valorPagado,
                                estadoLiquidacion: value.estadoLiquidacion,
                                estadoRecibo: value.estadoRecibo,
                                nombreCajero: value.nombreCajero,
                                codigoEstudiante: value.codigoEstudiante,
                                nombreEstudiante: value.nombreEstudiante,
                                nombrePrograma: value.nombrePrograma,
                                fechaPago: value.fechaPago,
                                referenciaLiquidacion: value.referenciaLiquidacion
                            };
                            gestionMovCaja.listadoMovCaja.push(dto);

                        });

                        gestionMovCaja.aux = $.unique(gestionMovCaja.listadoMovCaja.map(function (d) {
                            return d.nombreCajero;
                        }));

                        gestionMovCaja.listadoCajeros = gestionMovCaja.aux.filter(unique);

                        gestionMovCaja.listadoCajeros.push("TODOS");
                        gestionMovCaja.cajero = "TODOS";
                        gestionMovCaja.listadoMovCajaAux = gestionMovCaja.listadoMovCaja;

                    } else {
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.NO_MOVIMIENTO_CAJA);
                    }
                }).catch(function (e) {
                    appConstant.MSG_GROWL_ERROR();
                    return;
                });
            }
        };

        const unique = (value, index, self) => {
            return self.indexOf(value) === index;
        }

        gestionMovCaja.onChangeCajero = function () {

            if(gestionMovCaja.cajero === "TODOS"){
                gestionMovCaja.listadoMovCajaAux = gestionMovCaja.listadoMovCaja;
            }else{
                gestionMovCaja.listadoMovCajaAux = $.grep(gestionMovCaja.listadoMovCaja, function(data) {
                    return data.nombreCajero === gestionMovCaja.cajero;
                });
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

        gestionMovCaja.onGenerarReporte = function (item) {
            var itemArc = item.nombreReporte;
            appConstant.MSG_REPORTE();
            appConstant.CARGANDO();

          movCajaService.consultarDetalle(gestionMovCaja.movCajaEntity.idRecibo).then(function (data) {
            var idLiquidacion = data[0].idLiquidacion;
            var idRecibo = gestionMovCaja.movCajaEntity.idRecibo;
            var nombrePrograma = data[0].nombrePrograma;
            var idPrograma = data[0].idPrograma;
            var info = {
              idLiquidacion: idLiquidacion,
              idRecibo: idRecibo,
              nombrePrograma: nombrePrograma,
              idPrograma: idPrograma
            };

            movCajaService.getDetalleRecibo(info).then(function (report) {

              var jsonString = JSON.stringify(report);
              jsonString = '8' + '{"ReciboCaja":' + jsonString  +'}';

              var urlRequest = '/api/financiero/report/crearReportD/';

              $http.post(urlRequest, jsonString, {
                transformRequest: angular.identity,
                headers: {
                  Authorization: localStorageService.get('autorizacion').token,
                  Campus: localStorageService.get('autorizacion').objectResponse.idUniversidad
                },
                responseType: 'arraybuffer'
              }).success(function (data) {
                var file = new Blob([data], {
                  type: 'application/pdf'
                });
                var fileURL = URL.createObjectURL(file);
                window.open(fileURL);
                appConstant.CERRAR_SWAL();

              }).error(function () {
                appConstant.MSG_GROWL_ERROR("Error de conexión: No fue posible conectarse con el servidor");
                appConstant.CERRAR_SWAL();
              });

            }).catch(function (e) {
              appConstant.MSG_GROWL_ERROR();
              return;
            });
          }).catch(function (e) {

        });
        };

    }
})();


