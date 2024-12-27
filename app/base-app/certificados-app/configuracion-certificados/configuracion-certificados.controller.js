'use strict';
angular.module('mytodoApp').controller('confiCertificadosCtrl',
        ['confiCertificiadosServices', 'localStorageService', 'utilServices', 'appConstant', 'appGenericConstant', 'appConstantValueList', '$location',
            function (confiCertificiadosServices, localStorageService, utilServices, appConstant, appGenericConstant, appConstantValueList, $location) {
                var confiCertificadosCtrl = this;
                confiCertificadosCtrl.listCertificados = [];
                confiCertificadosCtrl.certificado = confiCertificiadosServices.certificado;
                confiCertificadosCtrl.certificadoAuxiliar = confiCertificiadosServices.certificadoAuxiliar;
                confiCertificadosCtrl.config = {globalTimeToLive: 3000, disableCountDown: true};
                confiCertificadosCtrl.options = appConstant.FILTRO_TABLAS;
                confiCertificadosCtrl.report = {selected: null};
                confiCertificadosCtrl.selectedOption = confiCertificadosCtrl.options[0];
                confiCertificadosCtrl.listaConceptoValor = [];
                //<editor-fold defaultstate="collapsed" desc="starages">
                if (localStorageService.get('certificado') !== null) {
                    confiCertificadosCtrl.certificado = localStorageService.get('certificado');

                }
                if (localStorageService.get('certificadoAuxiliar') !== null) {
                    confiCertificadosCtrl.certificadoAuxiliar = localStorageService.get('certificadoAuxiliar');
                }
                //</editor-fold>
                function onBuscarCertificado() {
                    confiCertificiadosServices.listarConfiguraciones().then(function (data) {
                        confiCertificadosCtrl.listCertificados = data.responseList;
                    });
                }
                confiCertificadosCtrl.onLimpiar = function () {
                    confiCertificiadosServices.certificado = {};
                    confiCertificadosCtrl.certificado.codigo = null;
                    confiCertificadosCtrl.certificado.nombre = null;
                    confiCertificadosCtrl.certificado.idConcepto = null;
                    confiCertificadosCtrl.certificado.estado = null;
                    confiCertificadosCtrl.certificado.leyenda = null;
                    localStorageService.remove('certificado');
                };
                function onConsultarListaEstados() {
                    utilServices.buscarListaValorByCategoria(appConstantValueList.LV_ESTADO, appGenericConstant.MICRO_SERVICIO_FINANCIERO).then(function (data) {
                        confiCertificadosCtrl.listaEstados = data;
                    });
                }

                function onConsultarConceptoValor() {
                    confiCertificadosCtrl.listaConceptoValor = [];
                    confiCertificiadosServices.listarConceptos(appGenericConstant.SI_MAYUS).then(function (data) {
                        angular.forEach(data, function (value, key) {
                            if (value.clase === appGenericConstant.CONCEPTO_INGRESO) {
                                var concepto = {
                                    id: value.id,
                                    nombre: value.nombre
                                };
                                confiCertificadosCtrl.listaConceptoValor.push(concepto);
                            }
                        });
                    });
                }
                /**
                 * Método para el cargue de un certificado ha crear
                 */
                confiCertificadosCtrl.onClickToAddCertificado = function () {
                    confiCertificadosCtrl.onLimpiar();
                    confiCertificadosCtrl.certificadoAuxiliar.disableVerDetalle = false;
                    confiCertificadosCtrl.certificadoAuxiliar.disableCodigo = false;
                    confiCertificadosCtrl.certificadoAuxiliar.onDeshabilitarCampoEstado = false;
                    confiCertificadosCtrl.certificadoAuxiliar.titulo = appGenericConstant.AGREGAR_CERTIFICADO;
                    localStorageService.set('certificado', null);
                    localStorageService.set('certificadoAuxiliar', confiCertificadosCtrl.certificadoAuxiliar);
                    $location.path('/configuracion-details');
                };
                /**
                 * Método para el cargue de un certificado ha ver el detalle
                 * @param {type} certificado
                 */
                confiCertificadosCtrl.onClickToVerDetalleGrupo = function (certificado) {
                    confiCertificadosCtrl.onLimpiar();
                    confiCertificadosCtrl.certificadoAuxiliar.disableVerDetalle = true;
                    confiCertificadosCtrl.certificadoAuxiliar.disableCodigo = true;
                    confiCertificadosCtrl.certificadoAuxiliar.onDeshabilitarCampoEstado = true;
                    confiCertificadosCtrl.certificadoAuxiliar.titulo = appGenericConstant.DETALLE_CERTIFICADO;
                    localStorageService.set('certificado', cargarCertificado(certificado));
                    localStorageService.set('certificadoAuxiliar', confiCertificadosCtrl.certificadoAuxiliar);
                    $location.path('/configuracion-details');
                };
                /**
                 * Método para el cargue de un certificado ha modificar
                 * @param {type} certificado
                 */
                confiCertificadosCtrl.onClickToUpdateGrupo = function (certificado) {
                    confiCertificadosCtrl.onLimpiar();
                    confiCertificadosCtrl.certificadoAuxiliar.disableVerDetalle = false;
                    confiCertificadosCtrl.certificadoAuxiliar.disableCodigo = true;
                    confiCertificadosCtrl.certificadoAuxiliar.onDeshabilitarCampoEstado = true;
                    confiCertificadosCtrl.certificadoAuxiliar.titulo = appGenericConstant.MODIFICAR_CERTIFICADO;
                    localStorageService.set('certificado', cargarCertificado(certificado));
                    localStorageService.set('certificadoAuxiliar', confiCertificadosCtrl.certificadoAuxiliar);
                    $location.path('/configuracion-details');
                };
                /**
                 * Métoda para persisitir un objeto certificado
                 */
                confiCertificadosCtrl.onSubmitForm = function () {
                    var certificado = crearCertificado();
                    if (certificado.id === undefined) {
                        certificado.idUsuarioCreacion = localStorageService.get("usuario").id;
                        confiCertificiadosServices.GenerarConfiguraciones(certificado)
                                .then(function (data) {
                                    respuesta(data);
                                    if (data.tipo === 200) {
                                        confiCertificadosCtrl.onLimpiar();
                                    }
                                });

                    } else {
                        certificado.idUsuarioModificacion = localStorageService.get("usuario").id;
                        confiCertificiadosServices.ActulizarConfiguraciones(certificado)
                                .then(function (data) {
                                    respuesta(data);
                                    if (data.tipo === 200) {
                                        localStorageService.set('certificado', cargarCertificado(certificado));
                                        localStorageService.set('certificadoAuxiliar', confiCertificadosCtrl.certificadoAuxiliar);
                                    }
                                });
                    }
                };

                /**
                 *  método privado para cargar el certificado retorna un objeto de tipo certificado
                 * @param {type} certificado
                 * @returns {certificado}
                 */
                function cargarCertificado(certificado) {
                    confiCertificadosCtrl.certificado.id = certificado.id;
                    confiCertificadosCtrl.certificado.codigo = certificado.codigo;
                    confiCertificadosCtrl.certificado.nombre = certificado.nombre;
                    confiCertificadosCtrl.certificado.idConcepto = certificado.idConcepto;
                    confiCertificadosCtrl.certificado.estado = certificado.estado;
                    confiCertificadosCtrl.certificado.leyenda = certificado.leyenda;
                    confiCertificadosCtrl.certificado.consecutivo = certificado.consecutivo;
                    confiCertificadosCtrl.certificado.idUsuarioCreacion = certificado.idUsuarioCreacion;
                    confiCertificadosCtrl.certificado.idUsuarioModificacion = certificado.idUsuarioModificacion;
                    return confiCertificadosCtrl.certificado;
                }

                /**
                 * Crceacion de objeto Certificado
                 */
                function crearCertificado() {
                    var certificado = {
                        id: confiCertificadosCtrl.certificado.id,
                        nombre: confiCertificadosCtrl.certificado.nombre,
                        estado: confiCertificadosCtrl.certificado.estado,
                        codigo: confiCertificadosCtrl.certificado.codigo,
                        leyenda: confiCertificadosCtrl.certificado.leyenda,
                        idConcepto: confiCertificadosCtrl.certificado.idConcepto,
                        consecutivo: confiCertificadosCtrl.certificado.consecutivo,
                        idUsuarioCreacion: confiCertificadosCtrl.certificado.idUsuarioCreacion,
                        idUsuarioModificacion: confiCertificadosCtrl.certificado.idUsuarioModificacion
                    };
                    return certificado;
                }

                function respuesta(response) {
                    appConstant.MENSAJE_GENERICO(response);
                }

                //<editor-fold defaultstate="collapsed" desc="Inicialización de métodos la gestión de certificados ">
                onBuscarCertificado();
                onConsultarListaEstados();
                onConsultarConceptoValor();
                //</editor-fold>
            }]);


